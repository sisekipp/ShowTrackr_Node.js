import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { addShow } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function AddShowPage({ searchParams }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30">
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Add a show</h1>
      <p className="mt-1 text-sm text-slate-400">
        We fetch the data from TheTVDB and schedule an email alert for every new episode.
      </p>
      {error && (
        <p className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>
      )}
      <form action={addShow} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-400">Show name</span>
          <input
            type="text"
            name="showName"
            required
            placeholder="e.g. Breaking Bad"
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-indigo-500 py-2.5 font-semibold text-white transition hover:bg-indigo-400"
        >
          Add show
        </button>
      </form>
    </div>
  );
}
