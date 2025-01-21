import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">Bookmark Manager</Link>
        </h1>
        <ul className="flex gap-4">
          <li>
            <Link
              href="/"
              className="hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:underline"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/features"
              className="hover:underline"
            >
              Features
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
