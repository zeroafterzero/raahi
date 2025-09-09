# Overview

This is a comprehensive Pomodoro Focus Mode feature built with React, TypeScript, and modern web technologies. The application provides a complete productivity timer system with focus sessions, break intervals, analytics, and data export capabilities. It's designed as a standalone feature that can be integrated into the larger Capella Pro productivity suite.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **Component Structure**: Modular component design with dedicated focus mode components
- **State Management**: Custom React hooks for Pomodoro timer logic with localStorage persistence
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI components with custom Tailwind styling
- **Data Fetching**: TanStack Query for server state management and caching

**Key Components**:
- `ProgressRing`: Animated circular timer with visual progress indicator
- `Controls`: Timer controls with keyboard shortcuts (spacebar, 'r', 's')
- `StatsPanel`: Real-time statistics display for daily focus metrics
- `AnalogClock` & `DigitalTimeGreeting`: Time display with glassmorphic styling
- `GraphCard`: SVG-based weekly focus visualization
- `ReportsCard`: Data export functionality (CSV/PDF)

**State Management Pattern**: 
- Custom `usePomodoro` hook implements timer state machine
- localStorage persistence for session continuity across browser restarts
- Three session types: focus (25min), short break (5min), long break (15min)

## Backend Architecture

**Server Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for focus session management
- **Session Management**: CRUD operations for focus session tracking
- **Data Export**: PDF and CSV generation for analytics reports

**API Endpoints**:
- `POST /api/focus/start` - Initialize new focus session
- `POST /api/focus/end` - Complete focus session with actual duration
- `GET /api/focus/stats` - Retrieve user statistics (daily/weekly/monthly)
- `POST /api/focus/export` - Generate and download reports

**Architecture Decision**: Modular storage interface allows switching between in-memory storage (development) and Firebase (production) without changing business logic.

## Data Storage Solutions

**Database Schema** (Drizzle ORM with PostgreSQL):
- **users**: Basic user authentication and profile data
- **focus_sessions**: Comprehensive session tracking with requested vs actual duration, completion status, and timestamps

**Storage Strategy**: 
- Development: In-memory storage with full interface compatibility
- Production: PostgreSQL via Drizzle ORM with migration support
- Optional Firebase integration for real-time features

**Data Models**:
- Focus sessions track both intended and actual duration for analytics
- Session types (focus/break) and completion status for streak calculations
- Timestamps for detailed reporting and trend analysis

## External Dependencies

**Core Technologies**:
- **React 18+**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Vite**: Fast development server and optimized builds

**UI and Styling**:
- **Radix UI**: Accessible headless UI components
- **Lucide React**: Consistent icon system
- **Custom CSS**: Glassmorphic effects and Capella brand theming

**Data and API**:
- **TanStack Query**: Intelligent caching and background refetching
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Zod**: Runtime validation for API requests and responses

**Development Tools**:
- **ESBuild**: Fast TypeScript compilation
- **PostCSS**: CSS processing with Tailwind
- **Replit Integration**: Development environment optimizations

**Optional Integrations**:
- **Firebase**: Real-time database and authentication (configurable)
- **PDF Generation**: Server-side report creation
- **Email Services**: Automated focus summaries (planned)

The architecture emphasizes modularity and type safety, making it easy to integrate into existing systems while maintaining independent functionality for development and testing.