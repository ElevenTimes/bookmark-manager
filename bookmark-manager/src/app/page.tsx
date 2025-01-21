export default function Home() {
  return (
    <div className="grid min-h-screen p-8 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Welcome to Bookmark Manager</h1>
        <p className="text-lg text-center">
          Start building your project here.
        </p>
        <div className="bookmark-holder"></div>
      </main>
    </div>
  );
}

