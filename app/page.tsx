import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/home/Hero';
import Experiences from '@/components/home/Experiences';
import Packages from '@/components/home/Packages';
import Courses from '@/components/home/Courses';
import DiveSites from '@/components/home/DiveSites';
import WhyUs from '@/components/home/WhyUs';
import Reviews from '@/components/home/Reviews';
import FinalCTA from '@/components/home/FinalCTA';
import { getDives, getCourses, getFeaturedReviews, getSettings, groupDivesBySite } from '@/lib/data';
import { getGoogleReviews } from '@/lib/google-reviews';
import { diveCentreSchema } from '@/lib/schema';

// ISR: serve from edge cache, refresh every 60s (admin edits appear within ~1 min).
export const revalidate = 60;

export default async function HomePage() {
  const [dives, courses, reviews, settings, google] = await Promise.all([
    getDives(),
    getCourses(),
    getFeaturedReviews(),
    getSettings(),
    getGoogleReviews(),
  ]);
  const grouped = groupDivesBySite(dives);

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />

      <Hero settings={settings} />

      <div className="sheet">
        <Experiences dives={dives} courses={courses} />
        <Packages grouped={grouped} />
        <Courses courses={courses} />
        <DiveSites dives={dives} />
        <WhyUs />
        <Reviews reviews={reviews} settings={settings} google={google} />
      </div>

      <FinalCTA settings={settings} />
      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} />

      <JsonLd data={diveCentreSchema(settings)} />
    </>
  );
}
