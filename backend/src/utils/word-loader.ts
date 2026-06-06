import { readFileSync } from "fs";
import { join } from "path";

export interface WordPair {
  A: string;
  B: string;
  category: string;
}

export interface WordCategory {
  name: string;
  pairs: WordPair[];
}

/**
 * Loads word pairs from the word-list.md file
 * Returns array of word pairs grouped by category
 */
export function loadWordPairs(): WordPair[] {
  const wordListPath = join(__dirname, "../../../docs/word-list.md");
  const content = readFileSync(wordListPath, "utf-8");

  const wordPairs: WordPair[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines, comments, and header
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("序号")) continue;

    const parts = trimmed.split(",");
    if (parts.length >= 4) {
      const category = parts[1].trim();
      const wordA = parts[2].trim();
      const wordB = parts[3].trim();
      if (category && wordA && wordB) {
        wordPairs.push({ A: wordA, B: wordB, category });
      }
    }
  }

  return wordPairs;
}

/**
 * Returns word pairs grouped by category
 */
export function getWordCategories(): WordCategory[] {
  const pairs = loadWordPairs();
  const categoryMap = new Map<string, WordPair[]>();

  for (const pair of pairs) {
    const existing = categoryMap.get(pair.category) || [];
    existing.push(pair);
    categoryMap.set(pair.category, existing);
  }

  return Array.from(categoryMap.entries()).map(([name, pairs]) => ({
    name,
    pairs,
  }));
}
