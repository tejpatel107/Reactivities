/// <reference types="vite/client" />

export default interface ImportMetaEnv {
    readonly VITE_API_URL : string,
    readonly VITE_CHAT_URL : string,
}

export default interface ImportMeta {
    readonly env: ImportMetaEnv
}