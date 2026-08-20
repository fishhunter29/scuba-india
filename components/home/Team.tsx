// "Meet the team" — real photos of the Scuba India crew and boat, for trust.
export default function Team() {
  return (
    <section className="band team" id="team">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">Our team</div>
          <h2>Meet the Scuba India crew</h2>
          <p>
            Every dive is run by our own PADI &amp; SSI-certified instructors and local Havelock
            boat crew — the people who know these reefs best. Small groups, careful guiding and a
            genuine welcome, on our own boat.
          </p>
        </div>

        <figure className="team-hero reveal">
          <picture>
            <source type="image/webp" srcSet="/images/team-hero.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/team-hero.jpg"
              alt="The Scuba India team on our dive boat off Havelock, Andaman"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>

        <div className="team-thumbs reveal">
          <picture>
            <source type="image/webp" srcSet="/images/team-a.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/team-a.jpg" alt="Scuba India dive instructors on the boat" loading="lazy" decoding="async" />
          </picture>
          <picture>
            <source type="image/webp" srcSet="/images/team-b.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/team-b.jpg" alt="Scuba India crew ready for a dive off Havelock" loading="lazy" decoding="async" />
          </picture>
        </div>
      </div>
    </section>
  );
}
