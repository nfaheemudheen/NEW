/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SHEETS_SPREADSHEET_URL?: string
  readonly VITE_SHEETS_SPREADSHEET_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
