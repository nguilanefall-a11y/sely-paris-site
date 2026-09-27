import os
from PIL import Image, ImageOps

public_dir = 'public'
journal_dir = 'public/journal'
os.makedirs(journal_dir, exist_ok=True)

TARGET_W = 1920
TARGET_H = 1080

def fit_16_9(img_path, out_path):
    if not os.path.exists(img_path):
        print(f"ERROR: {img_path} not found")
        return
    im = Image.open(img_path).convert('RGB')
    cropped = ImageOps.fit(im, (TARGET_W, TARGET_H), method=Image.Resampling.LANCZOS)
    cropped.save(out_path, 'JPEG', quality=90)
    print(f"Created: {out_path} from {img_path}")

def make_composite(img1_path, img2_path, out_path):
    im1 = Image.open(img1_path).convert('RGB')
    im2 = Image.open(img2_path).convert('RGB')
    half_w = TARGET_W // 2
    im1_crop = ImageOps.fit(im1, (half_w, TARGET_H), method=Image.Resampling.LANCZOS)
    im2_crop = ImageOps.fit(im2, (half_w, TARGET_H), method=Image.Resampling.LANCZOS)
    comp = Image.new('RGB', (TARGET_W, TARGET_H))
    comp.paste(im1_crop, (0, 0))
    comp.paste(im2_crop, (half_w, 0))
    divider_color = (212, 175, 55) # gold
    for y in range(TARGET_H):
        comp.putpixel((half_w - 1, y), divider_color)
        comp.putpixel((half_w, y), divider_color)
    comp.save(out_path, 'JPEG', quality=90)
    print(f"Created composite: {out_path}")

# Mapping of all 40 topics
topic_sources = {
    1: ('journal/journal_chauffeur_cost.jpg', False),
    2: ('processus_hero.png', False),
    3: ('experience_chauffeur.png', False),
    4: ('journal/journal_cdg_vs_taxi.jpg', False),
    5: ('service_sur_mesure.png', False),
    6: ('louvre-chauffeur-sunset.jpg', False),
    7: ('london_hourly_bg.jpg', False),
    8: ('experience_onboard.png', False),
    9: ('versailles_chateau.png', False),
    10: ('experience_fleet.png', False),
    11: ('journal/journal_cdg_cost.jpg', False),
    12: ('journal/journal_cdg_duration.jpg', False),
    13: ('journal/journal_cdg_meeting.jpg', False),
    14: ('journal/journal_cdg_vs_taxi.jpg', False),
    15: ('journal/journal_flight_delay.jpg', False),
    16: ('journal/journal_orly_cost.jpg', False),
    17: ('journal/journal_meet_greet.jpg', False),
    18: ('transfert_airport_van.png', False),
    19: ('peugeot-traveller-interior.jpg', False),
    20: ('minibus-7-vip-interior.jpg', False),
    21: ('composite:eclass-paris-luxury.jpg:sclass_paris.png', True),
    22: ('composite:sclass-main-new.jpg:maybach-paris-luxury.jpg', True),
    23: ('composite:vclass-paris-luxury.jpg:sclass_paris.png', True),
    24: ('composite:vclass-paris-luxury.jpg:mercedes_sprinter_vip.png', True),
    25: ('vclass_interior_vip_lounge.jpg', False),
    26: ('sclass-rear-paris-composite.jpg', False),
    27: ('luxury_shopping_paris.png', False),
    28: ('journal/journal_bourget_jet.jpg', False),
    29: ('journal/journal_bourget_fbo.jpg', False),
    30: ('sur_mesure_conciergerie.png', False),
    31: ('haute-couture-loader-bg.jpg', False),
    32: ('sclass_paris_hero.jpg', False),
    33: ('sclass_paris.png', False),
    34: ('paris_hero_eiffel.jpg', False),
    35: ('vclass-paris-luxury.jpg', False),
    36: ('composite:sclass_paris.png:vclass-paris-luxury.jpg', True),
    37: ('wedding_limousine.png', False),
    38: ('eclass-interior-paris-eiffel.jpg', False),
    39: ('experience_chauffeur_no_watch.png', False),
    40: ('paris_hero_vendome.jpg', False),
}

for topic_id, (src, is_comp) in topic_sources.items():
    out_file = os.path.join(journal_dir, f"journal_topic_{topic_id:02d}.jpg")
    if is_comp:
        _, p1, p2 = src.split(':')
        make_composite(os.path.join(public_dir, p1), os.path.join(public_dir, p2), out_file)
    else:
        full_src = os.path.join(public_dir, src)
        fit_16_9(full_src, out_file)

print("\n[SUCCESS] Generated all 40 thematic images in public/journal/!")
