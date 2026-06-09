import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Download, Languages, Mail, MousePointer2, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "./data/content.js";
import heroPortrait from "../assets/optimized/01-hero-card-01.webp";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const optimizedAsset = (name) => asset(`optimized/${name}`);
const resumePdfs = {
  zh: { label: "中文简历", src: asset("陈思语_中文简历_2026.pdf"), title: "陈思语中文简历预览" },
  en: { label: "English Resume", src: asset("Siyu Chen_Resume_2026.pdf"), title: "Siyu Chen resume preview" },
};
const projectLinks = [
  { type: "pdf", src: asset("project-01-thesis.pdf"), title: "Graduation thesis preview" },
  { type: "url", src: "https://another-me-19h.pages.dev/" },
  { type: "pdf", src: asset("project-03-presentation.pdf"), title: "PWCES presentation preview", wide: true },
];
const projectImageFiles = [
  [
    "04-projects-01-image-Col1image1.webp",
    "04-projects-01-image-Col1image2.webp",
    "04-projects-01-image-Col2.webp",
  ],
  [
    "04-projects-02-image-Col1image1.webp",
    "04-projects-02-image-Col1image2.webp",
    "04-projects-02-image-Col2.webp",
  ],
  [
    "04-projects-03-image-Col1image1.webp",
    "04-projects-03-image-Colimage2.webp",
    "04-projects-03-image-Col2.webp",
  ],
];

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

function BilingualLabel({ primary, secondary }) {
  return (
    <span className="bilingual-label">
      <span>{primary}</span>
      {secondary && <small>{secondary}</small>}
    </span>
  );
}

function NavLabel({ item, secondary }) {
  const primary = item === "Projects" ? "PROJECT" : item.toUpperCase();

  return (
    <span className="nav-pipe-label">
      <span>{primary}</span>
      <small>| {secondary}</small>
    </span>
  );
}

function Nav({ lang, setLang, t }) {
  const zhNav = {
    About: "关于",
    Internship: "实习",
    Projects: "项目",
    Contact: "联系我",
  };

  return (
    <header className="site-nav">
      <nav>
        {t.nav.map((item) => (
          <button key={item} onClick={() => scrollToId(item.toLowerCase())}>
            {lang === "zh" ? <NavLabel item={item} secondary={zhNav[item]} /> : item}
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

function BadgeCard({ t, contactLabel, contactSecondary, onContact }) {
  return (
    <div className="badge-wrap reveal">
      <div className="lanyard" />
      <div className="badge-flip">
        <div className="badge-inner">
          <div className="badge-face badge-front">
            <img src={optimizedAsset("02-about-card-01.webp")} alt="Siyu Chen badge portrait" loading="lazy" decoding="async" />
            <strong>{t.frontTitle}</strong>
            <span>{t.frontSub}</span>
            <div className="badge-tags">
              {t.tags.map((tag) => (
                <small key={tag}>{tag}</small>
              ))}
            </div>
          </div>
          <div className="badge-face badge-back">
            <strong>{t.backTitle}</strong>
            <div className="badge-back-content">
              {t.backHighlights.map((item) => (
                <p className="badge-highlight" key={item.label}>
                  <span>{item.label}</span>
                  {item.value}
                </p>
              ))}
              {t.backDetails.map((item) => (
                <p className="badge-detail" key={item.label}>
                  <span>{item.label}</span>
                  {item.value}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ContactButton onClick={onContact}>
        <BilingualLabel primary={contactLabel} secondary={contactSecondary} />
      </ContactButton>
    </div>
  );
}

function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}) {
  const magnetRef = useRef(null);

  useEffect(() => {
    const element = magnetRef.current;
    if (!element) return undefined;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    let animationFrame = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const applyTransform = (transform, transition = activeTransition) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        element.style.transition = transition;
        element.style.transform = transform;
      });
    };

    const reset = () => {
      applyTransform("translate3d(0, 0, 0) rotate(0deg)", inactiveTransition);
    };

    if (isMobile && "DeviceOrientationEvent" in window) {
      let orientationEnabled = false;

      const tilt = (event) => {
        const gamma = clamp(event.gamma ?? 0, -24, 24);
        const beta = clamp((event.beta ?? 0) - 35, -24, 24);
        const x = gamma * 0.65;
        const y = beta * 0.38;
        const rotate = gamma * 0.22;

        applyTransform(`translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`, "transform 0.18s ease-out");
      };

      const enableOrientation = () => {
        if (orientationEnabled) return;
        orientationEnabled = true;
        window.addEventListener("deviceorientation", tilt, true);
      };

      const requestOrientation = async () => {
        const orientationEvent = window.DeviceOrientationEvent;

        if (typeof orientationEvent?.requestPermission === "function") {
          try {
            const permission = await orientationEvent.requestPermission();
            if (permission === "granted") enableOrientation();
          } catch {
            reset();
          }
        } else {
          enableOrientation();
        }
      };

      window.addEventListener("pointerdown", requestOrientation, { once: true });
      window.addEventListener("touchstart", requestOrientation, { once: true, passive: true });
      window.addEventListener("blur", reset);

      return () => {
        cancelAnimationFrame(animationFrame);
        window.removeEventListener("deviceorientation", tilt, true);
        window.removeEventListener("pointerdown", requestOrientation);
        window.removeEventListener("touchstart", requestOrientation);
        window.removeEventListener("blur", reset);
      };
    }

    const move = (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const isActive = Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding;

      applyTransform(
        isActive ? `translate3d(${dx / strength}px, ${dy / strength}px, 0) rotate(0deg)` : "translate3d(0, 0, 0) rotate(0deg)",
        isActive ? activeTransition : inactiveTransition,
      );
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", reset);
    window.addEventListener("mouseleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", reset);
      window.removeEventListener("mouseleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [activeTransition, inactiveTransition, padding, strength]);

  return (
    <div className={className} ref={magnetRef}>
      {children}
    </div>
  );
}

function Hero({ t, onResume }) {
  const heroTitleMatch = t.title.match(/^(.*)\s+(陈思语|Siyu)$/);
  const heroIntro = heroTitleMatch?.[1] ?? t.title;
  const heroName = heroTitleMatch?.[2];
  const taglineLines =
    t.tagline === "市场营销 | 商业分析 | AI 实践 | 持续探索"
      ? ["市场营销 | 商业分析", "AI 实践 | 持续探索"]
      : [t.tagline];

  return (
    <section id="home" className="hero-section snap-panel">
      <h1 className="hero-heading hero-title reveal">
        <span className="hero-title-intro">{heroName ? heroIntro : t.title}</span>
        {heroName && <span className="hero-title-name">{heroName}</span>}
      </h1>
      <div className="hero-portrait reveal">
        <Magnet
          className="hero-magnet"
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <img src={heroPortrait} alt="Siyu Chen portrait" fetchPriority="high" decoding="async" />
        </Magnet>
      </div>
      <div className="hero-bottom">
        <div className="hero-cta-group reveal">
          <p className={`hero-tagline${taglineLines.length > 1 ? " hero-tagline-zh" : ""}`}>
            {taglineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <div className="hero-actions">
            <ContactButton onClick={() => scrollToId("contact")}>
              <BilingualLabel primary={t.contact} secondary={t.contactSecondary} />
            </ContactButton>
            <button className="resume-button" onClick={onResume}>
              <Download size={17} />
              <BilingualLabel primary={t.resume} secondary={t.resumeSecondary} />
            </button>
          </div>
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
      <BadgeCard t={t.badge} contactLabel={t.hero.contact} contactSecondary={t.hero.contactSecondary} onContact={() => scrollToId("contact")} />
      <div className="about-copy reveal">
        <p className="section-kicker">{t.about.eyebrow}</p>
        <h2 className="hero-heading">{t.about.title}</h2>
        <h3>{t.about.subtitle}</h3>
        {t.about.subtitleZh && <p className="subtitle-zh">{t.about.subtitleZh}</p>}
        <AnimatedParagraph text={t.about.body} />
        <div className="education-path" aria-label="Education path">
          <article className="education-card">
            <img src={optimizedAsset("02-about-card-02.webp")} alt={t.about.education[0].school} loading="lazy" decoding="async" />
            <h4>{t.about.education[0].school}</h4>
            <p>{t.about.education[0].years}</p>
          </article>
          <ArrowRight className="education-arrow" size={34} />
          <article className="education-card">
            <img src={optimizedAsset("02-about-card-03.webp")} alt={t.about.education[1].school} loading="lazy" decoding="async" />
            <h4>{t.about.education[1].school}</h4>
            <p>{t.about.education[1].years}</p>
          </article>
        </div>
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

function ProjectCard({ project, index, total, live, liveSecondary, onOpenPdf }) {
  const images = useMemo(() => projectImageFiles[index].map(optimizedAsset), [index]);
  const liveTarget = projectLinks[index];
  const liveLabel = <BilingualLabel primary={live} secondary={liveSecondary} />;

  return (
    <article className="project-stick" style={{ "--scale": 1 - (total - 1 - index) * 0.025 }}>
      <div className="project-card reveal">
        <div className="project-top">
          <span className="item-number">{project.number}</span>
          <div>
            <p className="project-category">
              <span>{project.category}</span>
              {project.categoryZh && <span>{project.categoryZh}</span>}
            </p>
            <h3>{project.name}</h3>
          </div>
          {liveTarget.type === "url" ? (
            <a className="live-project-button" href={liveTarget.src} target="_blank" rel="noreferrer">
              {liveLabel}
            </a>
          ) : (
            <button className="live-project-button" onClick={() => onOpenPdf(liveTarget)}>
              {liveLabel}
            </button>
          )}
        </div>
        <p className="project-desc">{project.desc}</p>
        <div className="project-images">
          <div>
            <img src={images[0]} alt="" loading="lazy" decoding="async" />
            <img src={images[1]} alt="" loading="lazy" decoding="async" />
          </div>
          <img src={images[2]} alt="" loading="lazy" decoding="async" />
        </div>
      </div>
    </article>
  );
}

function Projects({ t, onOpenPdf }) {
  return (
    <section id="projects" className="projects-section">
      <p className="section-kicker reveal">{t.projects.eyebrow}</p>
      <h2 className="hero-heading reveal">{t.projects.title}</h2>
      <div className="projects-stack">
        {t.projects.items.map((project, index) => (
          <ProjectCard
            project={project}
            index={index}
            total={t.projects.items.length}
            live={t.projects.live}
            liveSecondary={t.projects.liveSecondary}
            onOpenPdf={onOpenPdf}
            key={project.number}
          />
        ))}
      </div>
    </section>
  );
}

function Marquee({ onPreview }) {
  const rowOne = [1, 2, 3, 4];
  const rowTwo = [5, 6, 7, 8, 9];
  const allImages = [...rowOne, ...rowTwo].map((number) => optimizedAsset(`05-marquee-image-0${number}.webp`));

  return (
    <section className="marquee-section">
      <div className="marquee-track marquee-row-1">
        {[...Array(3)].flatMap((_, set) =>
          rowOne.map((number) => (
            <button
              className="marquee-tile"
              key={`row-1-${set}-${number}`}
              onClick={() => onPreview(number - 1, allImages)}
              aria-label={`Preview marquee image ${number}`}
            >
              <img src={optimizedAsset(`05-marquee-image-0${number}.webp`)} alt="" loading="lazy" decoding="async" />
            </button>
          )),
        )}
      </div>
      <div className="marquee-track marquee-row-2">
        {[...Array(3)].flatMap((_, set) =>
          rowTwo.map((number) => (
            <button
              className="marquee-tile"
              key={`row-2-${set}-${number}`}
              onClick={() => onPreview(number - 1, allImages)}
              aria-label={`Preview marquee image ${number}`}
            >
              <img src={optimizedAsset(`05-marquee-image-0${number}.webp`)} alt="" loading="lazy" decoding="async" />
            </button>
          )),
        )}
      </div>
    </section>
  );
}

function Contact({ t, onResume }) {
  const [copied, setCopied] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [previousCardIndex, setPreviousCardIndex] = useState(null);
  const [isCuttingCards, setIsCuttingCards] = useState(false);
  const cutTimerRef = useRef(0);
  const contactCardImages = ["06-contact-card-01.webp", "06-contact-card-02.webp", "06-contact-card-03.webp"];
  const showCard = (nextIndex) => {
    if (nextIndex === cardIndex) {
      nextIndex = (cardIndex + 1) % contactCardImages.length;
    }

    window.clearTimeout(cutTimerRef.current);
    setPreviousCardIndex(cardIndex);
    setCardIndex(nextIndex);
    setIsCuttingCards(true);
    cutTimerRef.current = window.setTimeout(() => setIsCuttingCards(false), 620);
  };

  useEffect(() => () => window.clearTimeout(cutTimerRef.current), []);

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
      <div className={`contact-cards reveal${isCuttingCards ? " is-cutting" : ""}`}>
        <div className="contact-card-deck" aria-label="Contact image cards">
          {contactCardImages.map((image, index) => {
            const offset = (index - cardIndex + contactCardImages.length) % contactCardImages.length;
            const slotClass = offset === 0 ? "is-active" : offset === 1 ? "is-next" : "is-previous";
            const wasActiveClass = isCuttingCards && index === previousCardIndex ? " was-active" : "";

            return (
              <button
                className={`contact-image-card ${slotClass}${wasActiveClass}`}
                onClick={() => showCard(index)}
                aria-label={`Show contact card ${index + 1}`}
                title="Switch contact card"
                key={image}
              >
                <img
                  src={optimizedAsset(image)}
                  onError={(event) => {
                    event.currentTarget.src = asset("contact-portrait.svg");
                  }}
                  alt="Siyu contact card"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            );
          })}
        </div>
        <div className="contact-card-dots" aria-label="Contact card selector">
          {contactCardImages.map((image, index) => (
            <button
              className={index === cardIndex ? "active" : ""}
              onClick={() => showCard(index)}
              aria-label={`Show contact card ${index + 1}`}
              key={image}
            />
          ))}
        </div>
      </div>
      <article className="contact-copy reveal">
        <span className="dot" />
        <h3>{t.contact.label}</h3>
        <p className="meta">{t.contact.meta}</p>
        <p>{t.contact.body}</p>
        <div className="contact-pills">
          <button onClick={copyEmail}>
            <Mail size={15} />
            {t.contact.email}
          </button>
          <a href="tel:+8618005630093">{t.contact.phone}</a>
          <button onClick={onResume}>{t.contact.resume}</button>
        </div>
        <button className="back-home-button" onClick={() => scrollToId("home")} aria-label={t.contact.backHome} title={t.contact.backHome}>
          <ArrowUp size={20} />
        </button>
      </article>
      {copied && <div className="toast">{t.contact.copied}</div>}
    </section>
  );
}

function PdfPreview({ preview, onClose }) {
  const [activeResume, setActiveResume] = useState(preview?.defaultResume ?? "zh");
  useEffect(() => {
    if (preview?.defaultResume) {
      setActiveResume(preview.defaultResume);
    }
  }, [preview?.defaultResume]);

  if (!preview) return null;
  const activeOption = preview.resumeOptions?.[activeResume] ?? preview;
  const previewTitle = activeOption.title || preview.title || "PDF preview";
  const iframeSrc = preview.wide && !activeOption.src.includes("#") ? `${activeOption.src}#view=FitH` : activeOption.src;

  return (
    <div className="resume-modal" role="dialog" aria-modal="true" aria-label={previewTitle}>
      <div className={`resume-modal-card${preview.wide ? " resume-modal-wide" : ""}`}>
        <button className="resume-close" onClick={onClose} aria-label="Close PDF preview">
          <X size={20} />
        </button>
        {preview.resumeOptions && (
          <div className="resume-switcher" aria-label="Resume language">
            {Object.entries(preview.resumeOptions).map(([key, option]) => (
              <button className={activeResume === key ? "active" : ""} onClick={() => setActiveResume(key)} key={key}>
                {option.label}
              </button>
            ))}
          </div>
        )}
        <iframe title={previewTitle} src={iframeSrc} />
      </div>
    </div>
  );
}

function ImagePreview({ preview, onClose, onStep }) {
  if (!preview) return null;

  return (
    <div className="image-modal" role="dialog" aria-modal="true" aria-label="Image preview">
      <button className="resume-close image-close" onClick={onClose} aria-label="Close image preview">
        <X size={20} />
      </button>
      <button className="image-arrow image-arrow-left" onClick={() => onStep(-1)} aria-label="Previous image">
        <ArrowLeft size={28} />
      </button>
      <img src={preview.images[preview.index]} alt="" />
      <button className="image-arrow image-arrow-right" onClick={() => onStep(1)} aria-label="Next image">
        <ArrowRight size={28} />
      </button>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("zh");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const t = content[lang];

  const openImagePreview = (index, images) => setImagePreview({ index, images });
  const openResumePreview = () =>
    setPdfPreview({
      defaultResume: lang === "en" ? "en" : "zh",
      resumeOptions: resumePdfs,
      title: "Resume preview",
    });
  const stepImagePreview = (direction) => {
    setImagePreview((current) => {
      if (!current) return current;
      const nextIndex = (current.index + direction + current.images.length) % current.images.length;
      return { ...current, index: nextIndex };
    });
  };

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
      gsap.matchMedia().add("(min-width: 901px)", () => {
        gsap.fromTo(
          ".marquee-row-1",
          { x: -200 },
          {
            x: 220,
            ease: "none",
            scrollTrigger: {
              trigger: ".marquee-section",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          ".marquee-row-2",
          { x: 200 },
          {
            x: -220,
            ease: "none",
            scrollTrigger: {
              trigger: ".marquee-section",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
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
      gsap.matchMedia().add("(max-width: 900px)", () => {
        gsap.fromTo(
          ".marquee-row-1",
          { xPercent: 0 },
          {
            xPercent: -33.333,
            ease: "none",
            scrollTrigger: {
              trigger: ".marquee-section",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          ".marquee-row-2",
          { xPercent: -33.333 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".marquee-section",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.utils.toArray(".project-stick").forEach((project) => {
          gsap.fromTo(
            project,
            { y: 74, scale: 0.96, autoAlpha: 0 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: project,
                start: "top 88%",
              },
            },
          );
        });
      });
    });
    return () => ctx.revert();
  }, [lang]);

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t.hero} onResume={openResumePreview} />
        <About t={t} />
        <Internship t={t} />
        <Projects t={t} onOpenPdf={setPdfPreview} />
        <Marquee onPreview={openImagePreview} />
        <Contact t={t} onResume={openResumePreview} />
      </main>
      <PdfPreview preview={pdfPreview} onClose={() => setPdfPreview(null)} />
      <ImagePreview preview={imagePreview} onClose={() => setImagePreview(null)} onStep={stepImagePreview} />
      <div className="cursor-note">
        <MousePointer2 size={14} />
        GSAP motion
      </div>
    </>
  );
}
