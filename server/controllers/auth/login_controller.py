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
    
    
api.add_resource(Login,'/login')
