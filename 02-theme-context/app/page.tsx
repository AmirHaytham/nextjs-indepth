export default function Home() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Prop drilling vs Context</h1>
      <p>The same page, three components deep, built two ways.</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <a href="/drilling" className="text-blue-700 underline">/drilling</a>: the theme is passed down as
          a prop through every level, even the ones that never use it.
        </li>
        <li>
          <a href="/context" className="text-blue-700 underline">/context</a>: only the component that needs
          the theme asks for it, with useTheme().
        </li>
      </ul>
    </div>
  );
}
