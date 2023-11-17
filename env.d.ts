/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string,
  readonly VITE_USERNAME: string,
  readonly VITE_PASSWORD: string,
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}
