// UptimeRobot Status Update Script
const UPTIME_API_KEY = "ur2763682-d3e2e8fce7e58c1c40d6a1ee";

const STATUS_CONFIG = {
  0: {
    text: "Paused",
    color: "#999999", // Gray
  },
  1: {
    text: "Not Checked Yet",
    color: "#999999", // Gray
  },
  2: {
    text: "Operational",
    color: "#3BD671", // Green
  },
  8: {
    text: "Seems Down",
    color: "#F7921E", // Orange
  },
  9: {
    text: "Not Operational",
    color: "#F7323A", // Red
  },
};

async function fetchMonitorStatus() {
  try {
    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: UPTIME_API_KEY,
        format: "json",
        custom_uptime_ratios: "90",
        all_time_uptime_ratio: "1",
      }),
    });

    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    if (data.stat === "fail") {
      throw new Error(data.error.message || "Failed to fetch monitors");
    }

    return data.monitors;
  } catch (error) {
    console.error("Error fetching monitors:", error);
    throw error;
  }
}

function updateMonitorElements(monitor, index) {
  const titleElement = document.getElementById(`monitor-title-${index}`);
  const uptimeElement = document.getElementById(`uptime-${index}`);
  const statusElement = document.getElementById(`status-${index}`);
  const statusTextElement = document.getElementById(`status-text-${index}`);

  if (titleElement) {
    titleElement.textContent = monitor.friendly_name;
  }

  if (uptimeElement) {
    const uptimeValue = Math.round(parseFloat(monitor.all_time_uptime_ratio));
    uptimeElement.textContent = `${uptimeValue}%`;
  }

  if (statusElement) {
    statusElement.style.color = STATUS_CONFIG[monitor.status].color;
  }

  if (statusTextElement) {
    statusTextElement.textContent = STATUS_CONFIG[monitor.status].text;
    statusTextElement.style.color = STATUS_CONFIG[monitor.status].color;
  }
}

// Initialize and update monitors
async function initMonitors() {
  try {
    const monitors = await fetchMonitorStatus();

    // Sort monitors by creation date to ensure consistent order
    const sortedMonitors = monitors.sort(
      (a, b) => a.create_datetime - b.create_datetime
    );

    // Update each monitor with its index (0, 1, 2)
    sortedMonitors.forEach((monitor, index) => {
      updateMonitorElements(monitor, index);
    });
  } catch (error) {
    console.error("Failed to initialize monitors:", error);
  }
}

// Initial load
initMonitors();

// Update every 5 minutes
setInterval(initMonitors, 300000);
