import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toko Bangunan Jaya - Material Berkualitas",
  description: "Pusat material bangunan berkualitas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <Script
          id="maze-snippet"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (m, a, z, e) {
                var s, t, u, v;
                try {
                  t = m.sessionStorage.getItem('maze-us');
                } catch (err) {}

                if (!t) {
                  t = new Date().getTime();
                  try {
                    m.sessionStorage.setItem('maze-us', t);
                  } catch (err) {}
                }

                u = document.currentScript || (function () {
                  var w = document.getElementsByTagName('script');
                  return w[w.length - 1];
                })();
                v = u && u.nonce;

                s = a.createElement('script');
                s.src = z + '?apiKey=' + e;
                s.async = true;
                if (v) s.setAttribute('nonce', v);
                a.getElementsByTagName('head')[0].appendChild(s);
                m.mazeUniversalSnippetApiKey = e;
              })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'c5108e1a-fa08-4a0c-9025-984cf76b9cec');
            `
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
