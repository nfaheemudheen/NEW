# Her Space Studio — website & staff portal

Marketing site and staff submission inbox for Her Space Fitness Studio. Built with React, TypeScript, Vite and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Build for production with:

```bash
npm run build
```

## Staff portal

The staff portal lives at **`/staff`**. Staff can sign in from the footer link, or go directly to `/staff/login`.

Staff sign-in is handled by the submissions backend. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the backend service environment; these values are never bundled into the website.

### What staff can do

- See every website enquiry in one inbox.
- Search by name, email, phone, program or note.
- Filter by **New**, **Contacted**, **Booked** and **Archived**.
- Change follow-up status and write internal notes.
- Export the current view as a spreadsheet-ready **CSV**.
- Copy rows as **TSV**, ready to paste into Google Sheets or Excel.
- Sync enquiries to a Google Sheet automatically, including edits made in the sheet (see below).
- Delete enquiries locally and from the connected sheet.

Enquiries submitted through `/contact` are saved in the browser and written to Google Sheets through the Apps Script webhook or the Node service in `backend/`.

## Connect Google Sheets

### Option A — Apps Script webhook (works on any static host)

1. Open the studio spreadsheet, choose **Extensions → Apps Script**, and paste `google-apps-script/Code.gs`.
2. Check `SPREADSHEET_ID`, `SHEET_NAME` and `SHARED_SECRET` at the top of the script.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as** to *Me* and **Who has access** to *Anyone*, then copy the `/exec` URL.
4. Add these variables in Vercel/Netlify and redeploy:
   - `VITE_SHEETS_WEBHOOK_URL` — the Apps Script `/exec` URL
   - `VITE_SHEETS_SHARED_SECRET` — the same secret as `SHARED_SECRET`
   - `VITE_SHEETS_SPREADSHEET_ID` — used by the “Open spreadsheet” shortcut
5. Use **Sync now** in the staff portal to push enquiries already stored in that browser.

On Vercel, the bundled `api/enquiries.js` proxy is an alternative: set `SHEETS_WEBHOOK_URL` and `SHEETS_SHARED_SECRET` (no `VITE_` prefix) instead, and the website posts to `/api/enquiries`.

### Option B — Node backend (adds staff login, pull and delete)

1. Deploy this repository as a Render Web Service with root directory `backend`, build command `npm install`, start command `npm start`, and health check path `/health`.
2. Add the variables in `backend/.env.example` to Render. Rotate the previously exposed Google service-account key before setting `GOOGLE_PRIVATE_KEY`.
3. Share the spreadsheet with `GOOGLE_SERVICE_ACCOUNT_EMAIL` as an Editor. The API creates the `Submissions` tab and headings automatically.
4. Set `FRONTEND_ORIGIN` to the exact Vercel origin.
5. In Vercel, set `VITE_API_BASE_URL` to the Render service origin and redeploy.
6. Use **Sync now** in the staff portal to push existing enquiries stored in that browser.

Staff credentials and the Google private key stay on Render. Do not use `VITE_` prefixes for those secrets because Vite embeds `VITE_*` values in the public website bundle. The webhook shared secret is only a light spam check and is not a real secret.

## Data & privacy

- Staff inbox copies are kept in browser storage, while the server writes records to Google Sheets.
- Staff login is checked by the backend; the signed session token expires after 12 hours.
- Sample enquiries stay in the browser and are never written to the spreadsheet.
