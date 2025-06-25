from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from server.models.application import Application
from server.models.program import Program
from server.extension import db
from datetime import datetime
from werkzeug.utils import secure_filename
import os

# only students can apply
class ApplicationResource(Resource):
    @jwt_required()
    def post(self):
        identity = get_jwt_identity()

        if identity["role"] != "student":
            return {"error": "Only students can apply for bursaries"}, 403

        student_id = identity["id"]
        data = request.get_json()

        # get files from request
        income_file = request.files.get('income_proof')
        academic_file = request.files.get('academic_proof')

        if not income_file or not academic_file:
            return{"error":"Both proof documents are required"}
        
        # save files securely
        income_filename = secure_filename(income_file.filename)
        academic_filename = secure_filename(academic_file.filename)

        income_path = os.path.join('server/uploads/income',income_filename)
        academic_path = os.path.join("server/uploads/academic", academic_filename)

        income_file.save(income_path)
        academic_file.save(academic_path)


        # Required fields
        required_fields = [
            "program_id", "school_name", "ward", "education_level", "household_income"
        ]
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} is required."}, 400

        # Check programme
        program = Program.query.get(data["program_id"])
        if not program:
            return {"error": "Programme not found"}, 404
        if program.deadline < datetime.utcnow():
            return {"error": "Application deadline has passed."}, 400

        # Prevent  applying twice
        if Application.query.filter_by(student_id=student_id, program_id=data["program_id"]).first():
            return {"error": "You have already applied to this programme."}, 409

        # Create application instance
        app = Application(
            student_id=student_id,
            program_id=data["program_id"],
            school_name=data["school_name"],
            ward=data["ward"],
            education_level=data["education_level"],
            kcpe_score=data.get("kcpe_score"),
            kcse_grade=data.get("kcse_grade"),
            gpa=data.get("gpa"),
            household_income=data["household_income"],
            income_proof_url=income_path,
            academic_proof_url=academic_path,
        )

        # Auto-score application
        app.evaluate()

        try:
            db.session.add(app)
            db.session.commit()
            return {
                "message": "Application submitted and evaluated.",
                "score": app.score,
                "status": app.status,
                "is_eligible": app.is_eligible
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"error": "Something went wrong saving the application."}, 500

        
# students can see their applications        
class MyApplications(Resource):
    @jwt_required(git a)
    def get(self):
        identity = get_jwt_identity()

        if identity['role'] != 'student':
            return {"error": "Only students can view their applications"}, 403

        student_id = identity['id']
        applications = Application.query.filter_by(student_id=student_id).all()

        result = []
        for app in applications:
            result.append({
                "application_id": app.id,
                "programme": app.programme.name,
                "status": app.status,
                "score":app.score,
                "is_eligible":app.is_eligible,
                "applied_at": app.applied_at.strftime("%Y-%m-%d")
            })

        return result, 200

