from .db import db
from  sqlalchemy_serializer import SerializerMixin

class User(db.Model,SerializerMixin):

    __tablename__ = 'users'

    id = db.Column(db.Integer,primary_key=True)
    email  = db.Column(db.Integer,unique=True)
    password = db.Column(db.String,nullable=False)
    role = db.Column(db.String,default='student')
    created_at = db.Column(db.Date)

    applications = db.relationship("Application",back_populate='student')
    serialize_rules= ("-applications.user",)
