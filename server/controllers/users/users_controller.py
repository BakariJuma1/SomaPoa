from flask_restful import Resource,Api
from flask import request,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User
from server.extension import db

users_bp = Blueprint('users_controller',__name__)
api= Api(users_bp)
class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])

        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at
        }, 200

    @jwt_required()
    def patch(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])

        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json()

        username = data.get("username")
        email = data.get("email")

        if username:
            user.username = username
        if email:
            user.email = email

        db.session.commit()

        return {"message": "Profile updated successfully"}, 200


class AllUsers(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        if current_user["role"] != "admin":
            return {"error": "Unauthorized"}, 403

        users = User.query.all()
        return [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at
            } for user in users
        ], 200

api.add_resource(UserProfile,'/users/<int:id>')
api.add_resource(AllUsers,'/admin/users')