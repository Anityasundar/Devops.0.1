from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import time

app = Flask(__name__)
CORS(app)


DB_HOST = os.getenv("DB_HOST", "database")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "devopsroot")
DB_NAME = os.getenv("DB_NAME", "employee_db")


def get_db_connection():

    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


def wait_for_database():

    for attempt in range(20):

        try:

            connection = get_db_connection()
            connection.close()

            print("Database connection successful")

            return

        except mysql.connector.Error as error:

            print(f"Database not ready: {error}")
            print(f"Retrying... ({attempt + 1}/20)")

            time.sleep(3)

    raise Exception("Could not connect to database")


@app.route("/")
def home():

    return jsonify({
        "application": "Employee Management API",
        "version": "1.0",
        "status": "running"
    })


@app.route("/health")
def health():

    return jsonify({
        "status": "healthy"
    })


@app.route("/employees", methods=["GET"])
def get_employees():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, name, department, email, salary FROM employees"
    )

    employees = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(employees)


@app.route("/employees", methods=["POST"])
def add_employee():

    data = request.get_json()

    name = data.get("name")
    department = data.get("department")
    email = data.get("email")
    salary = data.get("salary")

    if not name or not department or not email or salary is None:

        return jsonify({
            "error": "All fields are required"
        }), 400

    connection = get_db_connection()

    cursor = connection.cursor()

    query = """
        INSERT INTO employees
        (name, department, email, salary)
        VALUES (%s, %s, %s, %s)
    """

    cursor.execute(
        query,
        (name, department, email, salary)
    )

    connection.commit()

    new_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Employee added successfully",
        "id": new_id
    }), 201


@app.route("/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM employees WHERE id = %s",
        (employee_id,)
    )

    connection.commit()

    deleted_rows = cursor.rowcount

    cursor.close()
    connection.close()

    if deleted_rows == 0:

        return jsonify({
            "error": "Employee not found"
        }), 404

    return jsonify({
        "message": "Employee deleted successfully"
    })


if __name__ == "__main__":

    wait_for_database()

    app.run(
        host="0.0.0.0",
        port=5000
    )
