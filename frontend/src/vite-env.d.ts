/// <reference types="react-scripts" />
declare module '*.scss';
declare module '*.css';
declare module '*.svg';
declare module '*.svg?react';
declare module '*.png';

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_CLIENT_ID: string;
    readonly VITE_CLIENT_SECRET: string;
    readonly VITE_CYPHER_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
