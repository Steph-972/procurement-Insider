"""
Brand Board Generator — Procurement Insider
Direction A : Encre & Terracotta
canvas-design skill — system fonts edition
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ─── Canvas (A3 landscape @ 150 ppi) ──────────────────────────────
W, H = 2480, 1754

# ─── Palette ───────────────────────────────────────────────────────
INK    = (15,  15,  30)
INK2   = (26,  26,  46)
INK3   = (22,  22,  37)
TERRA  = (196, 97,  28)
TERRA2 = (224, 120, 64)
CREAM  = (240, 237, 232)
MUTED  = (156, 153, 168)
BORDER = (42,  42,  68)

# ─── System fonts (Windows) ────────────────────────────────────────
FD = r"C:\Windows\Fonts"

def F(name, size):
    try:
        return ImageFont.truetype(os.path.join(FD, name), size)
    except Exception:
        return ImageFont.load_default()

def tw(draw, text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0]

def th_f(draw, text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[3] - bb[1]

def draw_text_c(draw, text, cx, y, font, fill):
    w = tw(draw, text, font)
    draw.text((cx - w // 2, y), text, font=font, fill=fill)

# ─── Build canvas ──────────────────────────────────────────────────
img  = Image.new("RGB", (W, H), INK)
d    = ImageDraw.Draw(img)
PAD  = 88
LDIV = 940   # left column right edge
RDIV = 970   # right column left edge

# Global accent rules
d.rectangle([0, 0, W, 4], fill=TERRA)
d.rectangle([0, H - 4, W, H], fill=TERRA)

# Left panel bg
d.rectangle([0, 0, LDIV, H], fill=INK3)
# Vertical terracotta divider
d.rectangle([LDIV, 0, RDIV, H], fill=TERRA)

# ══════════════════════════════════════════════════════════════════
# LEFT — hero mockup
# ══════════════════════════════════════════════════════════════════
LCX = LDIV // 2

# — Nav bar —
NAV_H = 88
d.rectangle([0, 0, LDIV, NAV_H], fill=INK)
d.rectangle([0, NAV_H - 1, LDIV, NAV_H], fill=BORDER)

dot_x, dot_y = PAD, 37
d.ellipse([dot_x, dot_y, dot_x + 14, dot_y + 14], fill=TERRA)
d.text((dot_x + 24, 30), "Procurement Insider",
       font=F("GARAIT.TTF", 36), fill=CREAM)

nav_f = F("consola.ttf", 19)
nav_items = ["Services", "A propos", "Contact"]
nx = LDIV - PAD
for item in reversed(nav_items):
    w = tw(d, item, nav_f)
    d.text((nx - w, 33), item, font=nav_f, fill=MUTED)
    nx -= w + 36

# — Mono label —
y = NAV_H + 90
label_f = F("consola.ttf", 24)
d.text((PAD, y), "- CONSULTANT MARCHES PUBLICS  MARTINIQUE",
       font=label_f, fill=TERRA)

# Terracotta hairline
d.rectangle([PAD, y + 44, PAD + 48, y + 46], fill=TERRA)

# — Headline —
y += 78
lines = [
    ("Remporter",          F("GARAIT.TTF", 118), CREAM),
    ("un marche public,",  F("GARAIT.TTF", 118), CREAM),
    ("c'est l'offre",      F("GARA.TTF",   100), CREAM),
    ("qu'on merite.",      F("GARA.TTF",   100), TERRA),
]
for txt, fnt, col in lines:
    d.text((PAD, y), txt, font=fnt, fill=col)
    y += th_f(d, txt, fnt) + 6

# — Subtitle —
y += 22
sub_f = F("segoeui.ttf", 28)
for line in [
    "12 ans des deux cotes de la commande",
    "publique. Acheteur en collectivite,",
    "puis conseil aux entreprises.",
]:
    d.text((PAD, y), line, font=sub_f, fill=MUTED)
    y += 36

# — CTA buttons —
y += 34
BH = 58
# Primary
d.rectangle([PAD, y, PAD + 330, y + BH], fill=TERRA)
btn_f = F("consola.ttf", 22)
t = "DEMANDER UN DIAGNOSTIC"
bw = tw(d, t, btn_f)
d.text((PAD + (330 - bw) // 2, y + (BH - th_f(d, t, btn_f)) // 2),
       t, font=btn_f, fill=INK)
# Ghost
gx = PAD + 346
d.rectangle([gx, y, gx + 220, y + BH], outline=BORDER, width=1)
t2 = "VOIR LES SERVICES"
bw2 = tw(d, t2, btn_f)
d.text((gx + (220 - bw2) // 2, y + (BH - th_f(d, t2, btn_f)) // 2),
       t2, font=btn_f, fill=MUTED)

# — Stats row —
y += BH + 60
d.rectangle([PAD, y, LDIV - PAD, y + 1], fill=BORDER)
y += 26

stat_val_f  = F("GARA.TTF",   76)
stat_lbl_f  = F("consola.ttf", 19)
stats = [("12",   "ANS EXP."),
         ("+350", "MARCHES"),
         ("97%",  "CONFORMES")]
col_xs = [PAD + 95, PAD + 315, PAD + 545]

for (val, lbl), cx in zip(stats, col_xs):
    vw = tw(d, val, stat_val_f)
    d.text((cx - vw // 2, y), val, font=stat_val_f, fill=TERRA)
    vy = y + th_f(d, val, stat_val_f) + 4
    lw = tw(d, lbl, stat_lbl_f)
    d.text((cx - lw // 2, vy), lbl, font=stat_lbl_f, fill=MUTED)

# Direction badge bottom-left
d.text((PAD, H - 55),
       "Direction A  Encre & Terracotta  2024",
       font=F("consola.ttf", 20), fill=TERRA)

# ══════════════════════════════════════════════════════════════════
# RIGHT — palette · typographie · composants
# ══════════════════════════════════════════════════════════════════
RX0 = RDIV + PAD
RX1 = W - PAD
ry  = 68

sec_f = F("consola.ttf", 22)

def section_header(label, y):
    d.text((RX0, y), label, font=sec_f, fill=TERRA)
    d.rectangle([RX0, y + 34, RX0 + len(label) * 13, y + 35], fill=BORDER)
    return y + 58

# ── 01 · PALETTE ──────────────────────────────────────────────────
ry = section_header("01  PALETTE", ry)

swatches = [
    (INK,    "#0F0F1E", "Encre profonde"),
    (INK2,   "#1A1A2E", "Indigo nuit"),
    (INK3,   "#161625", "Encre moyenne"),
    (TERRA,  "#C4611C", "Terracotta"),
    (TERRA2, "#E07840", "Terracotta vif"),
    (CREAM,  "#F0EDE8", "Blanc chaud"),
]
SW, SH = 195, 120
SP = 10
hex_f  = F("consola.ttf", 18)
name_f = F("segoeui.ttf", 20)

for i, (col, hex_code, name) in enumerate(swatches):
    row  = i // 3
    col_i = i % 3
    sx = RX0 + col_i * (SW + SP)
    sy = ry + row * (SH + 50)
    d.rectangle([sx, sy, sx + SW, sy + SH], fill=col)
    if col == CREAM:
        d.rectangle([sx, sy, sx + SW, sy + SH], outline=BORDER, width=1)
    d.text((sx, sy + SH + 6),  hex_code, font=hex_f,  fill=MUTED)
    d.text((sx, sy + SH + 26), name,     font=name_f, fill=CREAM)

ry += (SH + 50) * 2 + 60

# ── 02 · TYPOGRAPHIE ──────────────────────────────────────────────
ry = section_header("02  TYPOGRAPHIE", ry)

typo_rows = [
    ("GARAMOND  titres",  F("GARAIT.TTF", 60), "Aa Bb — L'Expert"),
    ("SEGOE UI  corps",   F("segoeui.ttf", 36), "Audit · Formation · Ingenierie"),
    ("CONSOLAS  labels",  F("consola.ttf", 30), "01 MAPA CCTP RC 97%"),
]
for label, fnt, sample in typo_rows:
    d.text((RX0, ry), label, font=F("consola.ttf", 19), fill=MUTED)
    ry += 28
    d.text((RX0, ry), sample, font=fnt, fill=CREAM if label != "CONSOLAS  labels" else TERRA)
    ry += th_f(d, sample, fnt) + 26

ry += 12

# ── 03 · COMPOSANTS ───────────────────────────────────────────────
ry = section_header("03  COMPOSANTS", ry)

# Service card
CW, CH = 348, 178
d.rectangle([RX0, ry, RX0 + CW, ry + CH], fill=INK3, outline=BORDER)
d.text((RX0 + 22, ry + 20), "01 - Entreprises",
       font=F("consola.ttf", 20), fill=TERRA)
d.text((RX0 + 22, ry + 50), "Audit & construction",
       font=F("GARAIT.TTF", 36), fill=CREAM)
d.text((RX0 + 22, ry + 90), "d'offre",
       font=F("GARAIT.TTF", 36), fill=CREAM)
d.text((RX0 + 22, ry + 132), "Relecture criteres memoire technique",
       font=F("segoeui.ttf", 20), fill=MUTED)
d.text((RX0 + 22, ry + 156), "En savoir plus  >",
       font=F("consola.ttf", 18), fill=TERRA)

# Testimonial card
tx = RX0 + CW + 20
d.rectangle([tx, ry, tx + CW, ry + CH], fill=INK2, outline=BORDER)
d.text((tx + 22, ry + 16), '"Le dossier a gagne en clarte,',
       font=F("GARAIT.TTF", 28), fill=CREAM)
d.text((tx + 22, ry + 48), "en preuves et en coherence.",
       font=F("GARAIT.TTF", 28), fill=CREAM)
d.text((tx + 22, ry + 80), "Une reponse nettement plus",
       font=F("GARAIT.TTF", 28), fill=CREAM)
d.text((tx + 22, ry + 112), 'professionnelle."',
       font=F("GARAIT.TTF", 28), fill=CREAM)
AV = 30
d.ellipse([tx + 22, ry + 146, tx + 22 + AV, ry + 146 + AV],
          outline=TERRA, width=1)
d.text((tx + 28, ry + 150), "TP", font=F("consola.ttf", 16), fill=TERRA)
d.text((tx + 66, ry + 150), "Dirigeant  TPE BTP, Martinique",
       font=F("segoeui.ttf", 18), fill=MUTED)

ry += CH + 22

# Buttons
for bg, fg, label, bw_px in [
    (TERRA,  INK,   "DEMANDER UN DIAGNOSTIC", 380),
    (INK3,   CREAM, "VOIR LES SERVICES  >",   260),
]:
    d.rectangle([RX0, ry, RX0 + bw_px, ry + 52], fill=bg, outline=BORDER)
    lf = F("consola.ttf", 21)
    lw = tw(d, label, lf)
    d.text((RX0 + (bw_px - lw) // 2, ry + (52 - th_f(d, label, lf)) // 2),
           label, font=lf, fill=fg)
    RX0 += bw_px + 16
RX0 = RDIV + PAD  # reset

ry += 52 + 32

# ── 04 · SIGNATURE ────────────────────────────────────────────────
ry = section_header("04  SIGNATURE", ry)

sig1 = F("GARA.TTF",    58)
sig2 = F("GARAIT.TTF",  58)
d.text((RX0, ry), "L'expertise qui change", font=sig1, fill=CREAM)
ry += th_f(d, "L'expertise qui change", sig1) + 4
d.text((RX0, ry), "le resultat de votre dossier.", font=sig2, fill=TERRA)
ry += th_f(d, "le resultat de votre dossier.", sig2) + 22
d.text((RX0, ry),
       "Procurement Insider  Martinique  2024",
       font=F("segoeui.ttf", 24), fill=MUTED)

# Watermark bottom-right
d.text((RX1 - 420, H - 52),
       "canvas-design  Direction A  Encre & Terracotta",
       font=F("consola.ttf", 18), fill=BORDER)

# ─── Save ──────────────────────────────────────────────────────────
OUT = os.path.join(os.path.dirname(__file__), "..", "brand-board-direction-A.png")
OUT = os.path.abspath(OUT)
img.save(OUT, "PNG")
kb = os.path.getsize(OUT) // 1024
print(f"Brand board saved: {OUT}  ({kb} KB)")
