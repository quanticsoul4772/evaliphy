import fs from "node:fs/promises";
import path from "node:path";

export async function getDocBySlug(slug: string) {
  const docsDir = path.join(process.cwd(), "..", "docs");
  const filePath = path.join(docsDir, `${slug}.mdx`);
  
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch (error) {
    console.error(`Error reading doc: ${slug}`, error);
    return null;
  }
}
