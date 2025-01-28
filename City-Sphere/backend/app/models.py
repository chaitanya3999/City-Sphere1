from . import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    social_id = db.Column(db.String(64), unique=True)
    social_provider = db.Column(db.String(20))
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def get_or_create(email, username, social_id=None, social_provider=None):
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, username=username,
                       social_id=social_id,
                       social_provider=social_provider)
            db.session.add(user)
            db.session.commit()
        return user
