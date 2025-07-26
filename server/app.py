import os
from flask import Flask,request
from flask_migrate import Migrate
from flask_restful import Api
from dotenv import load_dotenv
from flask_cors import CORS
from server.extension import db, migrate, jwt
from datetime import timedelta
import logging
from server.routes import register_routes

load_dotenv()
def create_app():
    app = Flask(__name__) 
    CORS(app,
         supports_credentials=True,
         origins=[
             "http://localhost:5173",
             "https://somapoa.netlify.app"
            #  "https://somapoa.onrender.com"
             ],
         methods=["GET","POST","DELETE","OPTIONS","PUT"] , 
         allow_headers=["Content-Type", "Authorization"]  ,
         expose_headers=["Content-Type"]
         )
    app.config.from_prefixed_env() 

    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['JWT_TOKEN_LOCATION'] = ["cookies"]
    app.config['JWT_ACCESS_COOKIE_NAME'] = os.getenv("JWT_ACCESS_COOKIE_NAME", "access_token")
    app.config['JWT_COOKIE_SECURE'] = os.getenv("JWT_COOKIE_SECURE", "False").lower() == "true"
    app.config['JWT_COOKIE_HTTPONLY'] = os.getenv("JWT_COOKIE_HTTPONLY", "True").lower() == "true"
    app.config['JWT_COOKIE_SAMESITE'] = os.getenv("JWT_COOKIE_SAMESITE", "Lax")

    # Handle expiration durations
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 900)))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", 604800)))
    app.config['JWT_COOKIE_CSRF_PROTECT']= False

    db.init_app(app)
    migrate.init_app(app, db)
    api = Api(app)
    jwt.init_app(app)
   
    @app.before_request
    def handle_options():
       if request.method == 'OPTIONS':
          return '', 200

    @app.route('/')
    def home():
       return {"message": "Welcome to Somapoa  API",}
    register_routes(app)
    return app
app = create_app()