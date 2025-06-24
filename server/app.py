from flask import Flask,request
from flask_migrate import Migrate
from flask_restful import Api, Resource  
from dotenv import load_dotenv
from .models import db,User,Program,Application
from server.extension import db, migrate, jwt
# from server.controllers.auth.auth import Register,Login


load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env() 

    db.init_app(app)
    migrate = Migrate(app, db)
    api = Api(app)
    jwt.init_app(app)
    

    @app.route('/')
    def home():
       return {"message": "Welcome to Somapoa  API",}
    

   #  api.add_resource(Register,"/register")
   #  api.add_resource(Login,'/login')

    return app