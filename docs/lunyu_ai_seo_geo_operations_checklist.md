# lunyu.ai SEO/GEO Operations Checklist

> Scope: external-account and weekly PDCA actions that cannot be completed by repo code alone.
> Canonical host: `https://www.lunyu.ai`
> Last updated: 2026-07-08

## One-Time Submission

### 2026-07-08 Production Verification Log

- Production deployment: `dpl_FPvMunDc7a9QYYZjN4ri5CVUY25m`
- Production alias: `https://www.lunyu.ai`
- Sitemap: `https://www.lunyu.ai/sitemap.xml`
  - Status: HTTP 200
  - URL count: 1161
  - Trust pages present: `/zh-Hans/about`, `/en/sources`, `/zh-Hans/faq`
  - Stable lastmod present: `2026-07-07`
  - Old build-time timestamp removed: `2026-07-07T06:55:01.904Z`
- Trust page spot checks:
  - `https://www.lunyu.ai/zh-Hans/about`: HTTP 200
  - `https://www.lunyu.ai/en/sources`: HTTP 200
  - `https://www.lunyu.ai/zh-Hans/faq`: HTTP 200
- Passage schema spot check:
  - URL: `https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-001`
  - Article JSON-LD fields present: `dateModified`, `license`, `isAccessibleForFree`, `hasPart`
  - Page-level Twitter metadata present: `twitter:title`, `twitter:description`
- Static RAG contract spot check:
  - URL: `https://www.lunyu.ai/api/chat`
  - Mode: `token-free-rag-static`
  - Fields present: `sourceText`, `explanation`, `modernReflection`, `returnUrl`
- IndexNow submission:
  - Key URL: `https://www.lunyu.ai/0d395b7937ed1e80d4f83035261cf2b8.txt`
  - Endpoint: `https://api.indexnow.org/indexnow`
  - Submitted URL count: 17
  - Response: HTTP 200
- Google Search Console sitemap submission:
  - Status: pending account access.
  - Reason: Search Console UI/API requires verified property access or OAuth credentials.
- Bing Webmaster Tools sitemap submission:
  - Status: pending account access.
  - Reason: Bing Webmaster UI/API requires verified site access or API key.

### 2026-07-08 PDCA Metrics Snapshot

| Metric | Source | 2026-07-08 status |
|---|---|---|
| Sitemap URL count | Production curl | 1161 |
| Published trust pages | Production curl | 3/3 spot checks HTTP 200 |
| Passage structured data | Production HTML | Required Article fields present |
| FAQ / trust crawlability | Production curl | Trust routes are prerendered HTTP 200 |
| Static RAG contract | Production API spot check | Required fields present |
| IndexNow submission | `api.indexnow.org` | HTTP 200 |
| Google indexed pages | GSC | Pending verified account access |
| Google sitemap read date | GSC | Pending verified account access |
| Google crawl/indexing errors | GSC | Pending verified account access |
| Bing indexed pages | Bing Webmaster Tools | Pending verified account access |
| Bing sitemap read date | Bing Webmaster Tools | Pending verified account access |
| Rich result validation | Google Rich Results / Schema Validator | Pending external validator run |
| AI citation quality | Manual prompt test | Pending weekly GEO prompt set |

### Google Search Console

1. Open Google Search Console.
2. Use the domain property `sc-domain:lunyu.ai` if already verified; otherwise verify the domain property first.
3. Submit sitemap: `https://www.lunyu.ai/sitemap.xml`.
4. Inspect and request indexing for:
   - `https://www.lunyu.ai/en`
   - `https://www.lunyu.ai/zh-Hans`
   - `https://www.lunyu.ai/en/analects`
   - `https://www.lunyu.ai/zh-Hans/analects`
   - `https://www.lunyu.ai/en/analects/xue-er/xue-er-001`
   - `https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-001`
   - `https://www.lunyu.ai/en/about`
   - `https://www.lunyu.ai/zh-Hans/sources`
   - `https://www.lunyu.ai/en/faq`
5. Expected status after crawl: submitted sitemap is discovered; sample pages are not blocked by robots; canonical is the inspected URL.

### Bing Webmaster Tools

1. Add or verify `https://www.lunyu.ai`.
2. Submit sitemap: `https://www.lunyu.ai/sitemap.xml`.
3. Confirm IndexNow key route is reachable:
   - `https://www.lunyu.ai/0d395b7937ed1e80d4f83035261cf2b8.txt`
4. Submit high-value URLs first:
   - locale home pages
   - `/analects`
   - twenty book pages
   - trust pages: `/about`, `/method`, `/sources`, `/faq`
5. Expected status: Bing accepts sitemap and IndexNow ownership key returns HTTP 200.

### Rich Results / Schema Validation

Validate these pages with Google Rich Results Test or Schema Markup Validator:

- `https://www.lunyu.ai/en`
- `https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-001`
- `https://www.lunyu.ai/en/faq`
- `https://www.lunyu.ai/en/sources`
- `https://www.lunyu.ai/en/index/confucius`
- `https://www.lunyu.ai/en/blogs/how-to-read-the-analects`

Expected result: no fatal structured-data errors. Warnings are acceptable only when the field is genuinely not applicable.

## Weekly PDCA

### Plan

- Pick 10 low-impression pages from GSC and 10 important passages from the editorial backlog.
- Pick one trust or source page to review for clarity.
- Pick one AI/GEO citation prompt to test.

### Do

- Update content only through the editorial workflow.
- Re-run:
  - `npm run lint`
  - `npm run build`
  - `npm run qa:seo`
- Deploy only after all three pass.
- Submit changed URLs through sitemap discovery or IndexNow.

### Check

Record weekly metrics:

| Metric | Source | Target |
|---|---|---|
| Indexed pages | GSC / Bing | rising trend |
| Sitemap read date | GSC / Bing | within 7 days |
| Pages with canonical mismatch | GSC | 0 known regressions |
| 404 / soft 404 | GSC / Bing | 0 for published sitemap URLs |
| Top queries | GSC | identify content gaps |
| Passage page clicks | GSC / GA | rising trend |
| AI citation quality | manual prompt test | cites exact passage URL and separates source/explanation/reflection |
| QA script result | local CI/manual | pass |

### Act

- If pages are discovered but not indexed, improve internal links from book pages, FAQ, and trust pages.
- If AI answers cite only the homepage, strengthen `llms.txt` and trust-page citation instructions.
- If a passage has source uncertainty, mark it for editorial review before adding interpretation.
- If a schema warning repeats for non-optional fields, fix JSON-LD and add a QA assertion.

## Release Gate

Before production deploy:

- `npm run lint` passes.
- `npm run build` passes.
- `npm run qa:seo` passes.
- `curl -I https://www.lunyu.ai/sitemap.xml` returns 200.
- `curl -I https://www.lunyu.ai/robots.txt` returns 200.
- `curl -I https://www.lunyu.ai/llms.txt` returns 200.
- Random sample of 5 passage pages has self-canonical, correct hreflang, and visible trust links.
