const formatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const TABLE_BLOCK_PATTERN =
  String.raw`(^\|.*\|\r?\n\|[-:|\s]+\|\r?\n(?:\|.*\|\r?\n?)*)`;

export function formatDate(dateString) {
  try {
    return formatter.format(new Date(dateString));
  } catch (error) {
    return dateString;
  }
}

export function calculateReadingTime(content) {
  if (!content) {
    return 1;
  }
  const words = content
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function splitMarkdownContent(content) {
  if (!content) {
    return [];
  }
  const results = [];
  const tableRegex = new RegExp(TABLE_BLOCK_PATTERN, "gm");
  let lastIndex = 0;
  let match;

  while ((match = tableRegex.exec(content)) !== null) {
    const { index } = match;
    if (index > lastIndex) {
      const markdownBlock = content.slice(lastIndex, index);
      if (markdownBlock.trim()) {
        results.push({ type: "markdown", value: markdownBlock });
      }
    }

    results.push({ type: "table", value: match[0].trim() });
    lastIndex = tableRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    const markdownBlock = content.slice(lastIndex);
    if (markdownBlock.trim()) {
      results.push({ type: "markdown", value: markdownBlock });
    }
  }

  return results.length ? results : [{ type: "markdown", value: content }];
}

export function parseMarkdownTable(tableBlock) {
  if (!tableBlock) {
    return { headers: [], rows: [] };
  }

  const lines = tableBlock
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = extractCells(lines[0]);
  const rows = lines
    .slice(2)
    .map((line) => extractCells(line))
    .filter((cells) => cells.some((cell) => cell));

  return { headers, rows };
}

function extractCells(line) {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}
