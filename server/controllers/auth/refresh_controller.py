from flask_restful import Resource,Api
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, create_access_token, set_access_cookies)
from flask import jsonify, make_response
from datetime import timedelta
from server.models.user import User 
from . import auth_bp

api=Api(auth_bp)
class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
       
        identity = get_jwt_identity()
        user = User.query.get(identity["id"])

        if not user:
            return jsonify({"error": "User not found"}), 404

        # user  must have verified their email via OTP
        if not user.otp_verified:
            return jsonify({"error": "Email not verified. Please verify via OTP."}), 403

        
        new_access_token = create_access_token(
            identity={"id": user.id, "role": user.role},
            expires_delta=timedelta(minutes=15)
        )

        # Set access token in HTTP-only cookie
        response = make_response(jsonify({"access_token": new_access_token}))
        set_access_cookies(response, new_access_token)

        return response
    
api.add_resource(RefreshToken,'/refresh')
