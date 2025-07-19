from flask_restful import Resource
from flask_jwt_extended import create_access_token
from server.extension import db
from server.models.user import User
from flask import request
from datetime import timedelta
import pyotp
from flask_jwt_extended import set_refresh_cookies,create_refresh_token,set_access_cookies
from flask import request, make_response, jsonify
import datetime

class VerifyOTP(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get('username') or not data.get('otp'):
            return {"error": "Username and OTP are required"}, 400

        user = User.query.filter_by(username=data['username']).first()
        if not user:
            return {"error": "User not found"}, 404

        # Check OTP expiry
        if not user.otp_expiry or user.otp_expiry < datetime.datetime.utcnow():
            return {"error": "OTP expired. Please login again."}, 401

        # Validate OTP
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(data['otp']):
            return {"error": "Invalid OTP"}, 401

        # Generate tokens after successful OTP validation
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
            "access_token": access_token
        }))

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response
