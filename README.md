# NoteFlow — Secure Note-Taking & Community Frontend

An intuitive, secure, and modern web application built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **TypeScript**, **Redux Toolkit (RTK Query)**, and **Tailwind CSS**.

---

## 🌐 Live Deployed Backend

The backend REST API powering this application is deployed and live on Render:

| Service | Endpoint | Description |
|---|---|---|
| **Live Backend URL** | [https://noteflow-backend-5l9o.onrender.com/](https://noteflow-backend-5l9o.onrender.com/) | Live cloud server |
| **API Base URL** | [https://noteflow-backend-5l9o.onrender.com/api](https://noteflow-backend-5l9o.onrender.com/api) | API root used by the frontend |
| **Health Check** | [https://noteflow-backend-5l9o.onrender.com/](https://noteflow-backend-5l9o.onrender.com/) | Returns: `"Server running successfully!"` |

> [!NOTE]
> The backend is hosted on Render's free tier. If the instance has been inactive, the first request may take ~30–50 seconds while the server spins up.

---

## ✨ Key Features

- **🔐 Next.js 16 Proxy Route Protection**:
  - Unauthenticated visitors are restricted: attempting to visit `/`, `/posts`, or `/admin` automatically redirects to `/login`.
  - Only authenticated users with a valid JWT token can access protected pages.
- **🛡️ Strict Admin RBAC Guard**:
  - Regular users cannot access `/admin` or `/admin/*` routes; any non-admin request is intercepted by the server proxy and redirected to `/`.
  - Client-side `<AdminRoleGuard>` and conditional navigation prevent regular users from ever seeing admin controls or sidebars.
- **📝 Personal Note Management**:
  - Create, view, edit, and delete personal notes.
  - Rich text formatting powered by the Tiptap WYSIWYG editor.
  - Real-time search and pagination for notes.
- **👥 Community Posts Feed**:
  - Explore posts shared across the community.
  - Filter posts by interests (Technology, Coding, Design, AI, etc.) with custom multi-select pills.
  - Fast post creation modal with tags and rich descriptions.
- **📊 Admin Management Console**:
  - Unified view of all user notes and community posts.
  - User status management (block / unblock / delete / role change).
  - Visual summary cards powered by MongoDB aggregation pipelines.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management & Caching**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## ⚙️ Environment Configuration

Create a `.env.local` file inside the `interview-frontend` directory copying from `.env.example`:

```env
# Connect to the Live Deployed Backend (Render):
NEXT_PUBLIC_API_URL=https://noteflow-backend-5l9o.onrender.com/api

# Or connect to a Local Backend server:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd Frontend/interview-frontend
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
interview-frontend/
├── src/
│   ├── app/
│   │   ├── (authLayout)/          # Login & Register routes
│   │   ├── (commonLayout)/        # Home (My Notes) & Community Posts
│   │   ├── (adminLayout)/         # Admin dashboard & management
│   │   ├── layout.tsx             # Root Layout with Redux Provider
│   │   └── proxy.ts               # Next.js 16 Route Guard Proxy
│   ├── components/
│   │   ├── shared/                # Navbar, Footer, RichTextEditor
│   │   ├── ui/                    # Modals, Feed, Note & Post cards
│   │   └── Providers.tsx          # Redux and Toast Providers
│   ├── redux/
│   │   ├── api/                   # RTK Query APIs (auth, notes, posts, users)
│   │   ├── features/              # Redux slices (authSlice, etc.)
│   │   └── store.ts               # Redux store configuration
│   └── types/                     # TypeScript definitions
├── .env.example                   # Environment configuration template
├── package.json
└── README.md
```
