import os
from flask import Flask,request
from flask_migrate import Migrate
from flask_restful import Api, Resource  
from dotenv import load_dotenv
# from server.models import db,User,Program,Application
from server.extension import db, migrate, jwt
# authentication
from server.controllers.auth.login_controller import Login
from server.controllers.auth.register_controller import Register
from server.controllers.auth.logout_controller import Logout
from server.controllers.auth.verify_otp import VerifyOTP
# student application
from server.controllers.applications.student_app_controller import ApplicationResource,MyApplications,SingleApplication
from server.controllers.applications.admin_app_controller import AllApplications,ApplicationUpdate,DeleteApplication,EligibleApplications,PendingApplications,AwardBursary

# programmes
from server.controllers.programmes.programme_controller import ProgrammeList,ProgrammeCreate,ProgrammeDetail,ProgrammeHide,ProgrammeEdit,ProgrammeAdminList
# users
from server.controllers.users.users_controller import UserProfile,AllUsers
from flask_cors import CORS
# refresh
from server.controllers.auth.refresh_controller import RefreshToken
from datetime import timedelta
from server.controllers.auth.me_controller import Me
import logging

load_dotenv()


def create_app():
    app = Flask(__name__)
    # set the route 
    CORS(app,
         supports_credentials=True,
         origins=[
             "http://localhost:5173",
             "https://somapoa.netlify.app"
            #  "https://somapoa.onrender.com"
             ],
         methods=["GET","POST","DELETE","OPTIONS"] , 
         allow_headers=["Content-Type", "Authorization"]  ,
         expose_headers=["Content-Type"]
         )
    app.config.from_prefixed_env() 

    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    # app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
    app.config['JWT_TOKEN_LOCATION'] = ["cookies"]
    app.config['JWT_ACCESS_COOKIE_NAME'] = os.getenv("JWT_ACCESS_COOKIE_NAME", "access_token")
    app.config['JWT_COOKIE_SECURE'] = os.getenv("JWT_COOKIE_SECURE", "False").lower() == "true"
    app.config['JWT_COOKIE_HTTPONLY'] = os.getenv("JWT_COOKIE_HTTPONLY", "True").lower() == "true"
    app.config['JWT_COOKIE_SAMESITE'] = os.getenv("JWT_COOKIE_SAMESITE", "Lax")
    # app.config['JWT_COOKIE_CSRF_PROTECT'] = os.getenv("JWT_COOKIE_CSRF_PROTECT", "False").lower() == "true"


    # Handle expiration durations
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 900)))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", 604800)))

   



    db.init_app(app)
    migrate.init_app(app, db)
    api = Api(app)
    jwt.init_app(app)
   


   #  CRSF protection for cookies
    app.config['JWT_COOKIE_CSRF_PROTECT']= False

    # specific folders
    os.makedirs("server/uploads/income", exist_ok=True)
    os.makedirs("server/uploads/academic", exist_ok=True)
    

    @app.route('/')
    def home():
       return {"message": "Welcome to Somapoa  API",}
           

   #registering my routes
   # auth routes
    api.add_resource(Login,'/login')
    api.add_resource(Register,'/register')
    api.add_resource(Logout,'/logout')
    api.add_resource(RefreshToken,'/refresh')
    api.add_resource(Me,'/me')
    api.add_resource(VerifyOTP,'/verify-otp')

    # test api
   


   #  student applications
    api.add_resource(ApplicationResource,'/applications')
    api.add_resource(MyApplications,'/my-applications')
    api.add_resource(SingleApplication,'/my-applications/<int:id>')

   #  admin applications
    api.add_resource(AllApplications,'/admin/applications')
    api.add_resource(PendingApplications, "/admin/applications/pending")
    api.add_resource(EligibleApplications, "/admin/applications/eligible")
    api.add_resource(ApplicationUpdate, "/admin/applications/<int:id>/update")
    api.add_resource(AwardBursary, "/admin/applications/<int:id>/award")
    api.add_resource(DeleteApplication, "/admin/applications/<int:id>/delete")
   
   # programmes
    api.add_resource(ProgrammeList,'/programmes')
    api.add_resource(ProgrammeCreate,'/admin/programmes/create') 
    api.add_resource(ProgrammeDetail,'/programmes/<int:id>')
    api.add_resource(ProgrammeHide,'/admin/programmes/<int:id>/hide')
    api.add_resource(ProgrammeEdit,'/admin/programmes/<int:id>/edit')
    api.add_resource(ProgrammeAdminList,'/admin/programmes')


   # users
    api.add_resource(UserProfile,'/users/<int:id>')
    api.add_resource(AllUsers,'/admin/users')
   
    
    return app
app = create_app()