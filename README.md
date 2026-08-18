# Piyush weds Kiran

Final mobile-first wedding website for **www.piyushwedskiran.com**, built for GitHub Pages. Its **Grand Reveal** design begins behind wine-coloured silk curtains in a royal palace, then opens into a gold-framed cinematic invitation, private PIN access, guest invitation, celebration cards, couple's story and RSVP—without changing the live guest service.

The website begins with a full-screen curtain reveal; music starts only when the curtains are drawn. Once verified, each guest sees only the events selected for them, with the time, venue, address and a directions link for each event.

## Before publishing

1. The project includes `music/wedding.mp3`. Replace it with your licensed final track only if you want to change the music.
2. Create a Google Sheet. Open **Extensions → Apps Script**, replace the starter code with `backend/Code.gs`, save, and run `setupGuestSheet` once. Approve Google’s permissions.
3. In its `Guests` tab, add your guests under the headers created by the script. PIN cells must be formatted as **Plain text** so leading zeroes are preserved. Use `TRUE` / `FALSE` for every event column. `Venue Name`, `Venue Address`, and `Directions URL` are optional and may be shared by all guests.
4. In Apps Script, choose **Deploy → New deployment → Web app**. Set “Execute as” to **Me** and “Who has access” to **Anyone**, then deploy. Copy the `/exec` URL.
5. In `assets/app.js`, set `API_URL` to that URL. The delivered project already contains the current deployment URL. Never publish editing access to the Google Sheet.

## Important: make saved RSVPs reappear

This version reads the RSVP row already saved for a guest’s PIN when they log in again, and gives that guest a confirmed **Clear my RSVP** action. To activate it, replace the code in your existing Apps Script project with the included `backend/Code.gs`, save, then choose **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. Your existing `/exec` address stays the same; the spreadsheet needs no changes.

Example Guests data:

| PIN | Name | Ring Ceremony | Shagun | Sangeet | Cocktail | Mehendi | Haldi | Wedding |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 012345 | Aditi Sharma | TRUE | TRUE | TRUE | FALSE | FALSE | TRUE | TRUE |

## GitHub Pages and domain

1. Create a repository, upload the **contents** of this folder (not the folder itself), and push to `main`.
2. In GitHub **Settings → Pages**, deploy from the `main` branch at `/ (root)`.
3. In your domain provider, point `www` with a CNAME record to `<your-github-username>.github.io`. The included `CNAME` file configures `www.piyushwedskiran.com` in GitHub Pages.
4. In GitHub Pages settings, add the custom domain and enable **Enforce HTTPS** once it becomes available.

The date used by the countdown is 12 December 2026 at 6:00 PM IST. Change `2026-12-12T18:00:00+05:30` in `assets/app.js` if the ceremony time or year differs.

## Security note

PINs personalise invitations; they are not high-security credentials. Keep the spreadsheet private. The Apps Script only returns one matched guest and stores RSVP rows in the private spreadsheet.
