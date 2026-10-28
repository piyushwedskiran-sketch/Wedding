# Piyush & Kiran — wedding invitations

A mobile-friendly wedding website for the existing GitHub Pages domain.

- `/`: Piyush weds Kiran, with the original guest event selections.
- `/bride/`: Kiran weds Piyush, with only the three bridal selections.
- Both use the same PIN service and one saved RSVP per PIN.

## Current design

The floral paper envelope has two opening doors, a centred PK/KP gold seal,
a light flower shower and gold sparkles. Music starts after tapping the seal.
The interior uses embroidered plum panels, jewel-coloured illustrated event
cards, polished gold accents and an emerald story timeline. The invitation
button reads **View event details**.

The countdown shows **Every moment draws closer**, then **The celebration begins
in…**. Both countdowns target **12 December 2026 at 9:00 PM IST**.

Animations respect reduced-motion preferences. Card illustrations pause when
out of view; the envelope effects stop when the cover closes out of view.

The envelope and personal invitation feature a Ganpati image. Each name on the
personal invitation is followed by the parent names supplied by the couple.
The guest greeting uses Marcellus in a larger upright style (52 px on wide screens,
34–40 px on phones), with wrapping for long guest names.

The Wedding Festivities appear against a subtle champagne-and-sage background,
with a softly faded garden detail at the top. The existing event cards retain their individual
colours and illustrations. The RSVP heading is **We Look Forward to Celebrating
With You**.

Our Story now has five illustrated chapters (2015, 2017, 2019, 2024 and 2025).
Each cartoon scene is integrated into its matching milestone card. Both pages
use the same images; the bride page tells the story from Kiran's perspective.
Her 2017 chapter is **The beginning of us**: “On the day of our last MSc exam, we took the next step from friendship into a committed relationship.”
The scenes are artistic interpretations, not documentary pictures of the
actual locations. The old standalone portrait pair is no longer displayed.
Animations pause out of view and respect reduced-motion preferences. Clear
upright numerals are used for dates, times and countdowns. See `CURRENT-ARTWORK.md` for
current image details and prompts.

## Confirmed event details

### Original invitation

| Event | Date | Time | Venue / setting |
| --- | --- | --- | --- |
| Shagun | 10 December 2026 | 5:00 PM | Hotel The Eleganza, rooftop |
| Ring Ceremony | 10 December 2026 | 6:00 PM | Hotel The Eleganza, rooftop |
| Sangeet | 10 December 2026 | 7:00 PM | Hotel The Eleganza, rooftop |
| Mehendi | 11 December 2026 | 7:00 PM | Hotel The Eleganza, main hall |
| Cocktail | 11 December 2026 | 7:00 PM | Hotel The Eleganza, rooftop |
| Haldi | 12 December 2026 | 11:00 AM | Hotel The Eleganza, rooftop |
| Baraat Departure | 12 December 2026 | 7:00 PM | Hotel The Eleganza |
| Wedding | 12 December 2026 | 9:00 PM | Annfield Lawn by Monga Tent House |

### Bride invitation

| Event | Date | Time | Venue |
| --- | --- | --- | --- |
| Mehendi | 11 December 2026 | 7:00 PM | The Kutumb Cafe & Restro — FQMR+V5, Vikasnagar, Uttarakhand |
| Haldi | 12 December 2026 | 7:00 AM | The Kutumb Cafe & Restro — FQMR+V5, Vikasnagar, Uttarakhand |
| Wedding | 12 December 2026 | 9:00 PM | Annfield Lawn by Monga Tent House |

The café and Wedding cards include directions. Both Wedding invitations use the same Annfield Lawn venue and address: **FQ67+72R, Kotwali Bypass Rd, Fatehpur, Vikasnagar, Uttarakhand 248198**. Bridal Haldi is **7 AM at the café**;
the earlier residence plan is superseded.

## Clothing notes

- Haldi: Shades of yellow.
- Sangeet: Colourful festive wear.
- Cocktail: Glamorous evening wear.
- No clothing notes on Shagun, Mehendi, Ring Ceremony, Baraat Departure or Wedding.

These notes are shared by matching event designs on both invitation versions.

## Guest sheet

Keep the `Guests` tab and the existing header row (row 2 in the supplied sheet).
Use these exact headings:

| Column | Heading |
| --- | --- |
| A | PIN |
| B | Name |
| C | Ring Ceremony |
| D | Shagun |
| E | Sangeet |
| F | Cocktail |
| G | Mehendi |
| H | Haldi |
| I | Wedding |
| J | Bridal Mehendi |
| K | Bridal Haldi |
| L | Bridal Marriage |
| M | Notes |

**Keep the sheet heading `Bridal Marriage`.** Its displayed card is now called
**Wedding**, but the backend heading and selection key remain unchanged.

Use TRUE/FALSE dropdowns for event selections. YES/NO also work; blank means not
selected. Format PIN cells as plain text to preserve leading zeroes. Bridal
columns never add cards to the original invitation, and original event columns
never add cards to the bride invitation. Old sheets without bridal columns
continue to support the original invitation.

Venue Name, Venue Address and Directions URL columns are not needed. If replacing
those old columns, preserve any information you need before clearing their values.
All venue details are now in `assets/app.js`. No new sheet changes are required
for the latest wording, schedule or design corrections.

## Backend and publication

The included `assets/app.js` retains the existing Google Apps Script deployment
URL. To enable the bridal columns if that update has not yet been deployed:

1. Replace the code in the existing Apps Script project with `backend/Code.gs`.
2. Save, then choose **Deploy → Manage deployments → Edit → New version → Deploy**.
3. Keep the current `/exec` address. The spreadsheet stays private.

Use `setupGuestSheet` only when starting an empty sheet, not on the populated
existing guest sheet. RSVPs remain in the `RSVPs` tab. The backend restores saved
responses and supports editing and confirmed clearing of a guest's RSVP.

Upload the **contents** of this folder to the current GitHub Pages repository,
including `bride/`, `assets/`, `music/` and `CNAME`. Preserve the existing Pages
settings and custom domain. `/bride` redirects to `/bride/` on GitHub Pages.

## Files to maintain

- `index.html`, `bride/index.html`: wording, layout and name order.
- `assets/app.js`: event dates, times, venue details, countdowns and RSVP flow.
- `assets/event-designs.js`: event illustrations and clothing notes. This must
  load before `app.js`. An empty `attire` string hides the clothing section.
- `assets/door-entrance.css`: opening doors and seal structure.
- `assets/ivory-celebrations.css`: jewel colours, type and event-card design.
- `assets/final-refinements.css`: seal fit, envelope shower, glossy accents,
  countdown layout and story refinements.
- `assets/couple-and-numerals.css`: invitation portrait motion and clear number typography.
- `assets/story-garden.css`: Ganpati, parent names, garden setting and integrated story chapters.
- `assets/story-2015.jpg` through `assets/story-2025.jpg`: the five cartoon story scenes.
- `assets/ganpati.png`, `assets/wedding-garden.png`: devotional artwork and celebration background.
- `assets/wedding-couple.png`, `assets/couple-back.png`, `assets/couple-wedding-attire.png`: personalised illustrations.
- `assets/envelope-blossom.svg`: lightweight floral shower artwork.
- `music/wedding.mp3`: the existing music track.

The approved wording remains:

- “Two hearts, one beautiful beginning. Join us as we celebrate our wedding.”
- “A celebration of love and togetherness.”
- “With love and joy, we invite you to join us as we begin our forever.”

Story images are served as smaller JPEGs and load eagerly on both pages. Natural image dimensions reserve their space on phones; their visibility does not depend on animation. Original PNG artwork remains available for future editing.
