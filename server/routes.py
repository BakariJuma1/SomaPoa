from server.controllers.auth import auth_bp
from server.controllers.applications import applications_bp
from server.controllers.programmes.programme_controller import programme_controller_bp
from server.controllers.users.users_controller import users_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(programme_controller_bp)
    app.register_blueprint(applications_bp)
    app.register_blueprint(users_bp)