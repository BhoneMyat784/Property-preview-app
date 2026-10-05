# Web app project boundaries

Read this file before changing the web app. Keep TypeScript, React Native, Expo Router SDK 57, React Native Web, and the shared client contracts. Keep browser accessibility, responsive layouts, Burmese/English switching, URL-persisted filters, and public listing rendering intact.

Use the API project for authentication, authorization, data, and uploads. Do not import API internals into screens. This project is web-only; native work belongs in the mobile project.
