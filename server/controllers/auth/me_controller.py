# server/controllers/auth/me_controller.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

class Me(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        return {
            "id": identity["id"],
            "role": identity["role"]
        }, 200
