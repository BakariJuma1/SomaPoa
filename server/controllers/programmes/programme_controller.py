from server.models.program import Program
from flask_restful import Resource
from flask_jwt_extended import jwt_required,get_jwt_identity
from flask import request
from server.extension import db

# for the public and admin does not require aunthentication
class ProgrammeList(Resource):
    def get(self):
        programmes = Program.query.all()

        return[p.to_dict() for p in programmes],200

class ProgrammeDetail(Resource): 
    @jwt_required()
    def get(self, id):
        identity = get_jwt_identity()
       
        program = Program.query.get(id)
        if not program:
            return {"error": "Programme not found"}, 404

        return program.to_dict(), 200   

# only admins can create a programme  requires aunthentication 
class ProgrammCreate(Resource):
    @jwt_required
    def post(self):
        identity = get_jwt_identity()

        if identity['role'] != 'admin':
            return {"error":"only admins can create bursary programmes"}
        
        data = request.get_json()
        program_name = data.get_json('program_name')
        ward = data.get_json('ward')
        year = data.get_json('year')
        description = data.get_json('description')
        deadline = data.get_json('deadline')
        image_url = data.get("image_url")

        if not program_name or not deadline:
            return {"error":"Name and deadline are required"},400
        
        program = Program(
            name = program_name,
            ward=ward,
            year=year,
            description=description,
            deadline= deadline
        )
        db.session.add(program)
        db.session.commit()
        return {"message":"program created succesfully"}