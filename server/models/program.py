from server.extension import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime



class Program(db.Model,SerializerMixin):
    
    __tablename__ = "programs"

    id = db.Column(db.Integer,primary_key=True)
    program_name=db.Column(db.String(),nullable=False)
    ward=db.Column(db.String(),nullable=False)
    year = db.Column(db.Integer,default=lambda: datetime.now().year)
    description = db.Column(db.String(),nullable=False)
    deadline = db.Column(db.Date,nullable=False)
    visible = db.Column(db.Boolean,default=True,nullable=False)
    image_url = db.Column(db.String, nullable=True)

  
    applications= db.relationship('Application',back_populates='program',lazy=True,cascade="all, delete")
    serialize_rules= ("-applications.program",)
    
