import { ArrowUpRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import '../styles/footer.css';

const groups = [
  { title: 'Product', links: [
    { label: 'Daily commute', href: '#experiences' },
    { label: 'Intercity travel', href: '#viaris-features' },
    { label: 'Communities', href: '#communities' },
    { label: 'How it works', href: '#how-it-works' },
  ]},
  { title: 'Company', links: [
    { label: 'About Viaris', href: '#home' },
    { label: 'Careers', href: '#get-app' },
    { label: 'Contact us', href: '#get-app' },
  ]},
  { title: 'Support', links: [
    { label: 'Help centre', href: '#get-app' },
    { label: 'Safety & trust', href: '#get-app' },
    { label: 'FAQs', href: '#how-it-works' },
  ]},
];

export default function Footer() {
  return (
    <footer className="vr-footer" aria-label="Viaris Ride footer">
      <div className="vr-footer__inner">
        <a className="vr-footer__brand" href="#home" aria-label="Viaris home">
          <img className="vr-footer__logo" src="/images/logo.jpeg" alt="Viaris Ride" />
        </a>

        <div className="vr-footer__main">
          <div className="vr-footer__statement">
            <p className="vr-footer__eyebrow"><span/> GO FURTHER, TOGETHER</p>
            <h2>Shared journeys<br/>for a smarter,<br/><em>cleaner tomorrow.</em></h2>
            <p className="vr-footer__description">Carpool, commute, and travel together. Save money, reduce emissions, and make every ride more meaningful.</p>
          </div>

          <nav className="vr-footer__navigation" aria-label="Footer navigation">
            {groups.map(group => (
              <div className="vr-footer__group" key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map(link => <a key={link.label} href={link.href}>{link.label}</a>)}
              </div>
            ))}
          </nav>

          <div className="vr-footer__app">
            <span className="vr-footer__app-kicker">YOUR NEXT JOURNEY STARTS HERE</span>
            <h3>Take Viaris<br/>with you.</h3>
            <p>Find your people. Share the road. Make every journey count.</p>
            <a className="vr-footer__app-link" href="#get-app">Explore the app <ArrowUpRight size={16}/></a>
          </div>
        </div>
      </div>


      <div className="vr-footer__bottom">
        <span className="vr-footer__copyright">© {new Date().getFullYear()} Viaris Ride. All rights reserved.</span>
        <nav className="vr-footer__legal" aria-label="Legal">
          <a href="#privacy">Privacy policy</a><span aria-hidden="true">/</span>
          <a href="#terms">Terms of service</a><span aria-hidden="true">/</span>
          <a href="#community-guidelines">Community guidelines</a>
        </nav>
        <div className="vr-footer__social" aria-label="Social media">
          <span aria-hidden="true"><Instagram size={19}/></span>
          <span aria-hidden="true"><Linkedin size={19}/></span>
          <span aria-hidden="true"><Youtube size={20}/></span>
        </div>
      </div>
    </footer>
  );
}
