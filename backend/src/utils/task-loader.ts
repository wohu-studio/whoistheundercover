import { readFileSync } from "fs";
import { join } from "path";

export interface TaskItem {
  description: string;
  category: string;
}

export interface TaskCategory {
  name: string;
  tasks: TaskItem[];
}

export function loadTasks(): TaskItem[] {
  const taskListPath = join(__dirname, "../../../docs/task-list.md");
  const content = readFileSync(taskListPath, "utf-8");

  const tasks: TaskItem[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("序号")) continue;

    const parts = trimmed.split(",");
    if (parts.length >= 3) {
      const category = parts[1].trim();
      const description = parts.slice(2).join(",").trim(); // rejoin in case description has commas
      if (category && description) {
        tasks.push({ description, category });
      }
    }
  }

  return tasks;
}

export function getTaskCategories(): TaskCategory[] {
  const tasks = loadTasks();
  const categoryMap = new Map<string, TaskItem[]>();

  for (const task of tasks) {
    const existing = categoryMap.get(task.category) || [];
    existing.push(task);
    categoryMap.set(task.category, existing);
  }

  return Array.from(categoryMap.entries()).map(([name, tasks]) => ({
    name,
    tasks,
  }));
}
