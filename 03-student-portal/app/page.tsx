const accounts = [
  ["ahmed@giu-uni.de", "student123", "student"],
  ["mona@giu-uni.de", "student123", "student"],
  ["nada@giu-uni.de", "admin123", "admin"],
];

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Student Portal</h1>
      <p>Slide 004&apos;s student management system. Start the backend (folder 01) first.</p>
      <table className="w-full rounded bg-white text-sm">
        <tbody>
          {accounts.map(([email, password, role]) => (
            <tr key={email} className="border-b">
              <td className="p-2 font-mono">{email}</td>
              <td className="p-2 font-mono">{password}</td>
              <td className="p-2">{role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-slate-600">
        Logins last 60 seconds on purpose. Stay on the dashboard for a minute, then click anything.
      </p>
    </div>
  );
}
