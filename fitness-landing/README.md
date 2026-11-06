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

Default credentials:

| Field | Value |
| --- | --- |
| Username | `staff` |
| Password | `herspace2026` |

The login page also shows these credentials in a demo-access card and can fill them in with one click. To change them, copy `.env.example` to `.env` and edit:

```env
VITE_STAFF_USERNAME=staff
VITE_STAFF_PASSWORD=herspace2026
VITE_STAFF_NAME=Studio Staff
```

> **Security note:** this is a front-end demo login. The credentials are bundled into the browser, so they keep honest staff out but cannot protect a public site on their own. Add real server-side authentication before launch.

### What staff can do

- See every website enquiry in one inbox.
- Search by name, email, phone, program or note.
- Filter by **New**, **Contacted**, **Booked** and **Archived**.
- Change follow-up status and write internal notes.
- Export the current view as a spreadsheet-ready **CSV**.
- Copy rows as **TSV**, ready to paste into Google Sheets or Excel.
- Sync enquiries to a Google Sheet automatically, including edits made in the sheet (see below).
- Delete enquiries locally and from the connected sheet.

Enquiries submitted through `/contact` are saved to browser `localStorage`, so the inbox works without a backend.

## Store submissions in a Google Sheet

A CSV export always works. For live spreadsheet storage, connect the included Google Apps Script webhook.

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Replace `Code.gs` with [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) from this project.
4. Optionally change `SHARED_SECRET` in the script. If you do, use the same value for `VITE_SHEETS_SHARED_SECRET`.
5. Click **Deploy → New deployment → Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Copy the Web app URL.
7. Create `.env` from `.env.example` and fill in:

```env
VITE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_SHEETS_SHARED_SECRET=herspace-sheet-secret
VITE_SHEETS_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

8. Restart the dev server (or redeploy the site).

New enquiries sync automatically. If a sync fails, the staff portal keeps the enquiry locally and lets staff retry with **Sync now**. Status and note changes are pushed to the same spreadsheet row — the script updates by submission ID instead of adding duplicates.

Sync is two-way: **Sync now** pushes pending local changes and then pulls edits or new rows made directly in the spreadsheet. Deleting an enquiry in the portal also deletes its row from the sheet, and deleted IDs are remembered so a failed sheet delete cannot bring the enquiry back. Sample enquiries stay in the browser and are never synced.

### Notes on the Google Sheets connection

- All `VITE_*` values are visible in the browser bundle. The shared secret is a light spam check, not a true secret.
- The Apps Script must be deployed with access set to **Anyone**, otherwise the browser cannot post to it.
- The script uses `Content-Type: text/plain` so browsers skip the CORS preflight that Apps Script does not support.
- Add the same environment variables in your hosting dashboard (Vercel, Netlify, etc.) when deploying.
- If the Google Sheet is deleted or the deployment changes, update the environment variable and redeploy.

## Data & privacy

- Submissions are stored under the `herspace.staff.submissions.v1` key in the browser.
- Staff sessions use `sessionStorage` by default and `localStorage` when “Keep me signed in” is selected.
- Data is never sent anywhere else unless `VITE_SHEETS_WEBHOOK_URL` is configured.
- The sample entries loaded from the empty inbox are clearly labelled and can be removed in one click.
