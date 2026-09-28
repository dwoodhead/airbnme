// Paste this into the "AirBnMe Reservations" Google Sheet: Extensions → Apps Script.
// Then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone),
// and put the web app URL in the BOOKING_SHEET_URL env var on Vercel.
// After changing this code: Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy
// (the URL stays the same).

// Save a new reservation as a row
function doPost(e) {
  var data = JSON.parse(e.postData.contents)
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  sheet.appendRow([new Date(), clean(data.names), data.checkIn, data.checkOut, data.nights, clean(data.food)])
  return json({ ok: true })
}

// List reservations (names and dates only) so the site can show them on the calendar
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var tz = ss.getSpreadsheetTimeZone()
  var rows = ss.getSheets()[0].getDataRange().getValues().slice(1) // skip the header row
  var reservations = rows
    .filter(function (r) { return r[1] && r[2] && r[3] })
    .map(function (r) {
      return { names: String(r[1]).replace(/^'/, ''), checkIn: day(r[2], tz), checkOut: day(r[3], tz) }
    })
  return json({ ok: true, reservations: reservations })
}

// Sheets turns "2026-10-14" into a date; turn it back into "YYYY-MM-DD"
function day(value, tz) {
  return value instanceof Date ? Utilities.formatDate(value, tz, 'yyyy-MM-dd') : String(value).slice(0, 10)
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

// Stop guest text that starts with = + - @ from being run as a spreadsheet formula
function clean(value) {
  var s = String(value || '')
  return /^[=+\-@]/.test(s) ? "'" + s : s
}
