import Link from "next/link";

// 403: we know who you are, you just are not allowed here.
export default function Unauthorized() {
  return (
    <div className="space-y-2 rounded bg-white p-6">
      <h1 className="text-2xl font-semibold text-red-700">Not allowed</h1>
      <p>You are logged in, but your role cannot open that page.</p>
      <Link href="/dashboard" className="text-blue-700 underline">Back to your dashboard</Link>
    </div>
  );
}
