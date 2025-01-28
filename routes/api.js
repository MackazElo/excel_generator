const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const exceljs = require("exceljs");

// Konfiguracja bazy danych
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "attendence",
};

// Endpoint do pobierania danych i generowania Excela
router.post("/generate-excel", async (req, res) => {
  const { tableName, userColumn } = req.body;

  if (!tableName || !userColumn) {
    return res.status(400).json({ error: "Invalid parameters." });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Pobieranie danych z tabeli
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    await connection.end();

    // Grupowanie danych według kolumny userColumn
    const groupedData = rows.reduce((acc, row) => {
      const userValue = row[userColumn];
      if (!acc[userValue]) acc[userValue] = [];
      acc[userValue].push(row);
      return acc;
    }, {});

    // Tworzenie pliku Excel
    const workbook = new exceljs.Workbook();

    Object.keys(groupedData).forEach((user) => {
      const sheet = workbook.addWorksheet(user);
      const data = groupedData[user];

      // Dodanie nagłówków do arkusza
      const headers = Object.keys(data[0]);
      sheet.addRow(headers);

      // Dodanie danych
      data.forEach((row) => {
        sheet.addRow(Object.values(row));
      });
    });

    // Wysyłanie pliku do klienta
    const fileName = `data_${Date.now()}.xlsx`;
    const filePath = `./${fileName}`;
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, fileName, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

module.exports = router;
