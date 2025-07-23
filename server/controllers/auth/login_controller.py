from flask_restful import Resource
from server.extension import db
from server.models.user import User
from flask import request, make_response, jsonify
from datetime import timedelta
import pyotp
import datetime
from server.utils.email_service import send_otp_email  

class Login(Resource):
    def options(self):
        return{"message":"Preflight OK"},200
    def post(self):
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password'):
            return {"error": "Username and password are required"}, 400

        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            #  Generate a time-based OTP secret if not already there
            if not user.otp_secret:
                user.otp_secret = pyotp.random_base32()

            #  Generate current OTP
            totp = pyotp.TOTP(user.otp_secret)
            otp_code = totp.now()

            #  Send the OTP via SendGrid email
            send_otp_email(user.email, otp_code)  

            #  Set OTP expiry (5 minutes)
            user.otp_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)

            db.session.commit()

            return {"message": "OTP sent to your email. Please verify to complete login."}, 200

        return {"error": "Invalid credentials"}, 401

