# Zempled listening links

## Current behavior

Each of the 20 tracks in `src/features/projects/zempled/sample-pairs.ts` has saved YouTube, Spotify, and Apple Music song URLs. The platform icons open specific recordings rather than searching. YouTube opens in a new tab. Spotify and Apple Music default to installed apps, using `spotify:track:<id>` and `musics://music.apple.com/...` respectively. `platform-links.tsx` owns those app URL conversions and preserves Apple's song ID. The App / Browser buttons below the players switch those two services back to HTTPS/new-tab links when a visitor lacks the apps or prefers web playback. This choice remains active across sample pairs but resets on a new visit.

The large play button plays the existing 30-second Deezer preview. Opening a platform link pauses both previews and cancels an outstanding preview request so Zempled does not overlap the external player. Native links use ordinary anchors and the OS's registered handlers; the browser may request permission to open an app. There is no install/login detection or timer-based automatic fallback, which could wrongly open the browser after a successful handoff. Visitors can explicitly choose Browser.

The portfolio has no Spotify or MusicKit authorization configured. External apps/pages manage their own sessions, subscriptions, territory availability, and playback. Opening the installed app lets it use its own session; this does not grant the portfolio account access. A song link does not guarantee automatic playback or bypass login. The portfolio cannot read another site's login cookies or use an Apple Music app login as browser authorization.

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
