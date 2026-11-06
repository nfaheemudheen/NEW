# Her Space submissions API

This Node service stores contact enquiries in the `Submissions` tab of the configured Google Sheet. Staff login and inbox endpoints are protected by a signed, expiring bearer token; the Google service account private key stays on the server.

## Deploy on Render

Create a **Web Service** from this repository with:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Set the variables from [`.env.example`](./.env.example) in Render. Set `FRONTEND_ORIGIN` to the exact Vercel site origin (no trailing slash). For previews, add their origins as a comma-separated list. Use a newly generated `GOOGLE_PRIVATE_KEY`; the previous key was exposed and must be revoked. Change the staff password too. When entering the key, paste the full private key; literal `\n` line breaks are also accepted.

Share the spreadsheet with `GOOGLE_SERVICE_ACCOUNT_EMAIL` as an **Editor**. The API creates the `Submissions` tab and header row if needed.

## Connect Vercel

Add `VITE_API_BASE_URL` with the Render service origin, such as `https://your-service.onrender.com`, then redeploy the frontend. `VITE_SHEETS_SPREADSHEET_ID` is optional and only supplies the staff portal's Open Sheet shortcut.

Once both services are deployed, new contact forms write directly to Sheets. Existing local-only enquiries are pushed with **Sync now** from the same browser where they were saved.
