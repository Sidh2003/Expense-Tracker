const darkToggle = document.querySelector(".toggle-darkmode");
darkToggle.addEventListener("click", () =>
  document.body.classList.toggle("dark")
);

let salary = localStorage.getItem("salary")
  ? parseFloat(localStorage.getItem("salary"))
  : 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const salaryDisplay = document.getElementById("salaryDisplay");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");
const expenseList = document.getElementById("expenseList");
const chartCanvas = document.getElementById("expenseChart");

function setSalary() {
  const input = document.getElementById("salary");
  salary = parseFloat(input.value);
  localStorage.setItem("salary", salary);
  input.value = "";
  updateSummary();
}

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;

  if (!name || !amount || isNaN(amount))
    return alert("Please enter valid expense");

  const expense = { id: Date.now(), name, amount, category };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  updateSummary();
}

function deleteExpense(id) {
  expenses = expenses.filter((e) => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateSummary();
}

function updateSummary() {
  let total = expenses.reduce((acc, e) => acc + e.amount, 0);
  salaryDisplay.textContent = salary.toFixed(2);
  totalExpense.textContent = total.toFixed(2);
  balance.textContent = (salary - total).toFixed(2);

  renderExpenses();
  renderChart();
}

function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach((e) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
          <span><strong>${e.name}</strong> - ₹${e.amount.toFixed(2)} (${
      e.category
    })</span>
          <button onclick="deleteExpense(${e.id})">Delete</button>
        `;
    expenseList.appendChild(div);
  });
}

let chart;
function renderChart() {
  const data = {};
  expenses.forEach((e) => {
    data[e.category] = (data[e.category] || 0) + e.amount;
  });

  const ctx = chartCanvas.getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Expenses",
          data: Object.values(data),
          backgroundColor: ["#3498db", "#2ecc71", "#e74c3c", "#9b59b6"],
        },
      ],
    },
  });
}

updateSummary();
