from flask import Blueprint

applications_bp = Blueprint('applications_bp',__name__)

from .admin_app_controller import *
from .student_app_controller import *