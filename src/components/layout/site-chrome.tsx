"use client";

import { useRef } from "react";
import SearchPalette, { type SearchPaletteHandle } from "./search-palette";
import SiteHeader from "./site-header";

// The header's search button and the search box live in different places on screen,
// so this small parent connects them.
export default function SiteChrome() {
  const search = useRef<SearchPaletteHandle>(null);

  return (
    <>
      <SiteHeader onOpenSearch={() => search.current?.open()} />
      <SearchPalette ref={search} />
    </>
  );
}
