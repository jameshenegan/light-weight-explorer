// JSON Data (for example purposes, you could fetch this from an actual file instead)
const metadata = [
  {
    "Table Name": "Users",
    "Column Name": "UserID",
    "Column Description": "Unique ID for each user",
  },
  {
    "Table Name": "Users",
    "Column Name": "UserName",
    "Column Description": "Username for each user",
  },
  {
    "Table Name": "Orders",
    "Column Name": "OrderID",
    "Column Description": "Unique ID for each order",
  },
  {
    "Table Name": "Orders",
    "Column Name": "OrderDate",
    "Column Description": "Date when the order was placed",
  },
  // Add more objects as needed...
];

// Pagination control
let currentPage = 1;
const rowsPerPage = 5;
let filteredMetadata = [...metadata]; // Copy to track filtered results

// Function to render the metadata table
function renderTable(page = 1, data = filteredMetadata) {
  const tbody = document.getElementById("metadataBody");
  tbody.innerHTML = ""; // Clear previous rows

  // Determine the rows for the current page
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = data.slice(start, end);

  // Insert rows into the table
  pageData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item["Table Name"]}</td>
            <td>${item["Column Name"]}</td>
            <td>${item["Column Description"]}</td>
        `;
    tbody.appendChild(row);
  });

  // Update pagination info
  document.getElementById("pageInfo").textContent = `Page ${page}`;

  // Enable or disable pagination buttons based on page number
  document.getElementById("prevBtn").disabled = page === 1;
  document.getElementById("nextBtn").disabled = end >= data.length;
}

// Populate dropdown with unique table names
function populateTableFilter() {
  const tableSelect = document.getElementById("tableSelect");
  const tables = [...new Set(metadata.map((item) => item["Table Name"]))]; // Get unique table names

  // Add each unique table name to the dropdown
  tables.forEach((table) => {
    const option = document.createElement("option");
    option.value = table;
    option.textContent = table;
    tableSelect.appendChild(option);
  });
}

// Function to filter by table
function filterByTable() {
  const selectedTable = document.getElementById("tableSelect").value;

  // Filter metadata based on the selected table or reset if 'all' is selected
  filteredMetadata =
    selectedTable === "all"
      ? [...metadata]
      : metadata.filter((item) => item["Table Name"] === selectedTable);

  // Reset to the first page of filtered results
  currentPage = 1;
  renderTable(currentPage);
}

// Search/filter function
function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();

  // Perform search on filteredMetadata
  const searchedData = filteredMetadata.filter(
    (item) =>
      item["Table Name"].toLowerCase().includes(input) ||
      item["Column Name"].toLowerCase().includes(input) ||
      item["Column Description"].toLowerCase().includes(input)
  );

  // Reset to the first page of search results
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
  if (currentPage * rowsPerPage < filteredMetadata.length) {
    currentPage++;
    renderTable(currentPage);
  }
}

// Initial setup
populateTableFilter(); // Populate the table dropdown with unique table names
renderTable(); // Render the table with the full dataset
