"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/api-client";
import type { Course } from "@/lib/types";

// The admin's course list, fetched in the browser with the axios client.
// A student who types /courses gets a 403, and the interceptor sends them
// to /unauthorized. The navbar hides the link, the backend enforces it.
export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get<Course[]>("/courses")
      .then((res) => setCourses(res.data))
      .catch(() => {});
  }, []);

  if (!courses) return <p>Loading all courses...</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">All courses (admin)</h1>
      <ul className="space-y-2">
        {courses.map((c) => (
          <li key={c.id} className="flex justify-between rounded bg-white p-3">
            <span><span className="font-mono text-sm text-slate-500">{c.id}</span> {c.title}</span>
            <span className="text-sm text-slate-500">{c.students} {c.students === 1 ? "student" : "students"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
