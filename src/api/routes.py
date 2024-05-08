"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import time
from flask import request, Blueprint
from api.models import db, User

from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

import api.api_utils as api_utils
import api.utils as utils

root = Blueprint('root', __name__) # /* endpoints
api = Blueprint('api', __name__) # /api/* endpoints

### ---------------------------------------------------- ROOT ENDPOINTS

# optional ? param 'login', default= '1'
@root.route('/signup', methods=['POST'])
def hep_signup():
    def __endpoint__(shell):
        json= shell.data['json']
        admin= api_utils.parse_bool(json['admin'] if 'admin' in json else 0)
        user= User(
            username= json['username'],
            displayname= json['displayname'],
            password= api_utils.hash_password(json['password']),
            email= json['email'],
            permission= 1 if admin else 0
        )
        login= api_utils.parse_bool(json['login'] if 'login' in json else request.args.get("login", 1))
        if not login:
            user.timestamp= 0
        # try login if already exists, register otherwise
        _user= User.query.filter(User.email==json['email'] or User.username==json['username']).first()
        if _user:
            if not api_utils.check_password(json['password'], _user.password):
                return api_utils.response(400, "email already registered" if _user.email==user.email else "username taken")
            if not login: return api_utils.response_200() 
            user= _user
        else:
            db.session.add(user)
            db.session.commit()
        # login in after creation is optional, but defaults to true, prioritizes json over url
        if login:
            rtoken, atoken= api_utils.create_new_tokens(user)
            if _user: return api_utils.response_200("logged-in") 
            return api_utils.response_201({**user.serialize(), "refresh_token":rtoken, "access_token":atoken }) 
        return api_utils.response_201(user.serialize()) 
    return api_utils.endpoint_safe(__endpoint__, api_utils.get_shell(locals(), content="application/json", props=["username", "displayname", "email", "password"]))

@root.route('/login', methods=['POST'])
@jwt_required(optional=True)
def hep_login():
    def __endpoint__(shell):
        print(shell)
        data= shell.data['json']
        user= User.query.filter((User.username==data['account'] or User.email==data['account'])).first()
        if not user: return api_utils.response(400, "invalid username or email")
        if not api_utils.check_password(data['password'], user.password): return api_utils.response(400, "invalid password")
        user.timestamp= utils.current_millis_time() # only tokens whose timestap >= this timestamp will be valid
        db.session.commit()
        rtoken, atoken= api_utils.create_new_tokens(user)
        return api_utils.response_200({**user.serialize(), "refresh_token":rtoken, "access_token":atoken }) 
    return api_utils.endpoint_safe(__endpoint__, api_utils.get_shell(locals(), content="application/json", props=["account", "password"], props_strict=True))

# optional ? param 'full', default= '0' (also refresh the refresh_token)
@root.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def hep_refresh():
    user_identity = get_jwt_identity()
    if not user_identity: return api_utils.response_401() # shouldn't ever happen
    error= api_utils.check_user_access(user_identity) # security check
    if error: return error
    full= api_utils.parse_bool(request.args.get("full", "0"))

    token= api_utils.refresh_token(user_identity)
    return api_utils.response_200({"access_token":token})

# returns remaining time for a token to expire
@root.route('/expire', methods=['GET'])
@jwt_required(verify_type=False)
def hep_expire():
    exp= get_jwt()['exp']*1000
    rem= exp - utils.current_millis_time()
    return api_utils.response_200({"expire":exp, "remaining": rem if rem > 0 else 0})

@root.route('/logout', methods=['POST'])
@jwt_required()
def hep_logout():
    user_identity = get_jwt_identity()
    if not user_identity: return api_utils.response_401() # shouldn't ever happen
    user, error= api_utils.get_user_with_check_access(user_identity) # security check + get user
    if error: return error
    user.timestamp= 0 # this invalidates all existent refresh and access tokens for this user
    db.session.commit()
    return api_utils.response_200()

# delete account
@root.route('/unsign', methods=['DELETE'])
@jwt_required()
def hep_unsign():
    user_identity = get_jwt_identity()
    if not user_identity: return api_utils.response_401() # shouldn't ever happen
    user, error= api_utils.get_user_with_check_access(user_identity) # security check + get user
    if error: return error
    db.session.delete(user)
    db.session.commit()
    return api_utils.response_200()

# get current user
@root.route('/me', methods=['GET'])
@jwt_required(optional=True)
def hep_me():
    user_identity = get_jwt_identity()
    if not user_identity: return api_utils.response_401() # unauthorized -- NOT logged-in

    user, error= api_utils.get_user_with_check_access(user_identity) # security check
    if error: return error

    if not user: return api_utils.response(400, "bad token") # shouldn't ever happen
    return api_utils.response_200(user.serialize())

# check if authenticated [and allowed]
# optional ? param 'level', default= '0' -- the minimum permission level to pass
@root.route('/auth', methods=['GET'])
@jwt_required(optional=True)
def hep_auth():
    user_identity = get_jwt_identity()
    if not user_identity: return api_utils.response_401() # unauthorized -- NOT logged-in

    error= api_utils.check_user_access(user_identity) # security check
    if error: return error

    auth_level= request.args.get('level', 0)
    if type(auth_level)== str:
        if not auth_level.isnumeric or '.' in auth_level: return api_utils.response_400()
        auth_level= int(auth_level)
    if user_identity['p'] < auth_level: return api_utils.response_403() # forbidden -- NOT allowed
    return api_utils.response(200, "authorized")

### ---------------------------------------------------- API ENDPOINTS

# check username availability
@api.route('/username', methods=['POST'])
def hep_api_username():
    def __endpoint__(shell):
        if User.query.filter_by(username= shell.data['json']['username']).first(): return "n", 403
        return "y", 200
    return api_utils.endpoint_safe(__endpoint__, api_utils.get_shell(locals(), content="application/json", props=["username"], props_strict=True))

# get user lists
@api.route('/users', methods=['GET'])
def hep_api_users():
    users= User.query.all()
    if not users or len(users)==0: return "", 204
    return api_utils.response_200([user.serialize() for user in users])

# clears the data
@api.route('/clear', methods=['GET'])
def hep_api_clear():
    try:
        if len(db.engine.table_names()) > 0:
            for table in db.metadata.sorted_tables:
                db.session.execute(table.delete())
            db.session.commit()
    except Exception as e: return api_utils.response_500(repr(e))
    return api_utils.response_200()
