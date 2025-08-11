import { useState } from "react";
import "./App.css";
import apiClient from "../service/apiclient.js";
import { useNavigate } from "react-router";

function App() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleTogetSchools = () => {
    navigate("/listSchools");
  };

  const validateInputs = () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !latitude.trim() ||
      !longitude.trim()
    ) {
      setError("All fields are required.");
      return false;
    }
    const latNum = parseFloat(latitude);
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      setError("Latitude must be a number between -90 and 90.");
      return false;
    }
    const lonNum = parseFloat(longitude);
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      setError("Longitude must be a number between -180 and 180.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const res = await apiClient.addSchool(name, address, latitude, longitude);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to submit data");
      }

      const data = await res.json();
      console.log("Add School data:", data);

      setMessage("Institution added successfully!");
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in bg-white shadow-lg rounded-2xl p-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Add Your School Location{" "}
      </h1>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Institution name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Add Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Latitude */}
        <div>
          <label
            htmlFor="latitude"
            className="block font-medium text-gray-700 mb-1"
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            placeholder="Add latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Longitude */}
        <div>
          <label
            htmlFor="longitude"
            className="block font-medium text-gray-700 mb-1"
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            placeholder="Add longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Link Button */}
      <button
        onClick={handleTogetSchools}
        className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-white-800 py-2 rounded-lg transition"
      >
        Visit School List
      </button>
    </div>
  );
}

export default App;
