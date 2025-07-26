from server.models import User
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify, make_response


class Me(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        user = User.query.get(identity["id"])

        if not user.otp_verified:
            return {"error": "Email not verified"}, 403
      
        return {
            "id": user.id,
            "role": user.role
        }, 200
