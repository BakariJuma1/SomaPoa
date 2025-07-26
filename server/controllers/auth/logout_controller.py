from flask_restful import Resource,Api
from flask_jwt_extended import unset_jwt_cookies,jwt_required
from flask import jsonify
from . import auth_bp

api=Api(auth_bp)

class Logout(Resource):
    @jwt_required()
    def post(self):
        response = jsonify({"message": "Logged out successfully"})
        unset_jwt_cookies(response)
        return response

api.add_resource(Logout,'/logout')