from server.extension import db
from server.models.user import User
from server.models.program import Program
from server.models.application import Application
from server.app import create_app
from faker import Faker
from datetime import datetime, timedelta
import random

app = create_app()
fake = Faker()

# Stable Unsplash images (curated manually)
image_links = [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9",
    "https://images.unsplash.com/photo-1596495577886-d920f1fb7238",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    "https://images.unsplash.com/photo-1584697964180-2e3aaf58d0a7",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    "https://images.unsplash.com/photo-1581092580491-52a60b210175",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2",
    "https://images.unsplash.com/photo-1560264357-8a9fdf52f4d0",
    "https://images.unsplash.com/photo-1604023467129-a8da9fdd07ec"
]

with app.app_context():
    db.drop_all()
    db.create_all()

    print("🔄 Seeding database...")

    # Create Admins
    admins = []
    for i in range(5):
        user = User(
            username=fake.user_name(),
            email=f"admin{i}@example.com",
            role="admin"
        )
        user.set_password("adminpass")
        admins.append(user)
    
    # Create Students
    students = []
    for i in range(45):
        user = User(
            username=fake.user_name(),
            email=f"student{i}@example.com",
            role="student"
        )
        user.set_password("studentpass")
        students.append(user)

    db.session.add_all(admins + students)
    db.session.commit()

    # Create Programs
    programs = []
    for i in range(20):
        program = Program(
            program_name=fake.catch_phrase(),
            ward=fake.city(),
            description=fake.text(max_nb_chars=200),
            deadline=datetime.utcnow() + timedelta(days=random.randint(-5, 30)),
            image_url=random.choice(image_links),
        )
        programs.append(program)
    
    db.session.add_all(programs)
    db.session.commit()

    # Applications (each student can apply to up to 3 random programs)
    applications = []
    for student in students:
        chosen_programs = random.sample(programs, k=random.randint(1, 3))
        for program in chosen_programs:
            app = Application(
                student_id=student.id,
                program_id=program.id,
                school_name=fake.company() + " School",
                ward=fake.city(),
                education_level=random.choice(["primary", "secondary", "university"]),
                kcse_grade=random.choice(["A", "B+", "B", "C+", "C"]),
                household_income=random.randint(10000, 60000),
                income_proof_url=f"http://example.com/income{random.randint(1, 100)}.pdf",
                academic_proof_url=f"http://example.com/report{random.randint(1, 100)}.pdf"
            )
            app.evaluate()
            applications.append(app)

    db.session.add_all(applications)
    db.session.commit()

    print("✅ Database seeded successfully!")
