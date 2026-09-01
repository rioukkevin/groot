import type { GlobalConfig } from "payload";

/** Three registers of the same line. Empty ones fall back to `warm`. */
const voiced = (name: string, label: string) => ({
  name,
  type: "group" as const,
  label,
  fields: [
    // Not required: the voiced copy still lives in lib/terminal/commands.ts and
    // moves here field by field as the shell is wired to read from the CMS. An
    // empty group means "keep using the code".
    { name: "warm", type: "textarea" as const, localized: true },
    { name: "brief", type: "textarea" as const, localized: true },
    { name: "terse", type: "textarea" as const, localized: true },
  ],
});

/**
 * Every word the interface says about itself: command descriptions, hints,
 * the wizard's questions, the labels on the pickers. Separate from Site
 * content so translating the UI is not tangled up with editing the CV.
 */
export const UiText: GlobalConfig = {
  slug: "ui-text",
  label: "UI text",
  admin: { group: "Interface" },
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Shell",
          fields: [
            { name: "promptPlaceholder", type: "text", localized: true, required: true },
            { name: "banner", type: "text", localized: true },
            { name: "modeHint", type: "text", localized: true },
            voiced("intro", "Intro message"),
            {
              name: "introHints",
              type: "array",
              localized: true,
              fields: [
                {
                  name: "key",
                  type: "select",
                  required: true,
                  defaultValue: "try",
                  options: [
                    { label: "example to try", value: "try" },
                    { label: "note", value: "note" },
                  ],
                },
                {
                  name: "label",
                  type: "text",
                  admin: { description: "Prefix beside the first example, e.g. try." },
                },
                { name: "text", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Commands",
          fields: [
            {
              name: "commands",
              type: "array",
              localized: true,
              label: "Command list (/help and the palette)",
              fields: [
                { name: "command", type: "text", required: true },
                { name: "description", type: "text", localized: true, required: true },
                {
                  name: "hidden",
                  type: "checkbox",
                  defaultValue: false,
                  admin: { description: "Still runs, but absent from /help and autocomplete." },
                },
              ],
            },
            voiced("help", "/help preamble"),
            voiced("projects", "/projects preamble"),
            voiced("about", "/about preamble"),
            voiced("skills", "/skills preamble"),
            voiced("stack", "/stack preamble"),
            voiced("rates", "/rates preamble"),
            voiced("contact", "/contact preamble"),
            voiced("now", "/now summary"),
            voiced("photos", "/photos preamble"),
            voiced("noMatch", "Freeform: nothing matched"),
          ],
        },
        {
          label: "Contact wizard",
          fields: [
            {
              name: "wizardSteps",
              type: "array",
              localized: true,
              fields: [
                { name: "key", type: "text", required: true },
                { name: "group", type: "text", required: true },
                { name: "question", type: "text", required: true },
                { name: "label", type: "text" },
                {
                  name: "options",
                  type: "array",
                  fields: [
                    { name: "value", type: "text", required: true },
                    { name: "label", type: "text", required: true },
                    { name: "hint", type: "text" },
                    { name: "icon", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Pickers",
          fields: [
            {
              name: "themes",
              type: "array",
              localized: true,
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
                { name: "hint", type: "text" },
              ],
            },
            {
              name: "voices",
              type: "array",
              localized: true,
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
                { name: "hint", type: "text" },
              ],
            },
            {
              name: "strings",
              type: "array",
              localized: true,
              label: "Interface strings",
              admin: {
                description:
                  "Every short label, hint and message the interface uses, by key. One row per string so a new one costs an entry rather than a schema change.",
              },
              fields: [
                { name: "key", type: "text", required: true },
                { name: "text", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
