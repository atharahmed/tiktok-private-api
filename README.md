# Unofficial TikTok private API client

This is an unofficial light-weight scraper for TikTok.com to fetch posts and user info.

## Installation

```
npm i tiktok-private-api
```

## Importing

### TypeScript

```ts
import { TikTokClient } from "tiktok-private-api";
```

## Examples

### Fetch user info

```ts
import { TikTokClient } from "tiktok-private-api";

(async () => {
  const scraper = new TikTokClient();

  const data = await scraper.user.info("redbull");

  console.log(data);
})();
```

## Contributions

Software contributions are welcome.

If you need features that are not implemented — feel free to implement them and create PRs!

## Questions?

Please open an issue if you have questions, wish to request a feature, etc.
