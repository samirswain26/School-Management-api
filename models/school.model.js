import { connection } from "../config/db.js";

export const createSchoolTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      INDEX idx_location (latitude, longitude),
      INDEX idx_name_address (name, address(100))
    )
  `;
  try {
    const [result] = await connection.query(query);
    console.log("Schools table created or already exists");
    return result;
  } catch (error) {
    console.error("Error creating schools table:", error);
    throw error;
  }
};

// Check duplicate
export const findSchoolByDetails = async ({
  name,
  address,
  latitude,
  longitude,
}) => {
  try {
    console.log(`Searching for duplicate with :`, {
      name,
      address,
      longitude,
      latitude,
    });

    const [rows] = await connection.execute(
      `SELECT * FROM schools
      WHERE TRIM(LOWER(name)) = TRIM(LOWER(?)) 
      AND TRIM(LOWER(address)) = TRIM(LOWER(?))
      AND ABS(latitude - ?) < 0.0001
      AND ABS(longitude - ?) < 0.0001`,
      [name, address, latitude, longitude]
    );

    console.log(
      `Duplicate search result :`,
      rows.length > 0 ? "Found duplicate" : "No duplicate found"
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.log(`Error finding school by details: `, error);
    throw error;
  }
};

export const createSchool = async ({ name, address, latitude, longitude }) => {
  const [result] = await connection.execute(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    [name, address, latitude, longitude]
  );

  const [rows] = await connection.execute(
    "SELECT * FROM schools WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
};

export const getAllSchools = async () => {
  const [rows] = await connection.execute(`SELECT * FROM schools`);
  return rows;
};

