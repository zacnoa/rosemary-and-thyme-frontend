// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

/**
 * Server entry point: renders the outer HTML document every request is
 * wrapped in (fonts, viewport meta, the `data-theme`-driven background
 * pattern from app.css, and the `<div id="app">` entry-client.tsx hydrates
 * into) - `app.tsx`'s `<Router>` fills in `{children}`.
 */
export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="bg-background bg-x-pattern-sm md:bg-x-pattern">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Electrolize&display=swap" rel="stylesheet" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
