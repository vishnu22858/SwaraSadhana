from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/swarasadhana")
client = MongoClient(MONGO_URI)
db = client["swarasadhana"]

@app.route("/api/register", methods=["POST"])
def register():
    payload = request.get_json() or {}
    email = payload.get("email")
    password = payload.get("password")
    name = payload.get("name", "")
    if not email or not password:
        return jsonify({"error":"email and password required"}), 400
    if db.users.find_one({"email": email}):
        return jsonify({"error":"user exists"}), 400
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password": generate_password_hash(password),
        "name": name,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    result = db.users.insert_one(user)
    user.pop("password", None)
    user["_id"] = str(result.inserted_id)
    return jsonify(user), 201

@app.route("/api/login", methods=["POST"])
def login():
    payload = request.get_json() or {}
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        return jsonify({"error":"email and password required"}), 400
    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user.get("password",""), password):
        return jsonify({"error":"invalid credentials"}), 401
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return jsonify(user), 200

@app.route("/api/tutorials", methods=["GET"])
def get_tutorials():
    course = request.args.get("course")
    level = request.args.get("level")
    q = {}
    if course:
        q["course"] = course
    if level:
        q["level"] = level
    docs = list(db.tutorials.find(q, {"_id":0}))
    return jsonify(docs)

@app.route("/api/progress", methods=["GET", "POST"])
def progress():
    if request.method == "POST":
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "no data provided"}), 400
            data.setdefault("ts", datetime.utcnow().isoformat() + "Z")
            result = db.progress.insert_one(data)
            response = dict(data)
            response["_id"] = str(result.inserted_id)
            return jsonify(response), 201
        except Exception as e:
            import traceback, sys
            traceback.print_exc(file=sys.stdout)
            return jsonify({"error": "internal server error", "details": str(e)}), 500
    else:
        try:
            userId = request.args.get("userId")
            query = {"userId": userId} if userId else {}
            progress_list = list(db.progress.find(query, {"_id": 0}))
            return jsonify(progress_list)
        except Exception as e:
            import traceback, sys
            traceback.print_exc(file=sys.stdout)
            return jsonify({"error":"internal server error","details":str(e)}), 500

@app.route("/api/progress/<tutorial_id>", methods=["DELETE"])
def delete_progress(tutorial_id):
    user_id = request.args.get("userId")
    query = {"tutorialId": tutorial_id}
    if user_id:
        query["userId"] = user_id
    result = db.progress.delete_one(query)
    if result.deleted_count > 0:
        return jsonify({"status": "deleted"}), 200
    else:
        return jsonify({"status": "not found"}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)
