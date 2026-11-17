# Zempled listening links

## Current behavior

The collection has 19 pairs in `src/features/projects/zempled/sample-pairs.ts`. Each pair is an Ethiopian original, a song that sampled it, a short note, and one source that documents the connection.

- **Page.** Two record sleeves side by side (original on the left, sample on the right), a counter such as `03 / 19`, previous/next buttons, the left and right arrow keys, and Shuffle. Under the records are two fold-out notes: "Behind the sample" (the note and its source) and "About <artist>" (a short background from `artists.ts` with a Learn more link). At the bottom is an index of every pair, grouped by the Ethiopian artist who was sampled.
- **Previews.** The large play button plays a 30-second Deezer preview. Only one side plays at a time, and changing pair stops playback (`use-preview-player.ts`). The preview address is fetched from `/api/zempled/preview` the first time a song is played, because Deezer's addresses expire. The route only accepts track ids that are in the collection.
- **Song links.** Every track links to Deezer. YouTube, Spotify and Apple Music icons appear only when that exact recording was confirmed there, so some tracks show fewer icons. Spotify and Apple Music open the installed apps by default (`spotify:track:<id>` and `musics://music.apple.com/...`); the App / Browser buttons switch them to normal web links. Opening any link pauses the previews. There is no install or login detection.

The portfolio has no Spotify or MusicKit authorization configured. External apps and pages manage their own sessions, subscriptions and availability; a song link does not guarantee automatic playback.

## Adding a pair

1. Find a source that documents the sample (an article, liner notes, an interview). Do not add a pair on the strength of a "sounds like" alone, and never guess.
2. Look both songs up on Deezer and copy the track id, title, artist and album. Save the album cover as `public/projects/zempled/artwork/<track id>.jpg`.
3. Add the pair to `sample-pairs.ts`. Add YouTube, Spotify and Apple Music links only for the exact recording.
4. If the original artist is new, add a short profile to `artists.ts` with a source.
5. Run `npm test`. It fails when a cover file is missing, a pair has no source, or a link points at the wrong service.

Why 19 and not more: the nine pairs added in November 2026 were the ones that could be both sourced and found on Deezer. WhoSampled lists many more Ethiopian samples but blocks automated reading, so more pairs need to be collected by hand from its pages.

## October 11 app handoff review

Yakob clarified that he is signed in inside the installed apps, not the browser. Fresh Chrome checks reached the correct Spotify/Apple song pages but showed sign-in controls and no automatic audio. Confirmed the locally installed Spotify registers `spotify`, and Apple's Music app registers `music`/`musics`, by reading their application metadata. Spotify also documents its URI scheme in [content linking](https://developer.spotify.com/documentation/ios/tutorials/content-linking).

After the app-link change, isolated Chrome checked all 20 recordings in both App and Browser modes, unchanged YouTube links, correct tab targets, a real Deezer preview pausing when a provider icon is activated, keyboard access, light/dark rendering, and 1440/390/320px layouts without overflow or page errors. External app launching was suppressed in that UI check. Lint and the production Webpack build passed.

Separate approved OS handoff checks opened the first song's exact URIs in the installed apps. Spotify selected “Yègellé Tezeta” but reported paused. Music accepted the URI and reported stopped; the selected Apple song was not independently confirmed in its UI. Neither check demonstrated automatic playback. These results must not be reported as successful autoplay or as proof of every device's behavior. Temporary checks are `/private/tmp/zempled-provider-review.cjs` and `/private/tmp/zempled-app-ui-review.cjs`; durable behavior and limitations are recorded here.

## Catalog sources and maintenance

Mappings were researched on October 11, 2026 against public provider metadata, not guessed IDs or automatic first-result matches:

- Spotify's public track/album/playlist embed metadata, including the [OkayAfrica sample playlist](https://open.spotify.com/playlist/0RY7fow9OvrzVhxV9AF0QG), [K'naan source playlist](https://open.spotify.com/playlist/6y311CJZCRlQbqXOKqRUZL), and individual track metadata. All selected track embeds returned playable metadata during lookup; this is not a signed-in playback check or a guarantee for every territory. One unavailable extended release of “As We Enter” was rejected in favor of the 2:27 recording matching the Deezer source.
- Apple's public iTunes song search/lookup catalog. Checked artist, title, album, and stereo/mono distinctions. The Apple URLs include the specific song ID (`i=`), not just the album. Some recordings appear on equivalent reissues/compilations, including J-Live's “Longevity” on The Early Works of J-Live.
- Public YouTube artist/Topic channel results and oEmbed metadata. Preferred official audio and artist uploads. The Gaslamp Killer links use the artist's own videos; the other links use artist/label audio or official videos.

Keep these as static, reviewed content: opening an icon should not require another catalog request, expose an API key, or select an unrelated cover/remix. When a recording moves or becomes unavailable, review its artist, title, release, version, and duration before updating that track's URL. Do not add Spotify/Apple/YouTube API technology badges for outbound links alone.

## Future full-song playback

Spotify playback requires an application, user authorization, Spotify Premium, and an available playback device (or Web Playback SDK). Existing login may simplify authorization but does not replace it. See [Start/Resume Playback](https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback), [Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk), and [authorization](https://developer.spotify.com/documentation/web-api/concepts/authorization). Browser audio restrictions still apply.

Spotify's current [development mode](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) requires the app owner to have Premium and limits access to five allowlisted authenticated users. Broad public access needs extended quota eligibility/approval; do not promise public visitor playback with a development app.

Apple Music full-song playback requires [MusicKit](https://developer.apple.com/musickit/), Apple developer configuration, a signed developer token, listener authorization, and an active subscription. Signing keys must remain server-side. The current CSP deliberately does not allow provider scripts/frames/connections; review precise origins and permissions when implementing either integration. Do not broaden the global policy speculatively.

No account setup, SDK, OAuth flow, embedding, credential storage, or guaranteed autoplay is included in the listening-link changes.
