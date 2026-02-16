import mysql from 'mysql2/promise'

export async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "vuxenpoäng",
    });

    console.log("Ansluten till MySQL-databasen!");
    return connection;
  } catch (err) {
    console.error("Fel vid anslutning till MySQL:", err);
    throw err;
  }
}
