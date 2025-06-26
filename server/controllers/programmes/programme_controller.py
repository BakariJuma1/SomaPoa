from server.models.program import Program
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from server.extension import db

# Public: List all programs
class ProgrammeList(Resource):
    def get(self):
        programmes = Program.query.all()

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
class ProgrammCreate(Resource):
    @jwt_required()
    def post(self):
        identity = get_jwt_identity()

        if identity['role'] != 'admin':
            return {"error": "Only admins can create bursary programmes"}, 403

        data = request.get_json()
        program_name = data.get('program_name')
        ward = data.get('ward')
        year = data.get('year')
        description = data.get('description')
        deadline = data.get('deadline')
        image_url = data.get('image_url')

        if not program_name or not deadline:
            return {"error": "Name and deadline are required"}, 400
        
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
