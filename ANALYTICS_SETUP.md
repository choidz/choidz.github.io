# Blog analytics setup

This blog supports Google Analytics 4 and Microsoft Clarity through public build variables.

## GitHub Pages variables

Add these repository variables in GitHub:

- `PUBLIC_GA_MEASUREMENT_ID`: GA4 Measurement ID, for example `G-XXXXXXXXXX`
- `PUBLIC_GA_PROPERTY_ID`: GA4 property ID, for example `514244650`
- `PUBLIC_GOOGLE_CLIENT_ID`: optional Google OAuth web client ID for `/admin`
- `PUBLIC_ADMIN_API_URL`: optional serverless analytics API URL for `/admin`
- `PUBLIC_CLARITY_PROJECT_ID`: optional Microsoft Clarity project ID

Path:

`Repository > Settings > Secrets and variables > Actions > Variables > New repository variable`

After saving the variable, run the `Deploy Astro to GitHub Pages` workflow again or push a new commit.

## Where to check visits

In Google Analytics 4:

- Realtime: current visitors
- Reports > Engagement > Pages and screens: per-post page views
- Reports > Acquisition: traffic sources
- Blog admin page: `https://choidz.github.io/admin`

In Google Search Console:

- Performance: clicks, impressions, search terms
- Indexing > Pages: indexed and excluded URLs
- Sitemaps: submit `https://choidz.github.io/sitemap.xml`

## Notes

GitHub Pages is static hosting. It does not provide server-side visitor logs or per-post counters by itself.
Per-post views require an external analytics service such as GA4.

## `/admin` page

The blog has a private analytics entry page at:

`https://choidz.github.io/admin`

Without OAuth setup, `/admin` provides quick links to the GA reports.
With OAuth setup, `/admin` can call the Google Analytics Data API directly and render realtime users plus per-post views inside the blog domain.

If `PUBLIC_ADMIN_API_URL` is set, `/admin` calls the serverless backend first.
The Cloudflare Worker example lives in `serverless/cloudflare-admin-api-worker.js`.
Protect that Worker with Cloudflare Access before connecting it, otherwise the analytics API would be publicly callable.

Required Google Cloud setup for direct `/admin` reports:

1. Open Google Cloud Console.
2. Enable `Google Analytics Data API`.
3. Create an OAuth client:
   - Application type: Web application
   - Authorized JavaScript origins: `https://choidz.github.io`
4. Add the OAuth client ID to GitHub Actions Variables:
   - `PUBLIC_GOOGLE_CLIENT_ID`
5. Add the GA property ID:
   - `PUBLIC_GA_PROPERTY_ID=514244650`
6. Redeploy `Deploy Astro to GitHub Pages`.

Only Google accounts that already have access to the GA4 property can read the reports.

## Serverless backend option

GitHub Pages cannot run backend code directly, so the backend must be deployed separately.
Use the Cloudflare Worker in `serverless/` when you want `/admin` to read GA data without opening the Google OAuth popup.

Required Worker variables/secrets:

- `GA_PROPERTY_ID=514244650`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `ALLOWED_ORIGIN=https://choidz.github.io`

After the Worker is deployed and protected with Cloudflare Access, add its URL to GitHub Actions Variables:

- `PUBLIC_ADMIN_API_URL=https://your-worker.example.com`
