import mysql from "mysql2/promise"; // use promise version
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

let connection;

const connectionDB = async () => {
  try {
    connection = await mysql.createPool({
      host: process.env.Host,
      port: process.env.Port_number,
      user: process.env.Database_user,
      password: process.env.Database_password,
      database: process.env.Database_name,
      waitForConnections: true,
      connectionLimit: 10, // adjust if needed
      queueLimit: 0,
    });
    console.log(`MySql Connected`);
    return connection;
  } catch (error) {
    console.error(`MySQL connection failed`, error);
    process.exit(1);
  }
};

export { connectionDB, connection };
