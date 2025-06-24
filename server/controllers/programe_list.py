from server.models.program import Program
from flask_restful import Resource

class ProgrammeList(Resource):
    def get(self):
        programmes = Program.query.all()

        return[p.to_dict() for p in programmes],200