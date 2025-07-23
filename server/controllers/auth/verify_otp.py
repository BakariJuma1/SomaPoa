from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    set_access_cookies, set_refresh_cookies
)
from flask import request, jsonify, make_response
from datetime import datetime, timedelta
import pyotp
from server.models.user import User

class VerifyOTP(Resource):
    def options(self):
        return {"message": "Preflight OK"}, 200

    def post(self):
        data = request.get_json()
        if not data or not data.get('username') or not data.get('otp'):
            return {"error": "Username and OTP are required"}, 400

        user = User.query.filter_by(username=data['username']).first()
        if not user:
            return {"error": "User not found"}, 404

        # Debug logging
        print(f"OTP Verification Attempt - User: {user.username}")
        print(f"OTP Expiry: {user.otp_expiry}, Current Time: {datetime.utcnow()}")

        if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
            return {"error": "OTP expired. Please login again."}, 401

        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(data['otp'], valid_window=1):  # Added valid_window
            return {"error": "Invalid OTP"}, 401

        # Create tokens
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

        # Enhanced cookie settings
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            
            samesite='Lax',
            max_age=900,
            path='/'
        )
        
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            samesite='Lax',
            max_age=604800,
            path='/'
        )

        return response