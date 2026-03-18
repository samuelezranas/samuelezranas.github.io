import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBox,
  FiCode,
  FiCpu,
  FiDatabase,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiLayers,
  FiMail,
  FiMenu,
  FiMonitor,
  FiPenTool,
  FiRss,
  FiSend,
  FiFilm,
  FiImage,
  FiScissors,
  FiTerminal,
  FiX,
} from "react-icons/fi";
import { FaJava } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import {
  AdobeAfterEffects,
  AdobeIllustrator,
  AdobePhotoshop,
  AdobeXd,
} from "iconoir-react";
import { PiPlanetBold } from "react-icons/pi";
import {
  SiCanva,
  SiBehance,
  SiDart,
  SiFirebase,
  SiFigma,
  SiFlutter,
  SiGooglecolab,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLaravel,
  SiMariadb,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPhp,
  SiPycharm,
  SiPython,
  SiR,
  SiReact,
  SiScikitlearn,
  SiDiscord,
  SiLetterboxd,
  SiLine,
  SiSpotify,
  SiVuedotjs,
} from "react-icons/si";
import Antigravity from "./components/Antigravity";
import { createContactMessage, fetchPublicWebsiteData } from "./lib/siteApi";
import { isSupabaseConfigured } from "./lib/supabaseClient";

const HOME_TRANSLATIONS = [
  "Hello, World!",
  "Halo, Dunia!",
  "Bonjour, le monde!",
  "Hola, Mundo!",
  "Hallo, Welt!",
  "Konnichiwa, Sekai!",
  "Namaste, Duniya!",
  "Salam, Dunia!",
];

const ENCRYPT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\[]{}@#$%&*";
const RESUME_URL = "https://drive.google.com/";
const CONTACT_WA_NUMBER = "6281318994607";
const CERTIFICATIONS_PER_PAGE = 6;
const ABOUT_TITLE = "I\'m Samuel Ezra. Here, I craft digital products with a futuristic mindset.";
const ABOUT_LEAD =
  "I am an Information Technology undergraduate focused on software engineering, interface design, and visual storytelling. I enjoy building products that are both technically strong and visually memorable. Beyond coding, I care deeply about user flow, visual rhythm, and performance, so every project I build aims to feel smooth, purposeful, and ready for real-world use.";
const DEFAULT_ABOUT_PHOTOS = [{ id: "about-default", image: "/packages/images/2869.jpg" }];

const defaultContactLinks = [
  {
    id: "contact-mail",
    platform: "mail",
    label: "samuelezra2013@gmail.com",
    url: "mailto:samuelezra2013@gmail.com",
  },
  {
    id: "contact-linkedin",
    platform: "linkedin",
    label: "linkedin.com/in/samuel-ezra-sirait",
    url: "https://www.linkedin.com/in/samuel-ezra-sirait/",
  },
  {
    id: "contact-github",
    platform: "github",
    label: "github.com/samuelezranas",
    url: "https://github.com/samuelezranas",
  },
  {
    id: "contact-instagram",
    platform: "instagram",
    label: "instagram.com/samuelezra34",
    url: "https://www.instagram.com/samuelezra34/",
  },
];

const certificationsData = [
  {
    id: "cert-1",
    title: "Belajar Dasar Structured Query Language (SQL)",
    issuer: "Dicoding",
    year: "2024",
    image: "/packages/images/porto-carslification.png",
    credentialUrl: "https://www.dicoding.com/certificates/KEXLYN56YZG2",
  },
  {
    id: "cert-2",
    title: "Belajar Dasar Data Science",
    issuer: "Dicoding",
    year: "2024",
    image: "/packages/images/porto-mandiri-news.png",
    credentialUrl: "",
  },
  {
    id: "cert-3",
    title: "Memulai Pemrograman Dengan Python",
    issuer: "Dicoding",
    year: "2024",
    image: "/packages/images/porto-teman-pasar.jpg",
    credentialUrl: "",
  },
  {
    id: "cert-4",
    title: "Cloud Practitioner Essentials",
    issuer: "AWS Academy",
    year: "2023",
    image: "/packages/images/porto-redesign.png",
    credentialUrl: "",
  },
  {
    id: "cert-5",
    title: "Fundamental Front-End Web",
    issuer: "Dicoding",
    year: "2023",
    image: "/packages/images/cronus-index.png",
    credentialUrl: "",
  },
  {
    id: "cert-6",
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    year: "2023",
    image: "/packages/images/porto-graphic-design.png",
    credentialUrl: "",
  },
  {
    id: "cert-7",
    title: "Machine Learning Basics",
    issuer: "Google Cloud Skills Boost",
    year: "2023",
    image: "/packages/images/porto-cadmus.jpg",
    credentialUrl: "",
  },
  {
    id: "cert-8",
    title: "UI Design Essentials",
    issuer: "Coursera",
    year: "2022",
    image: "/packages/images/porto-desain-stiker.png",
    credentialUrl: "",
  },
];

const portfolioData = {
  Website: [
    {
      title: "Carslification",
      description:
        "Car image classification with CNN and price prediction flow for practical sales insights.",
      image: "/packages/images/porto-carslification.png",
      link: "https://github.com/samuelezranas/carslification-classification-prediction",
      techStack: ["HTML", "CSS", "JavaScript", "Python", "TensorFlow", "Flask"],
    },
    {
      title: "Cronus Watch",
      description:
        "A Laravel commerce website focused on clean architecture and structured SQL data management.",
      image: "/packages/images/cronus-index.png",
      link: "https://github.com/samuelezranas/cronus_watch_store",
      techStack: ["Laravel", "PHP", "MySQL", "JavaScript", "Bootstrap"],
    },
  ],
  Application: [
    {
      title: "Mandiri News App",
      description:
        "Android app that delivers curated headlines in real time via NewsAPI integration.",
      image: "/packages/images/porto-mandiri-news.png",
      link: "https://github.com/samuelezranas/mandiri-news-app/",
      techStack: ["Java", "Android Studio", "NewsAPI", "XML"],
    },
    {
      title: "OOP Smart Market",
      description:
        "Desktop Java application concept for customer and seller transactions in a smart market system.",
      image: "/packages/images/porto-teman-pasar.jpg",
      link: "https://github.com/samuelezranas/oop-project-smartmarket.git",
      techStack: ["Java", "NetBeans", "MySQL", "OOP"],
    },
  ],
};

const portfolioLinks = {
  Design: "https://www.behance.net/samuelezranas",
  Photography: "https://samuelezranas.my.canva.site/portofolio",
};

const TECH_STACK_META = {
  html: { Icon: SiHtml5, url: "https://developer.mozilla.org/en-US/docs/Web/HTML", color: "#e34f26" },
  css: { Icon: FaCss3Alt, url: "https://developer.mozilla.org/en-US/docs/Web/CSS", color: "#1572b6" },
  javascript: { Icon: SiJavascript, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", color: "#f7df1e" },
  python: { Icon: SiPython, url: "https://www.python.org/", color: "#3776ab" },
  tensorflow: { Icon: FiCpu, url: "https://www.tensorflow.org/", color: "#ff6f00" },
  flask: { Icon: FiCode, url: "https://flask.palletsprojects.com/", color: "#ffffff" },
  laravel: { Icon: SiLaravel, url: "https://laravel.com/", color: "#ff2d20" },
  php: { Icon: SiPhp, url: "https://www.php.net/", color: "#777bb4" },
  mysql: { Icon: SiMysql, url: "https://www.mysql.com/", color: "#4479a1" },
  bootstrap: { Icon: FiLayers, url: "https://getbootstrap.com/", color: "#7952b3" },
  java: { Icon: FaJava, url: "https://www.java.com/", color: "#f89820" },
  kotlin: { Icon: SiKotlin, url: "https://kotlinlang.org/", color: "#7f52ff" },
  dart: { Icon: SiDart, url: "https://dart.dev/", color: "#0175c2" },
  flutter: { Icon: SiFlutter, url: "https://flutter.dev/", color: "#02569b" },
  firebase: { Icon: SiFirebase, url: "https://firebase.google.com/", color: "#ffca28" },
  androidstudio: {
    Icon: FiMonitor,
    url: "https://developer.android.com/studio",
    color: "#3ddc84",
  },
  newsapi: { Icon: FiRss, url: "https://newsapi.org/", color: "#ff6f61" },
  xml: { Icon: FiFileText, url: "https://www.w3.org/XML/", color: "#00bcd4" },
  netbeans: { Icon: FiTerminal, url: "https://netbeans.apache.org/", color: "#1b6ac6" },
  oop: {
    Icon: FiBox,
    url: "https://en.wikipedia.org/wiki/Object-oriented_programming",
    color: "#ff7f50",
  },
  hapijs: { Icon: SiNodedotjs, url: "https://hapi.dev/", color: "#5fa04e" },
  geolocation: {
    Icon: PiPlanetBold,
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API",
    color: "#72d7ff",
  },
};

const normalizeTechStackKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const skillMarquees = [
  {
    title: "Website",
    direction: 1,
    logos: [
      { Icon: SiHtml5, name: "HTML", color: "#e34f26" },
      { Icon: FaCss3Alt, name: "CSS", color: "#1572b6" },
      { Icon: SiJavascript, name: "JavaScript", color: "#f7df1e" },
      { Icon: SiNodedotjs, name: "Node.js", color: "#5fa04e" },
      { Icon: SiPhp, name: "PHP", color: "#777bb4" },
      { Icon: SiLaravel, name: "Laravel", color: "#ff2d20" },
      { Icon: SiReact, name: "ReactJS", color: "#61dafb" },
      { Icon: SiVuedotjs, name: "Vue", color: "#42b883" },
    ],
  },
  {
    title: "Mobile",
    direction: -1,
    logos: [
      { Icon: FaJava, name: "Java", color: "#f89820" },
      { Icon: SiKotlin, name: "Kotlin", color: "#7f52ff" },
      { Icon: SiDart, name: "Dart", color: "#0175c2" },
      { Icon: SiFlutter, name: "Flutter", color: "#02569b" },
      { Icon: SiReact, name: "React Native", color: "#61dafb" },
    ],
  },
  {
    title: "Data",
    direction: 1,
    logos: [
      { Icon: SiMysql, name: "MySQL", color: "#4479a1" },
      { Icon: SiMongodb, name: "MongoDB", color: "#47a248" },
      { Icon: SiMariadb, name: "MariaDB", color: "#003545" },
      { Icon: SiR, name: "R", color: "#276dc3" },
      { Icon: SiGooglecolab, name: "Google Colab", color: "#f9ab00" },
      { Icon: SiScikitlearn, name: "Scikit", color: "#f7931e" },
      { Icon: SiPython, name: "Python", color: "#3776ab" },
      { Icon: SiPycharm, name: "PyCharm", color: "#21d789" },
      { Icon: SiNumpy, name: "NumPy", color: "#4dabcf" },
      { Icon: SiPandas, name: "Pandas", color: "#150458" },
    ],
  },
  {
    title: "Others",
    direction: -1,
    logos: [
      { Icon: SiFigma, name: "Figma", color: "#f24e1e" },
      { Icon: AdobeIllustrator, name: "Illustrator", color: "#ff9a00" },
      { Icon: AdobePhotoshop, name: "Photoshop", color: "#31a8ff" },
      { Icon: AdobeXd, name: "Adobe XD", color: "#ff61f6" },
      { Icon: AdobeAfterEffects, name: "After Effects", color: "#9999ff" },
      { Icon: FiFilm, name: "Premiere Pro", color: "#ea77ff" },
      { Icon: FiScissors, name: "CapCut", color: "#ffffff" },
      { Icon: SiCanva, name: "Canva", color: "#00c4cc" },
    ],
  },
];

const footerSocialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/samuel-ezra-sirait/",
    Icon: FiLinkedin,
  },
  {
    name: "Letterboxd",
    href: "https://boxd.it/gPYht",
    Icon: SiLetterboxd,
  },
  {
    name: "Behance",
    href: "https://behance.net/samuelezranas",
    Icon: SiBehance,
  },
  {
    name: "GitHub",
    href: "https://github.com/samuelezranas",
    Icon: FiGithub,
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/user/212evkjibuisarid6stvinxoq?nd=1&dlsi=de44e83244b94dbb",
    Icon: SiSpotify,
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Website");
  const [activeProject, setActiveProject] = useState(null);
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(false);
  const [isPortfolioRowAnimating, setIsPortfolioRowAnimating] = useState(false);
  const [portfolioRowMaxHeight, setPortfolioRowMaxHeight] = useState("none");
  const [aboutContent, setAboutContent] = useState({
    title: ABOUT_TITLE,
    lead: ABOUT_LEAD,
    resumeUrl: RESUME_URL,
    photos: DEFAULT_ABOUT_PHOTOS,
  });
  const [dynamicCertifications, setDynamicCertifications] = useState(certificationsData);
  const [dynamicPortfolioData, setDynamicPortfolioData] = useState(portfolioData);
  const [dynamicPortfolioLinks, setDynamicPortfolioLinks] = useState(portfolioLinks);
  const [dynamicContacts, setDynamicContacts] = useState(defaultContactLinks);
  const [contactMessageForm, setContactMessageForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactMessageError, setContactMessageError] = useState("");
  const [contactMessageSuccess, setContactMessageSuccess] = useState("");
  const [isSendingContactMessage, setIsSendingContactMessage] = useState(false);
  const [certificationPage, setCertificationPage] = useState(0);
  const [activeCertification, setActiveCertification] = useState(null);
  const [aboutPhotoIndex, setAboutPhotoIndex] = useState(0);
  const [aboutSwipeDirection, setAboutSwipeDirection] = useState("right");
  const [isAboutSwipeAnimating, setIsAboutSwipeAnimating] = useState(false);
  const [isAboutDragging, setIsAboutDragging] = useState(false);
  const [aboutDragOffsetX, setAboutDragOffsetX] = useState(0);
  const [isAboutActive, setIsAboutActive] = useState(false);
  const [encryptedHeroText, setEncryptedHeroText] = useState(HOME_TRANSLATIONS[0]);
  const encryptedIndexRef = useRef(0);
  const scrambleFrameRef = useRef(0);
  const homeSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const isPortfolioExpandedRef = useRef(false);
  const scrollSnapLockedRef = useRef(false);
  const snapTimeoutRef = useRef(0);
  const snapSettleTimeoutRef = useRef(0);
  const touchStartYRef = useRef(null);
  const portfolioRowRef = useRef(null);
  const aboutSwipeTimeoutRef = useRef(0);
  const aboutPointerStartXRef = useRef(null);
  const aboutActivePointerIdRef = useRef(null);

  const smoothSnapToSection = (targetSection) => {
    if (!targetSection) {
      return;
    }

    const targetTop = targetSection.offsetTop;
    scrollSnapLockedRef.current = true;
    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    window.clearTimeout(snapSettleTimeoutRef.current);
    snapSettleTimeoutRef.current = window.setTimeout(() => {
      // Force exact alignment to avoid ending between sections.
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "auto",
      });
    }, 430);

    window.clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = window.setTimeout(() => {
      scrollSnapLockedRef.current = false;
    }, 560);

    setIsMenuOpen(false);
  };

  useEffect(() => {
    isPortfolioExpandedRef.current = isPortfolioExpanded;
  }, [isPortfolioExpanded]);

  useEffect(() => {
    const runScramble = (targetText) => {
      cancelAnimationFrame(scrambleFrameRef.current);

      const start = performance.now();
      const duration = 920;

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const revealCount = Math.floor(progress * targetText.length);

        let nextText = "";
        for (let i = 0; i < targetText.length; i += 1) {
          if (i < revealCount) {
            nextText += targetText[i];
          } else {
            const randomIndex = Math.floor(Math.random() * ENCRYPT_CHARSET.length);
            nextText += ENCRYPT_CHARSET[randomIndex];
          }
        }

        setEncryptedHeroText(nextText);

        if (progress < 1) {
          scrambleFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        setEncryptedHeroText(targetText);
      };

      scrambleFrameRef.current = requestAnimationFrame(tick);
    };

    const transitionInterval = window.setInterval(() => {
      encryptedIndexRef.current = (encryptedIndexRef.current + 1) % HOME_TRANSLATIONS.length;
      runScramble(HOME_TRANSLATIONS[encryptedIndexRef.current]);
    }, 3000);

    return () => {
      window.clearInterval(transitionInterval);
      cancelAnimationFrame(scrambleFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeCertification) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setActiveCertification(null);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [activeCertification]);

  useEffect(() => {
    const aboutSection = aboutSectionRef.current;
    if (!aboutSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboutActive(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      {
        threshold: [0.25, 0.45, 0.65],
      }
    );

    observer.observe(aboutSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const isPhoneViewport = () => window.matchMedia("(max-width: 600px)").matches;

    const getSnapTargets = () =>
      Array.from(document.querySelectorAll(".section-page, .site-footer"));

    const getCurrentSectionIndex = (targets) => {
      if (!targets.length) {
        return -1;
      }

      const scrollY = window.scrollY;
      return targets.reduce((closestIndex, target, index) => {
        const closestDistance = Math.abs(targets[closestIndex].offsetTop - scrollY);
        const currentDistance = Math.abs(target.offsetTop - scrollY);
        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);
    };

    const goToAdjacentSection = (deltaY) => {
      const targets = getSnapTargets();
      if (!targets.length) {
        return false;
      }

      const currentIndex = getCurrentSectionIndex(targets);
      if (currentIndex < 0) {
        return false;
      }

      const nextIndex = deltaY > 0 ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= targets.length) {
        return false;
      }

      smoothSnapToSection(targets[nextIndex]);
      return true;
    };

    const snapBetweenHomeAndAboutOnPhone = (deltaY) => {
      const homeSection = homeSectionRef.current;
      const aboutSection = aboutSectionRef.current;
      if (!homeSection || !aboutSection) {
        return false;
      }

      const aboutTop = aboutSection.offsetTop;
      const scrollY = window.scrollY;
      const inHomeZone = scrollY < aboutTop - 8;
      const inAboutTopZone =
        scrollY >= aboutTop - 8 && scrollY < aboutTop + window.innerHeight * 0.58;

      if (deltaY > 0 && inHomeZone) {
        smoothSnapToSection(aboutSection);
        return true;
      }

      if (deltaY < 0 && inAboutTopZone) {
        smoothSnapToSection(homeSection);
        return true;
      }

      return false;
    };

    if (!getSnapTargets().length) {
      return;
    }

    const handleDirectionalSnap = (deltaY, event) => {
      if (Math.abs(deltaY) < 8) {
        return;
      }

      if (isPortfolioExpandedRef.current) {
        return;
      }

      if (scrollSnapLockedRef.current) {
        event.preventDefault();
        return;
      }

      if (isPhoneViewport()) {
        const didSnap = snapBetweenHomeAndAboutOnPhone(deltaY);
        if (didSnap) {
          event.preventDefault();
        }
        return;
      }

      event.preventDefault();
      goToAdjacentSection(deltaY);
    };

    const onWheel = (event) => {
      handleDirectionalSnap(event.deltaY, event);
    };

    const onTouchStart = (event) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event) => {
      if (touchStartYRef.current === null) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - currentY;
      if (Math.abs(deltaY) < 14) {
        return;
      }

      touchStartYRef.current = currentY;
      handleDirectionalSnap(deltaY, event);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.clearTimeout(snapTimeoutRef.current);
      window.clearTimeout(snapSettleTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    const loadWebsiteData = async () => {
      try {
        const data = await fetchPublicWebsiteData();
        if (!isMounted || !data) {
          return;
        }

        if (data.about) {
          setAboutContent((previous) => ({
            ...previous,
            title: data.about.title || previous.title,
            lead: data.about.lead || previous.lead,
            resumeUrl: data.about.resumeUrl || previous.resumeUrl,
            photos: data.about.photos?.length ? data.about.photos : previous.photos,
          }));
        }

        if (Array.isArray(data.certifications) && data.certifications.length > 0) {
          setDynamicCertifications(data.certifications);
        }

        if (data.portfolioData && Object.keys(data.portfolioData).length > 0) {
          setDynamicPortfolioData(data.portfolioData);
        }

        if (data.portfolioLinks && Object.keys(data.portfolioLinks).length > 0) {
          setDynamicPortfolioLinks(data.portfolioLinks);
        }

        if (Array.isArray(data.contacts) && data.contacts.length > 0) {
          setDynamicContacts(data.contacts);
        }
      } catch (error) {
        console.error("Failed to load Supabase website data:", error);
      }
    };

    loadWebsiteData();

    return () => {
      isMounted = false;
    };
  }, []);

  const aboutPhotos = aboutContent.photos?.length ? aboutContent.photos : DEFAULT_ABOUT_PHOTOS;

  useEffect(() => {
    if (aboutPhotoIndex >= aboutPhotos.length) {
      setAboutPhotoIndex(0);
    }
  }, [aboutPhotoIndex, aboutPhotos.length]);

  useEffect(() => {
    if (aboutPhotos.length <= 1) {
      return undefined;
    }

    const rotation = window.setInterval(() => {
      if (isAboutSwipeAnimating || isAboutDragging) {
        return;
      }

      setAboutSwipeDirection("right");
      setIsAboutSwipeAnimating(true);

      window.clearTimeout(aboutSwipeTimeoutRef.current);
      aboutSwipeTimeoutRef.current = window.setTimeout(() => {
        setAboutPhotoIndex((previous) => (previous + 1) % aboutPhotos.length);
        setIsAboutSwipeAnimating(false);
      }, 260);
    }, 3000);

    return () => {
      window.clearInterval(rotation);
    };
  }, [aboutPhotos.length, isAboutSwipeAnimating, isAboutDragging]);

  const swipeAboutPhoto = (direction) => {
    if (aboutPhotos.length <= 1 || isAboutSwipeAnimating) {
      return;
    }

    setAboutSwipeDirection(direction);
    setIsAboutSwipeAnimating(true);
    setIsAboutDragging(false);
    setAboutDragOffsetX(0);

    window.clearTimeout(aboutSwipeTimeoutRef.current);
    aboutSwipeTimeoutRef.current = window.setTimeout(() => {
      setAboutPhotoIndex((previous) => (previous + 1) % aboutPhotos.length);
      setIsAboutSwipeAnimating(false);
    }, 260);
  };

  const handleAboutPointerDown = (event) => {
    if (aboutPhotos.length <= 1 || isAboutSwipeAnimating) {
      return;
    }

    event.preventDefault();
    aboutActivePointerIdRef.current = event.pointerId;
    aboutPointerStartXRef.current = event.clientX;
    setIsAboutDragging(true);
    setAboutDragOffsetX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleAboutPointerMove = (event) => {
    if (
      !isAboutDragging ||
      aboutPointerStartXRef.current === null ||
      aboutActivePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    setAboutDragOffsetX(event.clientX - aboutPointerStartXRef.current);
  };

  const finishAboutPointerGesture = (event, isCancelled = false) => {
    if (!isAboutDragging || aboutPointerStartXRef.current === null) {
      return;
    }

    const endX = event?.clientX ?? aboutPointerStartXRef.current;
    const deltaX = endX - aboutPointerStartXRef.current;

    aboutPointerStartXRef.current = null;
    aboutActivePointerIdRef.current = null;

    if (!isCancelled && Math.abs(deltaX) >= 44) {
      swipeAboutPhoto(deltaX < 0 ? "left" : "right");
      return;
    }

    setIsAboutDragging(false);
    setAboutDragOffsetX(0);
  };

  const handleAboutPointerUp = (event) => {
    if (aboutActivePointerIdRef.current !== event.pointerId) {
      return;
    }

    finishAboutPointerGesture(event);
  };

  const handleAboutPointerCancel = (event) => {
    if (aboutActivePointerIdRef.current !== event.pointerId) {
      return;
    }

    finishAboutPointerGesture(event, true);
  };

  const preventNativeAboutDrag = (event) => {
    event.preventDefault();
  };

  const topCardSwipeStyle =
    isAboutDragging && !isAboutSwipeAnimating
      ? {
          transform: `translateX(${aboutDragOffsetX}px) rotate(${aboutDragOffsetX * 0.08}deg) scale(0.996)`,
          transition: "none",
        }
      : undefined;

  useEffect(() => {
    return () => {
      window.clearTimeout(aboutSwipeTimeoutRef.current);
    };
  }, []);

  const handleExploreClick = (event) => {
    event.preventDefault();
    smoothSnapToSection(aboutSectionRef.current);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveProject(null);
    setIsPortfolioExpanded(false);
    setIsPortfolioRowAnimating(false);
    setPortfolioRowMaxHeight("none");
  };

  const handlePortfolioExpandToggle = () => {
    const rowElement = portfolioRowRef.current;

    if (!rowElement) {
      setIsPortfolioExpanded((previous) => !previous);
      return;
    }

    const currentHeight = rowElement.getBoundingClientRect().height;
    setIsPortfolioRowAnimating(true);
    setPortfolioRowMaxHeight(`${Math.max(currentHeight, 1)}px`);
    setIsPortfolioExpanded((previous) => !previous);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const targetHeight = rowElement.scrollHeight;
        setPortfolioRowMaxHeight(`${Math.max(targetHeight, 1)}px`);
      });
    });
  };

  const handlePortfolioRowTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || !isPortfolioRowAnimating) {
      return;
    }

    setIsPortfolioRowAnimating(false);
    setPortfolioRowMaxHeight("none");
  };

  const portfolioCategories = useMemo(
    () => [...new Set([...Object.keys(dynamicPortfolioData), ...Object.keys(dynamicPortfolioLinks)])],
    [dynamicPortfolioData, dynamicPortfolioLinks]
  );

  useEffect(() => {
    if (!portfolioCategories.length) {
      return;
    }

    if (!portfolioCategories.includes(activeCategory)) {
      setActiveCategory(portfolioCategories[0]);
      setActiveProject(null);
    }
  }, [activeCategory, portfolioCategories]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(dynamicCertifications.length / CERTIFICATIONS_PER_PAGE));
    if (certificationPage >= totalPages) {
      setCertificationPage(0);
    }
  }, [certificationPage, dynamicCertifications.length]);

  const currentProjects = dynamicPortfolioData[activeCategory] || [];
  const visibleProjectLimit = 2;
  const hasMoreProjects = currentProjects.length > visibleProjectLimit;
  const visibleProjects = isPortfolioExpanded
    ? currentProjects
    : currentProjects.slice(0, visibleProjectLimit);
  const portfolioCards =
    visibleProjects.length > 0 && visibleProjects.length % 2 !== 0
      ? [...visibleProjects, { id: `project-skeleton-${activeCategory}-${visibleProjects.length}`, isPlaceholder: true }]
      : visibleProjects;
  const certificationPageCount = Math.max(
    1,
    Math.ceil(dynamicCertifications.length / CERTIFICATIONS_PER_PAGE)
  );
  const certificationPageItems = dynamicCertifications.slice(
    certificationPage * CERTIFICATIONS_PER_PAGE,
    (certificationPage + 1) * CERTIFICATIONS_PER_PAGE
  );
  const certificationsInView = Array.from({ length: CERTIFICATIONS_PER_PAGE }, (_, index) => {
    const certification = certificationPageItems[index];
    if (certification) {
      return certification;
    }

    return {
      id: `cert-placeholder-${certificationPage}-${index}`,
      isPlaceholder: true,
    };
  });
  const detailProjectSequence = ["Website", "Application"].flatMap((category) =>
    (dynamicPortfolioData[category] || []).map((project) => ({ category, project }))
  );
  const activeProjectIndex = activeProject
    ? detailProjectSequence.findIndex((item) => item.project.title === activeProject.title)
    : -1;
  const previousProject = activeProjectIndex > 0 ? detailProjectSequence[activeProjectIndex - 1] : null;
  const nextProject =
    activeProjectIndex >= 0 && activeProjectIndex < detailProjectSequence.length - 1
      ? detailProjectSequence[activeProjectIndex + 1]
      : null;

  const openProjectDetail = (target) => {
    if (!target) {
      return;
    }

    setActiveCategory(target.category);
    setActiveProject(target.project);
  };

  const resolveContactIcon = (contact) => {
    const normalized = [contact?.platform, contact?.label, contact?.url]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (normalized.includes("mail")) {
      return FiMail;
    }
    if (normalized.includes("linkedin")) {
      return FiLinkedin;
    }
    if (normalized.includes("github")) {
      return FiGithub;
    }
    if (normalized.includes("instagram")) {
      return FiInstagram;
    }
    if (normalized.includes("line.me") || normalized.includes(" line")) {
      return SiLine;
    }
    if (normalized.includes("discord")) {
      return SiDiscord;
    }

    return FiExternalLink;
  };

  const handleContactFormSubmit = async (event) => {
    event.preventDefault();
    setContactMessageError("");
    setContactMessageSuccess("");

    const name = contactMessageForm.name.trim();
    const email = contactMessageForm.email.trim();
    const message = contactMessageForm.message.trim();

    if (!name || !email || !message) {
      setContactMessageError("Nama, email, dan pesan wajib diisi.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setContactMessageError("Masukkan alamat email yang valid.");
      return;
    }

    const whatsappTemplate = `Halo, saya ${name}. Saya tertarik untuk berkomunikasi dengan anda lebih lanjut. ${message}. Hubungi saya kembali atau kirimkan email ke ${email}.`;

    setIsSendingContactMessage(true);
    try {
      if (isSupabaseConfigured) {
        await createContactMessage({
          name,
          email,
          message,
        });
      }

      const whatsappUrl = `https://wa.me/${CONTACT_WA_NUMBER}?text=${encodeURIComponent(
        whatsappTemplate
      )}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      setContactMessageForm({ name: "", email: "", message: "" });
      setContactMessageSuccess("Pesan berhasil disiapkan. WhatsApp chat sudah dibuka.");
    } catch (error) {
      setContactMessageError(error?.message || "Gagal mengirim pesan. Coba lagi.");
    } finally {
      setIsSendingContactMessage(false);
    }
  };

  useEffect(() => {
    if (!contactMessageSuccess) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setContactMessageSuccess("");
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [contactMessageSuccess]);

  return (
    <div className={`app-shell ${isAboutActive ? "about-active" : ""}`}>
      <div className="space-layer stars-near" />
      <div className="space-layer stars-mid" />
      <div className="space-layer stars-far" />

      <header className={`topbar ${isAboutActive ? "topbar-visible" : "topbar-hidden"}`}>
        <p className="brand">
          <PiPlanetBold />
          <span className="brand-text" data-text="Samuel Ezra">Samuel Ezra</span>
        </p>
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        <nav className={isMenuOpen ? "open" : ""}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skill</a>
          <a href="#certification">Certification</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" className="section-page home-section" ref={homeSectionRef}>
          <div className="home-hero-wrap">
            <Antigravity
              count={750}
              magnetRadius={10}
              ringRadius={5}
              waveSpeed={1.2}
              waveAmplitude={2.9}
              particleSize={2}
              lerpSpeed={0.35}
              color="#FF9FFC"
              autoAnimate
              particleVariance={1}
              rotationSpeed={1.5}
              depthFactor={1.8}
              pulseSpeed={3}
              particleShape="capsule"
              fieldStrength={10}
            />
            <div className="home-copy-layer">
              <p className="home-copy-kicker">BOOTING GREETING STREAM</p>
              <h1 className="home-copy-title">{encryptedHeroText}</h1>
              <a href="#about" className="home-explore-btn" onClick={handleExploreClick}>
                Explore Me
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="section-page" ref={aboutSectionRef}>
          <div className="section-panel intro-layout">
            <div>
              <p className="eyebrow">
                <HiOutlineSparkles /> About me
              </p>
              <h1 className="animated-subtitle about-title-dynamic">{aboutContent.title}</h1>
              <p className="lead">{aboutContent.lead}</p>
              <div className="quick-links">
                <a
                  href={aboutContent.resumeUrl || RESUME_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-cta"
                >
                  <FiFileText /> CV / Resume
                </a>
              </div>
            </div>

            <div className="about-photo-stack">
              <div
                className={`about-photo-stage${isAboutDragging ? " is-grabbing" : ""}`}
                onPointerDown={handleAboutPointerDown}
                onPointerMove={handleAboutPointerMove}
                onPointerUp={handleAboutPointerUp}
                onPointerCancel={handleAboutPointerCancel}
                onDragStart={preventNativeAboutDrag}
              >
                {aboutPhotos.slice(0, 3).map((_, layerIndex) => {
                  const photo = aboutPhotos[(aboutPhotoIndex + layerIndex) % aboutPhotos.length];
                  return (
                    <figure
                      key={`${photo.id}-${layerIndex}`}
                      className={`about-photo-layer layer-${layerIndex}${
                        layerIndex === 0 && isAboutSwipeAnimating
                          ? ` swipe-${aboutSwipeDirection}`
                          : ""
                      }`}
                      style={layerIndex === 0 ? topCardSwipeStyle : undefined}
                    >
                      <img
                        src={photo.image}
                        alt={`About visual ${layerIndex + 1}`}
                        draggable={false}
                        onDragStart={preventNativeAboutDrag}
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section-page">
          <div className="section-panel">
            <h2 className="animated-subtitle">Tech Skill</h2>
            <p className="section-desc">
              See more about my technical expertise.
            </p>
            <div className="skill-box">
              {skillMarquees.map((lane) => {
                const baseDirection = lane.direction;
                const repeatedLogos = Array.from({ length: 6 }, (_, groupIndex) =>
                  lane.logos.map((logo, logoIndex) => ({
                    ...logo,
                    key: `${lane.title}-${logo.name}-${groupIndex}-${logoIndex}`,
                  }))
                ).flat();

                return (
                  <section key={lane.title} className="skill-lane">
                    <span className={`lane-corner-tag ${baseDirection > 0 ? "left" : "right"}`}>
                      <span className="lane-corner-text">{lane.title}</span>
                    </span>
                    <div className="marquee-wrap">
                      <div className={`marquee-track ${baseDirection > 0 ? "left" : "right"}`}>
                        {repeatedLogos.map((logo) => (
                          <span className="logo-glyph" key={logo.key}>
                            <logo.Icon style={{ color: logo.color }} />
                            <span>{logo.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section id="certification" className="section-page">
          <div className="section-panel certification-panel">
            <h2 className="animated-subtitle">Certification</h2>
            <p className="section-desc">
              Selected certificates from my learning track. Hover for motion details and click to open full preview.
            </p>

            <div className="certification-grid" key={`cert-page-${certificationPage}`}>
              {certificationsInView.map((certification) => (
                <article
                  key={certification.id}
                  className={`cert-card ${certification.isPlaceholder ? "placeholder" : ""}`}
                  onClick={() => {
                    if (!certification.isPlaceholder) {
                      setActiveCertification(certification);
                    }
                  }}
                  role={certification.isPlaceholder ? undefined : "button"}
                  tabIndex={certification.isPlaceholder ? -1 : 0}
                  onKeyDown={(event) => {
                    if (certification.isPlaceholder) {
                      return;
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveCertification(certification);
                    }
                  }}
                >
                  {certification.isPlaceholder ? (
                    <>
                      <div className="cert-thumb-wrap cert-skeleton-block">
                        <div className="cert-thumb" aria-hidden="true" />
                        <span className="cert-thumb-hover-label" aria-hidden="true">Not Yet</span>
                      </div>
                      <div className="cert-title-slot" aria-hidden="true">
                        <div className="cert-skeleton-title" />
                        <p className="cert-placeholder-title">No Certificate Detected</p>
                      </div>
                      <div className="cert-skeleton-line" aria-hidden="true" />
                      <div className="cert-year-slot" aria-hidden="true">
                        <span className="cert-skeleton-pill" />
                        <span className="cert-skeleton-year">20XX</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="cert-thumb-wrap">
                        <img src={certification.image} alt={certification.title} className="cert-thumb" />
                      </div>
                      <h4>{certification.title}</h4>
                      <p>{certification.issuer}</p>
                      <span>{certification.year}</span>
                    </>
                  )}
                </article>
              ))}
            </div>

            {certificationPageCount > 1 && (
              <div className="cert-pagination">
                <button
                  type="button"
                  onClick={() =>
                    setCertificationPage((prev) =>
                      prev === 0 ? certificationPageCount - 1 : prev - 1
                    )
                  }
                  aria-label="Previous certification page"
                >
                  <FiArrowLeft />
                </button>
                <div className="cert-dots" aria-label="Certification pages">
                  {Array.from({ length: certificationPageCount }, (_, index) => (
                    <button
                      key={`cert-page-dot-${index}`}
                      type="button"
                      className={index === certificationPage ? "active" : ""}
                      onClick={() => setCertificationPage(index)}
                      aria-label={`Go to certification page ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCertificationPage((prev) =>
                      prev === certificationPageCount - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next certification page"
                >
                  <FiArrowRight />
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="portfolio" className="section-page">
          <div className="section-panel">
            <h2 className="animated-subtitle">Portfolio</h2>
            <p className="section-desc">
              Browse by category. Website and Application items open into detailed project pages.
            </p>

            {!activeProject && (
              <>
                <div className="portfolio-mobile-filter">
                  <label htmlFor="portfolio-category-select">Category</label>
                  <div className="portfolio-mobile-select-wrap">
                    <select
                      id="portfolio-category-select"
                      value={activeCategory}
                      onChange={(event) => handleCategoryChange(event.target.value)}
                    >
                      {portfolioCategories.map((category) => (
                        <option key={`portfolio-option-${category}`} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="portfolio-tabs">
                  {portfolioCategories.map((category) => (
                    <button
                      key={category}
                      className={activeCategory === category ? "active" : ""}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </>
            )}

            {(activeCategory === "Website" || activeCategory === "Application") && !activeProject && (
              <>
                <div
                  className={`portfolio-row-animator${isPortfolioRowAnimating ? " is-animating" : ""}`}
                  style={{ maxHeight: portfolioRowMaxHeight }}
                  onTransitionEnd={handlePortfolioRowTransitionEnd}
                >
                  <div className="portfolio-row" role="list" ref={portfolioRowRef}>
                    {portfolioCards.map((project, index) => {
                      if (project.isPlaceholder) {
                        return (
                          <article key={project.id || `project-placeholder-${index}`} className="project-card skeleton" role="presentation" aria-hidden="true">
                            <div className="project-thumb-skeleton-wrap">
                              <div className="project-thumb-skeleton" />
                              <span className="project-skeleton-hover-label">Not Yet</span>
                            </div>
                            <div className="project-skeleton-title-slot" aria-hidden="true">
                              <div className="project-line-skeleton short" />
                              <p className="project-skeleton-hover-title">No Project Detected</p>
                            </div>
                            <div className="project-line-skeleton" />
                            <div className="project-line-skeleton" />
                            <div className="project-line-skeleton" />
                          </article>
                        );
                      }

                      return (
                        <article
                          role="listitem"
                          key={project.title}
                          className="project-card clickable"
                          onClick={() =>
                            openProjectDetail({
                              category: activeCategory,
                              project,
                            })
                          }
                        >
                          <img src={project.image} alt={project.title} />
                          <h4>{project.title}</h4>
                          <p>{project.description}</p>
                        </article>
                      );
                    })}
                  </div>
                </div>

                {hasMoreProjects && (
                  <div className="portfolio-more-wrap">
                    <button type="button" onClick={handlePortfolioExpandToggle}>
                      {isPortfolioExpanded ? "Less" : "More"}
                    </button>
                  </div>
                )}
              </>
            )}

            {(activeCategory === "Website" || activeCategory === "Application") && activeProject && (
              <article className="project-detail">
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                  <button onClick={() => setActiveProject(null)}>Portfolio</button>
                  <span>/</span>
                  <button onClick={() => setActiveProject(null)}>{activeCategory}</button>
                  <span>/</span>
                  <span>{activeProject.title}</span>
                </nav>

                <div className="project-nav-controls">
                  <div className="project-nav-slot left">
                    {previousProject && (
                      <button
                        className="project-switch-btn"
                        onClick={() => openProjectDetail(previousProject)}
                      >
                        <FiArrowLeft />
                        <span>{previousProject.project.title}</span>
                      </button>
                    )}
                  </div>
                  <div className="project-nav-slot right">
                    {nextProject && (
                      <button
                        className="project-switch-btn"
                        onClick={() => openProjectDetail(nextProject)}
                      >
                        <span>{nextProject.project.title}</span>
                        <FiArrowRight />
                      </button>
                    )}
                  </div>
                </div>

                <img src={activeProject.image} alt={activeProject.title} />
                <h3>{activeProject.title}</h3>
                <p>{activeProject.description}</p>

                <h4>Tech Stack</h4>
                <div className="stack-list">
                  {activeProject.techStack.map((item) => (
                    (() => {
                      const normalizedKey = normalizeTechStackKey(item);
                      const meta = TECH_STACK_META[normalizedKey] || {
                        Icon: FiCode,
                        url: "https://developer.mozilla.org/",
                        color: "#f6efff",
                      };
                      const StackIcon = meta.Icon;

                      return (
                        <a
                          key={item}
                          href={meta.url}
                          target="_blank"
                          rel="noreferrer"
                          className="stack-icon-link"
                          aria-label={item}
                          title={item}
                        >
                          <StackIcon style={{ color: meta.color }} />
                        </a>
                      );
                    })()
                  ))}
                </div>

                <a
                  href={activeProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="repo-cta"
                >
                  <span>Project Repository</span>
                  <FiGithub />
                </a>
              </article>
            )}

            {(activeCategory === "Design" || activeCategory === "Photography") && (
              <article className="shortcut-card single">
                <h3>{activeCategory}</h3>
                <p>
                  Open the dedicated {activeCategory.toLowerCase()} portfolio page for the full collection.
                </p>
                <a href={dynamicPortfolioLinks[activeCategory]} target="_blank" rel="noreferrer">
                  Go to {activeCategory} Portfolio <FiExternalLink />
                </a>
              </article>
            )}
          </div>
        </section>

        <section id="contact" className="section-page">
          <div className="section-panel contact-panel">
            <h2 className="animated-subtitle">Contact Me</h2>
            <p className="section-desc">
              Have a project idea, collaboration opportunity, or just want to connect? Let&apos;s talk.
            </p>

            <form className="contact-message-form" onSubmit={handleContactFormSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={contactMessageForm.name}
                onChange={(event) =>
                  setContactMessageForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <input
                type="email"
                placeholder="yourname@email.com"
                value={contactMessageForm.email}
                onChange={(event) =>
                  setContactMessageForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <textarea
                placeholder="Your Message"
                value={contactMessageForm.message}
                onChange={(event) =>
                  setContactMessageForm((prev) => ({ ...prev, message: event.target.value }))
                }
              />
              <button type="submit" className="contact-send-btn" disabled={isSendingContactMessage}>
                <FiSend />
                <span>{isSendingContactMessage ? "Sending..." : "Send"}</span>
              </button>
            </form>

            {contactMessageError && <p className="contact-feedback error">{contactMessageError}</p>}

            <div className="contact-grid">
              {dynamicContacts.map((contact) => {
                const ContactIcon = resolveContactIcon(contact);
                const href = contact.url || "#";
                const isMail = href.startsWith("mailto:");

                return (
                  <a
                    key={contact.id || `${contact.platform}-${contact.label}`}
                    href={href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noreferrer"}
                  >
                    <ContactIcon /> {contact.label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {activeCertification && (
          <div
            className="cert-modal-overlay"
            role="presentation"
            onClick={() => setActiveCertification(null)}
          >
            <article
              className="cert-modal"
              role="dialog"
              aria-modal="true"
              aria-label={activeCertification.title}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="cert-modal-close"
                onClick={() => setActiveCertification(null)}
                aria-label="Close certification detail"
              >
                <FiX />
              </button>

              <img src={activeCertification.image} alt={activeCertification.title} />
              <h3>{activeCertification.title}</h3>
              <p>
                {activeCertification.issuer} · {activeCertification.year}
              </p>

              {activeCertification.credentialUrl && (
                <a
                  href={activeCertification.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cert-link-btn"
                >
                  Open Credential <FiExternalLink />
                </a>
              )}
            </article>
          </div>
        )}

        {contactMessageSuccess && (
          <div className="site-toast" role="status" aria-live="polite">
            <FiCheck />
            <span>{contactMessageSuccess}</span>
          </div>
        )}

        <footer className="site-footer">
          <h3>"Keep Moving Forward!"</h3>
          <p className="footer-quote-source"><em>- Disney: Meet the Robinsons</em></p>
          <p className="footer-copyright">© 2025 Samuel Ezra Sirait. All Rights Reserved.</p>
          <div className="footer-socials">
            {footerSocialLinks.map((item) => {
              const FooterIcon = item.Icon;
              return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.name}
                title={item.name}
              >
                <FooterIcon />
              </a>
            );
            })}
          </div>
        </footer>
      </main>
    </div>
  );
}
