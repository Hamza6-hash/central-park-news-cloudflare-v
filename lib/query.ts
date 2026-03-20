// Strip markdown for plain text extraction
export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[*_~`>#-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}
