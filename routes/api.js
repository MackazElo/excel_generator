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

  const { selectedYear, userColumn, selectedMonth } = req.body;

  if (!selectedYear || !userColumn || !selectedMonth) {
    return res.status(400).json({ error: "Invalid parameters." });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Pobieranie danych z tabeli
    //const [rows] = await connection.query(`SELECT * FROM ${selectedYear}`);
    const [rows] = await connection.query(`
SELECT 
    CONCAT(e.User_ID, ' ', e.Name) AS UserName,
    GROUP_CONCAT(DISTINCT Location SEPARATOR ', ') AS Location,
    Year,
    Month,
    Day,
    GROUP_CONCAT(CONCAT(Hour, ':', Minute, ':', Second) ORDER BY Hour, Minute, Second SEPARATOR ', ') AS Time
    
FROM (
    SELECT User, Year, Month, Day, Hour, Minute, Second, 'hubska' AS Location FROM hubska
    UNION ALL
    SELECT User, Year, Month, Day, Hour, Minute, Second, 'legnicka' AS Location FROM legnicka
    UNION ALL
    SELECT User, Year, Month, Day, Hour, Minute, Second, 'jednosci' AS Location FROM jednosci
    UNION ALL
    SELECT User, Year, Month, Day, Hour, Minute, Second, 'pugeta' AS Location FROM pugeta
) AS CombinedTables
JOIN employees e ON CombinedTables.User = e.User_ID  
WHERE Year = "${selectedYear}" AND Month = "${selectedMonth}"
GROUP BY User, Year, Month, Day;
`);


    await connection.end();

    // Grupowanie danych według kolumny selectedMonth
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
      //data[0].push('aa');
      data[0].Timedifference = '=1+2';
      const headers = Object.keys(data[0]);
      //console.log((data[0]));
      sheet.addRow(headers);


      
      // Dodanie danych
     
      
    let rowNumber = 2;
    data.forEach((row, rowIndex) => {
      row.TimeDifference = `=D${rowNumber}+E${rowNumber}`;
      const rowValues = Object.values(row)
      const excelRow = sheet.addRow(rowValues);
  
      // Add a formula to a specific column, e.g., in the last column of the row
      // Assuming the custom column is the last one
      const formulaCell = excelRow.getCell(excelRow.cellCount); // last cell in the row
      const formula = `=D${rowIndex + 2} + E${rowIndex + 2}`; // Excel formula starts with =, and rowIndex+2 is used because row numbers in Excel are 1-based and the first row is for headers.
      formulaCell.value = { formula: formula };  // Set the formula for that cell
      rowNumber++;
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
