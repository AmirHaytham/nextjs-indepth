export type User = { id: number; name: string; email: string; role: "student" | "admin" };

export type Course = { id: string; title: string; students?: number };
