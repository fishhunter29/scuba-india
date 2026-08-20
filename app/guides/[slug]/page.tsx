import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import PageBanner from '@/components/PageBanner';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import PostBody from '@/components/PostBody';
import { getPostBySlug, getAllPostSlugs, getSettings } from '@/lib/data';
import { waGeneral } from '@/lib/whatsapp';
import { articleSchema, articleBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Guide not found' };
  const description = post.excerpt || post.title;
  return {
    title: `${post.title} — Scuba Guide, Scuba India`,
    description,
    alternates: { canonical: `${SITE_URL}/guides/${params.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/guides/${params.slug}`,
      type: 'article',
    },
  };
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const [post, settings] = await Promise.all([
    getPostBySlug(params.slug),
    getSettings(),
  ]);
  if (!post) notFound();

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <main className="detail has-banner">
        <PageBanner image="/images/banner-guides" alt="Scuba India dive crew on the boat, Havelock" />
        <section className="detail-hero">
          <div className="wrap">
            <Link href="/guides" className="detail-back">
              ← Scuba Guide
            </Link>
            <div className="detail-eyebrow">Scuba Guide</div>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="detail-pitch">{post.excerpt}</p>}
          </div>
        </section>

        <section className="detail-body">
          <div className="wrap">
            {post.cover_image_url && (
              <div className="detail-photo">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}
            <div className="detail-grid">
              <div className="detail-main">
                <div className="panel guide-prose">
                  <PostBody body={post.body} />
                </div>
              </div>

              <aside className="detail-aside">
                <div className="book-card">
                  <div className="bc-per">Ready to dive?</div>
                  <Link href="/#packages" className="btn btn-primary">
                    See dives &amp; packages →
                  </Link>
                  <a
                    href={waGeneral(settings.whatsapp)}
                    className="btn btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ask a question on WhatsApp
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />

      <JsonLd data={[articleSchema(post), articleBreadcrumbSchema(post)]} />
    </>
  );
}
