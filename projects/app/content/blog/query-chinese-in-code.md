---
lang: zh
tags:
  - frontend
create: 2024-08-26
---

# I18n: 从代码中查询中文

为了实现项目的 i18n，必须将代码中所有展示出来的中文使用 i18n 的相关工具处理。

## 匹配中文

使用 **正则表达式** 可以匹配中文:

```tsx
text.match(/[\\u4e00-\\u9fa5]/g);
```

由于代码中存在大量的中文注释，因此从文本上处理是比较麻烦的。

之前学习 tree-sitter 了解到，可以通过简单的 query 语言得到想要的 AST 节点。于是从网上找到了这个项目：

- https://github.com/phenomnomnominal/tsquery

通过里面的 [demo](https://tsquery-playground.firebaseapp.com/) 可以方便的调试 query.

可以直接使用 `StringLiteral, JsxText` 来获取所有的中文：包括变量定义，property 定义等等，还包括 jsx 中的中文）

只要找到了所有的中文，那么就可以进行替换工作。

下面是示例代码：

```tsx [https://github.com/labring/FastGPT/blob/main/scripts/i18n/query.ts]
import { ast, query } from "@phenomnomnominal/tsquery";
import * as path from "path";
import * as fs from "fs";

const root = path.join(__dirname, "../../");
// get all files in the project recursively

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(root)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
  .filter((file) => !file.includes("node_modules"))
  .filter((file) => !file.includes("jieba"));

async function processFiles(allFiles: string[]) {
  try {
    // 并行读取所有文件内容
    const fileContents = await Promise.all(
      allFiles.map((file) => fs.readFileSync(file, "utf-8"))
    );

    // 处理每个文件的内容
    fileContents.forEach((content, index) => {
      const astTree = ast(content);
      const res = query(astTree, "JsxText,StringLiteral");
      for (const node of res) {
        const text = node.getText().trim();
        if (text.length > 0 && text.match(/[\u4e00-\u9fa5]/g)) {
          console.log(allFiles[index], text);
        }
      }
    });
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

processFiles(allFiles);
```
