from server.extension import db

from sqlalchemy_serializer import SerializerMixin

class Application(db.Model,SerializerMixin):
    
    __tablename__ = "applications"

    id = db.Column(db.Integer,primary_key=True)
    student_id = db.Column(db.Integer,db.ForeignKey('users.id'))
    program_id = db.Column(db.Integer,db.ForeignKey('programs.id'))
    school_name=db.Column(db.String(),nullable=False)
    ward=db.Column(db.String(),nullable=False)
    level_of_study=db.Column(db.String(),nullable=False)
    average_grade=db.Column(db.String(),nullable=False)
    household_income=db.Column(db.String,nullable=False)
    status=db.Column(db.Boolean(),default='pending')
    submission_date = db.Column(db.DateTime,server_default=db.func.now())

    student = db.relationship("User",back_populates='applications')
    program = db.relationship('Program',back_populates ='applications')
    serialize_rules= ("-applications.student","-applications.program")

    # Ensure that a user can only apply to a programme once
    # This is enforced at the database level with a unique constraint   
    __table_args__ = (
    db.UniqueConstraint('student_id', 'program_id', name='unique_student_programme'),
   )
