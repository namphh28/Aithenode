# Aithenode Documentation

Welcome to the Aithenode documentation! This repository contains guides and reference materials to help you understand and extend the Aithenode learning platform.

## About Aithenode

Aithenode is a web-based platform that connects students with educators for personalized learning experiences. The platform allows students to search for educators by category, book sessions, and manage their learning journey.

## Key Technologies

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Express sessions with Passport.js
- **State Management**: React Query and React hooks

## Installation Guide

### Prerequisites
- Node.js and npm installed
- PostgreSQL installed (we recommend PostgreSQL.app for macOS)

### Setup Steps

1. **Start PostgreSQL**:
   - Open PostgreSQL.app from Applications
   - Click "Initialize" to start the server
   - Wait for the green checkmark (✓)

2. **Create Database**:
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/psql -p5432 -d postgres -c "CREATE DATABASE aithenode;"
   ```

3. **Configure Environment**:
   Create a `.env` file in the project root:
   ```
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aithenode
   SESSION_SECRET=your_secret_key_here
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Run Database Migrations**:
   ```bash
   npm run db:push
   ```

6. **Start the Application**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Available Documentation

- [Getting Started Guide](./Getting-Started.md) - Quick setup and orientation for new developers
- [Developer Guide](./Aithenode-Developer-Guide.md) - Comprehensive documentation on the codebase and adding new features

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript checks
- `npm run db:push` - Update database schema

## Contribution Guidelines

If you're making changes to the Aithenode platform, please follow these guidelines:

1. Read the documentation thoroughly before making changes
2. Follow the established code patterns and architectural principles
3. Test your changes thoroughly
4. Update documentation when adding new features

## Troubleshooting

Common issues and solutions:

1. **Database Connection Error**:
   - Ensure PostgreSQL.app is running (green checkmark visible)
   - Verify database credentials in `.env` file
   - Check if database exists

2. **Port Already in Use**:
   - Check if another instance is running on port 5000
   - Kill the existing process or change the port

## Getting Help

If something is unclear or you need additional information, please check the existing codebase for examples or ask senior developers for guidance.

## License

MIT License - see LICENSE file for details 
