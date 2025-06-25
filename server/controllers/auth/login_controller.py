from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies
)
from server.extension import db
from server.models.user import User
from flask import request, make_response, jsonify
from datetime import timedelta

class Login(Resource):
    def post(self):
        # Get JSON data from the request
        data = request.get_json()

        # Validate presence of required fields
        if not data or not data.get('username') or not data.get('password'):
            return {"error": "Username and password are required"}, 400

        username = data['username']
        password = data['password']

        # Query the user from the database
        user = User.query.filter_by(username=username).first()

        # Check if user exists and password is correct
        if user and user.check_password(password):
            # Generate access token (short-lived)
            access_token = create_access_token(
                identity={"id": user.id, "role": user.role},
                expires_delta=timedelta(minutes=15)  # or 1 hour if you prefer
            )

            # Generate refresh token (longer-lived)
            refresh_token = create_refresh_token(
                identity={"id": user.id, "role": user.role},
                expires_delta=timedelta(days=7)
            )

            # Build the response
            response = make_response(jsonify({
                "message": "Login successful",
                "access_token": access_token  # still include for convenience
            }))

            # Set both tokens as HTTP-only cookies
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

            return response

        # If credentials are invalid
        return {"error": "Invalid credentials"}, 401
