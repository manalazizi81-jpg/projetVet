import Script from "next/script";

export function GoogleReviews() {
  return (
    <div className="home-google-reviews">
      <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
      <div
        className="elfsight-app-c7588631-5223-4ef5-b750-1e54fb6f7780"
        data-elfsight-app-lazy
      />
      <noscript>Activez JavaScript pour afficher les avis Google dans cette section.</noscript>
    </div>
  );
}
