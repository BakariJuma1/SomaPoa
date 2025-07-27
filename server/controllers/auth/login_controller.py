from flask_restful import Resource,Api
from server.extension import db
from server.models.user import User
from flask import request, jsonify
from datetime import datetime, timedelta
import pyotp
from server.utils.email_service import send_otp_email
from . import auth_bp

api = Api(auth_bp)

class Login(Resource):
    def options(self):
        return {"message": "Preflight OK"}, 200

    def post(self):
        data = request.get_json()

        if not data or not data.get('username') or not data.get('password'):
            return {"error": "Username and password are required"}, 400

        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            
            if not user.otp_secret:
                user.otp_secret = pyotp.random_base32()

            totp = pyotp.TOTP(user.otp_secret)
            otp_code = totp.now()  #

            # Log OTP and time
            print("Generated OTP:", otp_code)
            print("Generated at:", datetime.utcnow())

            # Save OTP expiry (give user 5 mins)
            user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)
            db.session.commit()

            # Send via email
            send_otp_email(user.email, otp_code)

            return {"message": "OTP sent to your email. Please verify to complete login."}, 200

        return {"error": "Invalid credentials"}, 401
    

class ResendOTP(Resource):
    def post(self):
        data = request.get_json()

        if not data or not data.get('username'):
            return {"error": "Username is required"}, 400

        user = User.query.filter_by(username=data['username']).first()

        if not user:
            return {"error": "User not found"}, 404

        #  resend if OTP was just sent
        now = datetime.utcnow()
        if user.otp_expiry and user.otp_expiry > now:
            seconds_left = int((user.otp_expiry - now).total_seconds())
            # If > 1 minute left, don't resend
            if seconds_left > 240:  
                return {"error": "OTP was recently sent. Please wait a moment before resending."}, 429

        if not user.otp_secret:
            user.otp_secret = pyotp.random_base32()

        totp = pyotp.TOTP(user.otp_secret)
        otp_code = totp.now()

        user.otp_expiry = now + timedelta(minutes=5)
        db.session.commit()

        send_otp_email(user.email, otp_code)

        return {"message": "OTP resent to your email."}, 200    
    
api.add_resource(Login,'/login')
api.add_resource(ResendOTP, '/resend-otp')

