#!/usr/bin/env bash
# Subsets JetBrains Mono to what the shell actually draws.
#
# The full faces (app/fonts/full/, ~94 KB each) carry Cyrillic, Greek and
# hundreds of glyphs the site never shows. The shipped faces keep Latin with
# its accents, punctuation, arrows, the box-drawing and block elements the
# transcript is built from, the geometric shapes and dingbats used as markers,
# and Braille for the ASCII photo — about a quarter of the bytes, preloaded
# on every first visit. Add a range here if a new glyph shows up as a fallback
# (a glyph in a different width breaks the monospace grid).
#
# Also writes TTF subsets of Regular and Bold for the Open Graph image:
# next/og's renderer reads TTF/OTF/WOFF, not WOFF2.
#
# Needs uv (https://docs.astral.sh/uv/); fonttools is fetched on the fly.
set -euo pipefail
cd "$(dirname "$0")/.."

UNICODES="U+0020-007E,U+00A0-00FF,U+0100-017F,U+2000-206F,U+20AC,U+2190-21FF,U+2300-23FF,U+2500-25FF,U+2600-26FF,U+2700-27BF,U+27E6-27E7,U+2800-28FF"
SUBSET="uvx --from fonttools[woff] pyftsubset"
COMMON="--unicodes=$UNICODES --layout-features=* --no-hinting --desubroutinize"

for face in Regular Italic Medium Bold; do
  $SUBSET "app/fonts/full/JetBrainsMono-$face.woff2" $COMMON \
    --flavor=woff2 --output-file="app/fonts/JetBrainsMono-$face.woff2"
done

for face in Regular Bold; do
  $SUBSET "app/fonts/full/JetBrainsMono-$face.woff2" $COMMON \
    --output-file="assets/og/JetBrainsMono-$face.ttf"
done

ls -la app/fonts/*.woff2 assets/og/*.ttf
