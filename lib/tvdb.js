import { parseStringPromise } from 'xml2js';

const TVDB_API_KEY = process.env.TVDB_API_KEY;

const parseXml = (xml) =>
  parseStringPromise(xml, { explicitArray: false, normalizeTags: true });

function seriesSlug(showName) {
  return showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');
}

export async function addShowFromTvdb(showName) {
  const searchResponse = await fetch(
    `http://thetvdb.com/api/GetSeries.php?seriesname=${seriesSlug(showName)}`
  );
  if (!searchResponse.ok) throw new Error('TVDB search request failed');
  const searchResult = await parseXml(await searchResponse.text());
  if (!searchResult?.data?.series) return null;
  const seriesId =
    searchResult.data.series.seriesid || searchResult.data.series[0].seriesid;

  const seriesResponse = await fetch(
    `http://thetvdb.com/api/${TVDB_API_KEY}/series/${seriesId}/all/en.xml`
  );
  if (!seriesResponse.ok) throw new Error('TVDB series request failed');
  const result = await parseXml(await seriesResponse.text());
  const series = result.data.series;
  const rawEpisodes = result.data.episode;
  const episodes = (Array.isArray(rawEpisodes) ? rawEpisodes : [rawEpisodes]).filter(
    Boolean
  );

  const show = {
    _id: Number(series.id),
    name: series.seriesname,
    airsDayOfWeek: series.airs_dayofweek,
    airsTime: series.airs_time,
    firstAired: series.firstaired,
    genre: String(series.genre || '').split('|').filter(Boolean),
    network: series.network,
    overview: series.overview,
    rating: Number(series.rating),
    ratingCount: Number(series.ratingcount),
    status: series.status,
    poster: series.poster,
    episodes: episodes.map((episode) => ({
      season: Number(episode.seasonnumber),
      episodeNumber: Number(episode.episodenumber),
      episodeName: episode.episodename,
      firstAired: episode.firstaired,
      overview: episode.overview,
    })),
  };

  if (show.poster) {
    const posterResponse = await fetch(`http://thetvdb.com/banners/${show.poster}`);
    if (posterResponse.ok) {
      const buffer = Buffer.from(await posterResponse.arrayBuffer());
      show.poster = `data:${posterResponse.headers.get('content-type')};base64,${buffer.toString('base64')}`;
    }
  }

  return show;
}
