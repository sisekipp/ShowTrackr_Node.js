import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Show from '@/lib/models/Show';

export const dynamic = 'force-dynamic';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function pill(active) {
  return (
    'flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition ' +
    (active
      ? 'bg-indigo-500 text-white'
      : 'border border-white/10 text-slate-300 hover:bg-white/10')
  );
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const genre = params.genre || '';
  const alphabet = params.alphabet || '';

  await connectDB();
  const query = Show.find();
  if (genre) query.where({ genre });
  else if (alphabet) query.where({ name: new RegExp('^[' + alphabet + ']', 'i') });
  else query.limit(12);
  const shows = await query.lean();
  const genres = (await Show.distinct('genre')).sort();

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Track your <span className="text-indigo-400">favorite shows</span>
        </h1>
        <p className="mt-3 max-w-xl text-slate-400">
          Add shows, subscribe, and get an email alert shortly before a new episode airs.
        </p>
      </section>

      <section className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1">
          <Link href="/" className={pill(!genre && !alphabet)}>
            All
          </Link>
          {LETTERS.map((letter) => (
            <Link key={letter} href={`/?alphabet=${letter}`} className={pill(alphabet === letter)}>
              {letter}
            </Link>
          ))}
        </div>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-white/10">
            {genre || 'Genre ▾'}
          </summary>
          <div className="absolute right-0 z-10 mt-2 max-h-64 w-48 overflow-auto rounded-xl border border-white/10 bg-slate-900 p-1.5 shadow-xl shadow-black/50">
            <Link
              href="/"
              className="block rounded-lg px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
            >
              All genres
            </Link>
            {genres.map((g) => (
              <Link
                key={g}
                href={`/?genre=${encodeURIComponent(g)}`}
                className="block rounded-lg px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
              >
                {g}
              </Link>
            ))}
          </div>
        </details>
      </section>

      {shows.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          No shows found.{' '}
          <Link href="/add" className="text-indigo-400 hover:underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {shows.map((show) => (
            <Link key={show._id} href={`/shows/${show._id}`} className="group">
              <div className="overflow-hidden rounded-xl ring-1 ring-white/10 transition duration-200 group-hover:scale-[1.03] group-hover:ring-indigo-400/50">
                {show.poster ? (
                  <img
                    src={show.poster}
                    alt={show.name}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-slate-800 text-4xl font-extrabold text-white/80">
                    {show.name?.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="mt-2 truncate text-sm font-semibold text-white">{show.name}</h2>
              <p className="truncate text-xs text-slate-400">
                {show.network}
                {typeof show.rating === 'number' && show.rating > 0
                  ? ` · ★ ${show.rating.toFixed(1)}`
                  : ''}
              </p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
