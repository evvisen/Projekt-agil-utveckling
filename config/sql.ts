const mysql = require("mysql2");

export const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "vuxenpoäng",
});

connection.connect((err: string) => {
  if (err) {
    console.error("Fel vid anslutning till MySQL:", err);
    return;
  }
  console.log("Ansluten till MySQL-databasen!");
});

