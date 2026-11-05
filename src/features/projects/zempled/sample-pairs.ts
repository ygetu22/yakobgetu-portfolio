export type Track = {
  id: number;
  artist: string;
  title: string;
  album: string;
  cover: string;
  deezer: string;
  youtube: string;
  spotify: string;
  appleMusic: string;
};
export type SamplePair = { id: string; original: Track; sampled: Track; note: string; source: { label: string; url: string } };

export const samplePairs: SamplePair[] = [
  {
    "id": "yegelle",
    "original": {
      "id": 3313948541,
      "artist": "Mulatu Astatke",
      "title": "Yègellé Tezeta",
      "album": "Ethiopian Modern Instrumentals Hits",
      "cover": "/projects/zempled/artwork/3313948541.jpg",
      "deezer": "https://www.deezer.com/track/3313948541",
      "youtube": "https://www.youtube.com/watch?v=TDfadvkNfIg",
      "spotify": "https://open.spotify.com/track/0fxjsll9jmmRgMFbwdp4Xg",
      "appleMusic": "https://music.apple.com/us/album/y%C3%A8gell%C3%A9-tezeta/1807098908?i=1807099299"
    },
    "sampled": {
      "id": 916387672,
      "artist": "Nas & Damian Marley",
      "title": "As We Enter",
      "album": "Distant Relatives",
      "cover": "/projects/zempled/artwork/916387672.jpg",
      "deezer": "https://www.deezer.com/track/916387672",
      "youtube": "https://www.youtube.com/watch?v=NmplwgfrH2A",
      "spotify": "https://open.spotify.com/track/6gSAiLNiRUJeeC0YKbG4QB",
      "appleMusic": "https://music.apple.com/us/album/as-we-enter/1442838851?i=1442838868"
    },
    "note": "Nas and Damian Marley build “As We Enter,” from their 2010 album Distant Relatives, around Mulatu’s “Yègellé Tezeta.” The bass line and upper-register melodies carry into the new recording: a clear example of an Ethio-jazz instrumental becoming the foundation for a hip-hop and reggae collaboration.",
    "source": {
      "label": "OkayAfrica",
      "url": "https://www.okayafrica.com/6-samples-from-ethiopiques-in-hip-hop/245275"
    }
  },
  {
    "id": "asylum",
    "original": {
      "id": 219203,
      "artist": "Alemayehu Eshete",
      "title": "Gubelyé",
      "album": "Ethiopiques, Vol. 22 : More Vintage 1972-1974 (More Vintage!)",
      "cover": "/projects/zempled/artwork/219203.jpg",
      "deezer": "https://www.deezer.com/track/219203",
      "youtube": "https://www.youtube.com/watch?v=D3RwvuCC6UE",
      "spotify": "https://open.spotify.com/track/46xcz6NjDcM5JLEy2s2OVJ",
      "appleMusic": "https://music.apple.com/us/album/gubely%C3%A9/264843659?i=264843984"
    },
    "sampled": {
      "id": 2934868331,
      "artist": "billy woods",
      "title": "Asylum",
      "album": "Aethiopes",
      "cover": "/projects/zempled/artwork/2934868331.jpg",
      "deezer": "https://www.deezer.com/track/2934868331",
      "youtube": "https://www.youtube.com/watch?v=8KcI1lp90GA",
      "spotify": "https://open.spotify.com/track/1x1madOc1HajmqGA50fkTR",
      "appleMusic": "https://music.apple.com/us/album/asylum/1761260010?i=1761260018"
    },
    "note": "Preservation draws on Alemayehu Eshete’s “Gubelyé” for the opening track of billy woods’ 2022 album Aethiopes. Listen for the piano: the original pairs its running phrases with Amharic vocals and horns. In “Asylum,” that Ethiopian recording becomes part of the setting for woods’ story of exile and uneasy safety.",
    "source": {
      "label": "Rayli Dornan · Anthós",
      "url": "https://pdxscholar.library.pdx.edu/anthos/vol13/iss1/4/"
    }
  },
  {
    "id": "dreamer",
    "original": {
      "id": 224760,
      "artist": "Alemayehu Eshete",
      "title": "Tey gedyeleshem",
      "album": "Ethiopiques, Vol. 3: Golden Years 1969-1975",
      "cover": "/projects/zempled/artwork/224760.jpg",
      "deezer": "https://www.deezer.com/track/224760",
      "youtube": "https://www.youtube.com/watch?v=IpfGLeosn28",
      "spotify": "https://open.spotify.com/track/2quY1GzrheQXwi8W3Oqj7N",
      "appleMusic": "https://music.apple.com/us/album/tey-gedyeleshem/78924397?i=78924280"
    },
    "sampled": {
      "id": 2918826,
      "artist": "K’naan",
      "title": "Dreamer",
      "album": "Troubadour",
      "cover": "/projects/zempled/artwork/2918826.jpg",
      "deezer": "https://www.deezer.com/track/2918826",
      "youtube": "https://www.youtube.com/watch?v=4fRF6Cby824",
      "spotify": "https://open.spotify.com/track/7uF1lD5NEh7E0w8DQ56fBM",
      "appleMusic": "https://music.apple.com/us/album/dreamer/1443296809?i=1443296818"
    },
    "note": "“Dreamer,” from K’naan’s 2009 album Troubadour, samples Alemayehu Eshete’s “Tey Gedyeleshem.” Eshete is named in the album’s sample credits; his recording is collected on Éthiopiques, Vol. 3: Golden Years 1969–1975. It is one of several Ethiopian sources on Troubadour, alongside recordings by Mulatu Astatke, Tilahun Gessesse, and Getatchew Mekurya.",
    "source": {
      "label": "Troubadour sample credits",
      "url": "https://en.wikipedia.org/wiki/Troubadour_(K%27naan_album)"
    }
  },
  {
    "id": "somalia",
    "original": {
      "id": 225082,
      "artist": "Tilahun Gessesse",
      "title": "Yene Mastawesha",
      "album": "Ethiopiques, Vol. 17: Tlahoun Gèssèssè",
      "cover": "/projects/zempled/artwork/225082.jpg",
      "deezer": "https://www.deezer.com/track/225082",
      "youtube": "https://www.youtube.com/watch?v=mkIhXriES-0",
      "spotify": "https://open.spotify.com/track/1R8vDQaHuDWBHgIQcdArsr",
      "appleMusic": "https://music.apple.com/us/album/yene-mastawesha/78953516?i=78953506"
    },
    "sampled": {
      "id": 2918831,
      "artist": "K’naan",
      "title": "Somalia",
      "album": "Troubadour",
      "cover": "/projects/zempled/artwork/2918831.jpg",
      "deezer": "https://www.deezer.com/track/2918831",
      "youtube": "https://www.youtube.com/watch?v=xppoqEMOw_s",
      "spotify": "https://open.spotify.com/track/5LjWDSYYnhvq2A38a6zuoF",
      "appleMusic": "https://music.apple.com/us/album/somalia/1443296809?i=1443296829"
    },
    "note": "K’naan’s “Somalia,” from Troubadour (2009), samples Tilahun Gessesse’s “Yene Mastawesha.” The album’s sample credits also name Gessesse as the source for “America” and “15 Minutes Away,” making this part of a recurring connection across the record. Find the original on Éthiopiques, Vol. 17, a collection devoted to Gessesse’s work.",
    "source": {
      "label": "Troubadour sample credits",
      "url": "https://en.wikipedia.org/wiki/Troubadour_(K%27naan_album)"
    }
  },
  {
    "id": "prepared",
    "original": {
      "id": 224950,
      "artist": "Getatchew Mekurya",
      "title": "Shellela",
      "album": "Ethiopiques, Vol. 14: Negus of Ethiopian Sax",
      "cover": "/projects/zempled/artwork/224950.jpg",
      "deezer": "https://www.deezer.com/track/224950",
      "youtube": "https://www.youtube.com/watch?v=0N7150EfPaI",
      "spotify": "https://open.spotify.com/track/69xPvlP5i5Rado4veDUQUc",
      "appleMusic": "https://music.apple.com/us/album/shelle-la/78952714?i=78952501"
    },
    "sampled": {
      "id": 2918827,
      "artist": "K’naan feat. Damian Marley",
      "title": "I Come Prepared",
      "album": "Troubadour",
      "cover": "/projects/zempled/artwork/2918827.jpg",
      "deezer": "https://www.deezer.com/track/2918827",
      "youtube": "https://www.youtube.com/watch?v=ALP6Yz-jh8A",
      "spotify": "https://open.spotify.com/track/33wTEi59zOsa5wc1jbHyIh",
      "appleMusic": "https://music.apple.com/us/album/i-come-prepared-feat-damian-jr-gong-marley/1443296809?i=1443296821"
    },
    "note": "“I Come Prepared” brings K’naan and Damian Marley together over a sample of Getatchew Mekurya’s “Shellela,” credited on Troubadour (2009). The source comes from a saxophonist, rather than one of the vocalists sampled elsewhere on the album. Explore Éthiopiques, Vol. 14: Negus of Ethiopian Sax for more of Mekurya’s recordings.",
    "source": {
      "label": "Troubadour sample credits",
      "url": "https://en.wikipedia.org/wiki/Troubadour_(K%27naan_album)"
    }
  },
  {
    "id": "mighty",
    "original": {
      "id": 219206,
      "artist": "Alemayehu Eshete",
      "title": "Yebèqanal",
      "album": "Ethiopiques, Vol. 22 : More Vintage 1972-1974 (More Vintage!)",
      "cover": "/projects/zempled/artwork/219206.jpg",
      "deezer": "https://www.deezer.com/track/219206",
      "youtube": "https://www.youtube.com/watch?v=KqE69kem4L8",
      "spotify": "https://open.spotify.com/track/2dTy7RLFhmqzbVmxdo2G64",
      "appleMusic": "https://music.apple.com/us/album/yeb%C3%A8qanal/264843659?i=264844076"
    },
    "sampled": {
      "id": 5900734,
      "artist": "Madlib",
      "title": "Mighty Force",
      "album": "Beat Konducta In Africa",
      "cover": "/projects/zempled/artwork/5900734.jpg",
      "deezer": "https://www.deezer.com/track/5900734",
      "youtube": "https://www.youtube.com/watch?v=otxuyND5-t8",
      "spotify": "https://open.spotify.com/track/3CvU1UCn1LbfwPwA8Qk7bL",
      "appleMusic": "https://music.apple.com/us/album/mighty-force/1680809862?i=1680812768"
    },
    "note": "Madlib uses Alemayehu Eshete’s “Yebèqanal,” collected on Éthiopiques, Vol. 22, in “Mighty Force” from Beat Konducta in Africa. The beat is roughly a minute long, with sharp snares punctuating the sample. It shows how a producer can turn a small piece of a longer recording into a compact instrumental of its own.",
    "source": {
      "label": "OkayAfrica",
      "url": "https://www.okayafrica.com/6-samples-from-ethiopiques-in-hip-hop/245275"
    }
  },
  {
    "id": "awe",
    "original": {
      "id": 4105629071,
      "artist": "Mahmoud Ahmed",
      "title": "Bèmen Sèbèb Letlash",
      "album": "Heavenly Ethiopiques (The Best Of The Ethiopiques Series)",
      "cover": "/projects/zempled/artwork/4105629071.jpg",
      "deezer": "https://www.deezer.com/track/4105629071",
      "youtube": "https://www.youtube.com/watch?v=J3Qv7jsQpeA",
      "spotify": "https://open.spotify.com/track/2NiPEl85JSH8xxwQsXTnUT",
      "appleMusic": "https://music.apple.com/us/album/b%C3%A8men-s%C3%A8b%C3%A8b-letlash/6783005552?i=6783006303"
    },
    "sampled": {
      "id": 2301137745,
      "artist": "The Gaslamp Killer feat. Gonjasufi",
      "title": "When I'm in Awe",
      "album": "Death Gate",
      "cover": "/projects/zempled/artwork/2301137745.jpg",
      "deezer": "https://www.deezer.com/track/2301137745",
      "youtube": "https://www.youtube.com/watch?v=yIggjahZQrY",
      "spotify": "https://open.spotify.com/track/1YImDyGqYunAvQjzvHUXXr",
      "appleMusic": "https://music.apple.com/us/album/when-im-in-awe-feat-gonjasufi/1689806113?i=1689806115"
    },
    "note": "The Gaslamp Killer samples Mahmoud Ahmed’s “Bèmen Sèbèb Letlash” on “When I’m in Awe,” featuring Gonjasufi. The reissue notes trace Ahmed’s recording to a 1978 LP on his own label, Mahmoud Ahmed Records. They also point to its inclusion on Cut Chemist’s Sound of the Police mix, another route for discovering the original.",
    "source": {
      "label": "Reissue notes · Betino’s",
      "url": "https://www.betinos.com/auteur/alemayehu-esheteamadou-balake"
    }
  },
  {
    "id": "impulse",
    "original": {
      "id": 12316792,
      "artist": "Mulatu Astatke & The Heliocentrics",
      "title": "Addis Black Widow",
      "album": "Inspiration Information 3",
      "cover": "/projects/zempled/artwork/12316792.jpg",
      "deezer": "https://www.deezer.com/track/12316792",
      "youtube": "https://www.youtube.com/watch?v=CSvNhbpWz5s",
      "spotify": "https://open.spotify.com/track/1YEVpaDDxCaELPzugWCfrr",
      "appleMusic": "https://music.apple.com/us/album/addis-black-widow/307556145?i=307556205"
    },
    "sampled": {
      "id": 2300833865,
      "artist": "The Gaslamp Killer feat. Daedelus",
      "title": "Impulse",
      "album": "Breakthrough",
      "cover": "/projects/zempled/artwork/2300833865.jpg",
      "deezer": "https://www.deezer.com/track/2300833865",
      "youtube": "https://www.youtube.com/watch?v=_oQw-n3K7QY",
      "spotify": "https://open.spotify.com/track/0BV0b2qPaf18v6Wr9piemn",
      "appleMusic": "https://music.apple.com/us/album/impulse-feat-daedelus/1689471592?i=1689471603"
    },
    "note": "“Addis Black Widow” comes from Mulatu Astatke’s 2009 collaboration with London group The Heliocentrics, Inspiration Information 3. The Gaslamp Killer reworks it into “Impulse,” featuring Daedelus, with distorted beats and chiptune-like keyboards. This pairing follows a contemporary Ethio-jazz collaboration into experimental electronic production.",
    "source": {
      "label": "OkayAfrica",
      "url": "https://www.okayafrica.com/the-5-best-mulatu-astatke-samples-in-hip-hop/257097"
    }
  },
  {
    "id": "longevity",
    "original": {
      "id": 349369731,
      "artist": "Mulatu Astatke",
      "title": "Kasalefkut-hulu (Stereo Master)",
      "album": "Mulatu Of Ethiopia",
      "cover": "/projects/zempled/artwork/349369731.jpg",
      "deezer": "https://www.deezer.com/track/349369731",
      "youtube": "https://www.youtube.com/watch?v=a3A7IeItt-o",
      "spotify": "https://open.spotify.com/track/24VYlFVsEZ1ARpoVr3D5kB",
      "appleMusic": "https://music.apple.com/us/album/kasalefkut-hulu-stereo-master/1225952989?i=1225953746"
    },
    "sampled": {
      "id": 6169434,
      "artist": "J-Live",
      "title": "Longevity",
      "album": "Always Has Been",
      "cover": "/projects/zempled/artwork/6169434.jpg",
      "deezer": "https://www.deezer.com/track/6169434",
      "youtube": "https://www.youtube.com/watch?v=AdvflNkZZcQ",
      "spotify": "https://open.spotify.com/track/2h2c1mmTLecyKChx50qiK5",
      "appleMusic": "https://music.apple.com/us/album/longevity/312157363?i=312157415"
    },
    "note": "J-Live’s “Longevity” reshapes the vibraphone melody of Mulatu’s “Kasalefkut-Hulu” into a backing for his verses. The track also uses a Sister Nancy sample, so the Ethiopian melody is one layer in a larger collage. Listen for the bright, ringing vibraphone phrase as you move between the two recordings.",
    "source": {
      "label": "OkayAfrica",
      "url": "https://www.okayafrica.com/the-5-best-mulatu-astatke-samples-in-hip-hop/257097"
    }
  },
  {
    "id": "cowboys",
    "original": {
      "id": 349369701,
      "artist": "Mulatu Astatke",
      "title": "Mascaram Setaba (Stereo Master)",
      "album": "Mulatu Of Ethiopia",
      "cover": "/projects/zempled/artwork/349369701.jpg",
      "deezer": "https://www.deezer.com/track/349369701",
      "youtube": "https://www.youtube.com/watch?v=p4tvFwgsGWo",
      "spotify": "https://open.spotify.com/track/4hVZKH4EVNP3iLyaDLA3Eq",
      "appleMusic": "https://music.apple.com/us/album/mascaram-setaba-stereo-master/1225952989?i=1225953455"
    },
    "sampled": {
      "id": 503161062,
      "artist": "Sadat X",
      "title": "Wild Cowboys",
      "album": "Wild Cowboys",
      "cover": "/projects/zempled/artwork/503161062.jpg",
      "deezer": "https://www.deezer.com/track/503161062",
      "youtube": "https://www.youtube.com/watch?v=t7qkBxZg_Pg",
      "spotify": "https://open.spotify.com/track/79nyyfDnRVtjMEozHa6l49",
      "appleMusic": "https://music.apple.com/us/album/wild-cowboys/1387603663?i=1387603671"
    },
    "note": "The title track of Sadat X’s 1996 album Wild Cowboys samples Mulatu Astatke’s “Mascaram Setaba,” from Mulatu of Ethiopia (1972). WhoSampled also identifies drums from Richard “Popcorn” Wylie’s “Both Ends Against the Middle.” The pairing is a reminder that a beat can combine separate melodic and rhythmic sources.",
    "source": {
      "label": "WhoSampled",
      "url": "https://www.whosampled.com/album/Sadat-X/Wild-Cowboys/"
    }
  }
];
