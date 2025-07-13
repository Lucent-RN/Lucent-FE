# Lucent - Pomodoro Focus Timer

<div align="center">
  <img src="https://github.com/PromptKits/.github/blob/main/profile/resources/logo.png" alt="Lucent Logo" width="300"/>
  
  <p>A beautiful and intuitive Pomodoro timer web application designed to boost your productivity and focus with progress tracking and insightful statistics.</p>

  <div>
    <img src="https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/-React-000000?style=flat&logo=react" alt="React"/>
    <img src="https://img.shields.io/badge/-TypeScript-000000?style=flat&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/-Tailwind_CSS-000000?style=flat&logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/-Shadcn_UI-000000?style=flat&logo=shadcn" alt="Shadcn UI"/>
  </div>
</div>

## 📋 Table of Contents

- [Lucent - Pomodoro Focus Timer](#lucent---pomodoro-focus-timer)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Overview](#-overview)
  - [✨ Key Features](#-key-features)
    - [⏱️ Pomodoro Timer](#️-pomodoro-timer)
    - [📊 Focus Statistics](#-focus-statistics)
    - [🎯 Progress Tracking](#-progress-tracking)
    - [🔔 Smart Notifications](#-smart-notifications)
    - [🌙 Dark Mode](#-dark-mode)
  - [🛠️ Technical Stack](#️-technical-stack)
    - [Frontend](#frontend)
    - [Development Tools](#development-tools)
  - [💎 Subscription Tiers](#-subscription-tiers)
    - [Free Tier](#free-tier)
    - [Pro Tier](#pro-tier)
  - [🚀 Getting Started](#-getting-started)
  - [⚙️ Environment Variables](#️-environment-variables)
  - [📁 Project Structure](#-project-structure)
  - [🔧 Development](#-development)
  - [📞 Support](#-support)
  - [📄 License](#-license)

## 🚀 Overview

Lucent is a modern Pomodoro timer web application that helps you stay focused and productive. Built with the Pomodoro Technique in mind, it combines beautiful design with powerful features to track your focus sessions and provide meaningful insights into your productivity patterns.

## ✨ Key Features

### ⏱️ Pomodoro Timer

- **Classic Pomodoro Technique**: 25-minute work sessions with 5-minute breaks
- **Customizable Intervals**: Adjust work and break durations to fit your workflow
- **Long Break Support**: 15-minute breaks after 4 completed sessions
- **Auto-start**: Seamlessly transition between work and break periods
- **Pause & Resume**: Full control over your timer sessions

### 📊 Focus Statistics

- **Daily Progress**: Track completed Pomodoros and total focus time
- **Weekly Overview**: Visual charts showing your productivity trends
- **Monthly Reports**: Comprehensive analysis of your focus patterns
- **Goal Setting**: Set daily/weekly Pomodoro targets
- **Achievement Badges**: Unlock rewards for consistent focus

### 🎯 Progress Tracking

- **Session History**: Complete log of all your focus sessions
- **Task Association**: Link Pomodoros to specific tasks or projects
- **Productivity Score**: AI-powered insights on your focus quality
- **Streak Counter**: Track consecutive days of focused work
- **Export Data**: Download your statistics for external analysis

### 🔔 Smart Notifications

- **Session Alerts**: Gentle reminders when work/break periods end
- **Daily Goals**: Motivational notifications to maintain consistency
- **Achievement Celebrations**: Celebrate milestones and streaks
- **Focus Reminders**: Gentle nudges to start your next session

### 🌙 Dark Mode

- **Beautiful UI**: Clean, modern interface with smooth animations
- **Dark/Light Themes**: Choose your preferred visual experience
- **Accessibility**: High contrast modes and screen reader support
- **Responsive Design**: Optimized for all device sizes

## 🛠️ Technical Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

### Development Tools

- **Package Manager**: Bun
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Commit Standards**: Commitlint with conventional commits
- **Type Checking**: TypeScript

## 💎 Subscription Tiers

### Free Tier

- Basic Pomodoro timer functionality
- Daily statistics tracking
- Standard notification features
- Basic progress insights

### Pro Tier

- Advanced analytics and reporting
- Custom timer intervals
- Task categorization and project tracking
- Data export capabilities
- Priority support
- Ad-free experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lucent-fe
   ```

2. **Install dependencies**

   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**

   ```bash
   # Using Bun
   bun run dev

   # Or using npm
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Code Quality
bun run lint         # Run ESLint
bun run format       # Check Prettier formatting
bun run format:fix   # Fix Prettier formatting

# Git Hooks
bun run prepare      # Setup Husky hooks
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Lucent
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (if using)
NEXT_PUBLIC_AUTH_PROVIDER=clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 📁 Project Structure

```
lucent-fe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Shared components
│   │   └── index.ts
│   ├── config/                 # App configuration
│   │   └── index.ts
│   ├── constants/              # App constants
│   │   └── index.ts
│   ├── context/                # React contexts
│   │   └── index.ts
│   ├── features/               # Feature-based modules
│   │   └── index.ts
│   ├── hooks/                  # Custom React hooks
│   │   └── index.ts
│   ├── layouts/                # Layout components
│   │   └── index.ts
│   ├── lib/                    # Core utilities
│   │   └── utils.ts
│   ├── middleware/             # Next.js middleware
│   │   └── index.ts
│   ├── services/               # API services
│   │   └── index.ts
│   ├── store/                  # State management
│   │   └── index.ts
│   ├── styles/                 # Additional styles
│   │   └── index.ts
│   └── utils/                  # Utility functions
│       └── index.ts
├── public/                     # Static assets
├── .husky/                     # Git hooks
├── commitlint.config.ts        # Commit linting rules
├── eslint.config.mjs           # ESLint configuration
├── lint-staged.config.js       # Lint-staged configuration
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔧 Development

### Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files
- **commitlint**: Enforce conventional commit messages

### Git Workflow

1. **Branch Naming**: Use conventional branch names

   - `feature/your-feature-name`
   - `bugfix/your-bug-fix`
   - `hotfix/urgent-fix`

2. **Commit Messages**: Follow conventional commits

   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`
   - `style: format code`
   - `refactor: improve code structure`

3. **Pre-commit Checks**: Automatic linting and formatting

### Adding New Features

1. Create a feature branch
2. Implement your feature
3. Add tests if applicable
4. Run linting and formatting
5. Commit with conventional message
6. Create a pull request

## 📞 Support

For support, email [support@lucent.app](mailto:support@lucent.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the Lucent Team</sub>
</div>
