from flask import Flask,request
from flask_migrate import Migrate
from flask_restful import Api, Resource  
from dotenv import load_dotenv
from .models import db,User,Program,Application
# from .controllers import controller


load_dotenv()

app = Flask(__name__)
# Loads from FLASK_SQLALCHEMY_DATABASE_URI and others
app.config.from_prefixed_env()  

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def home():
    return 'Home'
