import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/home/Hero';
import DiveTypes from '@/components/home/DiveTypes';
import CuratedPicks from '@/components/home/CuratedPicks';
import Courses from '@/components/home/Courses';
import ReefTeaser from '@/components/home/ReefTeaser';
import WhyUs from '@/components/home/WhyUs';
import Team from '@/components/home/Team';
import Reviews from '@/components/home/Reviews';
import Gallery from '@/components/home/Gallery';
import FinalCTA from '@/components/home/FinalCTA';
import { getDives, getCourses, getFeaturedReviews, getSettings, getReefs, getSections, getGalleryPhotos, diveCategory } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { diveCentreSchema } from '@/lib/schema';
import { fromPrice, cheapestDive } from '@/lib/format';

// ISR: serve from edge cache, refresh every 60s (admin edits appear within ~1 min).
export const revalidate = 60;

export default async function HomePage() {
  const [dives, courses, reviews, rawSettings, google, reefs, sections, galleryPhotos] = await Promise.all([
    getDives(),
    getCourses(),
    getFeaturedReviews(),
    getSettings(),
    getGoogleReviews(),
    getReefs(),
    getSections(),
    getGalleryPhotos(),
  ]);
  // Once Google Places is configured, every "[XX]+ reviews" trust line and the
  // AggregateRating schema below reflect the real live count, not just whatever
  // was last typed into admin → Settings.
  const settings = withLiveRating(rawSettings, google);
  // The hero quotes the cheapest thing a visitor can actually book, which is a
  // single dive at our cheapest reef. Falls back to the dive catalogue if no
  // reef carries a price.
  const cheapestReef = reefs
    .filter((r) => r.active !== false && r.price != null)
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
  const tryDives = dives.filter((d) => d.active !== false && diveCategory(d) === 'discover');
  const tryFrom = cheapestReef?.price
    ? `₹${cheapestReef.price.toLocaleString('en-IN')}`
    : fromPrice(tryDives.length ? tryDives : dives);
  const tryFromSite =
    cheapestReef?.name ?? cheapestDive(tryDives.length ? tryDives : dives)?.site ?? null;

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <Hero settings={settings} tryFrom={tryFrom} tryFromSite={tryFromSite} />

      <div className="sheet">
        {/* Reefs lead the page — picking where you dive is the decision most
            visitors want to make first. */}
        <ReefTeaser reefs={reefs} dives={dives} section={sections.reefs} whatsapp={settings.whatsapp} />
        <DiveTypes dives={dives} />
        <CuratedPicks dives={dives} whatsapp={settings.whatsapp} />
        <Courses courses={courses} whatsapp={settings.whatsapp} />
        <WhyUs section={sections.why} />
        <Team section={sections.team} />
        <Reviews reviews={reviews} settings={settings} google={google} />
        <Gallery photos={galleryPhotos} section={sections.gallery} />
      </div>

      <FinalCTA settings={settings} section={sections.final_cta} />
      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />

      <JsonLd data={diveCentreSchema(settings)} />
    </>
  );
}
