let salary = localStorage.getItem("salary")
  ? parseFloat(localStorage.getItem("salary"))
  : 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const salaryDisplay = document.getElementById("salaryDisplay");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");
const expenseList = document.getElementById("expenseList");

function setSalary() {
  const input = document.getElementById("salary");
  salary = parseFloat(input.value);
  localStorage.setItem("salary", salary);
  input.value = "";
  updateSummary();
}

function toggleCustomCategory() {
  const category = document.getElementById("expenseCategory").value;
  document.getElementById("customCategoryDiv").style.display =
    category === "Other" ? "block" : "none";
}

function getCategoryIcon(category) {
  switch (category) {
    case "Food":
      return "🍔";
    case "Travel":
      return "🚕";
    case "Bills":
      return "📄";
    case "Other":
      return "➕";
    default:
      return "📁";
  }
}

function addExpense() {
  const name = document.getElementById("expenseName").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  let category = document.getElementById("expenseCategory").value;
  const customCategory = document.getElementById("customCategory").value.trim();

  if (category === "Other" && customCategory) {
    category = customCategory;
  }

  if (!name || isNaN(amount) || !category) {
    alert("Please enter valid expense details.");
    return;
  }

  const expense = { id: Date.now(), name, amount, category };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseCategory").value = "";
  document.getElementById("customCategory").value = "";
  document.getElementById("customCategoryDiv").style.display = "none";

  updateSummary();
}

function deleteExpense(id) {
  expenses = expenses.filter((e) => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateSummary();
}

function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  salaryDisplay.textContent = salary.toFixed(2);
  totalExpense.textContent = total.toFixed(2);
  balance.textContent = (salary - total).toFixed(2);
  renderExpenses();
}

function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach((e) => {
    const div = document.createElement("div");
    div.className = "expense-item";
    const icon = getCategoryIcon(e.category);
    div.innerHTML = `
          <div class="expense-label">
            <strong><span class="category-icon">${icon}</span>${e.name}</strong>
            <small>₹${e.amount.toFixed(2)} - ${e.category}</small>
          </div>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${
            e.id
          })"><i class="fa fa-trash"></i></button>
        `;
    expenseList.appendChild(div);
  });
}

updateSummary();
