from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies
from flask import jsonify, make_response
from datetime import timedelta

class RefreshToken(Resource):
     # Require a valid refresh token
    @jwt_required(refresh=True) 
    def post(self):
        # Get identity from the refresh token
        identity = get_jwt_identity()

        # Create a new short-lived access token
        new_access_token = create_access_token(
            identity=identity,
            expires_delta=timedelta(minutes=15)
        )

        # Set the new access token in the response cookie
        response = make_response(jsonify({"access_token": new_access_token}))
        set_access_cookies(response, new_access_token)

        return response
