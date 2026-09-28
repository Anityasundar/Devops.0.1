const API_URL = "http://51.21.250.159:5000";


async function loadEmployees() {

    const table =
        document.getElementById("employeeTable");

    const message =
        document.getElementById("message");


    try {

        message.textContent =
            "Loading employees...";


        const response =
            await fetch(`${API_URL}/employees`);


        if (!response.ok) {

            throw new Error(
                "Failed to load employees"
            );

        }


        const employees =
            await response.json();


        table.innerHTML = "";


        employees.forEach(employee => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${employee.id}</td>

                <td>${employee.name}</td>

                <td>${employee.department}</td>

                <td>${employee.email}</td>

                <td>
                    ₹${Number(employee.salary).toLocaleString()}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteEmployee(${employee.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        });


        message.textContent =
            `${employees.length} employee(s) found.`;


    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ Could not connect to backend.";

    }
}



document
    .getElementById("employeeForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value;


            const department =
                document.getElementById("department").value;


            const email =
                document.getElementById("email").value;


            const salary =
                document.getElementById("salary").value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/employees`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,
                                department: department,
                                email: email,
                                salary: salary

                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Failed to add employee"
                    );

                }


                alert(
                    "✅ Employee added successfully!"
                );


                document
                    .getElementById("employeeForm")
                    .reset();


                loadEmployees();


            } catch (error) {

                console.error(error);

                alert(
                    "❌ Failed to add employee."
                );

            }

        }
    );



async function deleteEmployee(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/employees/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Delete failed"
            );

        }


        alert(
            "✅ Employee deleted."
        );


        loadEmployees();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Failed to delete employee."
        );

    }

}


loadEmployees();
