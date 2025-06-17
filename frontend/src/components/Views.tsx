export const VIEWS = {
  BOOKMARKS: "bookmarks",
  IMPORT_EXPORT: "import-export",
  SETTINGS: "settings",
  // add more as needed
} as const;

export type ViewType = typeof VIEWS[keyof typeof VIEWS];
