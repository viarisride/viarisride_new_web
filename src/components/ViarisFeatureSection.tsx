import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarDays, Users, Route, ArrowRight } from 'lucide-react';
import '../styles/viaris-features.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    id: 'intercity',
    title: 'Intercity',
    description: 'Share the road between cities. Find a seat, split the fuel and make the distance feel shorter.',
    image: '/images/35cfc7c0-ac90-4a34-9ad2-45093a5ce58b.png',
    icon: Route,
    path: 'M520 30 C486 54 420 60 350 66 C260 74 205 82 176 116 C158 138 153 184 150 236'
  },
  {
    id: 'daily-commute',
    title: 'Daily commute',
    description: 'Find people heading your way to work, college or business — once, or on the same weekdays.',
    image: '/images/69c28471-e7d9-4638-99bd-69898b699132.png',
    icon: CalendarDays,
    path: 'M520 30 C520 82 520 156 520 236'
  },
  {
    id: 'communities',
    title: 'Communities',
    description: 'Connect with people around the places you share — your neighbourhood, gym, park or school.',
    image: '/images/Connected%20Communities%20Carpool%20Map.png',
    icon: Users,
    path: 'M520 30 C554 54 620 60 690 66 C780 74 835 82 864 116 C882 138 887 184 890 236'
  }
];

function BranchCar({ id, delay }: { id: string; delay: number }) {
  return <g className="vf-car">
    <g transform="translate(-10 -5)">
      <path d="M1 6.5 3.5 2.8Q4.5 1.5 6.5 1.5h7q2 0 3 1.8l2.5 3.2v4.2H1Z" fill="#fffefa" stroke="#315b42" strokeWidth="1.35" strokeLinejoin="round"/>
      <path d="m5 2.8-1.5 3h10l-1.8-3Z" fill="#dce8d5"/>
      <circle cx="5.5" cy="11" r="1.4" fill="#315b42"/><circle cx="14.5" cy="11" r="1.4" fill="#315b42"/>
    </g>
    <animateMotion dur="10s" repeatCount="indefinite" begin={`${delay}s`} rotate="0"><mpath href={`#vf-path-${id}`}/></animateMotion>
  </g>;
}

function RouteBranches() {
  return <svg className="vf-routes" viewBox="0 0 1040 236" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="vf-route-tone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9bbd78"/><stop offset="1" stopColor="#6c9b53"/></linearGradient>
    </defs>
    {FEATURES.map(feature => <path key={feature.id} id={`vf-path-${feature.id}`} d={feature.path} fill="none"/>)}
    {FEATURES.map((feature,index) => <g key={feature.id}>
      <path className="vf-route" d={feature.path}/>
      
      <BranchCar id={feature.id} delay={index * 1.4}/>
    </g>)}
    <path className="vf-route-trunk" d="M520 18 V30"/>
    <circle className="vf-route-origin-ring" cx="520" cy="10" r="8"/>
    <circle className="vf-route-origin" cx="520" cy="10" r="3.2"/>
  </svg>;
}

function Feature({ feature }: { feature: (typeof FEATURES)[number] }) {
  const Icon = feature.icon;
  return <article className={`vf-feature vf-feature--${feature.id}`}>
    <div className="vf-feature__copy">
      <div className="vf-feature__title">
        <span className="vf-feature__icon"><Icon size={27} strokeWidth={2}/></span>
        <h3>{feature.title}</h3>
        <span className="vf-feature__arrow" aria-hidden="true"><ArrowRight size={23} strokeWidth={1.9}/></span>
      </div>
      <p>{feature.description}</p>
    </div>
    <div className="vf-feature__illustration">
      <img src={feature.image} alt="" loading="lazy"/>
    </div>
  </article>;
}

export default function ViarisFeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const context = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;
      const routes = gsap.utils.toArray<SVGPathElement>('.vf-route');
      routes.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 72%', once: true }
      });
      gsap.set(brandRef.current, { clearProps: 'opacity,transform' });
      timeline.to(routes, { strokeDashoffset: 0, duration: 1.35, stagger: .18, ease: 'power2.inOut' }, '-=.08');
      timeline.fromTo('.vf-feature__illustration', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .65, stagger: .12, ease: 'power2.out' }, '-=.2');
      timeline.fromTo('.vf-feature__copy', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .55, stagger: .12, ease: 'power2.out' }, '-=.25');
    }, section);
    return () => context.revert();
  }, []);

  return <section className="viaris-feature-section" id="viaris-features" ref={sectionRef} aria-labelledby="viaris-feature-heading">
    <div className="viaris-feature-section__inner">
      <header className="vf-header">
        <div className="vf-wordmark" ref={brandRef} aria-label="Viaris Ride">Viaris <span>ride</span></div>
        <p id="viaris-feature-heading" className="vf-kicker">COMMUNITY CARPOOLING PLATFORM</p>
      </header>
      <div className="vf-route-stage"><RouteBranches/></div>
      <div className="vf-features">
        {FEATURES.map(feature => <Feature key={feature.id} feature={feature}/>)}
      </div>
    </div>
  </section>;
}
