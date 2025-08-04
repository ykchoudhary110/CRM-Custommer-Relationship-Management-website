let customers = [];

document.getElementById("add-btn").addEventListener("click", () => {
  const type = prompt("Is this person a 'Client' or an 'Admin'?").trim();
  if (!["client", "admin"].includes(type.toLowerCase())) {
    alert("Invalid type. Please enter 'Client' or 'Admin'.");
    return;
  }

  const name = prompt("Customer Name:");
  const email = prompt("Email:");
  const phone = prompt("Phone:");

  if (name && email && phone) {
    customers.push({ name, email, phone, type });
    saveData();
    renderTable();
  }
});

function renderTable() {
  const tbody = document.querySelector("#customer-table tbody");
  tbody.innerHTML = "";

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  );

  filtered.forEach((cust, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cust.name}</td>
      <td>${cust.email}</td>
      <td>${cust.phone}</td>
      <td>${cust.type}</td>
      <td class="actions">
        <button onclick="editCustomer(${index})">
          <img src="images/edit user.png" width="16" /> Edit
        </button>
        <button onclick="deleteCustomer(${index})">
          <img src="images/delete.png" width="16" /> Delete
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editCustomer(index) {
  const c = customers[index];
  const type = prompt("Edit Type (Client/Admin)", c.type);
  const name = prompt("Edit Name", c.name);
  const email = prompt("Edit Email", c.email);
  const phone = prompt("Edit Phone", c.phone);

  if (type && name && email && phone) {
    customers[index] = { name, email, phone, type };
    saveData();
    renderTable();
  }
}

function deleteCustomer(index) {
  if (confirm("Delete this customer?")) {
    customers.splice(index, 1);
    saveData();
    renderTable();
  }
}

function saveData() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

function loadData() {
  const saved = localStorage.getItem("customers");
  if (saved) {
    customers = JSON.parse(saved);
    renderTable();
  }
}

document.getElementById("search").addEventListener("input", renderTable);

document.getElementById("export-btn").addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(customers);
  XLSX.utils.book_append_sheet(wb, ws, "Customers");
  XLSX.writeFile(wb, "customers.xlsx");
});

document.getElementById("import-btn").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv,.xlsx";
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(sheet);
      customers = customers.concat(imported);
      saveData();
      renderTable();
    };
    reader.readAsArrayBuffer(file);
  });
  input.click();
});

document.getElementById("print-btn").addEventListener("click", () => {
  window.print();
});

document.getElementById("dashboard-btn").addEventListener("click", () => {
  document.getElementById("chart").style.display = "block";
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Customers"],
      datasets: [{
        label: "# of Customers",
        data: [customers.length],
        backgroundColor: "rgba(0,123,255,0.6)",
      }]
    },
    options: {
      responsive: true,
    }
  });
});

document.getElement
