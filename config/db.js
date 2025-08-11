import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const connectionDB = async () => {
  try {
    await mysql.createConnection({
      host: process.env.Host,
      port: process.env.Port_number,
      user: process.env.Database_user,
      password: process.env.Database_password,
      database: process.env.Database_name,
    });
    console.log(`MySql Connected`);
  } catch (error) {
    console.error(`Mongodb connection failed`, error);
    process.exit(1);
  }
};

export const createSchoolTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const [result] = await connectionDB.query(query);
    console.log("✅ 'schools' table created or already exists");
    return result;
  } catch (error) {
    console.error("❌ Error creating schools table:", error);
    throw error;
  }
};

export default connectionDB;
