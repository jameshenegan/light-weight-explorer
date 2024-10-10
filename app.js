const config = {
  tableAttributes: [
    { key: "Table Category", displayName: "Category", isCategorical: true },
    { key: "Table Name", displayName: "Table", isCategorical: true },
    { key: "Variable Name", displayName: "Column", isCategorical: false },
    {
      key: "Description",
      displayName: "Column Description",
      isCategorical: false,
    },
  ],
  rowsPerPage: 5,
};

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
  // Add more objects as needed...
];

let currentPage = 1;
let filteredMetadata = [...metadata];

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

// Dynamically create dropdowns for categorical columns
function createDropdowns() {
  const dropdownsDiv = document.getElementById("dropdowns");
  dropdownsDiv.innerHTML = ""; // Clear any existing dropdowns

  config.tableAttributes.forEach((attr) => {
    if (attr.isCategorical) {
      const uniqueValues = [...new Set(metadata.map((item) => item[attr.key]))];

      const label = document.createElement("label");
      label.textContent = `Filter by ${attr.displayName}: `;

      const select = document.createElement("select");
      select.id = attr.key;
      select.onchange = filterByCategory;

      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = `All ${attr.displayName}s`;
      select.appendChild(allOption);

      uniqueValues.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });

      dropdownsDiv.appendChild(label);
      dropdownsDiv.appendChild(select);
    }
  });
}

// Filter the table rows based on selected categorical values
function filterByCategory() {
  let filtered = [...metadata];

  config.tableAttributes.forEach((attr) => {
    if (attr.isCategorical) {
      const selectedValue = document.getElementById(attr.key).value;
      if (selectedValue !== "all") {
        filtered = filtered.filter((item) => item[attr.key] === selectedValue);
      }
    }
  });

  filteredMetadata = filtered;
  currentPage = 1;
  renderTable(currentPage);
}

// Function to render the metadata table and display the result count
function renderTable(page = 1, data = filteredMetadata) {
  const tbody = document.getElementById("metadataBody");
  tbody.innerHTML = ""; // Clear previous rows

  const start = (page - 1) * config.rowsPerPage;
  const end = start + config.rowsPerPage;
  const pageData = data.slice(start, end);

  // Update result count
  document.getElementById(
    "resultCount"
  ).textContent = `Showing ${data.length} results`;

  // Insert rows into the table
  pageData.forEach((item) => {
    const row = document.createElement("tr");

    config.tableAttributes.forEach((attr) => {
      const td = document.createElement("td");
      td.textContent = item[attr.key] || ""; // Use the key from the config to access the value
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  // Update pagination info
  document.getElementById("pageInfo").textContent = `Page ${page}`;
  document.getElementById("prevBtn").disabled = page === 1;
  document.getElementById("nextBtn").disabled = end >= data.length;
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
createDropdowns(); // Create dropdowns for categorical columns
renderTable(); // Render the table with the full dataset
