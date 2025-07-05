const form = document.getElementById("expenseForm");
const category = document.getElementById("category");
const customCategory = document.getElementById("customCategory");
const loader = document.getElementById("btnLoader");
const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("expenseTableBody");

category.addEventListener("change", () => {
  customCategory.classList.toggle("hidden", category.value !== "Other");
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const note = document.getElementById("note").value.trim();
  const categoryValue =
    category.value === "Other" ? customCategory.value.trim() : category.value;

  if (!name || !amount || !categoryValue) {
    alert("Please fill all required fields.");
    return;
  }

  addBtn.disabled = true;
  loader.classList.remove("hidden");

  setTimeout(() => {
    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td><strong>₹${parseFloat(amount).toFixed(2)}</strong></td>
      <td>${categoryValue}</td>
      <td>${note || "-"}</td>
      <td>${date}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);

    form.reset();
    customCategory.classList.add("hidden");
    loader.classList.add("hidden");
    addBtn.disabled = false;
  }, 600);
});

// Edit + Delete functionality
tableBody.addEventListener("click", function (e) {
  const target = e.target;
  const row = target.closest("tr");

  if (target.classList.contains("delete-btn")) {
    row.remove();
  }

  if (target.classList.contains("edit-btn")) {
    const isSaving = target.textContent === "Save";
    const cells = row.querySelectorAll("td");

    if (!isSaving) {
      for (let i = 0; i < 4; i++) {
        const val = cells[i].innerText.replace("₹", "").trim();
        const input = document.createElement(i === 3 ? "textarea" : "input");
        input.value = val === "-" ? "" : val;
        input.style.width = "100%";
        cells[i].innerHTML = "";
        cells[i].appendChild(input);
      }
      target.textContent = "Save";
      target.style.background = "#2980b9";
    } else {
      for (let i = 0; i < 4; i++) {
        const value = cells[i].firstElementChild.value.trim();
        if (i === 1) {
          cells[i].innerHTML = `<strong>₹${parseFloat(value).toFixed(
            2
          )}</strong>`;
        } else {
          cells[i].textContent = value || "-";
        }
      }
      target.textContent = "Edit";
      target.style.background = "#27ae60";
    }
  }
});
