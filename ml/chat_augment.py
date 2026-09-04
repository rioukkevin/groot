"""
Noise for the training rows: the ways a visitor's typing differs from a clean
template. Applied at build time with a seeded RNG, so a run is reproducible.

Typos are keyboard-aware (QWERTY for English, AZERTY for French) because the
substitutions people actually make are neighbours, not random letters.
"""

import random

QWERTY = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
]
AZERTY = [
    "azertyuiop",
    "qsdfghjklm",
    "wxcvbn",
]


def _neighbours(rows: list) -> dict:
    out = {}
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            near = set()
            for dr in (-1, 0, 1):
                rr = r + dr
                if 0 <= rr < len(rows):
                    for dc in (-1, 0, 1):
                        cc = c + dc
                        if (dr or dc) and 0 <= cc < len(rows[rr]):
                            near.add(rows[rr][cc])
            out[ch] = "".join(sorted(near))
    return out


NEAR = {"en": _neighbours(QWERTY), "fr": _neighbours(AZERTY)}

# Lead-ins and tails visitors wrap a question in. They carry no intent of their
# own, and the model must learn to look past them.
PREFIX = {
    "en": [
        "hi", "hey", "hello", "hi kevin", "hey kevin", "hello there", "so",
        "ok so", "quick question", "quick one", "one question", "just wondering",
        "i was wondering", "before i write to you", "sorry", "excuse me", "also",
        "and", "btw", "by the way", "hmm", "well", "right", "cool", "great",
        "thanks", "please", "could you tell me", "can you tell me", "tell me",
        "i'd like to know", "i want to know", "i need to know", "curious",
        "first", "last thing", "one more thing", "actually", "basically",
    ],
    "fr": [
        "bonjour", "salut", "hello", "bonjour kevin", "salut kevin", "coucou",
        "alors", "bon", "ok", "petite question", "une question", "juste une question",
        "je me demandais", "avant de vous écrire", "pardon", "excusez-moi", "aussi",
        "et", "au fait", "hmm", "bon alors", "d'accord", "super", "merci",
        "svp", "stp", "s'il vous plaît", "dites-moi", "dis-moi", "pouvez-vous me dire",
        "peux-tu me dire", "j'aimerais savoir", "je voudrais savoir", "je veux savoir",
        "curieux de savoir", "d'abord", "dernière chose", "encore une chose",
        "en fait", "du coup",
    ],
}
SUFFIX = {
    "en": [
        "please", "thanks", "thank you", "if that's ok", "if possible", "?", "??",
        "!", "...", "pls", "thx", "cheers", "kevin", "kev", "mate", "sir",
        "asap", "today", "quickly", "in short", "roughly", "if you can",
    ],
    "fr": [
        "svp", "stp", "merci", "merci d'avance", "si possible", "?", "??", "!",
        "...", "mrc", "kevin", "kev", "monsieur", "rapidement", "en bref",
        "à peu près", "si vous pouvez", "si tu peux", "aujourd'hui", "vite",
    ],
}

PUNCT = ["?", "", "", ".", " ?", "!", "?!", "…"]


def typo(text: str, lang: str, rng: random.Random) -> str:
    """One keyboard-shaped mistake: drop, swap, double, neighbour, or a lost
    space. Leaves very short strings alone — "hi" with a typo is not "hi"."""
    if len(text) < 5:
        return text
    letters = [i for i, c in enumerate(text) if c.isalpha()]
    if not letters:
        return text
    i = rng.choice(letters)
    op = rng.random()
    if op < 0.28:  # drop
        return text[:i] + text[i + 1 :]
    if op < 0.52 and i + 1 < len(text) and text[i + 1].isalpha():  # swap
        return text[:i] + text[i + 1] + text[i] + text[i + 2 :]
    if op < 0.70:  # double
        return text[:i] + text[i] + text[i:]
    if op < 0.92:  # neighbour
        near = NEAR[lang].get(text[i].lower())
        if near:
            return text[:i] + rng.choice(near) + text[i + 1 :]
        return text[:i] + text[i + 1 :]
    spaces = [j for j, c in enumerate(text) if c == " "]  # lost space
    if spaces:
        j = rng.choice(spaces)
        return text[:j] + text[j + 1 :]
    return text


def wrap(text: str, lang: str, rng: random.Random) -> str:
    """Optionally add a lead-in and/or a tail."""
    r = rng.random()
    if r < 0.22:
        text = rng.choice(PREFIX[lang]) + rng.choice([" ", ", ", " — ", ". "]) + text
    elif r < 0.30:
        text = text + rng.choice([" ", ", ", " "]) + rng.choice(SUFFIX[lang])
    elif r < 0.34:
        text = (
            rng.choice(PREFIX[lang])
            + rng.choice([" ", ", "])
            + text
            + rng.choice([" ", ", "])
            + rng.choice(SUFFIX[lang])
        )
    return text


def drop_word(text: str, rng: random.Random) -> str:
    """Loses one word from a sentence of four or more — a visitor's ellipsis,
    and a push towards reading the whole sentence rather than one cue."""
    ws = text.split()
    if len(ws) < 4:
        return text
    i = rng.randrange(len(ws))
    if "{" in ws[i]:
        return text
    return " ".join(ws[:i] + ws[i + 1 :])


def noise(text: str, lang: str, rng: random.Random) -> str:
    """The full treatment: a lost word, wrapping, punctuation, casing, typos.

    The word is lost before the lead-in is added, so the guard in drop_word
    sees the template's own length and a one-word template keeps its word."""
    if rng.random() < 0.18:
        text = drop_word(text, rng)
    text = wrap(text, lang, rng)
    if rng.random() < 0.5:
        text = text.rstrip("?!. ") + rng.choice(PUNCT)
    c = rng.random()
    if c < 0.10:
        text = text.upper()
    elif c < 0.35:
        text = text[:1].upper() + text[1:]
    t = rng.random()
    if t < 0.30:
        text = typo(text, lang, rng)
        if t < 0.06 and len(text) > 20:
            text = typo(text, lang, rng)
    return text
