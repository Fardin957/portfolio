# Fix contact form → Google Sheet (do this once)

Your form shows success, but the Sheet stays empty until the **new** Apps Script is saved and **redeployed**.

## Step 1 — Replace script code
1. Open your Sheet: **Contact From Submission**
2. Menu: **Extensions → Apps Script**
3. Delete everything in `Code.gs`
4. Paste all code from: `google-apps-script/Code.gs` in this project
5. Click **Save** (floppy icon)

## Step 2 — Authorize write access
1. In the function dropdown, choose **`testWrite`**
2. Click **Run**
3. Click **Review permissions → Allow**
4. Go back to the Sheet and refresh — you should see a row on **Sheet1**

If `testWrite` fails, the Spreadsheet ID is wrong or you opened Apps Script from a different file.

## Step 3 — Redeploy Web App (required)
1. **Deploy → Manage deployments**
2. Click the **pencil** (Edit)
3. Version: **New version**
4. Execute as: **Me**
5. Who has access: **Anyone**
6. **Deploy**
7. Copy the **Web app URL**
8. Paste it into `js/config.js` → `GOOGLE_SCRIPT_URL`

## Step 4 — Browser test (proves Sheet write works)
Open this in a new tab (use YOUR web app URL):

```
YOUR_WEB_APP_URL?name=BrowserTest&mobile=01600000000&email=test@example.com&message=Hello
```

You should see JSON like `{"status":"success","message":"Saved to Sheet1."}`  
And **Sheet1** should get a new row.

## Step 5 — Portfolio form
1. Open **http://localhost:8080** (not file://)
2. Hard refresh: Ctrl+Shift+R
3. Submit the contact form
4. Refresh the Google Sheet → row on **Sheet1**
