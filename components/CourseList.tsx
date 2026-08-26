'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Course } from '@/lib/types';
import { formatPrice, courseSlug } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

const TABS = [
  { key: 'all', label: 'All courses' },
  { key: 'course', label: 'Single courses' },
  { key: 'combo', label: 'Course combos' },
];

export default function CourseList({
  courses,
  whatsapp,
}: {
  courses: Course[];
  whatsapp: string;
}) {
  const [active, setActive] = useState('all');

  const tabs = useMemo(
    () =>
      TABS.map((t) => ({
        ...t,
        items:
          t.key === 'all'
            ? courses
            : courses.filter((c) => (c.kind ?? 'course') === t.key),
      })).filter((t) => t.items.length > 0),
    [courses],
  );

  const list = (tabs.find((t) => t.key === active) ?? tabs[0])?.items ?? courses;

  if (!courses.length) {
    return (
      <div className="cat-empty">
        <p>Our course list is being updated — message us for current PADI courses and dates.</p>
        <a
          className="btn btn-primary"
          href={waLink(whatsapp, 'Hi Scuba India, I have a question about your PADI courses.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask on WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <>
      {tabs.length > 1 && (
        <div className="pk-filter" role="tablist" aria-label="Course options">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              className={`pk-tab${active === t.key ? ' active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="course-cards">
        {list.map((c) => (
          <div className="course-card" key={c.id}>
            <div className="cc-head">
              <h3>
                <Link href={`/courses/${courseSlug(c.name)}`}>{c.name}</Link>
              </h3>
              {c.kind === 'combo' && <span className="cc-badge">COMBO</span>}
            </div>
            {c.description && <p className="cc-desc">{c.description}</p>}
            <ul className="cc-stats">
              {c.duration && (
                <li>
                  <span>Duration</span>
                  {c.duration}
                </li>
              )}
              {c.depth && c.depth !== '—' && (
                <li>
                  <span>Max depth</span>
                  {c.depth}
                </li>
              )}
              {c.min_age && c.min_age !== 'None' && (
                <li>
                  <span>Min age</span>
                  {c.min_age}
                </li>
              )}
            </ul>
            <div className="pk-foot">
              <span className="pk-price">
                {formatPrice(c.price, c.on_request)}
                <small>{c.on_request ? 'contact us' : 'per person'}</small>
              </span>
              <a
                className="pk-book"
                href={waLink(whatsapp, `Hi Scuba India, I'd like to book the ${c.name} course.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.on_request ? 'Enquire →' : 'Book on WhatsApp →'}
              </a>
            </div>
            <Link href={`/courses/${courseSlug(c.name)}`} className="pk-more">
              Full details
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
