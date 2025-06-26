from server.extension import db

from sqlalchemy_serializer import SerializerMixin

class Application(db.Model,SerializerMixin):
    
    __tablename__ = "applications"

    id = db.Column(db.Integer,primary_key=True)
    student_id = db.Column(db.Integer,db.ForeignKey('users.id'))
    program_id = db.Column(db.Integer,db.ForeignKey('programs.id'))
    school_name=db.Column(db.String(),nullable=False)
    ward=db.Column(db.String(),nullable=False)

    income_proof_url = db.Column(db.String)
    academic_proof_url = db.Column(db.String)

    education_level=db.Column(db.String(),nullable=False)
    kcpe_score=db.Column(db.Integer(),nullable=True)
    kcse_grade = db.Column(db.String,nullable=True)
    gpa = db.Column(db.String,nullable=True)

    household_income=db.Column(db.Integer,nullable=False)

    status=db.Column(db.String(),default='pending',nullable=False)
    score = db.Column(db.Integer,default=0)
    is_eligible = db.Column(db.Boolean,default=False)
    submission_date = db.Column(db.DateTime,server_default=db.func.now())

    student = db.relationship("User",back_populates='applications')
    program = db.relationship('Program',back_populates ='applications')
    serialize_rules= ("-student.applications","-program.applications")

    # Ensure that a user can only apply to a programme once
    # This is enforced at the database level with a unique constraint   
    __table_args__ = (
    db.UniqueConstraint('student_id', 'program_id', name='unique_student_programme'),
   )
    
    def evaluate(self):
       score = 0

        # academic perfomance
       if self.education_level == 'primary' and self.kcpe_score:
          if self.kcpe_score >=400:
             score += 50
          elif self.kcpe_score >=350:
             score =+ 30
          else:
             score += 10
            

        # Highschool students
       elif self.education_level =='secondary' and self.kcse_grade:
          
          grade_points = {
            "A": 12, "A-": 11, "B+": 10, "B": 9,
            "B-": 8, "C+": 7, "C": 6, "C-": 5,
            "D+": 4, "D": 3, "D-": 2, "E": 1
           }
          points = grade_points.get(self.kcse_grade.upper(),0)
          if points >= 11:
             score += 50
          elif points >=8:
             score =+ 30
          else:
             score =+ 10

        # university students    #  
       elif self.education_level == 'university' and self.gpa is not None:
          if self.gpa >= 3.7:
             score += 50
          elif self.gpa >= 3.0:
             score += 30
          else:
             score += 10   

    #    vulnarability based on household income             #  
       if self.household_income <= 10000:
          score += 40
       elif self.household_income <=30000:
          score += 20  
       elif self.household_income <=50000:
          score +=10
       else:
          score += 0

       self.score = score
       self.is_eligible = score >= 70
       self.status = 'pending' 

