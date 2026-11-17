import type { JournalChapter, JournalPhoto } from "./journal-data";

export type PlacedPhoto = {
  photo: JournalPhoto;
  // Position in the whole journal, starting at 1.
  number: number;
  // Tall photos take turns on the left and right so the page has some rhythm. Wide ones fill the column.
  isOnRight: boolean;
};

export type PlacedChapter = {
  chapter: JournalChapter;
  photos: PlacedPhoto[];
  // The closing quote leans toward the same side as the photo before it.
  isQuoteOnRight: boolean;
};

// Numbers every photo across the journal and decides which side each tall photo sits on.
export function placeChapters(chapters: JournalChapter[]): PlacedChapter[] {
  let number = 0;
  let tallCount = 0;

  return chapters.map((chapter) => {
    const photos = chapter.photos.map((photo) => {
      number += 1;
      const isTall = photo.height > photo.width;
      if (isTall) tallCount += 1;
      return { photo, number, isOnRight: isTall && tallCount % 2 === 0 };
    });
    const lastPhoto = photos[photos.length - 1];
    return { chapter, photos, isQuoteOnRight: lastPhoto?.isOnRight ?? false };
  });
}
