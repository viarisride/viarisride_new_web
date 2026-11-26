import '../styles/benefits.css';

const benefits = [
  {
    title: 'Spend less on every journey',
    description: 'Share fuel and travel costs with people already heading your way.',
    image: 'icon-01-spend-less.png',
    alt: 'Green wallet illustration representing shared travel savings',
  },
  {
    title: 'Make every ride greener',
    description: 'Fewer cars making the same trip means a lighter footprint on the road.',
    image: 'icon-02-travel-greener.png',
    alt: 'Two green leaves representing lower environmental impact',
  },
  {
    title: 'Feel closer to your community',
    description: 'Get to know verified neighbours and people travelling in your direction.',
    image: 'icon-03-neighbourhood.png',
    alt: 'People illustration representing a connected neighbourhood',
  },
  {
    title: 'Fits the way you travel',
    description: 'Share a one-off journey or make carpooling part of your everyday routine.',
    image: 'icon-04-daily-life.png',
    alt: 'Calendar illustration representing everyday travel',
  },
];

function BenefitCard({ item, index }: { item: typeof benefits[number]; index: number }) {
  return (
    <article className="vb-card">
      <div className="vb-card-visual">
        <img
          className="vb-card-icon"
          src={`/viarisride_new_web/images/${item.image}`}
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="vb-card-content">
        <span className="vb-card-index">0{index + 1} / BENEFIT</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}


function ProofIcon({ type }: { type: 'cost' | 'planet' | 'people' }) {
  if (type === 'cost') {
    return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 19 10 10q1-3 4-3h12q3 0 4 3l3 9v12h-4v-4H11v4H7Z M10 19h20M13 13h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="23" r="1.5" fill="currentColor"/><circle cx="27" cy="23" r="1.5" fill="currentColor"/></svg>;
  }
  if (type === 'planet') {
    return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M32 6C16 6 7 13 8 25c1 6 6 9 12 7C30 28 32 17 32 6Z M9 32 25 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="32" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 31v-5c0-5 3-8 8-8s8 3 8 8v5ZM2 31v-4c0-4 2-7 6-7 2 0 3 .5 4 2m26 9v-4c0-4-2-7-6-7-2 0-3 .5-4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function BenefitsSection() {
  return (
    <section className="vb-section" aria-labelledby="vb-title">
      <div className="vb-shell">
        <div className="benefits-landscape" role="img" aria-label="A golden-hour drive through misty hills" />
        <header className="vb-header">
          <div className="vb-eyebrow"><span aria-hidden="true">✳</span> THE VIARIS DIFFERENCE</div>
          <h2 id="vb-title">Good things happen<br className="vb-title-break" /> when we go together.</h2>
          <span className="vb-underline" aria-hidden="true" />
          <p>Less spent on the road. A lighter impact on the planet. More connection along the way.</p>
        </header>

        <div className="vb-grid">
          {benefits.map((item, index) => <BenefitCard key={item.title} item={item} index={index} />)}
        </div>

        <aside className="vb-banner" aria-label="The impact of shared journeys">
          <div className="vb-banner-message">
            <span className="vb-banner-kicker">A BETTER WAY, TOGETHER</span>
            <h3>A more connected<br />and sustainable community.</h3>
          </div>
          <span className="vb-divider" aria-hidden="true" />
          <div className="vb-proof">
            <div className="vb-proof-item"><ProofIcon type="cost" /><span>Lower travel<br />costs</span></div>
            <div className="vb-proof-item"><ProofIcon type="planet" /><span>Fewer emissions<br />per shared trip</span></div>
            <div className="vb-proof-item"><ProofIcon type="people" /><span>Stronger local<br />connections</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}
