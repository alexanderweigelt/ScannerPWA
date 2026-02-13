# Scanner PWA

A **Progressive Web App (PWA)** for scanning documents directly in the browser — built with **Next.js**.

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The application uses:

- **[jscanify](https://github.com/puffinsoft/jscanify)** for document detection and image processing  
- **[jsPDF](https://github.com/parallax/jsPDF)** for generating PDF files  
- **Next.js (App Router)** as the application framework  
- PWA capabilities via Web App Manifest + Service Worker  

All processing happens entirely **client-side** — no backend required.

### Features

#### MVP

- Camera preview using `getUserMedia`
- Capture document image
- Apply scan processing with jscanify
- Generate PDF with jsPDF
- Download the PDF
- Installable as a PWA

#### Planned Enhancements

- Multi-page document support
- Page reordering and deletion
- Manual crop adjustments
- A4 / Letter export formats
- Image compression settings
- Offline support via Service Worker
- Local draft storage (IndexedDB)

### Tech Stack

- **[Next.js](https://nextjs.org/docs) (App Router)**
- **TypeScript**
- **[jscanify](https://github.com/puffinsoft/jscanify)**
- **[jsPDF](https://github.com/parallax/jsPDF)**
- Web APIs:
  - `navigator.mediaDevices.getUserMedia`
  - Canvas API
  - Blob API
  - (Optional) Web Share API
  - (Optional) IndexedDB



### Architecture Overview

Example structure:

```
app/
    ├── page.tsx              // Main scanner UI
    ├── layout.tsx
    └── globals.css
src/
    ├── camera/               // Camera access & capture logic
    ├── scan/                 // jscanify wrapper
    ├── pdf/                  // jsPDF wrapper
    ├── storage/              // IndexedDB (optional)
    └── lib/                  // Shared utilities
public/
    ├── manifest.json
    └── icons/
```

### Processing Pipeline

1. Camera stream → Video element
2. Capture frame → Canvas
3. Canvas → jscanify processing
4. Processed image → jsPDF
5. jsPDF → Blob → Download

All steps run locally in the browser.

### PWA Details

- Web App Manifest (`public/manifest.json`)
- Service Worker (custom or via plugin)
- Installable on mobile & desktop
- HTTPS required for camera access (except `localhost`)

### Browser Considerations

- Camera access requires user permission
- Must be triggered by user interaction
- Behavior may differ across:
  - iOS Safari
  - Android Chrome
  - Desktop browsers

## Development

### Getting Started

First, install dependencies:

```bash
pnpm install
````

Then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying:

```
app/page.tsx
```

The page auto-updates as you edit the file.



### Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a font family by Vercel.



### Build & Production

Build the app:

```bash
pnpm run build
```

### Deployment

The easiest way to deploy your Next.js app is to use the **Vercel Platform**:

[https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

See the official deployment documentation:

[https://nextjs.org/docs/app/building-your-application/deploying](https://nextjs.org/docs/app/building-your-application/deploying)

### Learn More

To learn more about Next.js:

* Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
* Learn Next.js: [https://nextjs.org/learn](https://nextjs.org/learn)
* Next.js GitHub Repository: [https://github.com/vercel/next.js](https://github.com/vercel/next.js)

### License

MIT 

