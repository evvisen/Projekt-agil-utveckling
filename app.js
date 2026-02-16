const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
// Parse JSON bodies
app.use(express.json());

// för att ta emot forms
app.use(express.urlencoded({ extended: true }));

// Använder static files (i mappen public)
// app.use anropas varje gång applikationen får en Request
app.use(express.static("public"));
app.use(cors());

const databaseSql = require("./config/sql");
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
