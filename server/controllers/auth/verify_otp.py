from flask_restful import Resource,Api
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    set_access_cookies, set_refresh_cookies)
from flask import request, jsonify, make_response
from datetime import datetime, timedelta
import pyotp
from server.models.user import User
from server.extension import db
from . import auth_bp

api=Api(auth_bp)
class VerifyOTP(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get('username') or not data.get('otp'):
            return {"error": "Username and OTP are required"}, 400

        user = User.query.filter_by(username=data['username']).first()
        if not user:
            return {"error": "User not found"}, 404

        print(f"OTP Verification Attempt - User: {user.username}")
        print(f"OTP Expiry: {user.otp_expiry}, Current Time: {datetime.utcnow()}")

        if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
            return {"error": "OTP expired. Please login again."}, 401

        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(data['otp'], valid_window=1):
            return {"error": "Invalid OTP"}, 401
        
        user.otp_verified = True
        db.session.commit()

        access_token = create_access_token(
            identity={"id": user.id, "role": user.role},
            expires_delta=timedelta(minutes=15)
        )
        refresh_token = create_refresh_token(
            identity={"id": user.id, "role": user.role},
            expires_delta=timedelta(days=7)
        )

        response = make_response(jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role
            }
        }), 200)

      
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response
    
api.add_resource(VerifyOTP,'/verify-otp')