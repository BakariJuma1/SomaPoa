from flask import Flask,request
from flask_migrate import Migrate
from flask_restful import Api, Resource  
from dotenv import load_dotenv
from .models import db,User,Program,Application
from server.extension import db, migrate, jwt
# authentication
from server.controllers.auth.login_controller import Login
from server.controllers.auth.register_controller import Register
from server.controllers.auth.logout_controller import Logout
# student application
from server.controllers.applications.student_app_controller import ApplicationResource,MyApplications
from server.controllers.applications.admin_app_controller import AllApplications,ApplicationUpdate,DeleteApplication,EligibleApplications,PendingApplications,AwardBursary

# programmes
from server.controllers.programmes.programme_controller import ProgrammeList,ProgrammCreate
# users
from server.controllers.users.users_controller import UserProfile,AllUsers


load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env() 

    db.init_app(app)
    migrate.init_app(app, db)
    api = Api(app)
    jwt.init_app(app)

   #  CRSF protection for cookies
    app.config['JWT_COOKIE_CSRF_PROTECT']= True
    

    @app.route('/')
    def home():
       return {"message": "Welcome to Somapoa  API",}
    
   #registering my routes
   # auth routes
    api.add_resource(Login,'/login')
    api.add_resource(Register,'/register')
    api.add_resource(Logout,'/logout')


   #  student applications
    api.add_resource(ApplicationResource,'/applications')
    api.add_resource(MyApplications,'/my-applications')
 
   #  admin applications
    api.add_resource(AllApplications,'/admin/applications')
    api.add_resource(PendingApplications, "/admin/applications/pending")
    api.add_resource(EligibleApplications, "/admin/applications/eligible")
    api.add_resource(ApplicationUpdate, "/admin/applications/<int:id>/update")
    api.add_resource(AwardBursary, "/admin/applications/<int:id>/award")
    api.add_resource(DeleteApplication, "/admin/applications/<int:id>/delete")
   
   # programmes
    api.add_resource(ProgrammeList,'/programmes')
    api.add_resource(ProgrammCreate,'/admin/programmes/create') 
   
    
    return app