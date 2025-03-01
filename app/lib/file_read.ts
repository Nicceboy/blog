import path from "path";
import process from "node:process";
const DATA_DIR = path.join(process.cwd(), "app", "data");

type FileDirectory = "robots" | "config" | "templates" | "content";

/**
 * Read a file from the data directory
 */
export async function readDataFile(
  directory: FileDirectory,
  filename: string,
): Promise<string> {
  try {
    const filePath = path.join(DATA_DIR, directory, filename);
    return await Deno.readTextFile(filePath);
  } catch (error) {
    console.error(`Error reading file ${filename} from ${directory}:`, error);
    throw new Error(`Failed to read ${directory}/${filename}`);
  }
}
