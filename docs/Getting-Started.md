# Aithenode: Getting Started Guide

This guide will help you set up the Aithenode project locally and understand how to navigate the codebase.

## Quick Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd aithenode
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This will start both the frontend and backend in development mode.

4. **Access the Application**
   The application will be available at http://localhost:5000

## Project Structure

Aithenode is a full-stack TypeScript application with:

- **Frontend**: React, Wouter (routing), React Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js REST API
- **Storage**: In-memory database (configured through MemStorage)
- **Shared**: Types and schemas shared between frontend and backend

### Key Directories

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities, types, and configurations
│   │   ├── pages/           # Page components (routes)
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
│
├── server/                  # Backend Express application
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Data storage implementation
│   └── vite.ts              # Vite configuration
│
├── shared/                  # Shared code between frontend and backend
│   └── schema.ts            # Database schema and types
│
└── docs/                    # Documentation
    ├── Getting-Started.md   # This file
    └── Aithenode-Developer-Guide.md  # Comprehensive guide
```

## Authentication

The application includes a simple authentication system:

- **Sign Up**: Create a new user account (student or educator)
- **Sign In**: Log in with email and password
- **Authentication State**: Managed via Express session and accessed with React Query

Default test accounts:
- Student: `student@example.com` / `password123`
- Educator: `educator@example.com` / `password123`

## Main Features

1. **User Authentication**: Sign up, sign in, and session management
2. **Educator Profiles**: View educator profiles with details, subjects, and reviews
3. **Category Browsing**: Browse educators by category
4. **Session Booking**: Book learning sessions with educators
5. **Dashboard**: Manage sessions, educator profile, and account settings

## Development Workflow

1. **Making Changes**:
   - Frontend changes in `/client` directory
   - Backend changes in `/server` directory
   - Shared type definitions in `/shared` directory

2. **Adding New Features**:
   See the comprehensive [Developer Guide](./Aithenode-Developer-Guide.md) for detailed instructions on adding new features.

3. **Testing**:
   - Manual testing by running the application
   - Check console for errors

## Useful Commands

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally

## Getting Help

If you need more detailed information:
- Consult the [Developer Guide](./Aithenode-Developer-Guide.md)
- Check the codebase for examples of similar features
- Look at the type definitions for understanding data structures