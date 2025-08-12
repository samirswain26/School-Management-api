import { useState } from "react";
import apiClient from "../service/apiclient";

function GetSchool() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!latitude.trim() || !longitude.trim()) {
      setError("Both latitude and longitude are required.");
      return false;
    }

    const sanitizeInput = (value) => {
      return value.replace(/[^0-9.-]/g, "");
    };
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      setError("Latitude must be between -90 and 90.");
      return false;
    }
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      setError("Longitude must be between -180 and 180.");
      return false;
    }
    return true;
  };

  const handleFetchSchools = async (e) => {
    e.preventDefault();
    setError("");
    setSchools([]);

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const data = await apiClient.listSchools(latitude, longitude);
      console.log("Received data:", data);

      if (Array.isArray(data)) {
        setSchools(data);
      } else {
        console.error("Expected array but got:", data);
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError("Failed to fetch schools.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          🎓 Find Nearby Schools
        </h1>

        <form onSubmit={handleFetchSchools} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Latitude:
            </label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(sanitizeInput(e.target.value))}
              placeholder="e.g., 54.48121"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Longitude:
            </label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(sanitizeInput(e.target.value))}
              placeholder="e.g., 19.868621"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 active:scale-95"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Get Schools"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-700 bg-red-100 p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {schools.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Nearby Schools ({schools.length} found)
            </h2>
            <ul className="space-y-3">
              {schools.map((school, index) => (
                <li
                  key={school.id || index}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="font-bold text-gray-800">{school.name}</p>
                  <p className="text-gray-600">📍 {school.address}</p>
                  <p className="text-gray-500">
                    📏 Distance:{" "}
                    {school.distance ? school.distance.toFixed(2) : "N/A"} km
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetSchool;
