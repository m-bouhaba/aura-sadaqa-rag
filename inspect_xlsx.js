
const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile("debug_data.xlsx");
    console.log("Sheet Names:", workbook.SheetNames);

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }); // Header: 1 returns array of arrays

    console.log("First 3 rows:", jsonData.slice(0, 3));

    // Check for common issues
    if (jsonData.length === 0) console.log("WARNING: Sheet is empty!");

} catch (error) {
    console.error("Error reading XLSX:", error.message);
}
