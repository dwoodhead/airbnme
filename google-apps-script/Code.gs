// Paste this into the "AirBnMe Reservations" Google Sheet: Extensions → Apps Script.
// Then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone),
// and put the web app URL in the BOOKING_SHEET_URL env var on Vercel.

function doPost(e) {
  var data = JSON.parse(e.postData.contents)
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  sheet.appendRow([new Date(), clean(data.names), data.checkIn, data.checkOut, data.nights, clean(data.food)])
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)
}

// Stop guest text that starts with = + - @ from being run as a spreadsheet formula
function clean(value) {
  var s = String(value || '')
  return /^[=+\-@]/.test(s) ? "'" + s : s
}
