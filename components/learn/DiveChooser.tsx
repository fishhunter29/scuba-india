'use client';

import { useState } from 'react';
import Link from 'next/link';

type Rec = { title: string; blurb: string; href: string; cta: string; price: string };

export default function DiveChooser({
  tryFrom,
  tryHref,
  courseFrom,
  funFrom,
}: {
  tryFrom: string;
  tryHref: string;
  courseFrom: string;
  funFrom: string;
}) {
  const REC_TRY: Rec = {
    title: 'A Try Scuba Dive',
    blurb:
      'You don\'t need any experience or certification. An instructor guides you the whole way on a calm, shallow reef — the perfect first taste of diving.',
    href: tryHref,
    cta: 'See the Try Dive →',
    price: `From ${tryFrom} per person`,
  };
  const REC_COURSE: Rec = {
    title: 'A PADI Course',
    blurb:
      'You want to dive properly and for life. Start with PADI Scuba Diver or Open Water — a real certification you can use anywhere in the world.',
    href: '/courses',
    cta: 'View PADI courses →',
    price: `From ${courseFrom} per person`,
  };
  const REC_FUN: Rec = {
    title: 'Fun Dives',
    blurb:
      'You\'re already certified — skip the training and explore. Our divemasters lead you across two of Havelock\'s best sites in one trip.',
    href: '/fun-dives',
    cta: 'See Fun Dives →',
    price: `From ${funFrom} per person`,
  };

  const [step, setStep] = useState(0);
  const [rec, setRec] = useState<Rec | null>(null);

  function reset() {
    setStep(0);
    setRec(null);
  }

  if (rec) {
    return (
      <div className="chooser">
        <div className="chooser-result">
          <div className="chooser-progress">Our recommendation</div>
          <div className="rec">{rec.title}</div>
          <p>{rec.blurb}</p>
          <div className="rec-price">{rec.price}</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={rec.href} className="btn btn-primary">
              {rec.cta}
            </Link>
            <button className="btn btn-ghost" onClick={reset}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chooser">
      <div className="chooser-progress">Question {step + 1} of 2</div>
      {step === 0 && (
        <>
          <div className="q">Have you scuba dived before?</div>
          <div className="chooser-opts">
            <button className="chooser-opt" onClick={() => setStep(1)}>
              No, never — I&apos;d be a complete beginner
            </button>
            <button className="chooser-opt" onClick={() => setStep(1)}>
              Once or twice on holiday, but I&apos;m not certified
            </button>
            <button className="chooser-opt" onClick={() => setRec(REC_FUN)}>
              Yes — I&apos;m a certified diver
            </button>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <div className="q">What do you want from it?</div>
          <div className="chooser-opts">
            <button className="chooser-opt" onClick={() => setRec(REC_TRY)}>
              Just to experience diving once, the easy way
            </button>
            <button className="chooser-opt" onClick={() => setRec(REC_COURSE)}>
              To learn properly and get certified for life
            </button>
            <button className="chooser-opt" onClick={() => setRec(REC_TRY)}>
              Not sure yet — I want to test the water first
            </button>
          </div>
        </>
      )}
    </div>
  );
}
