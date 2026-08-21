import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/home/Hero';
import DiveTypes from '@/components/home/DiveTypes';
import Packages from '@/components/home/Packages';
import Courses from '@/components/home/Courses';
import ReefExplorer from '@/components/home/ReefExplorer';
import WhyUs from '@/components/home/WhyUs';
import Team from '@/components/home/Team';
import Reviews from '@/components/home/Reviews';
import Gallery from '@/components/home/Gallery';
import FinalCTA from '@/components/home/FinalCTA';
import { getDives, getCourses, getFeaturedReviews, getSettings, groupDivesByCategory, diveCategory } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { diveCentreSchema } from '@/lib/schema';
import { fromPrice, cheapestDive } from '@/lib/format';

// ISR: serve from edge cache, refresh every 60s (admin edits appear within ~1 min).
export const revalidate = 60;

export default async function HomePage() {
  const [dives, courses, reviews, rawSettings, google] = await Promise.all([
    getDives(),
    getCourses(),
    getFeaturedReviews(),
    getSettings(),
    getGoogleReviews(),
  ]);
  // Once Google Places is configured, every "[XX]+ reviews" trust line and the
  // AggregateRating schema below reflect the real live count, not just whatever
  // was last typed into admin → Settings.
  const settings = withLiveRating(rawSettings, google);
  const grouped = groupDivesByCategory(dives);
  // cheapest Discover Scuba dive for the hero price hook ("from ₹X")
  const tryDives = dives.filter((d) => diveCategory(d) === 'discover');
  const tryFrom = fromPrice(tryDives.length ? tryDives : dives);
  const cheapestTry = cheapestDive(tryDives.length ? tryDives : dives);
  const tryFromSite = cheapestTry?.site ?? null;

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <Hero settings={settings} tryFrom={tryFrom} tryFromSite={tryFromSite} />

      <div className="sheet">
        <DiveTypes dives={dives} />
        <Packages grouped={grouped} settings={settings} tryFrom={tryFrom} />
        <Courses courses={courses} whatsapp={settings.whatsapp} />
        <ReefExplorer whatsapp={settings.whatsapp} />
        <WhyUs />
        <Team />
        <Reviews reviews={reviews} settings={settings} google={google} />
        <Gallery />
      </div>

      <FinalCTA settings={settings} />
      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />

      <JsonLd data={diveCentreSchema(settings)} />
    </>
  );
}
