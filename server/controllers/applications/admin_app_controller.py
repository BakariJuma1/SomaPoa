from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from server.models.application import Application
from server.models.program import Program
from server.extension import db
from datetime import datetime
from server.models.user import User


# admin can view all applications and update their status
class AllApplications(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()

        if identity['role'] != 'admin':
            return {"error": "Admin access only"}, 403

        apps = Application.query.all()
        result = []

        for app in apps:
            result.append({
                "application_id": app.id,
                "student": app.student.username,
                "programme": app.program.name,
                "status": app.status,
                "score":app.score,
                "is_eligible":app.is_eligible,
                "applied_at": app.applied_at.strftime("%Y-%m-%d")
            })

        return result, 200
    
# admin can update the status of the application    # 
class ApplicationUpdate(Resource):
    @jwt_required()
    def patch(self, id):
        identity = get_jwt_identity()

        if identity['role'] != 'admin':
            return {"error": "Admin access only"}, 403

        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404

        data = request.get_json()
        status = data.get("status")

        # if new_status == 'approved':
        #     send_email(user.email,"Congrats your application has been approved")

        if status not in ["approved", "rejected", "pending"]:
            return {"error": "Invalid status"}, 400

        app.status = status
        db.session.commit()

        return {
            "message": f"Application {id} status updated to {status}"

            }, 200
    
# admin can delete an application
class DeleteApplication(Resource):
    @jwt_required()
    def delete(self, id):

        identity = get_jwt_identity()
        if identity['role']!='admin':
            return {"error":"Admin access required"}
        

        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404

        db.session.delete(app)
        db.session.commit()
        return {"message": f"Application {id} deleted"}, 200
    
    #admin can see eligible applications 
class EligibleApplications(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        if identity['role'] != 'admin':
            return {"error": "Admin access only"}, 403

        apps = Application.query.filter_by(is_eligible=True).all()

        results = []
        for app in apps:
            results.append({
                "id": app.id,
                "student": app.student.username,
                "programme": app.program.name,
                "score": app.score,
                "status": app.status,
                "proofs": {
                    "income": app.income_proof_url,
                    "academic": app.academic_proof_url
                }
            })
        return results, 200
    
class PendingApplications(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        if identity['role'] != 'admin':
            return {"error": "Admin access only"}, 403

        apps = Application.query.filter_by(status='pending').all()

        return [{
            "id": app.id,
            "student": app.student.username,
            "programme": app.program.name,
            "score": app.score,
            "is_eligible": app.is_eligible
        } for app in apps], 200
    
# the final take for admin to finally review and see the proofs before he award the bursary    # 
class AwardBursary(Resource):
    @jwt_required()
    def patch(self, id):
        identity = get_jwt_identity()
        if identity['role'] != 'admin':
            return {"error": "Admin access only"}, 403

        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404

        if not app.is_eligible:
            return {"error": "This student did not meet the criteria automatically"}, 400

        app.status = 'awarded'
        db.session.commit()

       
        return {
            "message": f"Application {id} marked as awarded",
            "student": app.student.username,
            "programme": app.program.name
        }, 200
