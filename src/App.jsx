import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, Languages, Mail, MousePointer2, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "./data/content.js";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const resumePdf = `${import.meta.env.BASE_URL}assets/陈思语_中文简历_2026.pdf`;

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ContactButton({ children, onClick }) {
  return (
    <button className="contact-button" onClick={onClick}>
      {children}
    </button>
  );
}

function Nav({ lang, setLang, t }) {
  return (
    <header className="site-nav">
      <nav>
        {t.nav.map((item) => (
          <button key={item} onClick={() => scrollToId(item.toLowerCase())}>
            {item}
          </button>
        ))}
      </nav>
      <button className="lang-toggle" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
        <Languages size={16} />
        {t.lang}
      </button>
    </header>
  );
}

function BadgeCard({ t }) {
  return (
    <div className="badge-wrap reveal">
      <div className="lanyard" />
      <div className="badge-flip">
        <div className="badge-inner">
          <div className="badge-face badge-front">
            <img src={asset("avatar-placeholder.svg")} alt="Siyu portrait placeholder" />
            <strong>{t.frontTitle}</strong>
            <span>{t.frontSub}</span>
            <div className="badge-tags">
              {t.tags.map((tag) => (
                <small key={tag}>[{tag}]</small>
              ))}
            </div>
          </div>
          <div className="badge-face badge-back">
            <strong>{t.backTitle}</strong>
            <p>{t.backText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ t, onResume }) {
  const magnetRef = useRef(null);

  useEffect(() => {
    const element = magnetRef.current;
    if (!element) return undefined;
    const xTo = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });
    const move = (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const near = Math.abs(dx) < rect.width / 2 + 150 && Math.abs(dy) < rect.height / 2 + 150;
      xTo(near ? dx / 3 : 0);
      yTo(near ? dy / 3 : 0);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section id="home" className="hero-section snap-panel">
      <h1 className="hero-heading reveal">{t.title}</h1>
      <div className="hero-portrait reveal" ref={magnetRef}>
        <img src={asset("01-hero-card-01.svg")} alt="Portrait placeholder for Siyu Chen" />
      </div>
      <div className="hero-bottom">
        <p className="hero-tagline reveal">{t.tagline}</p>
        <div className="hero-actions reveal">
          <ContactButton onClick={() => scrollToId("contact")}>{t.contact}</ContactButton>
          <button className="resume-button" onClick={onResume}>
            <Download size={17} />
            {t.resume}
          </button>
        </div>
      </div>
    </section>
  );
}

function AnimatedParagraph({ text }) {
  return (
    <p className="animated-copy" aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span style={{ "--i": index }} key={`${char}-${index}`}>
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </p>
  );
}

function About({ t }) {
  return (
    <section id="about" className="about-section snap-panel">
      <img className="about-float moon" src={asset("02-about-moon.svg")} alt="" />
      <img className="about-float cube" src={asset("02-about-cube.svg")} alt="" />
      <img className="about-float bead" src={asset("02-about-bead.svg")} alt="" />
      <img className="about-float ring" src={asset("02-about-ring.svg")} alt="" />
      <BadgeCard t={t.badge} />
      <div className="about-copy reveal">
        <p className="section-kicker">{t.about.eyebrow}</p>
        <h2 className="hero-heading">{t.about.title}</h2>
        <h3>{t.about.subtitle}</h3>
        <AnimatedParagraph text={t.about.body} />
        <ContactButton onClick={() => scrollToId("contact")}>{t.hero.contact}</ContactButton>
      </div>
    </section>
  );
}

function Internship({ t }) {
  return (
    <section id="internship" className="internship-section snap-panel">
      <p className="section-kicker reveal">{t.internships.eyebrow}</p>
      <h2 className="section-title reveal">{t.internships.title}</h2>
      <div className="internship-list">
        {t.internships.items.map((item) => (
          <article className="internship-item reveal" key={item.number}>
            <span className="item-number">{item.number}</span>
            <div>
              <h3>{item.role}</h3>
              <p className="date">{item.date}</p>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total, live }) {
  const images = useMemo(
    () => [
      asset(`04-projects-0${index + 1}-image-Col1image1.svg`),
      asset(`04-projects-0${index + 1}-image-Col1image2.svg`),
      asset(`04-projects-0${index + 1}-image-Col2.svg`),
    ],
    [index],
  );

  return (
    <article className="project-stick" style={{ "--offset": `${index * 28}px`, "--scale": 1 - (total - 1 - index) * 0.03 }}>
      <div className="project-card reveal">
        <div className="project-top">
          <span className="item-number">{project.number}</span>
          <div>
            <p>{project.category}</p>
            <h3>{project.name}</h3>
          </div>
          <button>{live}</button>
        </div>
        <p className="project-desc">{project.desc}</p>
        <div className="project-images">
          <div>
            <img src={images[0]} alt="" />
            <img src={images[1]} alt="" />
          </div>
          <img src={images[2]} alt="" />
        </div>
      </div>
    </article>
  );
}

function Projects({ t }) {
  return (
    <section id="projects" className="projects-section">
      <p className="section-kicker reveal">{t.projects.eyebrow}</p>
      <h2 className="hero-heading reveal">{t.projects.title}</h2>
      <div className="projects-stack">
        {t.projects.items.map((project, index) => (
          <ProjectCard project={project} index={index} total={t.projects.items.length} live={t.projects.live} key={project.number} />
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <section className="marquee-section">
      <div className="marquee-track">
        {[...Array(3)].flatMap((_, set) =>
          [1, 2, 3, 4, 5].map((number) => (
            <img src={asset(`05-marquee-image-0${number}.svg`)} alt="" key={`${set}-${number}`} loading="lazy" />
          )),
        )}
      </div>
    </section>
  );
}

function Contact({ t, onResume }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard?.writeText(t.contact.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="contact-section snap-panel">
      <div className="contact-heading reveal">
        <p className="section-kicker">{t.contact.eyebrow}</p>
        <h2>{t.contact.title}</h2>
      </div>
      <div className="contact-cards reveal">
        <div className="back-card one" />
        <div className="back-card two" />
        <img className="front-card" src={asset("contact-portrait.svg")} alt="Siyu portrait placeholder" />
      </div>
      <article className="contact-copy reveal">
        <span className="dot" />
        <h3>{t.contact.label}</h3>
        <p className="meta">{t.contact.meta}</p>
        <p>{t.contact.body}</p>
        <div className="arrow-row">
          <button onClick={() => scrollToId("projects")} aria-label="Previous section">
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => scrollToId("home")} aria-label="Back to top">
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="contact-pills">
          <button onClick={copyEmail}>
            <Mail size={15} />
            {t.contact.email}
          </button>
          <a href="tel:+8618005630093">{t.contact.phone}</a>
          <button onClick={onResume}>{t.contact.resume}</button>
        </div>
      </article>
      {copied && <div className="toast">{t.contact.copied}</div>}
    </section>
  );
}

function ResumePreview({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="resume-modal" role="dialog" aria-modal="true" aria-label="Resume preview">
      <div className="resume-modal-card">
        <button className="resume-close" onClick={onClose} aria-label="Close resume preview">
          <X size={20} />
        </button>
        <iframe title="Siyu Chen resume preview" src={resumePdf} />
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("zh");
  const [resumeOpen, setResumeOpen] = useState(false);
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".site-nav", { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" });
      gsap.utils.toArray(".reveal").forEach((element, index) => {
        gsap.fromTo(
          element,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            delay: Math.min(index * 0.03, 0.18),
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%" },
          },
        );
      });
      gsap.utils.toArray(".animated-copy span").forEach((span) => {
        gsap.fromTo(
          span,
          { autoAlpha: 0.22 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".animated-copy",
              start: "top 80%",
              end: "bottom 25%",
              scrub: true,
            },
          },
        );
      });
      gsap.to(".marquee-track", {
        xPercent: -28,
        ease: "none",
        scrollTrigger: {
          trigger: ".marquee-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.utils.toArray(".project-card").forEach((card) => {
        gsap.to(card, {
          scale: card.parentElement?.style.getPropertyValue("--scale") || 1,
          ease: "none",
          scrollTrigger: {
            trigger: card.parentElement,
            start: "top 18%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      });
    });
    return () => ctx.revert();
  }, [lang]);

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t.hero} onResume={() => setResumeOpen(true)} />
        <About t={t} />
        <Internship t={t} />
        <Projects t={t} />
        <Marquee />
        <Contact t={t} onResume={() => setResumeOpen(true)} />
      </main>
      <ResumePreview open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <div className="cursor-note">
        <MousePointer2 size={14} />
        GSAP motion
      </div>
    </>
  );
}
