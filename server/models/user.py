from server.extension import db
from  sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash,check_password_hash
from datetime import datetime   

class User(db.Model,SerializerMixin):

    __tablename__ = 'users'

    id = db.Column(db.Integer,primary_key=True)
    username = db.Column(db.String,nullable=False)
    email  = db.Column(db.Integer,unique=True)
    password_hash = db.Column(db.String,nullable=False)
    role = db.Column(db.String,default='student')
    created_at = db.Column(db.Date)

    applications = db.relationship("Application",back_populates='student')
    serialize_rules= ("-applications.user",)

    def set_password(self,password):
        self.password_hash = generate_password_hash(password)

    def check_password(self,password):
        return check_password_hash(self.password_hash,password)     