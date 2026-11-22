// Brand constants for Woodroom. Keep copy and names consistent across the app
// and metadata. See docs/reference/brand.md for voice, tokens and usage.
export const brand = {
  name: "Woodroom",
  descriptor: "DJ Screw chapters",
  tagline: "Every chapter, slowed down and on the shelf.",
  description:
    "Browse and play DJ Screw’s tapes from the Internet Archive’s DJ Screw Discography: every chapter by number and year, with side A and side B track lists and the artists on each tape.",
  collectionName: "DJ Screw Discography",
  // The Internet Archive collection identifier the engine imports.
  collection: "dj-screw-discography",
  collectionURL: "https://archive.org/details/dj-screw-discography",
} as const;

export const discoveryCopy = {
  browse: "Browse the shelf",
  browseShort: "Browse",
  search: "Search tapes",
  searchShort: "Search",
  explore: "Browse by year",
  exploreShort: "Years",
  calendarShort: "Calendar",
  topArtists: "Top artists",
  seeAll: "See all",
  recording: "Tape",
  invalidRecording: "Choose a valid tape identifier.",
  recordingMissing:
    "This tape is not in the catalog. It may have been excluded or removed.",
  openRecording: "Open tape page",
  backToRecordings: "Back to the shelf",
  calendar: "Concert calendar",
  onThisDay: "On this day",
  artist: "Artist page",
  yearMode: "Years to include",
  singleYear: "Single year",
  yearRange: "Range of years",
  allYears: "All years",
  applyYears: "Apply years",
  calendarHelp:
    "Choose a month and years. Each count is a recording; different tapes can document the same concert.",
  crossYearHelp:
    "Dates are grouped by day of the month across the selected years.",
  todayHelp:
    "Recordings made on this month and day, across the selected years.",
  updateRequired:
    "This catalog service needs an update before date and artist discovery can load.",
  publicEngine:
    "This engine serves the public catalog only; source browsing and discovery need the private engine.",
  noBiography: "A sourced biography is not available for this artist yet.",
  noPhoto: "Artist photograph not available",
  sourceFacts: "Artist information from MusicBrainz",
  biographyCredit: "Wikipedia contributors · CC BY-SA 4.0",
  collectionBiographyCredit:
    "Text from the artist's Internet Archive collection page",
  readCollection: "View the collection",
  sourceCollection: "Artist collection on Internet Archive",
  unknown: "Not recorded",
  loadingArtist: "Loading artist information…",
  artistError:
    "Artist information could not load. Recordings remain available below.",
  retryArtist: "Retry artist information",
  artistType: "Artist type",
  origin: "Origin",
  country: "Country",
  activeFrom: "Active from",
  activeUntil: "Active until",
  readBiography: "Read the biography",
  year: "Year",
  fromYear: "From year",
  toYear: "To year",
  yearError: "Choose an ordered year range from 1900 through 2099.",
  month: "Month",
  day: "Day",
  loadingCalendar: "Loading the concert calendar…",
  calendarError: "The calendar could not load.",
  retryCalendar: "Retry calendar",
  emptyCalendar:
    "No recordings with complete dates match this month and these years.",
  wholeMonth: "Show the whole month",
  dateRecordings: "Recordings by date",
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
} as const;

export const recordingCopy = {
  lineageMissing: "Not recorded",
  sourceMissing: "Source not recorded",
  setlist: "Track list",
  notes: "Notes",
  readFullNotes: "Read the full notes",
} as const;

export const playerCopy = {
  placement: "Player position",
  openRecording: "Open tape page",
  showDetails: "Details",
  hideDetails: "Hide details",
  details: "Playing tape details",
  resize: "Resize player sidebar",
  play: "Play",
  pause: "Pause",
  previous: "Previous track",
  restart: "Restart track",
  next: "Next track",
  seek: "Playback position",
  loading: "Loading",
  mute: "Mute",
  volume: "Volume",
  openPlayer: "Open player",
  closePlayer: "Close player",
  bottom: "Bottom bar",
  top: "Top bar",
  mini: "Floating mini",
  left: "Left sidebar",
  right: "Right sidebar",
} as const;

export const shelfCopy = {
  filterLabel: "Filter these tapes",
  filterPlaceholder: "Filter by name, chapter or year",
  seriesLabel: "Series",
  series: { all: "All tapes", chapters: "Chapters", none: "No series" },
  columns: { chapter: "Chapter", title: "Tape", date: "Year (as uploaded)" },
  ascending: "ascending",
  descending: "descending",
  sortBy: (column: string, direction: string) =>
    direction
      ? `Sort these tapes by ${column}, ${direction}`
      : `Sort these tapes by ${column}`,
  shown: (shown: number, total: number) => `${shown} of ${total} tapes shown`,
  noMatch: (filter: string) =>
    filter ? `No tapes here match “${filter}”.` : "No tapes here match this series.",
  clearFilter: "Clear filter",
} as const;

export const tapeCopy = {
  release: "Release",
  // The series column of a shelf row; a chapter number of 0 means no series.
  seriesLine: (number: number, reissue: boolean) =>
    number === 0
      ? "No series"
      : `Chapter ${String(number).padStart(3, "0")}${reissue ? " reissue" : ""}`,
  // Chapter numbers come from the posthumous "Diary of the Originator"
  // reissues, not from when a tape was made. Years are the uploader's.
  yearNote:
    "Chapter numbers are not chronological. Years come from each upload’s title and are approximate.",
  yearAsUploaded: (year: string) => `${year} (as uploaded)`,
  pageOrder: "chapters in number order",
  reissueOf: (number: number) => `Reissue of Chapter ${String(number).padStart(3, "0")}`,
  side: (side: string) => `Side ${side}`,
  disclaimer:
    "Woodroom is an independent project. It is not affiliated with or endorsed by Screwed Up Records & Tapes or the estate of DJ Screw.",
} as const;

// Set dressing for the wood room (src/Room.tsx): promo posters for records by
// artists Screw mixed, supplied by the owner on 2026-11-21. Seven were redrawn
// cleanly from the owner's designs and weathered; "pokey-photo" is the owner's
// photo poster with its advisory label covered. Shapes: tall 2:3, wide 3:2,
// otherwise 3:4.
export const roomPosters = [
  { slot: "a", artist: "E.S.G.", title: "Sailin' Da South", src: "esg" },
  { slot: "b", artist: "Fat Pat", title: "Ghetto Dreams", src: "fatpat" },
  { slot: "c", artist: "Lil' Keke", title: "Don't Mess Wit Texas", src: "keke" },
  // Further down the wall; seen through the modules and between them.
  { slot: "d", lower: true, artist: "Big Pokey", title: "Hardest Pit in the Litter", src: "pokey" },
  { slot: "e", lower: true, artist: "Botany Boyz", title: "Thought of Many Ways", src: "botany" },
  { slot: "f", lower: true, artist: "Z-Ro", title: "Look What You Did to Me", src: "zro" },
  { slot: "g", lower: true, artist: "UGK", title: "Ridin' Dirty", src: "ugk", shape: "wide" },
  { slot: "h", lower: true, artist: "Big Pokey", title: "Hardest Pit in the Litter", src: "pokey-photo", shape: "tall" },
] as const;
