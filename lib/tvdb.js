const TVDB_API_BASE = 'https://api4.thetvdb.com/v4';

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

async function tvdbToken() {
  const body = { apikey: process.env.TVDB_API_KEY };
  if (process.env.TVDB_PIN) body.pin = process.env.TVDB_PIN;
  const res = await fetch(`${TVDB_API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`TVDB login failed (HTTP ${res.status})`);
  const json = await res.json();
  const token = json?.data?.token;
  if (!token) throw new Error('TVDB login returned no token');
  return token;
}

async function tvdbGet(path, token) {
  const res = await fetch(`${TVDB_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`TVDB request failed (HTTP ${res.status}): ${path}`);
  return res.json();
}

function airsDayOfWeek(airsDays) {
  if (!airsDays) return null;
  const day = DAY_NAMES.find((name) => airsDays[name]);
  return day ? day.charAt(0).toUpperCase() + day.slice(1) : null;
}

export async function addShowFromTvdb(showName) {
  const token = await tvdbToken();

  const search = await tvdbGet(
    `/search?query=${encodeURIComponent(showName)}&type=series`,
    token
  );
  const results = Array.isArray(search?.data) ? search.data : [];
  const hit = results.find((result) => result.tvdb_id) || results[0];
  if (!hit?.tvdb_id) return null;

  const { data: series } = await tvdbGet(
    `/series/${hit.tvdb_id}/extended?meta=episodes`,
    token
  );
  if (!series) return null;

  const show = {
    _id: Number(series.id),
    name: series.name,
    airsDayOfWeek: airsDayOfWeek(series.airsDays),
    airsTime: series.airsTime || null,
    firstAired: series.firstAired || null,
    genre: (series.genres || []).map((genre) => genre.name).filter(Boolean),
    network: series.originalNetwork?.name || series.latestNetwork?.name || null,
    overview: series.overview || '',
    rating: typeof series.score === 'number' ? series.score : null,
    status: series.status?.name || null,
    poster: series.image || null,
    episodes: (series.episodes || []).map((episode) => ({
      season: Number(episode.seasonNumber),
      episodeNumber: Number(episode.number),
      episodeName: episode.name || '',
      firstAired: episode.aired || null,
      overview: episode.overview || '',
    })),
  };

  if (show.poster) {
    try {
      const posterRes = await fetch(show.poster);
      if (posterRes.ok) {
        const buffer = Buffer.from(await posterRes.arrayBuffer());
        show.poster = `data:${posterRes.headers.get('content-type')};base64,${buffer.toString('base64')}`;
      }
    } catch {
      // keep the remote poster URL
    }
  }

  return show;
}
