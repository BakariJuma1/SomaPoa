from flask_restful import Resource
from flask_jwt_extended import create_access_token
from server.extension import db
from server.models.user import User
from flask import request
from datetime import timedelta
import pyotp
import os
from server.utils.email_service import send_otp_email


class Register(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password') or not data.get('username'):
            return {"error": "Username, Email and Password are required"}, 400

        username = data['username']
        email = data['email']
        password = data['password']
        role = data.get('role', 'student')

        if User.query.filter((User.username == username) | (User.email == email)).first():
            return {"error": "User already exists"}, 409

        otp_secret = pyotp.random_base32()
        totp = pyotp.TOTP(otp_secret)
        otp_code = totp.now()

        #  send email first before saving user
        try:
            send_otp_email(email, otp_code)
        except Exception as e:
            return {"error": f"Failed to send OTP email: {str(e)}"}, 500

        #  save user if email is sent successfully
        user = User(
            username=username,
            email=email,
            role=role,
            otp_secret=otp_secret,
            otp_verified=False
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return {"message": "User created. OTP sent to email for verification"}
