import SignInButton from "@/components/sign-in-button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Catalog Maker
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <SignInButton />
      </main>
    </div>
  );
}
