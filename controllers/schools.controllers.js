import {
  createSchool,
  findSchoolByDetails,
  getAllSchools,
} from "../models/school.model.js";

export const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    console.log("Received data:", { name, address, latitude, longitude });

    if (
      !name ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude must be numbers" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        error:
          "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
      });
    }

    // Trim whitespace from string inputs
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();

    // Check for duplicates
    console.log("Checking for duplicates with:", {
      name: trimmedName,
      address: trimmedAddress,
      latitude: lat,
      longitude: lon,
    });

    // Check for duplicates
    const existingSchool = await findSchoolByDetails({
      name: trimmedName,
      address: trimmedAddress,
      latitude: lat,
      longitude: lon,
    });
    if (existingSchool) {
      return res.status(409).json({
        error: `School "${trimmedName}" already exists at this location (${trimmedAddress})`,
        existingSchool: {
          id: existingSchool.id,
          name: existingSchool.name,
          address: existingSchool.address,
          latitude: existingSchool.latitude,
          longitude: existingSchool.longitude,
        },
      });
    }

    // Create new school with trimmed and validated data
    const newSchool = await createSchool({
      name: trimmedName,
      address: trimmedAddress,
      latitude: lat,
      longitude: lon,
    });

    res.status(201).json({
      message: "School added successfully",
      school: newSchool,
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// List Schools Sorted by Proximity
export const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Required fields check
    if (latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    //  Must be numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude must be valid numbers" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    //  Range check
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        error:
          "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
      });
    }

    const schools = await getAllSchools();
    // const [schools] = await connection.query("SELECT * FROM schools");

    // Calculate distance using Haversine formula
    const sortedSchools = schools
      .map((school) => {
        const R = 6371; // Earth radius in km
        const dLat = ((school.latitude - latitude) * Math.PI) / 180;
        const dLon = ((school.longitude - longitude) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((school.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...school, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (error) {
    console.error("Error listing schools:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
