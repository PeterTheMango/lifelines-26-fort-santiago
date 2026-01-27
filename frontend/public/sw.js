if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let c = {};
    const r = (e) => a(e, t),
      o = { module: { uri: t }, exports: c, require: r };
    s[t] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), c));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/TMy-DHQ0jamkYkNkJCkzn/_buildManifest.js",
          revision: "871c725e38d5ead50490b4bd5010a458",
        },
        {
          url: "/_next/static/TMy-DHQ0jamkYkNkJCkzn/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/378-2a4e5859bacfe95f.js",
          revision: "2a4e5859bacfe95f",
        },
        {
          url: "/_next/static/chunks/38-067eac7c0d51fdc2.js",
          revision: "067eac7c0d51fdc2",
        },
        {
          url: "/_next/static/chunks/477-977be6cf8a3d5564.js",
          revision: "977be6cf8a3d5564",
        },
        {
          url: "/_next/static/chunks/497-6f628794f0470785.js",
          revision: "6f628794f0470785",
        },
        {
          url: "/_next/static/chunks/4bd1b696-096d35a2bd1da3af.js",
          revision: "096d35a2bd1da3af",
        },
        {
          url: "/_next/static/chunks/548-1e38ce3cb3d091bd.js",
          revision: "1e38ce3cb3d091bd",
        },
        {
          url: "/_next/static/chunks/912-3e7014a00d4adee8.js",
          revision: "3e7014a00d4adee8",
        },
        {
          url: "/_next/static/chunks/928-8997848950e232cd.js",
          revision: "8997848950e232cd",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-a3d4f8e832675edd.js",
          revision: "a3d4f8e832675edd",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-211b7171528f74a6.js",
          revision: "211b7171528f74a6",
        },
        {
          url: "/_next/static/chunks/app/architect/demo/page-d1d641c6c9f19495.js",
          revision: "d1d641c6c9f19495",
        },
        {
          url: "/_next/static/chunks/app/architect/page-a20af97314d660e7.js",
          revision: "a20af97314d660e7",
        },
        {
          url: "/_next/static/chunks/app/inventory/page-a298b81afe080553.js",
          revision: "a298b81afe080553",
        },
        {
          url: "/_next/static/chunks/app/layout-bbcc46fc70fd29bd.js",
          revision: "bbcc46fc70fd29bd",
        },
        {
          url: "/_next/static/chunks/app/network/page-bf3c773fd97d2e9c.js",
          revision: "bf3c773fd97d2e9c",
        },
        {
          url: "/_next/static/chunks/app/page-d72f056b00ffe8af.js",
          revision: "d72f056b00ffe8af",
        },
        {
          url: "/_next/static/chunks/c36f3faa.e8399ca1a8d204a9.js",
          revision: "e8399ca1a8d204a9",
        },
        {
          url: "/_next/static/chunks/framework-75892d61b920805f.js",
          revision: "75892d61b920805f",
        },
        {
          url: "/_next/static/chunks/main-app-6511c5a1d65233eb.js",
          revision: "6511c5a1d65233eb",
        },
        {
          url: "/_next/static/chunks/main-bc6119334a82c938.js",
          revision: "bc6119334a82c938",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-a3d4f8e832675edd.js",
          revision: "a3d4f8e832675edd",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-a3d4f8e832675edd.js",
          revision: "a3d4f8e832675edd",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-5e1f3a68150046d2.js",
          revision: "5e1f3a68150046d2",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-a3d4f8e832675edd.js",
          revision: "a3d4f8e832675edd",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-a3d4f8e832675edd.js",
          revision: "a3d4f8e832675edd",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-f0d0041dc3518232.js",
          revision: "f0d0041dc3518232",
        },
        {
          url: "/_next/static/css/8793a593b0e81bec.css",
          revision: "8793a593b0e81bec",
        },
        {
          url: "/_next/static/css/bdda2ac7b192ca0a.css",
          revision: "bdda2ac7b192ca0a",
        },
        {
          url: "/_next/static/media/nunito-sans-cyrillic-ext-wght-normal.807f8a64.woff2",
          revision: "807f8a64",
        },
        {
          url: "/_next/static/media/nunito-sans-cyrillic-wght-normal.958b8893.woff2",
          revision: "958b8893",
        },
        {
          url: "/_next/static/media/nunito-sans-latin-ext-wght-normal.dde16b97.woff2",
          revision: "dde16b97",
        },
        {
          url: "/_next/static/media/nunito-sans-latin-wght-normal.89a9369d.woff2",
          revision: "89a9369d",
        },
        {
          url: "/_next/static/media/nunito-sans-vietnamese-wght-normal.904964c5.woff2",
          revision: "904964c5",
        },
        {
          url: "/_next/static/media/source-code-pro-cyrillic-400-normal.27dff3ad.woff",
          revision: "27dff3ad",
        },
        {
          url: "/_next/static/media/source-code-pro-cyrillic-400-normal.9bb5aaf9.woff2",
          revision: "9bb5aaf9",
        },
        {
          url: "/_next/static/media/source-code-pro-cyrillic-ext-400-normal.040ea99f.woff",
          revision: "040ea99f",
        },
        {
          url: "/_next/static/media/source-code-pro-cyrillic-ext-400-normal.b9f9ca09.woff2",
          revision: "b9f9ca09",
        },
        {
          url: "/_next/static/media/source-code-pro-greek-400-normal.752f7a42.woff2",
          revision: "752f7a42",
        },
        {
          url: "/_next/static/media/source-code-pro-greek-400-normal.a4dc3e08.woff",
          revision: "a4dc3e08",
        },
        {
          url: "/_next/static/media/source-code-pro-greek-ext-400-normal.0eb42c71.woff",
          revision: "0eb42c71",
        },
        {
          url: "/_next/static/media/source-code-pro-greek-ext-400-normal.b086a65f.woff2",
          revision: "b086a65f",
        },
        {
          url: "/_next/static/media/source-code-pro-latin-400-normal.4c1c2cf6.woff",
          revision: "4c1c2cf6",
        },
        {
          url: "/_next/static/media/source-code-pro-latin-400-normal.838d3b90.woff2",
          revision: "838d3b90",
        },
        {
          url: "/_next/static/media/source-code-pro-latin-ext-400-normal.85c5fe34.woff2",
          revision: "85c5fe34",
        },
        {
          url: "/_next/static/media/source-code-pro-latin-ext-400-normal.a0376390.woff",
          revision: "a0376390",
        },
        {
          url: "/_next/static/media/source-code-pro-vietnamese-400-normal.6bc621cc.woff2",
          revision: "6bc621cc",
        },
        {
          url: "/_next/static/media/source-code-pro-vietnamese-400-normal.d1c5ac25.woff",
          revision: "d1c5ac25",
        },
        {
          url: "/crisisbuild_logo.svg",
          revision: "8e64ed3402310d38abc47d28b15b9c05",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/manifest.json", revision: "f328c8c5d338f5d574ea4c69c3918615" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
