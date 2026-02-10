
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.utils.book_new();
const ws_data = [
    ['Name', 'Donation', 'Date'],
    ['Ahmed', '100', '2024-03-10'],
    ['Fatima', '250', '2024-03-11'],
    ['Khalid', '50', '2024-03-12']
];
const ws = XLSX.utils.aoa_to_sheet(ws_data);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

const filePath = path.join(__dirname, 'dummy_data.xlsx');
XLSX.writeFile(wb, filePath);
console.log('Dummy Excel file created at:', filePath);
