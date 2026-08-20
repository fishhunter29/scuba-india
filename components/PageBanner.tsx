// Full-width photo strip at the top of a secondary page. Sits behind the fixed
// nav and fades into the page background; the page's text hero follows below.
export default function PageBanner({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="page-banner" role="img" aria-label={alt}>
      <picture>
        <source type="image/webp" srcSet={`${image}.webp`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${image}.jpg`} alt={alt} fetchPriority="high" decoding="async" />
      </picture>
      <span className="page-banner-veil" aria-hidden="true" />
    </div>
  );
}
