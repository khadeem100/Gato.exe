const API_BASE = "https://gato-companion.gato-international.com/salesrep";

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("sr_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("sr_token", token);
    } else {
      localStorage.removeItem("sr_token");
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      this.setToken(null);
      window.location.hash = "#/login";
      throw new Error("Session expired");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // Auth
  async login(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Dashboard
  getDashboard() {
    return this.get("/dashboard");
  }

  // Customers
  getCustomers() {
    return this.get("/customers");
  }

  getCustomer(id) {
    return this.get(`/customers/${id}`);
  }

  // Orders
  getOrders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/orders${qs ? `?${qs}` : ""}`);
  }

  getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  // Products
  searchProducts(query) {
    return this.get(`/products/search?q=${encodeURIComponent(query)}`);
  }

  getProductCombinations(id) {
    return this.get(`/products/${id}/combinations`);
  }

  // Preorders
  getPreorders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/preorders${qs ? `?${qs}` : ""}`);
  }

  getPreorder(id) {
    return this.get(`/preorders/${id}`);
  }

  // Analytics
  getAnalytics() {
    return this.get("/analytics");
  }

  // Discounts & Payment Methods
  getDiscounts() {
    return this.get("/discounts");
  }

  getPaymentMethods() {
    return this.get("/payment-methods");
  }

  // Version check (for auto-update in web mode)
  async checkVersion() {
    try {
      const res = await fetch(`${API_BASE}/version`);
      return res.json();
    } catch {
      return null;
    }
  }
}

const api = new ApiClient();
export default api;
