/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBHOOK_ENTRADA?: string;
  readonly VITE_WEBHOOK_SAIDA?: string;
  readonly VITE_WEBHOOK_NOVO_ITEM?: string;
  readonly VITE_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
