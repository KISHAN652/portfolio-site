from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
import smtplib
from email.message import EmailMessage

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["portfolio"]
collection = db["submissions"]
print("Loaded URI:", os.getenv("MONGO_URI"))

# Email setup
EMAIL = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# Home Route
@app.route('/')
def home():
    return render_template("index.html")

# Contact Route
@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data received"}), 400

        name = data.get("name")
        email = data.get("email")
        subject = data.get("subject", "No subject")
        message = data.get("message")

        # Save to DB
        collection.insert_one({
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "timestamp": datetime.utcnow()
        })

        # Send Email
        msg = EmailMessage()
        msg["Subject"] = f"New Contact: {subject}"
        msg["From"] = EMAIL
        msg["To"] = EMAIL
        msg.set_content(f"Name: {name}\nEmail: {email}\nMessage:\n{message}")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL, EMAIL_PASS)
            smtp.send_message(msg)

        return jsonify({"message": f"Thanks {name}, your message has been sent!"}), 200

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"message": "Something went wrong!"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=int(os.environ.get("PORT", 8080)))
