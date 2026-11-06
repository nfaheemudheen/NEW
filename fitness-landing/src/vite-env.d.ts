/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SHEETS_SPREADSHEET_URL?: string
  readonly VITE_SHEETS_SPREADSHEET_ID?: string
  readonly VITE_SHEETS_WEBHOOK_URL?: string
  readonly VITE_SHEETS_SHARED_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
