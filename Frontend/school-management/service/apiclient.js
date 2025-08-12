class ApiClient {
  constructor() {
    this.baseURL = "https://school-management-api-yvhy.onrender.com/api";

    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async customFetch(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = { ...this.defaultHeaders, ...options.headers };

      const config = {
        ...options,
        headers,
        mode: "cors", // Enable CORS
      };

      console.log(`Fetching ${url}`);
      const response = await fetch(url, config);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Parse JSON and return
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Api Error:", error);
      throw error;
    }
  }

  // endpoints
  async addSchool(name, address, latitude, longitude) {
    return this.customFetch("/addSchool", {
      method: "POST",
      body: JSON.stringify({ name, address, latitude, longitude }),
    });
  }

  async listSchools(latitude, longitude) {
    const query = `?latitude=${encodeURIComponent(
      latitude
    )}&longitude=${encodeURIComponent(longitude)}`;
    return this.customFetch(`/listSchools${query}`, {
      method: "GET",
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
