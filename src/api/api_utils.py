import json
from types import SimpleNamespace
from flask import jsonify, request
from flask_jwt_extended import create_refresh_token, create_access_token
from bcrypt import *
import api.utils as utils
from api.models import User

AUTH_TOKEN_HEADER= 'Auth-Token'
CONTENT_TYPE_JSON= {'Content-Type': 'application/json'}

# common configurable tests for endpoints, just to avoid writing it everytime
def endpoint_safe(f, shell):
    #try:
        body, data= None, None
        # force content to be given type
        if 'content' in shell.options:
            content= shell.options["content"]
            if not 'Content-Type' in request.headers or not request.headers['Content-Type'] == content: return response(400, f"Content-Type is not '{content}'")
            if not request.data: return response(400, "body must contain data")
            if 'data' in shell.options: return response(400, "cannot define shell data-type if content-type is beign defined")
            if 'json' in content: body= "json"
            #if 'form' in content: body= "form"
            #if 'plain' in content or 'text' in content: body= "text"
        elif 'data' in shell.options: body= shell.options['data']
        # load data automatically
        if body=="json":
            try:
                data= request.get_json(force=True)
                if not data: return response(400, "body contains no JSON")
                shell.data["json"]= data
            except: return response(400, "body contains no valid JSON")
        # check missing or invalid properties
        if 'props' in shell.options:
            if not data: return response(400, "given required properties but no data received")
            props= shell.options["props"]
            for p in props:
                if not p in data: return response(400, f"missing required property '{p}'")
                if not data[p] or (type(data[p])== str and data[p]== ""): return response(400, f"empty required property '{p}'")
            if 'props_strict' in shell.options and len(data.keys()) > len(props): return response(400, f"data contains extra garbage properties")
        # execute the endpoint function if everything else went right
        return f(shell)
    #except Exception as e:
    #    print(e)
    #    return response_500(repr(e))
    
def hash_password(password):
    return hashpw(bytes(password, 'UTF-8'), gensalt())

def check_password(input, password):
    print(input, password)
    return checkpw(bytes(input, 'UTF-8'), password)

# check a list of properties against data
def check_missing_properties_manual(data, props):
    for p in props:
        if not p in data:
            return f"missing required property '{p}'"
    return None

def get_shell(locals, **options): return SimpleNamespace(**{ "namespace": SimpleNamespace(**locals), "data": {}, "options": options})

def response(status:int, msg:str, data=None, debug=None) -> tuple[dict, int, dict]:
    obj= { "msg": msg }
    if data: obj['res']= data
    if debug: obj['_']= json.loads(json.dumps(debug, default=json_object_safe))
    return jsonify(obj), status, CONTENT_TYPE_JSON

def response_200(data=None, debug=None): return response(200, "ok", data, debug)
def response_201(data=None, debug=None): return response(201, "created", data, debug)
def response_400(data=None, debug=None): return response(400, "bad request", data, debug)
def response_401(data=None, debug=None): return response(401, "unauthorized", data, debug)
def response_403(data=None, debug=None): return response(403, "forbidden", data, debug)
def response_500(data=None, debug=None): return response(500, "server error", data, debug)

def json_object_safe(obj):
    dict= obj.__dict__
    return dict if dict else type(obj).__name__

# create both refresh and access tokens for a given user
def create_new_tokens(user):
    _identity= {"u":user.username, "e":user.email, "p":user.permission, "t":user.timestamp}
    return (
        create_refresh_token(identity=_identity), 
        create_access_token(identity=_identity)
    )

# just to have everything organized in this module
def refresh_token(identity_):
    user_identity= identity_.copy()
    user_identity['t']= utils.current_millis_time()
    return create_access_token(identity=user_identity)

def parse_int(v, default=-1):
    try: return int(v) if type(v) != int else v
    except: return default

def parse_bool(v, default=False):
    if type(v) == bool: return v
    if not v or v=="": return default
    if v.isnumeric(): return float(v) > .0
    return v.lower() in ('true', 'yes', 't', 'y')

# check valid access for a token and returns the user
def get_user_with_check_access(identity):
    user= User.query.filter((User.username==identity['u'] and User.email==identity['e'])).first()
    if not user: return None, response(400, "bad token") # shouldn't ever happen
    t= parse_int(identity['t'])
    if t is None: return None, response(400, "bad timestamp") # shouldn't ever happen
    if user.timestamp==0 or t < user.timestamp: None, response(401, "expired", {"token":t, "user":user.timestamp})
    return user, None

# check valid access for a token
def check_user_access(identity):
    _, error= get_user_with_check_access(identity)
    return error