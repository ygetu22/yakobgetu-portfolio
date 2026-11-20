// Downloads a small photo of every artist in the "ethio" playlist, for the music card.
//
//   node scripts/fetch-artist-photos.mjs
//
// For one song per artist it reads Spotify's public embed page to find the artist, then asks
// Spotify's oEmbed endpoint for the artist picture. Photos are saved as 320 px JPEGs in
// public/music/artists/<slug>.jpg, because the site's security policy only allows its own images.
// Run it again after refresh-playlist.mjs if new artists were added.

import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const TRACKS_FILE = new URL("../src/features/music/playlist-tracks.ts", import.meta.url);
const OUTPUT_FOLDER = new URL("../public/music/artists/", import.meta.url);
const PHOTO_SIZE_PX = 320;

// Same rule as artistSlug() in src/features/music/artists.ts: "Teddy Afro" -> "teddy-afro".
// For a shared credit ("Hailu Mergia, Dahlak Band") only the first named artist counts.
function artistSlug(credit) {
  const firstArtist = credit.split(",").map((name) => name.trim()).find((name) => name !== "Various Artists") ?? credit;
  return firstArtist.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.text();
}

async function artistIdForTrack(trackId) {
  const html = await fetchText(`https://open.spotify.com/embed/track/${trackId}`);
  const pageData = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!pageData) throw new Error(`No track data on the embed page of ${trackId}`);
  const track = JSON.parse(pageData[1]).props.pageProps.state.data.entity;
  return track.artists[0].uri.replace("spotify:artist:", "");
}

async function savePhoto(artistId, slug) {
  const oembed = JSON.parse(await fetchText(`https://open.spotify.com/oembed?url=https://open.spotify.com/artist/${artistId}`));
  if (!oembed.thumbnail_url) throw new Error(`No photo for artist ${artistId}`);

  const response = await fetch(oembed.thumbnail_url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`${response.status} for ${oembed.thumbnail_url}`);
  const image = Buffer.from(await response.arrayBuffer());

  await sharp(image)
    .resize(PHOTO_SIZE_PX, PHOTO_SIZE_PX, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toFile(new URL(`${slug}.jpg`, OUTPUT_FOLDER).pathname);
}

const source = await readFile(TRACKS_FILE, "utf8");
const tracks = [...source.matchAll(/\{"id":"([^"]+)","title":"[^"]*","artist":"([^"]+)"/g)].map((match) => ({
  id: match[1],
  artist: match[2],
}));

// One song per artist is enough to find who they are.
const firstTrackBySlug = new Map();
for (const track of tracks) {
  const slug = artistSlug(track.artist);
  if (!firstTrackBySlug.has(slug)) firstTrackBySlug.set(slug, track);
}

await mkdir(OUTPUT_FOLDER, { recursive: true });
for (const [slug, track] of firstTrackBySlug) {
  try {
    await savePhoto(await artistIdForTrack(track.id), slug);
    console.log(`saved ${slug}`);
  } catch (error) {
    console.warn(`skipped ${slug}: ${error.message}`);
  }
}
