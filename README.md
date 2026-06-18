# React TypeScript Universal Data Converter

A modern, fast, completely browser-based data conversion application built using React, TypeScript, and Vite. This application handles data transformations securely without sending any payload to a server.

Languages available: [English](README.md) | [עברית (Hebrew)](README.he.md)

## ✨ Features

- **Six Powerful Tools:**
  - **JSON to CSV:** Flattens arrays and structures properties into clean comma-separated values.
  - **CSV to JSON:** Validates headers and rows to construct robust JSON representations.
  - **XML to JSON:** Deep traversal to convert attribute structures and nodes into clean nested JSON.
  - **JSON to XML:** Recursively maps arrays and primitives to valid XML syntax with auto tags.
  - **JSON to YAML:** Converts JSON payloads into readable YAML.
  - **YAML to JSON:** Parses YAML content into formatted JSON.
- **Privacy First Approach:** 100% of the logic happens locally in your browser. No files are uploaded and no APIs are called.
- **Dark Mode Support:** State-of-the-Art CSS variable implementation with dynamic theme toggling (Sun/Moon).
- **Internationalization (i18n):** Full support for English (LTR) and Hebrew (RTL) including structural interface flip.
- **Accessibility (a11y):** Built following WCAG semantics, dynamic ARIA tags, and high-contrast `:focus-visible` styling for optimal screen reader and keyboard navigation limits.
- **Data Persistence:** User input and interface settings are automatically saved via custom `useLocalStorage` hooks.

## 🛠️ Technology Stack

- **[React 18+](https://react.dev/):** UI library for declarative views.
- **[TypeScript](https://www.typescriptlang.org/):** Strictly typed JavaScript codebase.
- **[Vite](https://vitejs.dev/):** Next Generation Frontend Tooling ensuring immediate Hot Module Reload (HMR) and optimized builds.
- **[React Router DOM](https://reactrouter.com/):** Client-side declarative routing system.
- **[i18next](https://www.i18next.com/):** Robust internationalization framework.
- **[Lucide React](https://lucide.dev/):** Beautiful and consistent iconography.

## 🚀 Getting Started

To run the project locally on your machine, ensure you have [Node.js](https://nodejs.org/) installed, and then run the following commands:

```bash
# 1. Clone the repository or navigate into it
cd online-converter

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## 📦 Building for Production

To create an optimized bundle for deployment:

```bash
# Compile and build using Vite
npm run build
```

This will output statically verified assets into the `dist` directory, ready to be served on platforms like Vercel, Netlify, or Nginx.

## ☁️ Production Deployment

Production is handled by Cloudflare Pages Git integration, not by a GitHub Actions deploy job.

- Site: `https://online-converter.evyatarhazan.com/`
- Cloudflare Pages project: `online-converter`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`

Every push to `main` triggers Cloudflare Pages to build and publish the latest production deployment.

## ✅ Quality Checks

```bash
npm run lint
npm audit
```

GitHub Actions runs CI checks on every push and pull request: dependency install, production build, and lint. Deployments remain managed by Cloudflare Pages.

## 📄 License

This project is open-source and available under the terms of the MIT License. Universal Data Converter. All rights reserved.
