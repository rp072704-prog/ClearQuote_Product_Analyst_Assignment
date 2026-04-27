const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}

export const getCustomers = async () => request("/customers");

export const getUsage = async (customerId) => {
  const suffix = customerId && customerId !== "all" ? `?customer_id=${customerId}` : "";
  return request(`/usage${suffix}`);
};

export const getTickets = async (customerId) => {
  const suffix = customerId && customerId !== "all" ? `?customer_id=${customerId}` : "";
  return request(`/tickets${suffix}`);
};

export const getFleet = async (customerId) => {
  const suffix = customerId && customerId !== "all" ? `?customer_id=${customerId}` : "";
  return request(`/fleet${suffix}`);
};

export const getSummary = async () => request("/summary");
