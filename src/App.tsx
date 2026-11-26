import { useEffect } from 'react';
import HeroIntroReveal from './components/HeroIntroReveal';
import ViarisFeatureSection from './components/ViarisFeatureSection';
import ImpactCalculator from './components/ImpactCalculator';
import DownloadAppSection from './components/DownloadAppSection';
import BenefitsSection from './components/BenefitsSection';
import CommunityExchangeSection from './components/CommunityExchangeSection';
import Footer from './components/Footer';
import { ArrowUpRight, Menu, MapPin, CarFront, Users, Building2, Wallet, Fuel } from 'lucide-react';

export default function App() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));

    const story = document.querySelector<HTMLElement>('.community-story');
    const sequence = story?.querySelector<HTMLElement>('.story-sequence');
    const road = sequence?.querySelector<SVGPathElement>('.road-motion-path');
    const vehicles = sequence?.querySelectorAll<SVGGElement>('.road-vehicle') ?? [];
    const single = sequence?.querySelector<SVGGElement>('.road-vehicle-single');
        const pathLength = road?.getTotalLength() ?? 0;
    let frame = 0;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const smoothStep = (value: number) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };

    const placeVehicle = (vehicle: SVGElement, progress: number, lateralPixels = 0, carScale = 0.66) => {
      if (!road || !pathLength) return;
      const svg = road.ownerSVGElement;
      if (!svg) return;
      const viewBox = svg.viewBox.baseVal;
      const bounds = svg.getBoundingClientRect();
      const scaleX = bounds.width / (viewBox.width || 1);
      const scaleY = bounds.height / (viewBox.height || 1);
      const distance = pathLength * clamp(progress, 0.015, 0.985);
      const point = road.getPointAtLength(distance);
      const before = road.getPointAtLength(Math.max(0, distance - 8));
      const after = road.getPointAtLength(Math.min(pathLength, distance + 8));
      const dx = (after.x - before.x) * scaleX;
      const dy = (after.y - before.y) * scaleY;
      const tangentLength = Math.hypot(dx, dy) || 1;
      const normalX = (-dy / tangentLength) / (scaleX || 1);
      const normalY = (dx / tangentLength) / (scaleY || 1);
      const x = point.x + normalX * lateralPixels;
      const y = point.y + normalY * lateralPixels;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      // Vehicle artwork points toward -Y (the bonnet/nose). Rotate that nose onto the road tangent, then offset its anchor slightly rearward so the front leads into each bend.
      const noseLead = 8 * carScale;
      const anchorX = x - Math.cos(Math.atan2(dy, dx)) * noseLead / (scaleX || 1);
      const anchorY = y - Math.sin(Math.atan2(dy, dx)) * noseLead / (scaleY || 1);
      vehicle.setAttribute('transform', `translate(${anchorX} ${anchorY}) rotate(${angle}) scale(${carScale})`);
    };

    const updateProgress = () => {
      if (!story || !sequence) return;
      const rect = sequence.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      // Progress spans the sequence's full entrance-to-exit through the viewport.
      const progress = clamp((viewportHeight - rect.top) / (rect.height + viewportHeight), 0, 1);
      story.style.setProperty('--story-progress', String(progress));

      const activeChapter = Math.min(3, Math.floor(progress * 4));
      story.querySelectorAll<HTMLElement>('[data-chapter]').forEach((chapter, index) => {
        chapter.classList.toggle('chapter-active', index === activeChapter);
      });

      if (!road || !pathLength) return;

      // Keep the three cars travelling together; smoothly bring them into one lane,
      // then hand the exact centre position to the single lead car.
      const merge = smoothStep((progress - 0.60) / 0.22);
      const convoyPosition = 0.06 + progress * 0.88;
      vehicles.forEach((vehicle, index) => {
        const lane = index - 1;
        const staggeredPosition = convoyPosition + lane * 0.012 * (1 - merge);
        placeVehicle(vehicle, staggeredPosition, lane * 24 * (1 - merge));
        vehicle.style.opacity = String(1 - merge);
      });

      if (single) {
        // A single detailed SVG car leads the journey from start to finish.
        // Its bonnet points into the path tangent on every curve.
        placeVehicle(single, 0.035 + progress * 0.93, 0, 0.92);
        single.style.opacity = '1';
      }
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <HeroIntroReveal />
      <main className="viaris-home">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Viaris Ride home"><img src="/viarisride_new_web/images/logo.jpeg" alt="Viaris Ride" /></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#experiences">Experiences</a>
          <a href="#how-it-works">How it works</a>
          <a href="#communities">Communities</a>
        </nav>
        <div className="header-actions">
          <a className="header-cta" href="#get-app">Get the app <ArrowUpRight size={15} /></a>
          <button className="menu-button" aria-label="Open menu"><Menu size={22} /></button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-photo">
          <div className="hero-image" role="img" aria-label="A modern car travelling through a green countryside landscape" />
          <div className="hero-wash" />
          

          <div className="hero-copy">
            
            <h1>Same roads.<br /><em>Different people.</em> One journey.</h1>
            <p className="hero-description">Find people going your way. Share everyday commutes,<br className="desktop-break" /> discover intercity rides, and make every journey count.</p>
            <a className="hero-cta" href="#experiences">Explore the Viaris way <ArrowUpRight size={16} /></a>
          </div>

          <div className="hero-bottomline"><span>DAILY COMMUTE <i /> INTERCITY <i /> COMMUNITIES</span><span>GO FURTHER, TOGETHER <b>↗</b></span></div>
        </div>
      </section>

      <section className="community-story" id="experiences" aria-labelledby="community-story-title">
        <div className="story-masthead">
          <div><h2 id="community-story-title">A hundred people.<br/><em>One community.</em></h2></div>
          <p className="story-intro">Every morning, people from the same community head in the same direction — without knowing it.</p>
          
        </div>
        <div className="story-sequence">
          <svg className="story-road" viewBox="0 0 1600 2800" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="roadShoulder" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b7b7a4"/><stop offset=".18" stopColor="#dedbc9"/><stop offset=".5" stopColor="#eee9d8"/><stop offset=".82" stopColor="#d4d0be"/><stop offset="1" stopColor="#aaa995"/></linearGradient><linearGradient id="roadAsphalt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#303a35"/><stop offset=".18" stopColor="#414b44"/><stop offset=".52" stopColor="#4c554d"/><stop offset=".82" stopColor="#39443d"/><stop offset="1" stopColor="#27342d"/></linearGradient><filter id="roadShadow" x="-100%" y="-10%" width="300%" height="120%"><feGaussianBlur stdDeviation="5"/></filter></defs>
            <g transform="translate(-160 0)">
            <path className="road-shadow" d="M800 -120 C800 160 700 250 830 430 C560 610 1080 560 1210 760 C1340 960 1300 1060 1130 1210 C960 1360 520 1340 390 1530 C260 1720 300 1820 450 1980 C600 2140 1080 2110 1200 2300 C1320 2490 1280 2590 1160 2740"/><path className="road-shoulder" d="M800 -120 C800 160 700 250 830 430 C560 610 1080 560 1210 760 C1340 960 1300 1060 1130 1210 C960 1360 520 1340 390 1530 C260 1720 300 1820 450 1980 C600 2140 1080 2110 1200 2300 C1320 2490 1280 2590 1160 2740"/><path className="road-asphalt" d="M800 -120 C800 160 700 250 830 430 C560 610 1080 560 1210 760 C1340 960 1300 1060 1130 1210 C960 1360 520 1340 390 1530 C260 1720 300 1820 450 1980 C600 2140 1080 2110 1200 2300 C1320 2490 1280 2590 1160 2740"/><path className="road-edge-line" d="M800 -120 C800 160 700 250 830 430 C560 610 1080 560 1210 760 C1340 960 1300 1060 1130 1210 C960 1360 520 1340 390 1530 C260 1720 300 1820 450 1980 C600 2140 1080 2110 1200 2300 C1320 2490 1280 2590 1160 2740"/><path className="road-center" d="M800 -120 C800 160 700 250 830 430 C560 610 1080 560 1210 760 C1340 960 1300 1060 1130 1210 C960 1360 520 1340 390 1530 C260 1720 300 1820 450 1980 C600 2140 1080 2110 1200 2300 C1320 2490 1280 2590 1160 2740"/><path className="road-motion-path" d="M800 -120 C800 160 700 250 830 430 C560 610 1080 560 1210 760 C1340 960 1300 1060 1130 1210 C960 1360 520 1340 390 1530 C260 1720 300 1820 450 1980 C600 2140 1080 2110 1200 2300 C1320 2490 1280 2590 1160 2740"/>
            <g className="road-vehicle"><ellipse cx="1" cy="5" rx="17" ry="34" fill="#142019" opacity=".24"/><path d="M-10 -31 Q-9 -39 -4 -41 L4 -41 Q9 -39 10 -31 L14 -18 Q17 -10 17 2 L16 25 Q15 34 8 36 L-8 36 Q-15 34 -16 25 L-17 2 Q-17 -10 -14 -18Z" fill="#e8e4d8" stroke="#26372b" strokeWidth="1.8"/><path d="M-9 -24 Q0 -33 9 -24 L11 -8 L-11 -8Z" fill="#65766e" stroke="#33463a" strokeWidth="1"/><path d="M-11 -4 L11 -4 L12 13 L-12 13Z" fill="#65766e" opacity=".9"/><path d="M-9 18 L9 18 L8 28 Q0 32 -8 28Z" fill="#40564a"/><path d="M-12 -34 L-7 -37 L7 -37 L12 -34" fill="none" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round"/><rect x="-14" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="11" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="-14" y="27" width="3" height="6" rx="1" fill="#d87967"/><rect x="11" y="27" width="3" height="6" rx="1" fill="#d87967"/><path d="M-17 -18 L-20 -14 L-20 -3 L-17 0 M17 -18 L20 -14 L20 -3 L17 0 M-17 11 L-20 14 L-20 23 L-16 25 M17 11 L20 14 L20 23 L16 25" fill="#25352a" stroke="#25352a" strokeWidth="2"/></g><g className="road-vehicle"><ellipse cx="1" cy="5" rx="17" ry="34" fill="#142019" opacity=".24"/><path d="M-10 -31 Q-9 -39 -4 -41 L4 -41 Q9 -39 10 -31 L14 -18 Q17 -10 17 2 L16 25 Q15 34 8 36 L-8 36 Q-15 34 -16 25 L-17 2 Q-17 -10 -14 -18Z" fill="#a9bf8a" stroke="#26372b" strokeWidth="1.8"/><path d="M-9 -24 Q0 -33 9 -24 L11 -8 L-11 -8Z" fill="#53685e" stroke="#33463a" strokeWidth="1"/><path d="M-11 -4 L11 -4 L12 13 L-12 13Z" fill="#53685e" opacity=".9"/><path d="M-9 18 L9 18 L8 28 Q0 32 -8 28Z" fill="#40564a"/><path d="M-12 -34 L-7 -37 L7 -37 L12 -34" fill="none" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round"/><rect x="-14" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="11" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="-14" y="27" width="3" height="6" rx="1" fill="#d87967"/><rect x="11" y="27" width="3" height="6" rx="1" fill="#d87967"/><path d="M-17 -18 L-20 -14 L-20 -3 L-17 0 M17 -18 L20 -14 L20 -3 L17 0 M-17 11 L-20 14 L-20 23 L-16 25 M17 11 L20 14 L20 23 L16 25" fill="#25352a" stroke="#25352a" strokeWidth="2"/></g><g className="road-vehicle"><ellipse cx="1" cy="5" rx="17" ry="34" fill="#142019" opacity=".24"/><path d="M-10 -31 Q-9 -39 -4 -41 L4 -41 Q9 -39 10 -31 L14 -18 Q17 -10 17 2 L16 25 Q15 34 8 36 L-8 36 Q-15 34 -16 25 L-17 2 Q-17 -10 -14 -18Z" fill="#b9c4c4" stroke="#26372b" strokeWidth="1.8"/><path d="M-9 -24 Q0 -33 9 -24 L11 -8 L-11 -8Z" fill="#5c7067" stroke="#33463a" strokeWidth="1"/><path d="M-11 -4 L11 -4 L12 13 L-12 13Z" fill="#5c7067" opacity=".9"/><path d="M-9 18 L9 18 L8 28 Q0 32 -8 28Z" fill="#40564a"/><path d="M-12 -34 L-7 -37 L7 -37 L12 -34" fill="none" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round"/><rect x="-14" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="11" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="-14" y="27" width="3" height="6" rx="1" fill="#d87967"/><rect x="11" y="27" width="3" height="6" rx="1" fill="#d87967"/><path d="M-17 -18 L-20 -14 L-20 -3 L-17 0 M17 -18 L20 -14 L20 -3 L17 0 M-17 11 L-20 14 L-20 23 L-16 25 M17 11 L20 14 L20 23 L16 25" fill="#25352a" stroke="#25352a" strokeWidth="2"/></g><g className="road-vehicle-single"><ellipse cx="1" cy="5" rx="17" ry="34" fill="#142019" opacity=".24"/><path d="M-10 -31 Q-9 -39 -4 -41 L4 -41 Q9 -39 10 -31 L14 -18 Q17 -10 17 2 L16 25 Q15 34 8 36 L-8 36 Q-15 34 -16 25 L-17 2 Q-17 -10 -14 -18Z" fill="#b6d987" stroke="#26372b" strokeWidth="1.8"/><path d="M-9 -24 Q0 -33 9 -24 L11 -8 L-11 -8Z" fill="#465e52" stroke="#33463a" strokeWidth="1"/><path d="M-11 -4 L11 -4 L12 13 L-12 13Z" fill="#465e52" opacity=".9"/><path d="M-9 18 L9 18 L8 28 Q0 32 -8 28Z" fill="#40564a"/><path d="M-12 -34 L-7 -37 L7 -37 L12 -34" fill="none" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round"/><rect x="-14" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="11" y="-28" width="3" height="8" rx="1.2" fill="#fff3d1"/><rect x="-14" y="27" width="3" height="6" rx="1" fill="#d87967"/><rect x="11" y="27" width="3" height="6" rx="1" fill="#d87967"/><path d="M-17 -18 L-20 -14 L-20 -3 L-17 0 M17 -18 L20 -14 L20 -3 L17 0 M-17 11 L-20 14 L-20 23 L-16 25 M17 11 L20 14 L20 23 L16 25" fill="#25352a" stroke="#25352a" strokeWidth="2"/></g>
          
            </g>
          </svg>
          <article className="story-chapter chapter-community" data-chapter="0">
            <div className="chapter-copy" data-reveal><h3>A hundred people.<br/><em>One community.</em></h3><p>Different routines. Similar goals. A shared place to call home.</p><div className="story-tags"><span><Building2 size={17}/> Shared neighbourhood</span><span><Users size={17}/> Familiar faces</span></div></div>
            <div className="chapter-visual community-visual" data-reveal><div className="story-photo community-photo" role="img" aria-label="A modern residential community in the morning"/><span className="visual-caption">THE DAY BEGINS HERE <b>↗</b></span></div>
          </article>
          <article className="story-chapter chapter-separate" data-chapter="1">
            <div className="chapter-visual commute-visual" data-reveal><div className="story-photo commute-photo" role="img" aria-label="Cars leaving a residential community separately"/><span className="visual-caption">MONDAY · 8:05 AM <b>SEPARATE CARS / SAME DIRECTION</b></span></div>
            <div className="chapter-copy" data-reveal><h3>Every morning,<br/>we leave <em>separately.</em></h3><p>Different cars. Different journeys. Often heading to the very same workplace.</p><div className="route-facts"><span><CarFront size={17}/> One car at a time</span><span><MapPin size={17}/> Same direction</span></div></div>
          </article>
          <article className="story-chapter chapter-connection" data-chapter="2">
            <div className="chapter-copy" data-reveal><h3>What if your neighbour was <em>going your way?</em></h3><p>Someone just a few doors away could be heading to the same destination.</p><div className="story-tags"><span><MapPin size={17}/> Same destination</span><span><Users size={17}/> Just a few doors away</span></div></div>
            <div className="chapter-visual connection-visual" data-reveal><div className="story-photo connection-photo" role="img" aria-label="Two neighbours meeting beside a car"/><span className="visual-caption">A FAMILIAR FACE. A NEW CONNECTION.</span></div>
          </article>
          <article className="story-chapter story-final" data-chapter="3">
            <div className="chapter-visual shared-visual" data-reveal><div className="story-photo shared-photo-image" role="img" aria-label="Two neighbours sharing a car journey together"/><span className="visual-caption">ONE CAR · ONE SHARED JOURNEY</span></div>
            <div className="chapter-copy shared-story-copy" data-reveal><h3>Many journeys.<br/><em>One shared ride.</em></h3><p>Share the journey, split the cost and get to know the people going your way.</p><div className="shared-outcomes"><span><Fuel size={18}/> Share the fuel cost</span><span><Wallet size={18}/> Split the ride fairly</span><span><Users size={18}/> Meet your neighbours</span></div><a className="story-cta" href="#how-it-works">See how Viaris works <ArrowUpRight size={16}/></a></div>
          </article>
        </div>
        <div className="story-ending"><span className="ending-line"/><p>Same roads. <em>Different people.</em> One journey.</p><span className="ending-line"/></div>
      </section>
      <ViarisFeatureSection />
      <CommunityExchangeSection />
      <BenefitsSection />
      <ImpactCalculator />
      <DownloadAppSection />
      <div id="how-it-works" /><div id="get-app" />
      </main>
      <Footer />
    </>
  );
}
