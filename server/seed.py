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

    # Create Users
    admin = User(username="admin_user", email="admin@example.com", role="admin")
    admin.set_password("adminpass")

    student1 = User(username="student1", email="student1@example.com", role="student")
    student1.set_password("studentpass")

    student2 = User(username="student2", email="student2@example.com", role="student")
    student2.set_password("studentpass")

    db.session.add_all([admin, student1, student2])
    db.session.commit()

    # Create Programmes
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
        deadline=datetime.utcnow() - timedelta(days=1)  # Expired
    )

    db.session.add_all([programme1, programme2])
    db.session.commit()

    # Sample application
    application = Application(
        student_id=student1.id,
        program_id=programme1.id,
        school_name="Greenhill High",
        ward="Central Ward",
        education_level="secondary",
        kcse_grade="B",
        household_income=25000,
        income_proof_url="http://example.com/income.pdf",
        academic_proof_url="http://example.com/reportcard.pdf"
    )
    application.evaluate()  # Automatically calculate score/eligibility
    db.session.add(application)

    db.session.commit()
    print("🌱 Database seeded successfully!")
