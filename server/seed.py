from server.extension import db
from server.models.user import User
from server.models.program import Program
from server.models.application import Application
from server.app import create_app
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Users
    admin = User(username="admin_user", email="admin@example.com", role="admin")
    admin.set_password("adminpass")

    student1 = User(username="student1", email="student1@example.com", role="student")
    student1.set_password("studentpass")

    student2 = User(username="student2", email="student2@example.com", role="student")
    student2.set_password("studentpass")

    student3 = User(username="student3", email="student3@example.com", role="student")
    student3.set_password("studentpass")

    student4 = User(username="student4", email="student4@example.com", role="student")
    student4.set_password("studentpass")

    db.session.add_all([admin, student1, student2, student3, student4])
    db.session.commit()

    # Programmes
    programme1 = Program(
        program_name="County Education Bursary",
        ward='Lugari',
        description="Bursary for needy secondary school students",
        deadline=datetime.utcnow() + timedelta(days=7)
    )

    programme2 = Program(
        program_name="Emergency Support Fund",
        ward='Kisii',
        description="Bursary for students in emergencies",
        deadline=datetime.utcnow() - timedelta(days=1)
    )

    programme3 = Program(
        program_name="University Talent Grant",
        ward='Kakamega Central',
        description="Grant for students excelling in sports or arts",
        deadline=datetime.utcnow() + timedelta(days=14)
    )

    programme4 = Program(
        program_name="Orphans & Vulnerable Children Bursary",
        ward='Mumias East',
        description="Targeted support for OVCs in primary and secondary",
        deadline=datetime.utcnow() + timedelta(days=30)
    )

    db.session.add_all([programme1, programme2, programme3, programme4])
    db.session.commit()

    # Applications
    applications = [
        Application(
            student_id=student1.id,
            program_id=programme1.id,
            school_name="Greenhill High",
            ward="Lugari",
            education_level="secondary",
            kcse_grade="B",
            household_income=25000,
            income_proof_url="http://example.com/income1.pdf",
            academic_proof_url="http://example.com/report1.pdf"
        ),
        Application(
            student_id=student2.id,
            program_id=programme3.id,
            school_name="Kakamega Uni",
            ward="Kakamega Central",
            education_level="university",
            kcse_grade="A",
            household_income=40000,
            income_proof_url="http://example.com/income2.pdf",
            academic_proof_url="http://example.com/report2.pdf"
        ),
        Application(
            student_id=student3.id,
            program_id=programme4.id,
            school_name="Mumias Academy",
            ward="Mumias East",
            education_level="primary",
            kcse_grade=None,
            household_income=10000,
            income_proof_url="http://example.com/income3.pdf",
            academic_proof_url="http://example.com/report3.pdf"
        )
    ]

    for app in applications:
        app.evaluate()
        db.session.add(app)

    db.session.commit()
    print("Database seeded successfully with more users, programs, and applications!")
