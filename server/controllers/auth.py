from flask_restful import Resource
from flask_jwt_extended import create_access_token
from server.extension import db
from server.models.user import User
from flask import request, jsonify
from datetime import timedelta


class Register(Resource):
    def post(self):
        data =request.get_json()
        if not data or not data.get('email') or not data.get('password') or not data.get('username'):
            return {"error":"Username,Email and Password are required"},400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role','student') 

        

        if User.query.filter((User.username==username) | (User.email==email)).first():
            return {"error":"User already exists"},409
        
        user = User(username=username,email=email,role=role)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()
        return {"message":"User created succesfully"}
    
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