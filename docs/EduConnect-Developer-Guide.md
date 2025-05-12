# EduConnect Platform Developer Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Core Architecture](#core-architecture)
3. [Key Components](#key-components)
4. [Data Flow](#data-flow)
5. [Adding New Features](#adding-new-features)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

EduConnect is a web-based platform that connects students with educators for personalized learning experiences. This developer guide explains the codebase structure and provides detailed instructions for extending the platform with new features.

## Core Architecture

### Backend Structure
- **server/index.ts**: The main entry point that initializes the Express server
- **server/routes.ts**: Defines all API endpoints for the application
- **server/storage.ts**: Implements data storage and retrieval using an in-memory database
- **server/vite.ts**: Configures Vite for development

### Frontend Structure
- **client/src/App.tsx**: The main React component that handles routing
- **client/src/components/**: Reusable UI components
- **client/src/pages/**: Page components representing different routes
- **client/src/lib/**: Utility functions, types, and configurations

### Shared Resources
- **shared/schema.ts**: Defines the data models and validation schemas using Drizzle ORM and Zod

## Key Components

### Data Model (shared/schema.ts)
This file defines the database schema using Drizzle ORM with tables for:
- Users (both students and educators)
- Educator profiles
- Categories and subjects
- Sessions (bookings)
- Reviews
- Testimonials

Each model has corresponding:
- Select types (for retrieving data)
- Insert types (for creating new records)
- Zod validation schemas

Example:
```typescript
// Table definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  userType: text("user_type").notNull(),
  isVerified: boolean("is_verified").default(false),
});

// Insert schema for validation
export const insertUserSchema = createInsertSchema(users);

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
```

### Storage Layer (server/storage.ts)
The `MemStorage` class implements the `IStorage` interface and provides:
- CRUD operations for all data types
- Relationship management between entities
- Error handling for missing records
- Data filtering and querying capabilities

Example method:
```typescript
async createUser(userData: InsertUser): Promise<User> {
  const id = this.userId++;
  const user: User = { ...userData, id };
  this.users.set(id, user);
  return user;
}
```

### API Routes (server/routes.ts)
This file sets up Express routes for:
- Authentication (sign up, sign in, current user)
- Educator profiles
- Categories and subjects
- Sessions/bookings
- Reviews

Example route:
```typescript
app.get("/api/educator-profiles", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const educators = await storage.getAllEducators(limit);
    res.json(educators);
  } catch (error) {
    console.error("Error fetching educators:", error);
    res.status(500).json({ error: "Failed to fetch educators" });
  }
});
```

### Frontend Components
- **Navbar.tsx**: Navigation bar with authentication state
- **Dashboard.tsx**: User dashboard with tabs for sessions, profile, etc.
- **CategoryCard.tsx/EducatorCard.tsx**: Card components for list displays
- **BookingForm.tsx**: Form for scheduling sessions

## Data Flow

1. **User Interaction**: User interacts with a component in the UI
2. **API Request**: Frontend makes a request to the backend API using React Query
3. **Route Handler**: Express route handles the request
4. **Storage Operation**: Route handler calls storage methods
5. **Data Processing**: Data is processed and returned to the frontend
6. **UI Update**: React components re-render with the updated data

## Adding New Features

### Example: Adding a Student Notes Feature

This step-by-step guide demonstrates how to add a feature allowing students to take notes during or after sessions.

#### Step 1: Update the Data Model
First, add a new table to `shared/schema.ts`:

```typescript
// 1. Define the table structure
export const sessionNotes = pgTable("session_notes", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// 2. Create insert schema
export const insertSessionNoteSchema = createInsertSchema(sessionNotes).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// 3. Define types
export type SessionNote = typeof sessionNotes.$inferSelect;
export type InsertSessionNote = z.infer<typeof insertSessionNoteSchema>;
```

#### Step 2: Update the Storage Interface
Add methods to the `IStorage` interface in `server/storage.ts`:

```typescript
export interface IStorage {
  // ... existing methods

  // Session notes operations
  getSessionNote(id: number): Promise<SessionNote | undefined>;
  getSessionNotesBySession(sessionId: number): Promise<SessionNote[]>;
  getSessionNotesByStudent(studentId: number): Promise<SessionNote[]>;
  createSessionNote(note: InsertSessionNote): Promise<SessionNote>;
  updateSessionNote(id: number, content: string): Promise<SessionNote>;
  deleteSessionNote(id: number): Promise<void>;
}
```

#### Step 3: Implement Storage Methods
Implement these methods in the `MemStorage` class:

```typescript
export class MemStorage implements IStorage {
  private sessionNotes: Map<number, SessionNote>;
  private sessionNoteId: number;

  constructor() {
    // ...existing initialization
    this.sessionNotes = new Map();
    this.sessionNoteId = 1;
  }

  // New methods
  async getSessionNote(id: number): Promise<SessionNote | undefined> {
    return this.sessionNotes.get(id);
  }

  async getSessionNotesBySession(sessionId: number): Promise<SessionNote[]> {
    return Array.from(this.sessionNotes.values())
      .filter(note => note.sessionId === sessionId);
  }

  async getSessionNotesByStudent(studentId: number): Promise<SessionNote[]> {
    return Array.from(this.sessionNotes.values())
      .filter(note => note.studentId === studentId);
  }

  async createSessionNote(noteData: InsertSessionNote): Promise<SessionNote> {
    const id = this.sessionNoteId++;
    const now = new Date();
    
    const note: SessionNote = {
      ...noteData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.sessionNotes.set(id, note);
    return note;
  }

  async updateSessionNote(id: number, content: string): Promise<SessionNote> {
    const note = await this.getSessionNote(id);
    if (!note) throw new Error(`Session note not found: ${id}`);
    
    const updatedNote = {
      ...note,
      content,
      updatedAt: new Date()
    };
    
    this.sessionNotes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteSessionNote(id: number): Promise<void> {
    const exists = this.sessionNotes.has(id);
    if (!exists) throw new Error(`Session note not found: ${id}`);
    
    this.sessionNotes.delete(id);
  }
}
```

#### Step 4: Add API Routes
Add new endpoints in `server/routes.ts`:

```typescript
// Inside registerRoutes function
// Session notes routes
app.get("/api/sessions/:sessionId/notes", requireAuth, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const notes = await storage.getSessionNotesBySession(sessionId);
    res.json(notes);
  } catch (error) {
    console.error("Error fetching session notes:", error);
    res.status(500).json({ error: "Failed to fetch session notes" });
  }
});

app.post("/api/sessions/:sessionId/notes", requireAuth, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const studentId = req.user?.id;
    
    if (!studentId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const noteData = {
      sessionId,
      studentId,
      content: req.body.content
    };
    
    const result = await storage.createSessionNote(noteData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating session note:", error);
    res.status(500).json({ error: "Failed to create session note" });
  }
});

app.put("/api/session-notes/:id", requireAuth, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const content = req.body.content;
    
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
    
    const result = await storage.updateSessionNote(noteId, content);
    res.json(result);
  } catch (error) {
    console.error("Error updating session note:", error);
    res.status(500).json({ error: "Failed to update session note" });
  }
});

app.delete("/api/session-notes/:id", requireAuth, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    await storage.deleteSessionNote(noteId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting session note:", error);
    res.status(500).json({ error: "Failed to delete session note" });
  }
});
```

#### Step 5: Update Frontend Types
Add the new type to `client/src/lib/types.ts`:

```typescript
export interface SessionNote {
  id: number;
  sessionId: number;
  studentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Step 6: Create Frontend Components
Create a new component for the notes feature:

```tsx
// client/src/components/SessionNotes.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SessionNote } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define form schema
const noteSchema = z.object({
  content: z.string().min(1, { message: "Note content is required" }),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface SessionNotesProps {
  sessionId: number;
}

const SessionNotes = ({ sessionId }: SessionNotesProps) => {
  const { toast } = useToast();
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  
  // Fetch notes for this session
  const { data: notes, isLoading } = useQuery<SessionNote[]>({
    queryKey: [`/api/sessions/${sessionId}/notes`],
  });
  
  // Create new note mutation
  const createNote = useMutation({
    mutationFn: async (data: { content: string }) => {
      return apiRequest("POST", `/api/sessions/${sessionId}/notes`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sessions/${sessionId}/notes`] });
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
      form.reset({ content: "" });
    }
  });
  
  // Update note mutation
  const updateNote = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      return apiRequest("PUT", `/api/session-notes/${id}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sessions/${sessionId}/notes`] });
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
      setEditingNoteId(null);
      form.reset({ content: "" });
    }
  });
  
  // Delete note mutation
  const deleteNote = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/session-notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sessions/${sessionId}/notes`] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    }
  });
  
  // Initialize form
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });
  
  // Set form values when editing
  useEffect(() => {
    if (editingNoteId && notes) {
      const note = notes.find(n => n.id === editingNoteId);
      if (note) {
        form.reset({ content: note.content });
      }
    }
  }, [editingNoteId, notes, form]);
  
  // Handle form submission
  const onSubmit = (data: NoteFormValues) => {
    if (editingNoteId) {
      updateNote.mutate({ id: editingNoteId, content: data.content });
    } else {
      createNote.mutate(data);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add a note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your notes here..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              {editingNoteId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingNoteId(null);
                    form.reset({ content: "" });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={createNote.isPending || updateNote.isPending}>
                {editingNoteId ? "Update Note" : "Add Note"}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Your Notes</h3>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ) : notes && notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNoteId(note.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => deleteNote.mutate(note.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No notes yet. Add your first note above.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionNotes;
```

#### Step 7: Integrate into existing pages
Add the SessionNotes component to the SessionDetails page:

```tsx
// Add to client/src/pages/SessionDetails.tsx
import SessionNotes from "@/components/SessionNotes";

// Then in the component's render function where appropriate:
{isStudent && session.status === "completed" && (
  <div className="mt-8">
    <SessionNotes sessionId={session.id} />
  </div>
)}
```

If the SessionDetails page doesn't exist, you may need to create it and add it to the router in App.tsx:

```tsx
// In App.tsx router
<Route path="/sessions/:id">
  <SessionDetails />
</Route>
```

## Best Practices

### Backend Development
1. **Consistent error handling**: Always catch errors and return appropriate status codes
2. **Data validation**: Use Zod schemas to validate all incoming data
3. **Authentication checks**: Use `requireAuth` middleware for protected endpoints
4. **Separation of concerns**: Keep route handlers thin; move business logic to service functions

### Frontend Development
1. **Use React Query for data fetching**: Leverage caching and automatic revalidation
2. **Form validation with Zod**: Use the same schemas as the backend when possible
3. **Error state handling**: Always account for loading, error, and empty states
4. **Component composition**: Break complex UI into smaller, reusable components
5. **Type safety**: Leverage TypeScript to catch errors at compile-time

### State Management
1. **React Query for server state**: Use for data from the backend
2. **React state for UI state**: Use for component-level state
3. **Context for shared state**: Use for authentication state or theme

## Troubleshooting

### Common Issues and Solutions

#### 1. API Requests Failing
- Check network tab for response details
- Verify endpoint is correctly implemented
- Ensure authentication state is valid
- Check request payload format

#### 2. Components Not Rendering
- Check for React key prop warnings
- Verify data is being passed correctly
- Check for conditional rendering issues
- Look for null or undefined values

#### 3. Type Errors
- Ensure types are correctly defined
- Check for missing properties
- Verify optional properties are handled

#### 4. React Query Issues
- Verify query keys are consistent
- Check that mutations invalidate the correct queries
- Ensure query options are correct

### Development Tips
1. Use console.log to debug API requests and responses
2. Check the React DevTools to inspect component props and state
3. Use the Network tab to monitor API requests
4. Review terminal logs for backend errors