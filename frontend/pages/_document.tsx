import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="bg-background">
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="application-name" content="homemind" />
        <meta
          name="description"
          content="homemind - Your intelligent estate assistant providing personalized property recommendations in Chapel Hill."
        />
        <meta
          name="keywords"
          content="Real Estate, AI, Chapel Hill, Property Recommendations, homemind"
        />
        <meta name="author" content="Sergio Sediq" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#faf9f2" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://homemind.vercel.app/favicon.ico" />
        <link
          rel="manifest"
          href="https://homemind.vercel.app/manifest.json"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="homemind - Intelligent Estate Assistant"
        />
        <meta
          property="og:site_name"
          content="homemind | Your Intelligent Estate Assistant"
        />
        <meta
          property="og:description"
          content="Discover your dream property in Chapel Hill with personalized recommendations from homemind."
        />
        <meta property="og:url" content="https://homemind.vercel.app/" />
        <meta
          property="og:image"
          content="https://homemind.vercel.app/android-chrome-512x512.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="homemind - Intelligent Estate Assistant"
        />
        <meta
          name="twitter:description"
          content="Discover your dream property in Chapel Hill with personalized recommendations from homemind."
        />
        <meta
          name="twitter:image"
          content="https://homemind.vercel.app/android-chrome-512x512.png"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
