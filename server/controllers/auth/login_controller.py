from flask_restful import Resource
from flask_jwt_extended import create_access_token
from server.extension import db
from server.models.user import User
from flask import request
from datetime import timedelta



   
class Login(Resource):
    def post(self):

        data = request.get_json()    

        if not data or not data.get('username') or not data.get('password'):
            return {"error":"email and password are required"}
        
        username = data['username']
        password = data['password']

        user = User.query.filter_by(email=username).first()

        if user and user.check_password(password):
            token = create_access_token(
                identity={"id":user.id,"role":user.role},
                expires_delta=timedelta(hours=1)
            )
            return {"access_token":token},200
        return {"error":"Invalid Credentials"},401