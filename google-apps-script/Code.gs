/**
 * PASTE THIS ENTIRE FILE into Apps Script (Extensions → Apps Script).
 * Then: Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy
 *
 * Writes into the FIRST tab (Sheet1) of your spreadsheet so you can see rows immediately.
 */

var SPREADSHEET_ID = "1ZBQ9N5I_GC0akAJR1vMIY-cju-BVmrJuyfYaV_f-v3E";

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    var data = readFields_(e);

    // Health check only (no fields)
    if (!data.name && !data.email && !data.message) {
      return json_({
        status: "ok",
        message: "Portfolio contact endpoint is live.",
        tip: "Append ?name=Test&mobile=01&email=a@b.com&message=Hi to this URL to test writing.",
      });
    }

    if (!data.name || !data.mobile || !data.email || !data.message) {
      return json_({
        status: "error",
        message: "Missing required fields (name, mobile, email, message).",
        received: data,
      });
    }

    var sheet = getSheet_();
    ensureHeader_(sheet);
    sheet.appendRow([new Date(), data.name, data.mobile, data.email, data.message]);

    return json_({ status: "success", message: "Saved to Sheet1." });
  } catch (err) {
    return json_({ status: "error", message: String(err) });
  }
}

function readFields_(e) {
  var out = { name: "", mobile: "", email: "", message: "" };
  if (!e) return out;

  var p = e.parameter || {};
  out.name = String(p.name || p.Name || "").trim();
  out.mobile = String(p.mobile || p.phone || p.Mobile || "").trim();
  out.email = String(p.email || p.Email || "").trim();
  out.message = String(p.message || p.msg || p.Message || "").trim();

  // Fallback: raw body (JSON / urlencoded)
  if ((!out.name || !out.email) && e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    try {
      var parsed = JSON.parse(raw);
      out.name = out.name || String(parsed.name || "").trim();
      out.mobile = out.mobile || String(parsed.mobile || parsed.phone || "").trim();
      out.email = out.email || String(parsed.email || "").trim();
      out.message = out.message || String(parsed.message || "").trim();
    } catch (ignore1) {
      raw.split("&").forEach(function (pair) {
        var parts = pair.split("=");
        var key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
        var value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
        if (key === "name") out.name = out.name || value.trim();
        if (key === "mobile" || key === "phone") out.mobile = out.mobile || value.trim();
        if (key === "email") out.email = out.email || value.trim();
        if (key === "message") out.message = out.message || value.trim();
      });
    }
  }

  return out;
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheets()[0]; // Sheet1
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Mobile", "Email", "Message"]);
    return;
  }
  var a1 = String(sheet.getRange(1, 1).getValue() || "");
  if (a1.toLowerCase().indexOf("timestamp") === -1 && a1.toLowerCase().indexOf("name") === -1) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, 5).setValues([["Timestamp", "Name", "Mobile", "Email", "Message"]]);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Run manually in editor (select testWrite → Run) to verify Sheet access */
function testWrite() {
  var sheet = getSheet_();
  ensureHeader_(sheet);
  sheet.appendRow([new Date(), "Test User", "01600000000", "test@example.com", "Manual testWrite OK"]);
}
