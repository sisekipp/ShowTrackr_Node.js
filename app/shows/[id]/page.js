import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Show from '@/lib/models/Show';
import { subscribe, unsubscribe } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function ShowDetailPage({ params }) {
  const { id } = await params;
  await connectDB();
  const show = await Show.findById(Number(id)).lean();
  if (!show) notFound();

  const session = await auth();
  const subscribed = session?.user?.id
    ? show.subscribers.some((subscriber) => subscriber.toString() === session.user.id)
    : false;

  const episodes = [...show.episodes].sort(
    (a, b) => a.season - b.season || a.episodeNumber - b.episodeNumber
  );

  return (
    <div>
      <Link href="/" className="text-sm text-indigo-400 hover:underline">
        ← Back to all shows
      </Link>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row">
        {show.poster && (
          <img
            src={show.poster}
            alt={show.name}
            className="w-48 self-start rounded-2xl ring-1 ring-white/10"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{show.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {show.genre?.map((g) => (
              <Link
                key={g}
                href={`/?genre=${encodeURIComponent(g)}`}
                className="rounded-full bg-white/10 px-3 py-1 text-slate-200 hover:bg-white/20"
              >
                {g}
              </Link>
            ))}
            {show.network && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
                {show.network}
              </span>
            )}
            {show.status && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">{show.status}</span>
            )}
            {typeof show.rating === 'number' && show.rating > 0 && (
              <span className="rounded-full bg-amber-400/20 px-3 py-1 font-semibold text-amber-300">
                ★ {show.rating.toFixed(1)} ({show.ratingCount})
              </span>
            )}
          </div>
          {show.overview && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">{show.overview}</p>
          )}
          {show.airsDayOfWeek && (
            <p className="mt-3 text-sm text-slate-400">
              Airs {show.airsDayOfWeek}
              {show.airsTime ? ` at ${show.airsTime}` : ''}
            </p>
          )}
          {session?.user ? (
            subscribed ? (
              <form action={unsubscribe.bind(null, show._id)} className="mt-5">
                <button
                  type="submit"
                  className="rounded-full border border-rose-400/40 bg-rose-500/10 px-5 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
                >
                  Unsubscribe
                </button>
              </form>
            ) : (
              <form action={subscribe.bind(null, show._id)} className="mt-5">
                <button
                  type="submit"
                  className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Subscribe for episode alerts
                </button>
              </form>
            )
          ) : (
            <p className="mt-5 text-sm text-slate-400">
              <Link href="/login" className="text-indigo-400 hover:underline">
                Log in
              </Link>{' '}
              to get email alerts for new episodes.
            </p>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-white">Episodes</h2>
      {episodes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No episodes available.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
          {episodes.map((episode, index) => (
            <li key={index} className="px-4 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-semibold text-white">
                  S{episode.season}E{episode.episodeNumber} — {episode.episodeName}
                </span>
                {episode.firstAired && (
                  <span className="shrink-0 text-xs text-slate-400">
                    {new Date(episode.firstAired).toLocaleDateString()}
                  </span>
                )}
              </div>
              {episode.overview && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                  {episode.overview}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
