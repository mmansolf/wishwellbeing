import { defineConfig } from "astro/config";
import { ContentfulContentSource } from "@stackbit/cms-contentful"; // Ensure this package is installed
import preact from "@astrojs/preact";
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://feature-tour.netlify.app',
  integrations: [
    preact(),
    sitemap({
      canonicalURL: 'https://feature-tour.netlify.app'
    }),
    ContentfulContentSource({
      spaceId: 'm7sm67fcit2i',       // replace with your actual space ID
      accessToken: 'GHupeYjVjlS02-_WJIDk36jeHyqIEddl_4PRJd0EwcI',    // replace with your actual API key
      environment: 'master',                       // adjust if you use different environments
    })
  ],
});
