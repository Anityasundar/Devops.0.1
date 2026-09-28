const modal = document.getElementById("employeeModal");
const openModal = document.getElementById("openEmployeeModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");

const themeToggle = document.getElementById("themeToggle");

// -----------------------------
// OPEN MODAL
// -----------------------------

openModal.addEventListener("click", () => {
modal.classList.add("show");
});

// -----------------------------
// CLOSE MODAL
// -----------------------------

function closeEmployeeModal() {
modal.classList.remove("show");
}

closeModal.addEventListener("click", closeEmployeeModal);
cancelModal.addEventListener("click", closeEmployeeModal);

// Close when clicking outside modal

modal.addEventListener("click", (event) => {

if (event.target === modal) {
    closeEmployeeModal();
}

});

// -----------------------------
// ADD EMPLOYEE
// -----------------------------

// -----------------------------
// ADD EMPLOYEE
// -----------------------------

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const department =
        document.getElementById("department").value;

    const role =
        document.getElementById("role").value.trim();

    const status =
        document.getElementById("status").value;


    const employeeData = {
        name: firstName + " " + lastName,
        department: department,
        email: email,
        salary: 0
    };


    try {

        const response = await fetch(
            "http://localhost:5000/employees",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

               body: JSON.stringify(employeeData)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Server returned " + response.status
            );

        }


        const result = await response.json();

        console.log(
            "Employee saved to database:",
            result
        );


        const initials =
            (firstName.charAt(0) +
             lastName.charAt(0)).toUpperCase();


        const today =
            new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });


        const statusClass =
            status === "Active"
                ? "active"
                : "inactive";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="employee">

                    <div class="employee-avatar purple">
                        ${initials}
                    </div>

                    <div>

                        <strong>
                            ${firstName} ${lastName}
                        </strong>

                        <span>
                            ${email}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${department}
            </td>


            <td>
                ${role}
            </td>


            <td>

                <span class="status ${statusClass}">
                    ${status}
                </span>

            </td>


            <td>
                ${today}
            </td>


            <td>

                <button class="action-button">
                    ⋮
                </button>

            </td>

        `;


        table.prepend(row);

        form.reset();

        closeEmployeeModal();

        updateEmployeeCount();


    } catch (error) {

        console.error(
            "Failed to save employee:",
            error
        );

        alert(
            "Failed to save employee. Check the browser console."
        );

    }

});


    
   

// -----------------------------
// EMPLOYEE COUNT
// -----------------------------

function updateEmployeeCount() {

const rows =
    table.querySelectorAll("tr").length;

const counter =
    document.getElementById("totalEmployees");

const current =
    parseInt(counter.textContent) || 0;

counter.textContent =
    current + 1;

}

// -----------------------------
// SEARCH EMPLOYEES
// -----------------------------

const searchInput =
document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

const search =
    searchInput.value.toLowerCase();


const rows =
    table.querySelectorAll("tr");


rows.forEach(row => {

    const text =
        row.textContent.toLowerCase();


    row.style.display =
        text.includes(search)
            ? ""
            : "none";

});

});

// -----------------------------
// DEPARTMENT FILTER
// -----------------------------

const departmentFilter =
document.getElementById("departmentFilter");

departmentFilter.addEventListener("change", () => {

const selected =
    departmentFilter.value;


const rows =
    table.querySelectorAll("tr");


rows.forEach(row => {

    const department =
        row.children[1]?.textContent.trim();


    if (
        selected === "all" ||
        department === selected
    ) {

        row.style.display = "";

    } else {

        row.style.display = "none";

    }

});

});

// -----------------------------
// DARK MODE
// -----------------------------

themeToggle.addEventListener("click", () => {

document.body.classList.toggle("dark");


if (
    document.body.classList.contains("dark")
) {

    themeToggle.textContent = "☀️";

} else {

    themeToggle.textContent = "🌙";

}

});

// -----------------------------
// ACTION BUTTONS
// -----------------------------

document.addEventListener("click", (event) => {

if (
    event.target.classList.contains("action-button")
) {

    const row =
        event.target.closest("tr");


    const employee =
        row.querySelector(".employee strong");


    if (employee) {

        alert(
            `Employee selected: ${employee.textContent}`
        );

    }

}

});

// -----------------------------
// STARTUP MESSAGE
// -----------------------------

console.log(
"DevOpsHub Employee Management Dashboard loaded successfully."
);

// -----------------------------
// LOAD EMPLOYEES FROM BACKEND
// -----------------------------

async function loadEmployees() {

    try {

        const response =
            await fetch("http://localhost:5000/employees");

        if (!response.ok) {
            throw new Error(
                "Server returned " + response.status
            );
        }

        const employees =
            await response.json();

        console.log(
            "Employees received from backend:",
            employees
        );

        table.innerHTML = "";

        employees.forEach(employee => {

            const nameParts =
                employee.name.split(" ");

            const firstName =
                nameParts[0] || "";

            const lastName =
                nameParts.slice(1).join(" ") || "";

            const initials =
                (firstName.charAt(0) +
                 lastName.charAt(0)).toUpperCase();

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="employee">

                        <div class="employee-avatar purple">
                            ${initials}
                        </div>

                        <div>
                            <strong>
                                ${employee.name}
                            </strong>

                            <span>
                                ${employee.email}
                            </span>
                        </div>

                    </div>
                </td>

                <td>${employee.department}</td>

                <td>-</td>

                <td>
                    <span class="status active">
                        Active
                    </span>
                </td>

                <td>
                    ${new Date(employee.created_at)
                        .toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        })}
                </td>

                <td>
                    <button class="action-button">
                        ⋮
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

        const counter =
            document.getElementById("totalEmployees");

        counter.textContent = employees.length;

    } catch (error) {

        console.error(
            "Failed to load employees:",
            error
        );

    }

}

loadEmployees();
