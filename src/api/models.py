import time
from flask_sqlalchemy import SQLAlchemy
import api.utils as utils

db = SQLAlchemy()

class User(db.Model):
    __tablename__="users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), unique=True, nullable=False)
    displayname = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, unique=False, nullable=False) # password is stored hashed, in binary
    permission= db.Column(db.Integer, unique=False, nullable=False, default=0) # to test basic permission levels (its just 0=user, 1=admin)
    # i found token "revoking" dumb as fuck, it requires you to store every revoked token until they expire so nobody can access the user's data using them, how dumb is that?
    # i've implemented it differently
    timestamp = db.Column(db.Integer, unique=False, nullable=False, default=utils.current_millis_time())

    def __repr__(self):
        return f'<User {self.email}::{self.username} ({self.displayname})>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "displayname": self.displayname,
            "permission": self.permission,
            "timestamp": time.ctime(self.timestamp) if self.timestamp > 0 else 0,
            "password": str(self.password),
            "email": self.email
        }