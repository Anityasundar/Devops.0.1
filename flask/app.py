from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({
        "application": "DevOps Learning App",
        "version": "1.0",
        "status": "running"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000)
