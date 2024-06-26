import os, sys, signal
from datetime import timedelta
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import root, api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import JWTManager

import api.api_utils as api_utils

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config['SQLALCHEMY_DATABASE_URI']= os.environ.get("DATABASE_URL", "sqlite:////tmp/example.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
app.config["JWT_SECRET_KEY"]= "rigobaby_is_horrendous__change_my_mind"
app.config["JWT_TOKEN_LOCATION"]= ('headers')
app.config["JWT_HEADER_NAME"]= "Auth-Token"
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
MIGRATE = Migrate(app, db, compare_type=True)
CORS(app)
db.init_app(app)
setup_admin(app)
setup_commands(app)

jwt = JWTManager(app)

app.register_blueprint(root)
app.register_blueprint(api, url_prefix='/api')

# error handling
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return api_utils.response(error.status_code, "error", error.to_dict())

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

with app.app_context():
    if 'run' in sys.argv and len(db.engine.table_names()) == 0:
        print("\n\033[1;93mPlease initialize your DB first using \033[91mpipenv run upgrade\033[93m|\033[91mremake\n\033[0m")
        os.kill(os.getpid(), signal.SIGTERM)