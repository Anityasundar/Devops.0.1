from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host="employee-db",
        user="root",
        password="devopsroot",
        database="employee_db"
    )


@app.route("/")
def home():
    return jsonify({
        "application": "DevOps Employee Management API",
        "version": "1.0",
        "status": "running"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })


@app.route("/employees")
def get_employees():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(employees)
@app.route("/employees", methods=["POST"])
def add_employee():

    data = request.json

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO employees (name, department, email, salary)
        VALUES (%s, %s, %s, %s)
    """

    values = (
        data["name"],
        data["department"],
        data["email"],
        data["salary"]
    )

    cursor.execute(query, values)
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Employee added successfully"
    }), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
