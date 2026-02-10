
const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream("debug_data.xlsx");
const url = "https://docs.google.com/spreadsheets/d/1RqGW2AzXdSLj_J2dGnscC-5vcZohIO4nlnnm5kJ9YDI/export?format=xlsx";

https.get(url, function (response) {
    if (response.statusCode === 302 || response.statusCode === 301 || response.statusCode === 307) {
        https.get(response.headers.location, function (redirectResponse) {
            redirectResponse.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log("Download completed.");
            });
        });
    } else {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("Download completed.");
        });
    }
}).on('error', function (err) {
    fs.unlink("debug_data.xlsx");
    console.error("Error downloading file:", err.message);
});
