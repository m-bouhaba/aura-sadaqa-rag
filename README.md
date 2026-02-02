# 🌙 Aura-Sadaqa — AI Assistant for Ramadan Solidarity

Aura-Sadaqa is an AI-powered web platform designed to support charitable associations in Casablanca during Ramadan.

Every year, associations face an overwhelming flow of requests, PDF lists, donation inventories, and volunteer coordination tasks. Aura-Sadaqa transforms this operational chaos into a calm, grounded, and accessible experience through an intelligent conversational assistant.

---

## ✨ Key Features

- 🤖 **RAG-based AI Assistant**
  - Grounded answers using the association’s real data (families, donations, schedules).
  - Powered by **Gemini Flash 2.0** and **Pinecone Vector DB**.

- 🧩 **Parallel Routing with Next.js 15**
  - Chat with the assistant while data exploration runs independently.
  - Separate loading states for chat and explorer slots.

- 📂 **PDF & Document Ingestion**
  - Upload family lists, Quffat Ramadan inventories, and distribution plans.
  - Documents are chunked, embedded, and indexed in Pinecone.

- ⚡ **Real-Time Streaming**
  - AI responses stream chunk-by-chunk for a smooth, live experience.
  - Visual “Sadaqa Pulse” indicator shows when the assistant is thinking.

- 🎨 **Ramadan-Inspired UI**
  - Tailwind CSS v4 with custom theme variables.
  - Soft animations inspired by lantern light using Framer Motion.
  - Accessible components powered by shadcn/ui.

- 🛡️ **Form Validation & Safety**
  - React Hook Form + Zod for strict input validation.
  - Prevents empty messages and unsupported file uploads.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI**: Gemini Flash 2.0
- **Vector Database**: Pinecone
- **Animations**: Framer Motion
- **Validation**: Zod + React Hook Form

---

## 🧠 Architecture Highlights

- Parallel Routes with `@chat` and `@explorer`
- Server Actions for secure AI & vector operations
- Strict kebab-case file naming
- Global Ramadan session state via React Context

---

## 🌍 Social Impact

Aura-Sadaqa is built to empower volunteers, donors, and coordinators with instant access to critical information — enabling faster, fairer, and more transparent aid distribution during Ramadan.

---

## 🚀 Future Improvements

- Multi-association support
- Role-based access (Admin / Volunteer)
- Arabic dialect understanding (Darija)
- Donation analytics & heatmaps by neighborhood

---

## 📜 License
MIT
