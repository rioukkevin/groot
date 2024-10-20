import { Profanity } from "@2toad/profanity";

export const profanity = new Profanity({
  languages: ["en", "fr", "de", "es"],
  wholeWord: false,
  grawlix: "*****",
  grawlixChar: "$",
});
