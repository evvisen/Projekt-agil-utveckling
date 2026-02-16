const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "vuxenpoäng",
});

connection.connect((err) => {
  if (err) {
    console.error("Fel vid anslutning till MySQL:", err);
    return;
  }
  console.log("Ansluten till MySQL-databasen!");
});

module.exports = connection;
