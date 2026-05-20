# GoodStuff Analytics

GoodStuff currently uses Google Analytics 4 Measurement ID `G-49G5GBLQRP`.

The fixed Google tag is in `index.html`. It sets `send_page_view: false` because this is a React single-page app; route page views are sent manually from `src/lib/analytics.ts` after the page metadata updates.

The Measurement ID is public by design. It is safe to include in frontend code. If the old GA4 property or web data stream was deleted, create a new GA4 web stream and replace this ID. If GA4 shows `G-49G5GBLQR` without the final `P`, treat that as a mismatch and use the full Measurement ID shown in the Google tag snippet: `G-49G5GBLQRP`.

## What Is Tracked

- `page_view`: sent when the SPA route content loads and `setPageMeta` updates the page title/canonical URL.
- `affiliate_click`: sent when a rendered article link points to `s.shopee.*`.

The `affiliate_click` event includes these event parameters:

- `affiliate_network`: currently `shopee`.
- `link_domain`: for example `s.shopee.tw`.
- `link_url`: the clicked Shopee short URL.
- `link_text`: visible link text, trimmed.
- `page_path`: the current GoodStuff page path.
- `book_slug` and `chapter_slug`: article location.

## How To View It In GA4

1. Open Google Analytics.
2. Select the property that owns `G-49G5GBLQRP`.
3. Go to `Reports -> Realtime` to confirm live page views and clicks.
4. Go to `Reports -> Engagement -> Events` and look for `affiliate_click`.
5. For easier filtering, create event-scoped custom dimensions in `Admin -> Data display -> Custom definitions` for:
   - `affiliate_network`
   - `link_domain`
   - `link_url`
   - `link_text`
   - `book_slug`
   - `chapter_slug`

## How To Change The GA4 ID

Fastest temporary override before build:

```powershell
$env:VITE_GA_MEASUREMENT_ID='G-XXXXXXXXXX'
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

Permanent default:

- Edit `DEFAULT_GA_MEASUREMENT_ID` in `src/lib/analytics.ts`.

## How To Create A New GA4 Web Stream

1. Open Google Analytics.
2. Go to `Admin -> Data streams`.
3. Choose `Add stream -> Web`.
4. Set the website URL to `https://pnforce.github.io/GoodStuff/`.
5. Copy the new Measurement ID that starts with `G-`.
6. Replace the default ID or build with `VITE_GA_MEASUREMENT_ID`.
