import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Markdown } from "@/components/terminal/markdown/Markdown";
import { InlineMarkdown } from "@/components/terminal/markdown/InlineMarkdown";
import { parseBlocks, parseInline, plain, toLines, wrapInline } from "@/lib/terminal/markdown";

const inline = (s: string) => parseInline(s);

describe("inline markdown", () => {
  test("bold, italic, strike, code, link", () => {
    expect(inline("a **b** *i* ~~s~~ `c` [l](https://x.y)")).toEqual([
      { t: "text", s: "a " },
      { t: "b", c: [{ t: "text", s: "b" }] },
      { t: "text", s: " " },
      { t: "i", c: [{ t: "text", s: "i" }] },
      { t: "text", s: " " },
      { t: "s", c: [{ t: "text", s: "s" }] },
      { t: "text", s: " " },
      { t: "code", s: "c" },
      { t: "text", s: " " },
      { t: "a", href: "https://x.y", c: [{ t: "text", s: "l" }] },
    ]);
  });
  test("highlights: default accent, named colour, the answer layer's marker", () => {
    expect(inline("==x==")).toEqual([{ t: "hl", color: "accent", c: [{ t: "text", s: "x" }] }]);
    expect(inline("=={warn}x==")).toEqual([{ t: "hl", color: "warn", c: [{ t: "text", s: "x" }] }]);
    expect(inline("⟦x⟧")).toEqual([{ t: "hl", color: "accent", c: [{ t: "text", s: "x" }] }]);
    // An unknown colour name is text inside the highlight, not a crash.
    expect(plain("=={pink}x==")).toBe("{pink}x");
  });
  test("nesting and code shields", () => {
    expect(inline("**a *b* c**")).toEqual([{ t: "b", c: [{ t: "text", s: "a " }, { t: "i", c: [{ t: "text", s: "b" }] }, { t: "text", s: " c" }] }]);
    expect(inline("`**not bold**`")).toEqual([{ t: "code", s: "**not bold**" }]);
    expect(plain("**bold `code **inside**` still**")).toBe("bold code **inside** still");
  });
  test("streaming: an unclosed opener runs to the end", () => {
    expect(inline("say **bo")).toEqual([{ t: "text", s: "say " }, { t: "b", c: [{ t: "text", s: "bo" }] }]);
    expect(inline("a ⟦fac")).toEqual([{ t: "text", s: "a " }, { t: "hl", color: "accent", c: [{ t: "text", s: "fac" }] }]);
  });
  test("what is not markup", () => {
    expect(plain("5 * 3 = 15")).toBe("5 * 3 = 15");
    expect(plain("get_profile and snake_case")).toBe("get_profile and snake_case");
    expect(plain("a == b")).toBe("a == b");
    expect(plain("[not a link](ftp://x)")).toBe("[not a link](ftp://x)");
  });
});

describe("blocks", () => {
  const doc = [
    "# Title",
    "",
    "A paragraph",
    "on two lines.",
    "",
    "## Section",
    "- one",
    "- two **bold**",
    "  - nested",
    "",
    "1. first",
    "2. second",
    "   continued",
    "",
    "> quoted",
    "> more",
    "",
    "---",
    "### Small",
  ].join("\n");
  test("parses every block kind", () => {
    expect(parseBlocks(doc).map((b) => b.t)).toEqual(["h", "p", "h", "list", "list", "quote", "hr", "h"]);
    const blocks = parseBlocks(doc);
    expect(blocks[0]).toEqual({ t: "h", level: 1, text: "Title" });
    expect(blocks[1]).toEqual({ t: "p", lines: ["A paragraph", "on two lines."] });
    expect(blocks[3]).toEqual({ t: "list", ordered: false, items: [{ text: "one", level: 0, n: 0 }, { text: "two **bold**", level: 0, n: 0 }, { text: "nested", level: 1, n: 0 }] });
    expect(blocks[4]).toEqual({ t: "list", ordered: true, items: [{ text: "first", level: 0, n: 1 }, { text: "second continued", level: 0, n: 2 }] });
    expect(blocks[5]).toEqual({ t: "quote", lines: ["quoted", "more"] });
    expect(blocks[7]).toEqual({ t: "h", level: 3, text: "Small" });
  });
  test("a dash rule is not a bullet, a lone dash line is text", () => {
    expect(parseBlocks("---").map((b) => b.t)).toEqual(["hr"]);
    expect(parseBlocks("- item\n***").map((b) => b.t)).toEqual(["list", "hr"]);
  });
});

describe("wrapping for the character grid", () => {
  test("keeps a wrapped run valid on both lines", () => {
    const lines = wrapInline("say **two words here** end", 12);
    expect(lines).toEqual(["say **two**", "**words here**", "end"]);
    for (const l of lines) expect(plain(l).length).toBeLessThanOrEqual(12);
  });
  test("never breaks inside a code span or a link", () => {
    const lines = wrapInline("run `claude mcp add` now [a b](https://x.y/z)", 10);
    expect(lines.some((l) => l.includes("`claude mcp add`"))).toBe(true);
    expect(lines.some((l) => l.includes("[a b](https://x.y/z)"))).toBe(true);
  });
  test("measures visible characters, not markup", () => {
    // "ab cd ef" is eight visible characters: it fits in eight, wraps at seven.
    expect(wrapInline("**ab** ==cd== ~~ef~~", 8)).toEqual(["**ab** ==cd== ~~ef~~"]);
    expect(wrapInline("**ab** ==cd== ~~ef~~", 7)).toEqual(["**ab** ==cd==", "~~ef~~"]);
  });
  test("lays a document out as glyph-keyed lines", () => {
    const lines = toLines("# T\n\n- a\n  - b\n\n1. c\n\n> q\n\n---\n\np", 40);
    expect(lines[0].k).toBe("# ");
    expect(lines[0].style).toBe("h1");
    expect(lines[1].style).toBe("rule");
    expect(lines.find((l) => l.text === "a")?.k).toBe("• ");
    expect(lines.find((l) => l.text === "b")?.k).toBe("  ◦ ");
    expect(lines.find((l) => l.text === "c")?.k).toBe(" 1. ");
    expect(lines.find((l) => l.text === "q")?.style).toBe("quote");
    expect(lines.filter((l) => l.style === "rule").length).toBe(2);
    expect(lines.find((l) => l.text === "p")?.md).toBe(true);
  });
});

describe("rendering", () => {
  test("multi-line draws the glyphs and marks", () => {
    const html = renderToStaticMarkup(Markdown({ text: "# H\n\nsome **b** and =={warn}w==\n\n- x\n\n> q" }));
    expect(html).toContain("━━━");
    expect(html).toContain("font-weight:700");
    expect(html).toContain("var(--warn)");
    expect(html).toContain("•");
    expect(html).toContain("▎");
  });
  test("one-line leaves block syntax as text", () => {
    const html = renderToStaticMarkup(InlineMarkdown({ text: "# not a heading · - not a bullet" }) as never);
    expect(html).toContain("# not a heading · - not a bullet");
  });
});
