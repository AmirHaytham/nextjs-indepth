"use client";

import { useState } from "react";
import axiosInstance from "@/lib/api-client";
import type { Course } from "@/lib/types";

// A request from the browser, through the axios client and its interceptor.
// Wait for the token to expire (60 seconds), then click: the interceptor sees
// the 401 and sends you to /login.
export function CheckAgain({ userId }: { userId: number }) {
  const [courses, setCourses] = useState<Course[] | null>(null);

  async function load() {
    const res = await axiosInstance.get<Course[]>(`/students/${userId}/courses`);
    setCourses(res.data);
  }

  return (
    <div className="space-y-2 rounded bg-white p-3">
      <button onClick={() => load().catch(() => {})} className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
        Load my courses from the browser
      </button>
      {courses && (
        <ul className="list-disc pl-5 text-sm">
          {courses.map((c) => <li key={c.id}>{c.id}: {c.title}</li>)}
        </ul>
      )}
    </div>
  );
}
