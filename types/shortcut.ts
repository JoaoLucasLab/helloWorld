export type ShortcutType =
  | "linkedin"
  | "github"
  | "portfolio"
  | "leetcode"
  | "other";

export type Shortcut = {
  id: string;
  type: ShortcutType;
  label: string;
  url: string;
  createdAt: number;
};
