import Link from 'next/link';
import { auth } from '@/lib/auth';
import { logout } from '@/lib/actions';

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
          Show<span className="text-indigo-400">Trackr</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/add"
                className="rounded-full bg-indigo-500 px-4 py-1.5 font-semibold text-white transition hover:bg-indigo-400"
              >
                + Add show
              </Link>
              <span className="hidden px-1 text-slate-400 md:inline">{session.user.email}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-white/15 px-4 py-1.5 text-slate-200 transition hover:bg-white/10"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-slate-200 transition hover:bg-white/10"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-indigo-500 px-4 py-1.5 font-semibold text-white transition hover:bg-indigo-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
