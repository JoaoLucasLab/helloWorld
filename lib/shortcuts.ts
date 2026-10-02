import type { ShortcutType } from "@/types/shortcut";

export type ShortcutOption = {
  type: ShortcutType;
  label: string;
  placeholder: string;
};

// The choices shown in the "Add section" dropdown, in order.
export const shortcutOptions: ShortcutOption[] = [
  { type: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/in/your-name" },
  { type: "github", label: "GitHub", placeholder: "https://github.com/your-username" },
  { type: "portfolio", label: "Portfolio", placeholder: "https://your-portfolio.com" },
  { type: "leetcode", label: "LeetCode", placeholder: "https://leetcode.com/u/your-username" },
  { type: "other", label: "Another", placeholder: "https://example.com" },
];

// Accepts "github.com/me" as well as full URLs. Only http(s) links are allowed,
// so a shortcut can never run script (e.g. "javascript:...") when clicked.
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : "https://" + trimmed;

  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}
