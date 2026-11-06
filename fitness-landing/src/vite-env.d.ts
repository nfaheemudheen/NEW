/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STAFF_USERNAME?: string
  readonly VITE_STAFF_PASSWORD?: string
  readonly VITE_STAFF_NAME?: string
  readonly VITE_SHEETS_WEBHOOK_URL?: string
  readonly VITE_SHEETS_SHARED_SECRET?: string
  readonly VITE_SHEETS_SPREADSHEET_URL?: string
  readonly VITE_SHEETS_SPREADSHEET_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
