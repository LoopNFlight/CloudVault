# CloudVault — Secure Serverless Cloud Storage

A production-style, Dropbox-like file sharing platform built entirely on **true serverless AWS architecture**: API Gateway + Lambda + S3, with zero EC2 instances and zero traditional backend servers. Built as a portfolio piece for Cloud / AWS / DevOps engineering roles.

![Architecture](https://img.shields.io/badge/AWS-Serverless-orange) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Node](https://img.shields.io/badge/Node.js-22.x-339933)

---

## 1. Project Overview

CloudVault lets users upload, browse, search, preview, download, and delete files through a polished dark-mode SaaS dashboard. Every operation is handled by a dedicated AWS Lambda function invoked through API Gateway, with Amazon S3 as the sole storage layer.

**Live capabilities**
- Drag-and-drop multi-file upload with per-file progress, cancel, and retry
- Searchable, sortable, paginated file table
- In-browser preview for images, video, audio, PDF, and text files
- One-click copy of a time-limited (15-minute) presigned download link
- Real-time dashboard and statistics (total files, storage used, today's uploads, largest file, file-type breakdown, monthly upload trend)
- Toast notifications, loading skeletons, empty states, and a custom 404 page

---

## 2. Architecture Diagram

```
                    ┌─────────────────────┐
                    │   React 19 + Vite    │
                    │   (Vercel hosting)    │
                    └──────────┬───────────┘
                               │ HTTPS (Axios)
                               ▼
                    ┌─────────────────────┐
                    │   Amazon API Gateway  │
                    │       (REST API)      │
                    └──────────┬───────────┘
        ┌───────────┬──────────┼──────────┬───────────┬────────────┐
        ▼           ▼          ▼          ▼           ▼            ▼
   uploadFile   listFiles  downloadFile deleteFile searchFiles getStatistics
   (Lambda)     (Lambda)   (Lambda)     (Lambda)   (Lambda)    (Lambda)
        │           │          │          │           │            │
        └───────────┴──────────┴────┬─────┴───────────┴────────────┘
                                     ▼
                          ┌────────────────────┐
                          │     Amazon S3        │
                          │  (encrypted bucket)   │
                          └────────────────────┘
                                     │
                                     ▼
                          ┌────────────────────┐
                          │      CloudWatch       │
                          │  (logs & metrics)      │
                          └────────────────────┘

IAM roles scoped per-function (least privilege) sit between every
Lambda and S3. All infrastructure is defined in backend/template.yaml
(AWS SAM) and deploys with a single `sam deploy`.
```

---

## 3. AWS Services Used

| Service | Purpose |
|---|---|
| **AWS Lambda** (Node.js 22, arm64) | Six single-purpose functions: upload, list, download, delete, search, statistics |
| **Amazon API Gateway** (REST API) | Public HTTPS surface, CORS, routing, throttling |
| **Amazon S3** | Encrypted, versioned object storage; source of truth for files and metadata |
| **IAM** | Least-privilege execution roles generated per-function via SAM policy templates |
| **CloudWatch** | Automatic logs + X-Ray tracing for every invocation |
| **AWS SDK v3** | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |

---

## 4. Application Flow

1. **Upload** — the browser reads the file as base64 and POSTs it to `/upload`. `uploadFile` validates size/extension, writes the object to `uploads/` with a UUID-prefixed key, and stores the original filename as S3 object metadata.
2. **List** — `/files` (`listFiles`) paginates `ListObjectsV2` and enriches each key with a `HeadObject` call for metadata.
3. **Search** — `/search?q=` (`searchFiles`) lists the prefix and filters in-memory by filename (a DynamoDB GSI would replace this at large scale).
4. **Download / Preview** — `/download/{key}` (`downloadFile`) returns a presigned S3 GET URL valid for 15 minutes; the browser streams directly from S3.
5. **Delete** — `/files/{key}` (`deleteFile`) removes the object after confirming it exists.
6. **Statistics** — `/stats` (`getStatistics`) aggregates total files, storage, today's uploads, largest file, file-type breakdown, and monthly trend directly from bucket contents.

The frontend refetches files + stats after every upload/delete so the dashboard, file table, and statistics page all stay in sync in real time.

---

## 5. Folder Structure

```
serverless-file-share/
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, Navbar, FileTable, DropZone, Charts, modals...
│   │   ├── pages/            # Landing, DashboardHome, Upload, MyFiles, Statistics, Settings, About, 404
│   │   ├── hooks/            # useDebouncedSearch
│   │   ├── services/         # api.js (Axios client)
│   │   ├── context/          # AppContext (global file/stat/toast state)
│   │   ├── utils/            # formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── lambda/
│   │   ├── uploadFile/index.mjs
│   │   ├── listFiles/index.mjs
│   │   ├── downloadFile/index.mjs
│   │   ├── deleteFile/index.mjs
│   │   ├── searchFiles/index.mjs
│   │   ├── getStatistics/index.mjs
│   │   └── common/           # shared s3Client.mjs, response.mjs
│   ├── template.yaml         # AWS SAM infrastructure-as-code
│   └── package.json
└── README.md
```

---

## 6. Installation

### Prerequisites
- Node.js 22+
- AWS account + AWS CLI configured (`aws configure`)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

### Frontend
```bash
cd frontend
npm install
cp .env.example .env      # fill in your API Gateway URL after deploying the backend
npm run dev                # http://localhost:5173
```

### Backend
```bash
cd backend
npm install
sam build
sam local start-api        # http://localhost:3000, for local testing
```

---

## 7. Deployment

### Backend → AWS Lambda + API Gateway
```bash
cd backend
sam build
sam deploy --guided
```
On first run, SAM will prompt for a stack name, region, and the `AllowedOrigin` parameter (set this to your Vercel domain, e.g. `https://cloudvault.vercel.app`) and save your answers to `samconfig.toml`.

A `samconfig.toml` is already included with sensible defaults (region `us-east-1`, `CAPABILITY_IAM`, `AllowedOrigin="*"`). If you want to deploy non-interactively once you're past the first run, either edit `samconfig.toml` directly or override on the command line:
```bash
sam deploy --parameter-overrides Stage="prod" AllowedOrigin="https://cloudvault.vercel.app"
```
Note the `ApiEndpoint` and `BucketName` values in the stack outputs — you'll need them for the frontend's `.env`.

### Frontend → Vercel
```bash
cd frontend
vercel --prod
```
Set the following environment variables in the Vercel project settings (Project → Settings → Environment Variables):

| Variable | Example |
|---|---|
| `VITE_API_BASE_URL` | `https://abc123.execute-api.us-east-1.amazonaws.com/prod` |
| `VITE_AWS_REGION` | `us-east-1` |
| `VITE_BUCKET_NAME` | `serverless-file-share-123456789012-prod` |

---

## 8. Environment Variables

**Frontend (`frontend/.env`)**
```
VITE_API_BASE_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
VITE_AWS_REGION=us-east-1
VITE_BUCKET_NAME=serverless-file-share-xxxxxxxxxxxx-prod
```

**Backend** — no `.env` file is used. `BUCKET_NAME` and `ALLOWED_ORIGIN` are injected into every Lambda automatically by `template.yaml` (`Globals.Function.Environment.Variables`). AWS credentials are never hardcoded — Lambda execution roles handle S3 access via IAM.

---

## 9. API Documentation

Base URL: `{ApiEndpoint}` from the SAM stack output.

| Method | Path | Lambda | Description |
|---|---|---|---|
| `POST` | `/upload` | `uploadFile` | Body: `{ fileName, contentType, fileContent (base64) }`. Returns the new object key. |
| `GET` | `/files` | `listFiles` | Query: `limit`, `continuationToken`. Returns `{ files[], count, isTruncated, nextContinuationToken }`. |
| `GET` | `/download/{key}` | `downloadFile` | Returns `{ url, expiresInSeconds }` — a presigned GET URL valid 15 minutes. |
| `DELETE` | `/files/{key}` | `deleteFile` | Permanently deletes the object. |
| `GET` | `/search?q=` | `searchFiles` | Filters files by filename substring. |
| `GET` | `/stats` | `getStatistics` | Returns totals, largest file, file-type breakdown, monthly trend, recent uploads. |

All responses are JSON with CORS headers (`Access-Control-Allow-Origin`) applied. Errors return `{ error: true, message }` with an appropriate 4xx/5xx status code.

---

## 10. Security

- IAM least-privilege: read-only functions (`listFiles`, `downloadFile`, `searchFiles`, `getStatistics`) get `S3ReadPolicy`; write functions (`uploadFile`, `deleteFile`) get `S3CrudPolicy` — nothing gets broader access than it needs.
- No AWS credentials are ever present in frontend code or Lambda source; execution roles are attached by SAM.
- Uploads are capped at 100MB and blocked for dangerous extensions (`.exe`, `.sh`, `.bat`, etc.).
- Presigned URLs expire after 15 minutes.
- The S3 bucket blocks all public access; the only path to an object is a signed, time-limited URL.
- Server-side encryption (AES-256) is enabled on every object.

---

## 11. Screenshots

### Landing Page

![Landing Page](assets\landingpage.png)

### Dashboard

![Dashboard](assets\dashboard.png)

### Upload Page

![Upload Page](assets/upload-page.png)

### My Files

![My Files](assets/my-files.png)

### Settings

![Settings](assets\settings.png)
---

## 12. Future Improvements

- Replace in-memory search with DynamoDB + GSI for filename search at scale
- Add Cognito-based authentication and per-user file namespacing
- Switch upload to presigned `PUT` URLs for direct-to-S3 multipart uploads (removes the 100MB Lambda payload ceiling)
- Add CloudFront in front of S3 for faster global downloads
- Add S3 Event Notifications → SNS for upload alerts
- Infrastructure CI/CD via GitHub Actions (`sam build && sam deploy` on merge to `main`)

---

## 13. Tech Stack Summary

**Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Icons, Axios, React Router
**Backend:** AWS Lambda (Node.js 22), AWS SDK v3, AWS SAM
**Infra:** Amazon API Gateway, Amazon S3, IAM, CloudWatch
**Hosting:** Vercel (frontend) + AWS (backend)
