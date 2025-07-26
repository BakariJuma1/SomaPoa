from server.models.program import Program
from flask_restful import Resource,Api
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request,Blueprint
from server.extension import db
from datetime import datetime
from server.services.cloudinary_service import upload_file_to_cloudinary

programme_controller_bp = Blueprint("programme_controller",__name__)
api = Api(programme_controller_bp)

# Public: List all programs
class ProgrammeList(Resource):
    def get(self):
        today = datetime.utcnow().date()
        programmes = Program.query.filter_by(visible=True).filter(Program.deadline >= today).all()

        result = []
        for p in programmes:
            result.append({
                "id": p.id,
                "program_name": p.program_name,
                "ward": p.ward,
                "year": p.year,
                "description": p.description,
                "deadline": p.deadline.strftime("%Y-%m-%d") if p.deadline else None,
                "image_url": p.image_url
            })

        return result, 200


# Public/Admin: View a single programme
class ProgrammeDetail(Resource): 
    @jwt_required()
    def get(self, id):
        identity = get_jwt_identity()
        program = Program.query.get(id)
        if not program:
            return {"error": "Programme not found"}, 404
        return program.to_dict(), 200   


# Admin only: Create a programme
class ProgrammeCreate(Resource):
    @jwt_required()
    def post(self):
        identity = get_jwt_identity()

        if identity['role'] != 'admin':
            return {"error": "Only admins can create bursary programmes"}, 403

        program_name = request.form.get('program_name')
        ward = request.form.get('ward')
        year = request.form.get('year')
        description = request.form.get('description')
        deadline = request.form.get('deadline')
        image_file = request.files.get('image')

        if not program_name or not deadline:
            return {"error": "Program name and deadline are required"}, 400

        image_url = None
        if image_file:
            try:
                image_url = upload_file_to_cloudinary(image_file, folder="soma-poa/program-images")
            except Exception:
                return {"error": "Image upload failed"}, 500

        program = Program(
            program_name=program_name,
            ward=ward,
            year=year,
            description=description,
            deadline=deadline,
            image_url=image_url
        )

        db.session.add(program)
        db.session.commit()

        return {
            "message": "Program created successfully",
            "program": program.to_dict()
        }, 201
    
# soft deleting  a program  
class ProgrammeHide(Resource):
    @jwt_required()
    def patch(self, id):
        identity = get_jwt_identity()
        if identity["role"] != "admin":
            return {"error": "Unauthorized"}, 403
        
        programme = Program.query.get(id)
        if not programme:
            return {"error": "Programme not found"}, 404
        
        programme.visible = False
        db.session.commit()
        return {"message": "Programme hidden successfully"}, 200

# edit programme details
class ProgrammeEdit(Resource):
    @jwt_required()
    def patch(self, id):
        identity = get_jwt_identity()
        if identity["role"] != "admin":
            return {"error": "Unauthorized"}, 403

        data = request.get_json()
        programme = Program.query.get(id)
        if not programme:
            return {"error": "Programme not found"}, 404

        for field in ["program_name", "ward", "year", "description", "deadline", "image_url"]:
            if field in data:
                setattr(programme, field, data[field])

        db.session.commit()
        return {"message": "Programme updated"}, 200
    
# Admin only:List all programmes (including hidden ones)
class ProgrammeAdminList(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()

        if identity["role"] != "admin":
            return {"error": "Unauthorized"}, 403

        programmes = Program.query.order_by(Program.deadline.desc()).all()
        result = []

        for p in programmes:
            result.append({
                "id": p.id,
                "program_name": p.program_name,
                "ward": p.ward,
                "year": p.year,
                "description": p.description,
                "visible": p.visible,
                "deadline": p.deadline.strftime("%Y-%m-%d") if p.deadline else None,
                "image_url": p.image_url
            })

        return result, 200
    
    
#register my routes
api.add_resource(ProgrammeList,'/programmes') 
api.add_resource(ProgrammeCreate,'/admin/programmes/create') 
api.add_resource(ProgrammeDetail,'/programmes/<int:id>')
api.add_resource(ProgrammeHide,'/admin/programmes/<int:id>/hide')
api.add_resource(ProgrammeEdit,'/admin/programmes/<int:id>/edit')
api.add_resource(ProgrammeAdminList,'/admin/programmes')
  
  
