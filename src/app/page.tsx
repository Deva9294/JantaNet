import { ArrowRight, Globe2, ShieldCheck, Sparkles, Users, MessageCircle, PlaySquare, BriefcaseBusiness, Cloud, Wallet, Bot, RadioTower } from "lucide-react";

const modules = [
  { icon: Users, title: "Social community", description: "Profiles, feed, pages, groups, polls and events." },
  { icon: MessageCircle, title: "Messaging", description: "Private and group conversations, presence and sharing." },
  { icon: PlaySquare, title: "Creator studio", description: "Publish media, grow an audience and track performance." },
  { icon: BriefcaseBusiness, title: "Business & jobs", description: "Business pages, leads, hiring and professional profiles." },
  { icon: Globe2, title: "Communities", description: "Topic spaces, channels, roles and community discovery." },
  { icon: Cloud, title: "Personal cloud", description: "Files, photos, sharing and backup plans." },
  { icon: Wallet, title: "Payments", description: "A future provider-led wallet and compliant payment experience." },
  { icon: Bot, title: "AI assistant", description: "Helpful discovery, translation and productivity tools." }
];

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <nav className="container nav" aria-label="Main navigation">
          <a className="brand" href="/" aria-label="JantaNet home">
            <span className="brand-mark"><RadioTower size={21} /></span>
            <span>Janta<span className="gradient-text">Net</span></span>
          </a>
          <div className="nav-links">
            <a href="#modules">Modules</a><a href="/feed">Community feed</a><a href="#principles">Our principles</a><a href="#roadmap">Roadmap</a>
          </div>
          <div className="nav-actions">
            <a className="btn" href="#modules">Explore</a>
            <a className="btn btn-primary" href="#roadmap">Get updates <ArrowRight size={16} /></a>
          </div>
        </nav>
      </header>
      <main>
        <section className="hero container">
          <span className="eyebrow"><Sparkles size={14} /> A new digital community is taking shape</span>
          <h1>One place to <span className="gradient-text">connect, create</span> and grow.</h1>
          <p className="hero-copy">JantaNet brings people, communities, creators and businesses closer — with privacy, transparency and useful technology at its core.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#modules">Discover the ecosystem <ArrowRight size={17} /></a>
            <a className="btn" href="#roadmap">View the roadmap</a>
          </div>
          <p className="hero-note">Built in phases. Designed around people. Privacy by default.</p>
        </section>
        <section className="section container" id="modules">
          <div className="section-heading">
            <span className="eyebrow">THE ECOSYSTEM</span>
            <h2>More than a social network.</h2>
            <p>A connected set of experiences, introduced carefully so every module is secure, reliable and genuinely useful.</p>
          </div>
          <div className="module-grid">
            {modules.map(({ icon: Icon, title, description }) => (
              <article className="module-card" key={title}>
                <div className="module-icon"><Icon size={21} /></div>
                <h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section container" id="principles">
          <div className="section-heading"><span className="eyebrow">OUR PROMISE</span><h2>Technology with people at the centre.</h2></div>
          <div className="principles">
            <article className="principle"><ShieldCheck size={22} /><h3>Privacy & safety</h3><p>Secure defaults, clear permissions, transparent controls and accountable moderation.</p></article>
            <article className="principle"><Users size={22} /><h3>Inclusive by design</h3><p>Accessible, mobile-first experiences with a foundation for multilingual communities.</p></article>
            <article className="principle"><Sparkles size={22} /><h3>Useful innovation</h3><p>AI and automation added with consent, explainability and practical value.</p></article>
          </div>
        </section>
        <section className="section container" id="roadmap">
          <div className="section-heading"><span className="eyebrow">DELIVERY ROADMAP</span><h2>Built step by step, not all at once.</h2><p>Foundation → Identity → Social → Messaging → Communities & business → Creator tools → Cloud & AI → Payments → Scale and governance.</p></div>
        </section>
      </main>
      <footer className="footer"><div className="container footer-inner"><span>© {new Date().getFullYear()} JantaNet. Connect • Chat • Share • Earn.</span><span>People-first. Privacy-minded. Built in phases.</span></div></footer>
    </>
  );
}
