require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173"
  ].filter(Boolean)
}));

const PORT = process.env.PORT || 5000;

// Google Sheets authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Her Space API is running"
  });
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ success: true, token });
});

// Verify admin token
function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new Error("Missing token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") throw new Error("Invalid role");

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
}

// Submit enquiry
app.post("/api/submissions", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof message !== "string" || !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and message"
      });
    }

    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Submissions!A:D",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[
          name.trim(),
          email.trim(),
          message.trim(),
          new Date().toISOString()
        ]]
      }
    });

    res.json({
      success: true,
      message: "Enquiry saved successfully"
    });

  } catch (error) {
    console.error("Sheets error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not save enquiry"
    });
  }
});

// Admin: View submissions
app.get("/api/admin/submissions", verifyAdmin, async (req, res) => {
  try {
    const sheets = await getSheets();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Submissions!A:D"
    });

    const rows = result.data.values || [];

    res.json({
      success: true,
      submissions: rows.slice(1).map((row, index) => ({
        id: index + 1,
        name: row[0] || "",
        email: row[1] || "",
        message: row[2] || "",
        date: row[3] || ""
      }))
    });

  } catch (error) {
    console.error("Sheets read error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not retrieve submissions"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Her Space API running on port ${PORT}`);
});
