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
    new ContentfulContentSource({
      spaceId: 'm7sm67fcit2i',       // replace with your actual space ID
      previewToken: 'MlURUe50wGm9tt7328rmGq8IOrQXNelWRbEfSxzE91c',
      accessToken: 'GHupeYjVjlS02-_WJIDk36jeHyqIEddl_4PRJd0EwcI',
      environment: 'master',                       // adjust if you use different environments
    })
  ],
});
