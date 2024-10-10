// Configuration for attribute mapping and other options
const config = {
  tableAttributes: [
    { key: "Table Category", displayName: "Category" },
    { key: "Table Name", displayName: "Table" },
    { key: "Variable Name", displayName: "Column" },
    { key: "Description", displayName: "Column Description" },
  ],
  rowsPerPage: 5,
};

// Sample JSON data
const metadata = [
  {
    "Table Category": "User Data",
    "Table Name": "Users",
    "Variable Name": "UserID",
    Description: "Unique ID for each user",
  },
  {
    "Table Category": "Order Data",
    "Table Name": "Orders",
    "Variable Name": "OrderID",
    Description: "Unique ID for each order",
  },
  {
    "Table Category": "Order Data",
    "Table Name": "Orders",
    "Variable Name": "OrderID",
    Description: "Unique ID for each order",
  },
  {
    "Table Category": "Order Data",
    "Table Name": "Orders",
    "Variable Name": "OrderID",
    Description: "Unique ID for each order",
  },
  {
    "Table Category": "Order Data",
    "Table Name": "Orders",
    "Variable Name": "OrderID",
    Description: "Unique ID for each order",
  },
  {
    "Table Category": "Order Data",
    "Table Name": "Orders",
    "Variable Name": "OrderID",
    Description: "Unique ID for each order",
  },
  // Add more objects as needed...
];

let currentPage = 1;
let filteredMetadata = [...metadata]; // Copy of metadata for filtering

// Dynamically create table headers from config
function createTableHeaders() {
  const headerRow = document.getElementById("tableHeaders");
  headerRow.innerHTML = ""; // Clear previous headers

  config.tableAttributes.forEach((attr) => {
    const th = document.createElement("th");
    th.textContent = attr.displayName; // Use the display name from the config
    headerRow.appendChild(th);
  });
}

// Render the metadata table based on config and data
function renderTable(page = 1, data = filteredMetadata) {
  const tbody = document.getElementById("metadataBody");
  tbody.innerHTML = ""; // Clear previous rows

  const start = (page - 1) * config.rowsPerPage;
  const end = start + config.rowsPerPage;
  const pageData = data.slice(start, end);

  pageData.forEach((item) => {
    const row = document.createElement("tr");

    config.tableAttributes.forEach((attr) => {
      const td = document.createElement("td");
      td.textContent = item[attr.key] || ""; // Use the key from the config to access the value
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  document.getElementById("pageInfo").textContent = `Page ${page}`;
  document.getElementById("prevBtn").disabled = page === 1;
  document.getElementById("nextBtn").disabled = end >= data.length;
}

// Populate the table filter dropdown
function populateTableFilter() {
  const tableSelect = document.getElementById("tableSelect");
  const uniqueTables = [...new Set(metadata.map((item) => item["Table Name"]))];

  uniqueTables.forEach((table) => {
    const option = document.createElement("option");
    option.value = table;
    option.textContent = table;
    tableSelect.appendChild(option);
  });
}

// Filter table rows by selected table
function filterByTable() {
  const selectedTable = document.getElementById("tableSelect").value;
  filteredMetadata =
    selectedTable === "all"
      ? [...metadata]
      : metadata.filter((item) => item["Table Name"] === selectedTable);

  currentPage = 1;
  renderTable(currentPage);
}

// Search/filter function
function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const searchedData = filteredMetadata.filter((item) =>
    config.tableAttributes.some(
      (attr) => item[attr.key] && item[attr.key].toLowerCase().includes(input)
    )
  );

  currentPage = 1;
  renderTable(currentPage, searchedData);
}

// Pagination controls
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable(currentPage);
  }
}

function nextPage() {
  if (currentPage * config.rowsPerPage < filteredMetadata.length) {
    currentPage++;
    renderTable(currentPage);
  }
}

// Initial setup
createTableHeaders(); // Create table headers dynamically
populateTableFilter(); // Populate the table dropdown with unique table names
renderTable(); // Render the table with the full dataset
