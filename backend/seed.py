from pymongo import MongoClient
import os, uuid

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["swarasadhana"]

courses = [
    ("Vocals","beginner"),
    ("Vocals","advanced"),
    ("Flute","beginner"),
    ("Flute","advanced"),
    ("Guitar","beginner"),
    ("Guitar","advanced"),
    ("Ukelele","beginner"),
    ("Ukelele","advanced"),
    ("Keyboard","beginner"),
    ("Keyboard","advanced"),
]

tutorials = []
for course, level in courses:
    for i in range(1,6):
        tutorials.append({
            "id": f"{course.lower()}-{level}-{i}",
            "course": course,
            "level": level,
            "title": f"{course} {level} Lesson {i}",
            "youtube": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "duration": "20:00"
        })

db.tutorials.delete_many({})
db.progress.delete_many({})
db.users.delete_many({})
db.tutorials.insert_many(tutorials)
print("Seeded tutorials and cleared collections.")
print("Total tutorials:", db.tutorials.count_documents({}))
