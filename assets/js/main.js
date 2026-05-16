//================= Filters =================//
const filters = {
  status: "",
  priority: "",
  department: "",
  location: "",
};

//================= Tickets =================//
const tickets = [
  {
    id: 1012,
    createdAt: "2026-05-10 09:15",
    status: "New",
    priority: "Low",
    department: "Operations",
    location: "Jeddah",
    agent: "Ali Ahmed",
    resolutionHours: 12,
  },
  {
    id: 1013,
    createdAt: "2026-05-10 10:20",
    status: "Pending",
    priority: "Medium",
    department: "Finance",
    location: "Riyadh",
    agent: "Mona Abdullah",
    resolutionHours: 5,
  },
  {
    id: 1014,
    createdAt: "2026-05-10 11:00",
    status: "In Progress",
    priority: "High",
    department: "Retail",
    location: "Makkah",
    agent: "Omar Saleh",
    resolutionHours: 20,
  },
  {
    id: 1015,
    createdAt: "2026-05-10 12:30",
    status: "Canceled",
    priority: "Low",
    department: "Centers",
    location: "Dammam",
    agent: "Sarah Ahmed",
    resolutionHours: 2,
  },
  {
    id: 1016,
    createdAt: "2026-05-10 13:45",
    status: "Completed",
    priority: "Critical",
    department: "Operations",
    location: "Madina",
    agent: "Eissa Ba",
    resolutionHours: 4,
  },
];

//================= Helpers (classes) =================//
function getStatusClass(status) {
  switch (status) {
    case "New":
      return "status-new";
    case "Pending":
      return "status-pending";
    case "In Progress":
      return "status-in-progress";
    case "Canceled":
      return "status-canceled";
    case "Completed":
      return "status-completed";
    case "Open":
      return "status-open";
    default:
      return "status-new";
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case "Low":
      return "priority-low";
    case "Medium":
      return "priority-medium";
    case "High":
      return "priority-high";
    case "Critical":
      return "priority-critical";
    default:
      return "";
  }
}

//================= Table Rendering =================//
function renderTable(ticketsList) {
  const tbody = document.getElementById("tickets-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  ticketsList.forEach((ticket) => {
    const row = document.createElement("tr");

    const statusClass = getStatusClass(ticket.status);
    const priorityClass = getPriorityClass(ticket.priority);

    row.innerHTML = `
      <td data-label="Ticket ID">${ticket.id}</td>
      <td data-label="Created At">${ticket.createdAt}</td>
      <td data-label="Status">
        <span class="status-badge ${statusClass}">${ticket.status}</span>
      </td>
      <td data-label="Priority">
        <span class="priority-badge ${priorityClass}">${ticket.priority}</span>
      </td>
      <td data-label="Department">${ticket.department}</td>
      <td data-label="Location">${ticket.location}</td>
      <td data-label="Agent">${ticket.agent}</td>
      <td data-label="Resolution Time (hrs)">${ticket.resolutionHours}</td>
      <td>
        <div class="action-buttons">
          <button class="table-btn btn-view">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="table-btn btn-close">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

//================= KPI Calculation =================//
function calculateKpis(ticketsList) {
  const totalTickets = ticketsList.length;

  let openTickets = 0;
  let closedTickets = 0;
  let totalResolutionHours = 0;

  ticketsList.forEach((ticket) => {
    // Open tickets
    if (
      ticket.status === "New" ||
      ticket.status === "Pending" ||
      ticket.status === "In Progress" ||
      ticket.status === "Open"
    ) {
      openTickets++;
    }

    // Closed tickets
    if (ticket.status === "Completed" || ticket.status === "Canceled") {
      closedTickets++;
    }

    // Sum resolution hours
    if (typeof ticket.resolutionHours === "number") {
      totalResolutionHours += ticket.resolutionHours;
    }
  });

  const avgResolutionHours =
    ticketsList.length > 0
      ? (totalResolutionHours / ticketsList.length).toFixed(1)
      : 0;

  return {
    totalTickets,
    openTickets,
    closedTickets,
    avgResolutionHours,
  };
}

//================= KPI Rendering =================//
function renderKpis(kpis) {
  const totalEl = document.getElementById("kpi-total-tickets");
  const openEl = document.getElementById("kpi-open-tickets");
  const closedEl = document.getElementById("kpi-closed-tickets");
  const avgEl = document.getElementById("kpi-avg-resolution");

  if (totalEl) totalEl.textContent = kpis.totalTickets;
  if (openEl) openEl.textContent = kpis.openTickets;
  if (closedEl) closedEl.textContent = kpis.closedTickets;
  if (avgEl) avgEl.textContent = kpis.avgResolutionHours;
}

//================= Chart Helpers =================//
function getStatusCounts(ticketsList) {
  const counts = {
    New: 0,
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
    Canceled: 0,
  };

  ticketsList.forEach((ticket) => {
    if (Object.prototype.hasOwnProperty.call(counts, ticket.status)) {
      counts[ticket.status]++;
    }
  });

  return counts;
}

let statusChart = null;

function renderStatusChart(ticketsList) {
  const counts = getStatusCounts(ticketsList);
  const ctx = document.getElementById("status-chart");
  if (!ctx) return;

  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const backgroundColors = [
    "#e0f2ff", // New
    "#fff4d6", // Pending
    "#ffe6e6", // In Progress
    "#e3f8e5", // Completed
    "#fbe4e6", // Canceled
  ];

  if (statusChart) {
    statusChart.data.labels = labels;
    statusChart.data.datasets[0].data = data;
    statusChart.update();
    return;
  }

  statusChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Tickets",
          data,
          backgroundColor: backgroundColors,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

//================= Filters Logic =================//
function applyFilters() {
  let filtered = tickets;

  // Status
  if (filters.status) {
    filtered = filtered.filter((ticket) => ticket.status === filters.status);
  }

  // Priority
  if (filters.priority) {
    filtered = filtered.filter(
      (ticket) => ticket.priority === filters.priority,
    );
  }

  // Department
  if (filters.department) {
    filtered = filtered.filter(
      (ticket) => ticket.department === filters.department,
    );
  }

  // Location
  if (filters.location) {
    filtered = filtered.filter(
      (ticket) => ticket.location === filters.location,
    );
  }

  renderTable(filtered);

  const kpis = calculateKpis(filtered);
  renderKpis(kpis);

  renderStatusChart(filtered);
}

//================= Events & Init =================//
const statusSelect = document.getElementById("filter-status");
const prioritySelect = document.getElementById("filter-priority");
const deptSelect = document.getElementById("filter-department");
const locationSelect = document.getElementById("filter-location");

if (statusSelect) {
  statusSelect.addEventListener("change", (e) => {
    filters.status = e.target.value || "";
    applyFilters();
  });
}

if (prioritySelect) {
  prioritySelect.addEventListener("change", (e) => {
    filters.priority = e.target.value || "";
    applyFilters();
  });
}

if (deptSelect) {
  deptSelect.addEventListener("change", (e) => {
    filters.department = e.target.value || "";
    applyFilters();
  });
}

if (locationSelect) {
  locationSelect.addEventListener("change", (e) => {
    filters.location = e.target.value || "";
    applyFilters();
  });
}

// Initial render
applyFilters();
