import Link from 'next/link';
import { login } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30">
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h1>
      {error && (
        <p className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>
      )}
      {message && (
        <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}
      <form action={login} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-400">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-400">Password</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-indigo-500 py-2.5 font-semibold text-white transition hover:bg-indigo-400"
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-400">
        No account yet?{' '}
        <Link href="/signup" className="text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
