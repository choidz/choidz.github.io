# Blog analytics setup

This blog supports Google Analytics 4 and Microsoft Clarity through public build variables.

## GitHub Pages variables

Add these repository variables in GitHub:

- `PUBLIC_GA_MEASUREMENT_ID`: GA4 Measurement ID, for example `G-XXXXXXXXXX`
- `PUBLIC_CLARITY_PROJECT_ID`: optional Microsoft Clarity project ID

Path:

`Repository > Settings > Secrets and variables > Actions > Variables > New repository variable`

After saving the variable, run the `Deploy Astro to GitHub Pages` workflow again or push a new commit.

## Where to check visits

In Google Analytics 4:

- Realtime: current visitors
- Reports > Engagement > Pages and screens: per-post page views
- Reports > Acquisition: traffic sources

In Google Search Console:

- Performance: clicks, impressions, search terms
- Indexing > Pages: indexed and excluded URLs
- Sitemaps: submit `https://choidz.github.io/sitemap.xml`

## Notes

GitHub Pages is static hosting. It does not provide server-side visitor logs or per-post counters by itself.
Per-post views require an external analytics service such as GA4.
