import { ThemedBox, ThemedButton, ThemedTitle } from "../components/themed";

// A Server Component. It never touches the theme itself, it only places
// the Client Components that read it. No props are passed down.
export default function ContextPage() {
  return (
    <div className="space-y-3">
      <ThemedTitle />
      <ThemedBox>
        <Level name="Dashboard (knows nothing about the theme)">
          <Level name="Sidebar (knows nothing about the theme)">
            <ThemedButton />
          </Level>
        </Level>
      </ThemedBox>
    </div>
  );
}

function Level({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded border border-dashed border-current p-3">
      <p className="text-xs text-slate-500">{name}</p>
      {children}
    </div>
  );
}
