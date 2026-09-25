<div align="center">

# ⚡ GitPulse — GitHub Developer & Repo Analytics

**A high-performance GitHub profile analyzer and repository intelligence dashboard.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live Demo](#-live-demo) • [Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment)

</div>

---

## 🌟 Overview

**GitPulse** provides instant, deep visual analytics on any public GitHub profile. Simply enter a GitHub username to visualize language usage, calculate aggregate star and fork counts, inspect repository topics, filter/sort projects, and export custom Markdown snippets for your own GitHub Profile README.

---

## 🚀 Key Features

- **⚡ Real-time GitHub REST API Integration**: Queries users and repositories without requiring authentication.
- **📊 Aggregate Developer Metrics**:
  - Total stars earned across all public repositories.
  - Total forks and community contributions.
  - Primary language detection and average stars per repository.
- **🎨 Interactive Language Distribution**:
  - Segmented visual progress bar reflecting exact language composition.
  - Color-coded language badges matched to GitHub's Linguist specs.
- **🔎 Repository Explorer & Filtering**:
  - Real-time client-side search across repo names, descriptions, and languages.
  - Multi-criteria sorting: *Most Stars*, *Most Forks*, *Recently Pushed*, and *Alphabetical*.
  - Toggle between all repos and original source repos (filtering out forks).
- **📋 One-Click Git Clone**: Instant clipboard copy of `git clone <url>` commands.
- **📄 Profile README Generator**: One-click modal to copy a formatted Markdown summary card to paste directly into personal GitHub profile repositories (`username/username`).
- **🔗 Shareable Profile URLs**: Dynamic URL query parameter support (`?username=...`) allowing direct profile links.
- **🌙 Modern Dark UI**: Designed with glassmorphism, glowing gradients, and responsive layouts.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Data Source:** [GitHub REST API v3](https://docs.github.com/en/rest)
- **Deployment Ready:** [Vercel](https://vercel.com/)

---

## 💻 Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.17+ or LTS) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/gitpulse.git
cd gitpulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start exploring!

### 4. Build for production
```bash
npm run build
```

---

## 🌐 Deployment

The easiest way to deploy GitPulse is using the **Vercel Platform**:

1. Push this repository to your GitHub account.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `gitpulse` repository.
4. Click **Deploy**. Vercel will automatically detect Next.js and deploy your live site with a free `.vercel.app` URL!

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
