from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from server.models.application import Application
from server.models.program import Program
from server.models.user import User
from server.extension import db
from datetime import datetime


# ============================== #
#     Admin: View All Apps      #
# ============================== #
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
                "programme": app.program.program_name,
                "status": app.status,
                "score": app.score,
                "is_eligible": app.is_eligible,
                "applied_at": app.applied_at.strftime("%Y-%m-%d")
            })

        return result, 200


# =================================== #
#   Admin: Update Application Status  #
# =================================== #
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

        if status not in ["approved", "rejected", "pending"]:
            return {"error": "Invalid status"}, 400

        app.status = status
        db.session.commit()

        return {
            "message": f"Application {id} status updated to {status}"
        }, 200


# =============================== #
#     Admin: Delete Application   #
# =============================== #
class DeleteApplication(Resource):
    @jwt_required()
    def delete(self, id):
        identity = get_jwt_identity()
        if identity['role'] != 'admin':
            return {"error": "Admin access required"}, 403

        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404

        db.session.delete(app)
        db.session.commit()

        return {"message": f"Application {id} deleted"}, 200


# ======================================= #
#   Admin: View Eligible Applications     #
# ======================================= #
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
                "programme": app.program.program_name,
                "score": app.score,
                "status": app.status,
                "proofs": {
                    "income": app.income_proof_url,
                    "academic": app.academic_proof_url
                }
            })
            print("✅ Eligible apps:", apps)


        return results, 200


# ======================================= #
#   Admin: View Pending Applications      #
# ======================================= #
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
            "programme": app.program.program_name,
            "score": app.score,
            "is_eligible": app.is_eligible,
            "proofs": {
                "income": app.income_proof_url,
                "academic": app.academic_proof_url
            }
        } for app in apps], 200


# ======================================= #
#     Admin: Award Bursary to Student     #
# ======================================= #
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
            "programme": app.program.program_name
        }, 200
