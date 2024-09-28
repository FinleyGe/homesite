import { readFileSync } from "fs";
import { parse } from "vue/compiler-sfc";

export async function parseComponent(filePath: string) {
  const content = readFileSync(filePath, 'utf-8')
  const a = parse(content)
}
