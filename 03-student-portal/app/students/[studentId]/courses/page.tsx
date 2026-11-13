import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import apiserver from "@/lib/api-server";
import type { Course } from "@/lib/types";

// Slide 019: a Server Component fetching with apiserver().
export default function StudentCoursesPage({ params }: PageProps<"/students/[studentId]/courses">) {
  return (
    <Suspense fallback={<p>Loading courses...</p>}>
      <Courses params={params} />
    </Suspense>
  );
}

async function Courses({ params }: Pick<PageProps<"/students/[studentId]/courses">, "params">) {
  const { studentId } = await params;
  const axiosInstance = await apiserver();

  let courses: Course[] = [];
  try {
    const response = await axiosInstance.get<Course[]>(`/students/${studentId}/courses`);
    courses = response.data;
  } catch (error) {
    // The interceptor lives in the browser instance, so the server handles its own errors.
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401) redirect("/login?expired=1");
    if (status === 403) redirect("/unauthorized");
    throw error;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Courses of student {studentId}</h1>
      <ul className="space-y-2">
        {courses.map((c) => (
          <li key={c.id} className="rounded bg-white p-3">
            <span className="font-mono text-sm text-slate-500">{c.id}</span> {c.title}
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-500">Rendered on the server with apiserver().</p>
    </div>
  );
}
