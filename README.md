# Project Management using AI (AI Project Pilot)

A modern, intelligent project planning tool that leverages Generative AI to automate the tedious process of breaking down high-level project goals into actionable, prioritized tasks.

## 🚀 Overview
Most project management tools require you to manually input every single task, often leading to "planning fatigue." This application utilizes a powerful **AI model** to analyze your project description and generate a complete roadmap in seconds—complete with priorities, categories, and estimated deadlines.

## ✨ Key Features
- **Intelligent Task Generation**: Simply describe your project in plain text, and the AI generates 5-10 structured, actionable tasks.
- **Dynamic Kanban Board**: Seamlessly organize your work with a clean, intuitive board interface.
- **Priority Scaling**: The AI contextually assigns priority levels (Low, Medium, High, Critical) to ensure focus on what matters.
- **Smart Categorization**: Tasks are automatically grouped into logical categories like *Design*, *Development*, or *Testing*.
- **Integrated Auth**: Robust user management and access control powered by Supabase Auth.

## 🛠 Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Engine**: Google Generative AI SDK (configurable model)
- **ORM & Database**: [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/) (hosted on Supabase)
- **Security**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.17 or later
- An AI API Key (Google AI Studio or equivalent)
- A Supabase Project (Auth & Database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ViswaSri07/Project-Management-using-AI.git
   cd Project-Management-using-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and populate it with your credentials:
   ```env
   # Database
   DATABASE_URL="your_postgresql_url"
   DIRECT_URL="your_direct_postgresql_url"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   
   # AI
   GOOGLE_API_KEY="your_ai_api_key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## 🏗 Project Structure
- `app/`: Next.js App Router routes, API handlers, and layout definitions.
- `components/`: Shared UI components built with Radix UI and Tailwind.
- `lib/`: Shared utility functions, Prisma client, and Supabase server-side clients.
- `prisma/`: Database schema and migration tracking.

---
*Developed with a focus on streamlined workflows and AI-driven efficiency.*