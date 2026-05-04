export const CATEGORIES = {
  food:          { label: "飲食",   color: "#f59e0b" },
  shopping:      { label: "購物",   color: "#6366f1" },
  transport:     { label: "交通",   color: "#3b82f6" },
  accommodation: { label: "住宿",   color: "#10b981" },
  sightseeing:   { label: "觀光",   color: "#ec4899" },
  other:         { label: "其他",   color: "#8b5cf6" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export function getCategoryLabel(key: string): string {
  return CATEGORIES[key as CategoryKey]?.label ?? key;
}

export function getCategoryColor(key: string): string {
  return CATEGORIES[key as CategoryKey]?.color ?? "#8b5cf6";
}
