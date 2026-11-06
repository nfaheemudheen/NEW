
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Submissions";

const HEADERS = [
  "id",
  "fullName",
  "email",
  "phone",
  "interest",
  "method",
  "source",
  "status",
  "notes",
  "createdAt",
];

const STATUSES = ["new", "contacted", "booked", "archived"];

app.use(express.json({ limit: "100kb" }));

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Google Sheets authentication
const googleAuth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({
  version: "v4",
  auth: googleAuth,
});

// Get the sheet tab ID and create the tab if necessary.
async function getSheetTabId() {
  if (!SHEET_ID) {
    throw new Error("GOOGLE_SHEET_ID is missing.");
  }

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
    fields: "sheets.properties",
  });

  let sheet = spreadsheet.data.sheets?.find(
    (item) => item.properties.title === SHEET_NAME
  );

  if (!sheet) {
    const created = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: SHEET_NAME,
              },
            },
          },
        ],
      },
    });

    sheet = created.data.replies?.[0]?.addSheet;
  }

  if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
    throw new Error("Could not find or create the Submissions sheet.");
  }

  return sheet.properties.sheetId;
}

// Ensure the first row contains the expected column headers.
async function ensureSheetReady() {
  const sheetId = await getSheetTabId();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:J1`,
  });

  const currentHeaders = result.data.values?.[0] || [];

  if (currentHeaders.join("|") !== HEADERS.join("|")) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:J1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [HEADERS],
      },
    });
  }

  return sheetId;
}

function rowToSubmission(row) {
  return {
    id: String(row[0] || ""),
    fullName: String(row[1] || ""),
    email: String(row[2] || ""),
    phone: String(row[3] || ""),
    interest: String(row[4] || "General enquiry"),
    method: String(row[5] || "Email"),
    source: String(row[6] || "Website enquiry form"),
    status: STATUSES.includes(row[7]) ? row[7] : "new",
    notes: String(row[8] || ""),
    createdAt: String(row[9] || new Date().toISOString()),
    syncedToSheet: true,
    isSample: false,
  };
}

function submissionToRow(item) {
  return [
    item.id,
    item.fullName,
    item.email,
    item.phone,
    item.interest,
    item.method,
    item.source,
    item.status,
    item.notes,
    item.createdAt,
  ];
}

async function getAllRows() {
  await ensureSheetReady();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:J`,
  });

  return result.data.values || [];
}

async function findSubmissionRow(id) {
  const rows = await getAllRows();

  const index = rows.findIndex((row) => String(row[0]) === String(id));

  return index === -1 ? null : index + 2;
}

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Her Space API is running",
  });
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Admin authentication is not configured.",
    });
  }

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.trim().toLowerCase() !==
      process.env.ADMIN_USERNAME.trim().toLowerCase() ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Incorrect username or password.",
    });
  }

  const token = jwt.sign(
    {
      role: "admin",
      username: process.env.ADMIN_USERNAME,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    success: true,
    token,
    user: {
      username: process.env.ADMIN_USERNAME,
      name: process.env.ADMIN_NAME || "Her Space Admin",
      role: "Admin",
    },
    expiresIn: 8 * 60 * 60 * 1000,
  });
});

// Verify staff authentication
function verifyAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      throw new Error("Invalid role");
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please sign in again.",
    });
  }
}

// Public website: save a new enquiry.
app.post("/api/submissions", async (req, res) => {
  try {
    const body = req.body || {};

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const interest =
      typeof body.interest === "string" ? body.interest.trim() : "";
    const method =
      typeof body.method === "string" ? body.method.trim() : "";

    if (!fullName || !email || !phone || !interest || !method) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required enquiry details.",
      });
    }

    const submission = {
      id: randomUUID(),
      fullName,
      email,
      phone,
      interest,
      method,
      source: "Website enquiry form",
      status: "new",
      notes: "",
      createdAt: new Date().toISOString(),
    };

    await ensureSheetReady();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:J`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [submissionToRow(submission)],
      },
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been received successfully.",
      submission: {
        ...submission,
        syncedToSheet: true,
        isSample: false,
      },
    });
  } catch (error) {
    console.error("Enquiry save error:", error.message);

    res.status(500).json({
      success: false,
      message: "We could not submit your enquiry. Please try again.",
    });
  }
});

// Staff: fetch all enquiries.
app.get("/api/admin/submissions", verifyAdmin, async (req, res) => {
  try {
    const rows = await getAllRows();

    res.json({
      success: true,
      submissions: rows
        .filter((row) => row[0] && row[1])
        .map(rowToSubmission),
    });
  } catch (error) {
    console.error("Sheets read error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not retrieve enquiries from Google Sheets.",
    });
  }
});

// Staff: update an enquiry.
app.put("/api/admin/submissions/:id", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const rowNumber = await findSubmissionRow(id);

    if (!rowNumber) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    const currentRows = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A${rowNumber}:J${rowNumber}`,
    });

    const current = rowToSubmission(currentRows.data.values?.[0] || []);
    const body = req.body || {};

    const updated = {
      ...current,
      fullName: typeof body.fullName === "string" ? body.fullName.trim() : current.fullName,
      email: typeof body.email === "string" ? body.email.trim() : current.email,
      phone: typeof body.phone === "string" ? body.phone.trim() : current.phone,
      interest: typeof body.interest === "string" ? body.interest : current.interest,
      method: typeof body.method === "string" ? body.method : current.method,
      source: typeof body.source === "string" ? body.source : current.source,
      status: STATUSES.includes(body.status) ? body.status : current.status,
      notes: typeof body.notes === "string" ? body.notes : current.notes,
      createdAt: current.createdAt,
    };

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A${rowNumber}:J${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [submissionToRow(updated)],
      },
    });

    res.json({
      success: true,
      submission: {
        ...updated,
        syncedToSheet: true,
        isSample: false,
      },
    });
  } catch (error) {
    console.error("Sheets update error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not update the enquiry.",
    });
  }
});

// Staff: delete an enquiry.
app.delete("/api/admin/submissions/:id", verifyAdmin, async (req, res) => {
  try {
    const rowNumber = await findSubmissionRow(req.params.id);

    if (!rowNumber) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    const sheetId = await ensureSheetReady();

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    res.json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Sheets delete error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not delete the enquiry.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Her Space API running on port ${PORT}`);
});
