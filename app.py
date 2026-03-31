from flask import Flask, render_template, jsonify, request
import smtplib

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    # In production, send email or save to DB
    print(f"Contact from: {data.get('name')} - {data.get('email')}")
    return jsonify({"status": "success", "message": "Message received!"})

if __name__ == '__main__':
    import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
