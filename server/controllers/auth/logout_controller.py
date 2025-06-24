from flask_restful import Resource
from flask_jwt_extended import unset_jwt_cookies,jwt_required
from flask import jsonify

class Logout(Resource):
    @jwt_required()
    def post(self):
        response = jsonify({"message": "Logged out successfully"})
        unset_jwt_cookies(response)
        return response, 200
