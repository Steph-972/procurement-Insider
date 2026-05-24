"""
apply_direction_A.py
Applique la palette Encre & Terracotta (Direction A) sur tous les fichiers HTML.
Remplace : couleurs navy/gold, fonte Playfair Display → Cormorant Garamond.
"""

import os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")

# Fichiers à exclure
SKIP = {"design-previews.html", "admin.html"}

# ─── Remplacements de chaînes exactes ─────────────────────────────
REPLACEMENTS = [
    # ── Google Fonts ──────────────────────────────────────────────
    # Variante 1 : avec italic weights
    (
        "family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600",
        "family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600"
    ),
    # Variante 2 : sans italic
    (
        "family=Playfair+Display:wght@400;600;700",
        "family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600"
    ),
    # Variante 3 : toute autre mention du nom dans les URLs
    (
        "Playfair+Display",
        "Cormorant+Garamond"
    ),
    # ── Nom de fonte dans le CSS ──────────────────────────────────
    (
        "'Playfair Display'",
        "'Cormorant Garamond'"
    ),
    (
        '"Playfair Display"',
        '"Cormorant Garamond"'
    ),

    # ── Hex colors ────────────────────────────────────────────────
    # Navy exact variants
    ("#0F2342",  "#0F0F1E"),
    ("#0f2342",  "#0f0f1e"),
    ("#1A3A6B",  "#1A1A2E"),
    ("#1a3a6b",  "#1a1a2e"),
    ("#243F7A",  "#2A2A3E"),
    ("#243f7a",  "#2a2a3e"),

    # Gold exact variants
    ("#C9A84C",  "#C4611C"),
    ("#c9a84c",  "#c4611c"),
    ("#E8C96A",  "#E07840"),
    ("#e8c96a",  "#e07840"),
    ("#F5E9C0",  "#FAE8DC"),
    ("#f5e9c0",  "#fae8dc"),

    # Cream
    ("#F8F5EF",  "#F0EDE8"),
    ("#f8f5ef",  "#f0ede8"),
    ("#EDE8DC",  "#E8E3DB"),
    ("#ede8dc",  "#e8e3db"),

    # Text (near-black)
    ("#1C1C2E",  "#1A1A24"),
    ("#1c1c2e",  "#1a1a24"),

    # ── rgba navy ────────────────────────────────────────────────
    ("rgba(15,35,66,",    "rgba(15,15,30,"),
    ("rgba(15, 35, 66,",  "rgba(15, 15, 30,"),

    # ── rgba gold ────────────────────────────────────────────────
    ("rgba(201,168,76,",  "rgba(196,97,28,"),
    ("rgba(201, 168, 76,","rgba(196, 97, 28,"),

    # ── rgba navy-light #243F7A used in some shadows ─────────────
    ("rgba(36,63,122,",   "rgba(42,42,62,"),
]

# ─── Remplacements regex ──────────────────────────────────────────
# Ajustement typographique Cormorant : poids 700 → 600 pour les classes serif
# On cible uniquement les classes display/h1/h2/h3 dans les blocs de variables
TYPO_PATCHES = [
    # .display { ... font-weight: 700 → 600; + font-style:italic }
    (
        r'(\.display\s*\{[^}]*?)font-weight:\s*700([^}]*?\})',
        r'\1font-weight: 600\2'
    ),
    # .h1/.h2 { ... font-weight: 600 → 400 }
    (
        r'(\.h[12]\s*\{[^}]*?)font-weight:\s*600([^}]*?\})',
        r'\1font-weight: 400\2'
    ),
]

# ─── Traitement des fichiers ───────────────────────────────────────
changed = []
skipped = []

html_files = [
    f for f in os.listdir(ROOT)
    if f.endswith(".html") and f not in SKIP
]

for fname in sorted(html_files):
    fpath = os.path.join(ROOT, fname)
    with open(fpath, "r", encoding="utf-8") as fp:
        original = fp.read()

    content = original

    # Remplacements exacts
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)

    # Remplacements regex (typographie)
    for pattern, repl in TYPO_PATCHES:
        content = re.sub(pattern, repl, content, flags=re.DOTALL)

    if content != original:
        with open(fpath, "w", encoding="utf-8") as fp:
            fp.write(content)
        # Compter les changements
        n = sum(original.count(old) for old, _ in REPLACEMENTS)
        changed.append((fname, n))
        print(f"  [OK] {fname}")
    else:
        skipped.append(fname)
        print(f"  [--] {fname}  (aucun changement)")

print(f"\nResultat : {len(changed)} fichiers modifies, {len(skipped)} inchanges.")
if changed:
    print("\nFichiers modifies :")
    for f, n in changed:
        print(f"  {f}")
