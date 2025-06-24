from flask_restful import Resource
from flask_jwt_extended import create_access_token,set_access_cookies
from server.extension import db
from server.models.user import User
from flask import request
from datetime import timedelta
from flask import make_response,jsonify



   
class Login(Resource):
    def post(self):

        data = request.get_json()    

        if not data or not data.get('username') or not data.get('password'):
            return {"error":"email and password are required"}
        
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            access_token =create_access_token(
                identity={"id":user.id,"role":user.role},
                expires_delta=timedelta(hours=1)
                
                )
            response =make_response(jsonify(
                {
                "message":"Login succesfull",
                "access_token":access_token
                }
             ) )
            # stores the token as a cookie 
            set_access_cookies(response,access_token)
            return response
        return {"error":"Invalid Credentials"},401