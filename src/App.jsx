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
  FiFilm,
  FiImage,
  FiScissors,
  FiTerminal,
  FiX,
} from "react-icons/fi";
import { FaJava } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PiPlanetBold } from "react-icons/pi";
import {
  SiCanva,
  SiDart,
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
  SiVuedotjs,
} from "react-icons/si";
import Antigravity from "./components/Antigravity";
import { fetchPublicWebsiteData } from "./lib/siteApi";
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
  HTML: { Icon: SiHtml5, url: "https://developer.mozilla.org/en-US/docs/Web/HTML", color: "#e34f26" },
  CSS: { Icon: FaCss3Alt, url: "https://developer.mozilla.org/en-US/docs/Web/CSS", color: "#1572b6" },
  JavaScript: { Icon: SiJavascript, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", color: "#f7df1e" },
  Python: { Icon: SiPython, url: "https://www.python.org/", color: "#3776ab" },
  TensorFlow: { Icon: FiCpu, url: "https://www.tensorflow.org/", color: "#ff6f00" },
  Flask: { Icon: FiCode, url: "https://flask.palletsprojects.com/", color: "#ffffff" },
  Laravel: { Icon: SiLaravel, url: "https://laravel.com/", color: "#ff2d20" },
  PHP: { Icon: SiPhp, url: "https://www.php.net/", color: "#777bb4" },
  MySQL: { Icon: SiMysql, url: "https://www.mysql.com/", color: "#4479a1" },
  Bootstrap: { Icon: FiLayers, url: "https://getbootstrap.com/", color: "#7952b3" },
  Java: { Icon: FaJava, url: "https://www.java.com/", color: "#f89820" },
  "Android Studio": {
    Icon: FiMonitor,
    url: "https://developer.android.com/studio",
    color: "#3ddc84",
  },
  NewsAPI: { Icon: FiRss, url: "https://newsapi.org/", color: "#ff6f61" },
  XML: { Icon: FiFileText, url: "https://www.w3.org/XML/", color: "#00bcd4" },
  NetBeans: { Icon: FiTerminal, url: "https://netbeans.apache.org/", color: "#1b6ac6" },
  OOP: {
    Icon: FiBox,
    url: "https://en.wikipedia.org/wiki/Object-oriented_programming",
    color: "#ff7f50",
  },
};

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
      { Icon: FiPenTool, name: "Illustrator", color: "#ff9a00" },
      { Icon: FiImage, name: "Photoshop", color: "#31a8ff" },
      { Icon: FiMonitor, name: "Adobe XD", color: "#ff61f6" },
      { Icon: FiFilm, name: "After Effects", color: "#9999ff" },
      { Icon: FiFilm, name: "Premiere Pro", color: "#ea77ff" },
      { Icon: FiScissors, name: "CapCut", color: "#ffffff" },
      { Icon: SiCanva, name: "Canva", color: "#00c4cc" },
    ],
  },
];

const footerCreattieIcons = [
  {
    name: "Discord",
    href: "https://discord.com",
    previewUrl: "https://ik.imagekit.io/creattie/main/tr:q-80,f-auto/processed/thumb/b99TBpR5ENAx4K4z6j.mp4#t=0.001",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/samuelezra34/",
    previewUrl: "https://ik.imagekit.io/creattie/main/tr:q-80,f-auto/processed/thumb/64f9DTp5f54Bs4T2n1.mp4#t=0.001",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/samuel-ezra-sirait/",
    previewUrl: "https://ik.imagekit.io/creattie/main/tr:q-80,f-auto/processed/thumb/ujceQ6Op20bYPr4S2E.mp4#t=0.001",
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Website");
  const [activeProject, setActiveProject] = useState(null);
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
  const [certificationPage, setCertificationPage] = useState(0);
  const [activeCertification, setActiveCertification] = useState(null);
  const [aboutPhotoIndex, setAboutPhotoIndex] = useState(0);
  const [isAboutActive, setIsAboutActive] = useState(false);
  const [encryptedHeroText, setEncryptedHeroText] = useState(HOME_TRANSLATIONS[0]);
  const encryptedIndexRef = useRef(0);
  const scrambleFrameRef = useRef(0);
  const homeSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const scrollSnapLockedRef = useRef(false);
  const snapTimeoutRef = useRef(0);
  const snapSettleTimeoutRef = useRef(0);
  const touchStartYRef = useRef(null);
  const aboutTouchStartXRef = useRef(null);
  const footerVideoRefs = useRef(new Map());

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
    const videos = Array.from(footerVideoRefs.current.values());
    videos.forEach((video) => {
      video.preload = "auto";
      video.load();
    });

    return () => {
      footerVideoRefs.current.clear();
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
      setAboutPhotoIndex((previous) => (previous + 1) % aboutPhotos.length);
    }, 4500);

    return () => {
      window.clearInterval(rotation);
    };
  }, [aboutPhotos.length]);

  const showPreviousAboutPhoto = () => {
    setAboutPhotoIndex((previous) =>
      previous === 0 ? aboutPhotos.length - 1 : previous - 1
    );
  };

  const showNextAboutPhoto = () => {
    setAboutPhotoIndex((previous) => (previous + 1) % aboutPhotos.length);
  };

  const handleAboutTouchStart = (event) => {
    aboutTouchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleAboutTouchEnd = (event) => {
    if (aboutTouchStartXRef.current === null || aboutPhotos.length <= 1) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? aboutTouchStartXRef.current;
    const deltaX = aboutTouchStartXRef.current - endX;
    aboutTouchStartXRef.current = null;

    if (Math.abs(deltaX) < 28) {
      return;
    }

    if (deltaX > 0) {
      showNextAboutPhoto();
      return;
    }

    showPreviousAboutPhoto();
  };

  const handleExploreClick = (event) => {
    event.preventDefault();
    smoothSnapToSection(aboutSectionRef.current);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveProject(null);
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

  const pauseOtherFooterVideos = (activeName) => {
    footerVideoRefs.current.forEach((video, name) => {
      if (!video || name === activeName) {
        return;
      }

      video.pause();
      video.currentTime = 0;
    });
  };

  const handleFooterIconEnter = (event, iconName) => {
    const video = event.currentTarget.querySelector("video");
    if (!video) {
      return;
    }

    pauseOtherFooterVideos(iconName);
    video.preload = "auto";
    video.loop = true;
    video.play().catch(() => {});
  };

  const handleFooterIconLeave = (event) => {
    const video = event.currentTarget.querySelector("video");
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  };

  const registerFooterVideoRef = (name, node) => {
    if (!node) {
      footerVideoRefs.current.delete(name);
      return;
    }

    footerVideoRefs.current.set(name, node);
  };

  const resolveContactIcon = (platform = "") => {
    const normalized = platform.toLowerCase();
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

    return FiExternalLink;
  };

  return (
    <div className={`app-shell ${isAboutActive ? "about-active" : ""}`}>
      <div className="space-layer stars-near" />
      <div className="space-layer stars-mid" />
      <div className="space-layer stars-far" />

      <header className={`topbar ${isAboutActive ? "topbar-visible" : "topbar-hidden"}`}>
        <p className="brand">
          <PiPlanetBold /> Samuel Ezra
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

            <div
              className="about-photo-stack"
              onTouchStart={handleAboutTouchStart}
              onTouchEnd={handleAboutTouchEnd}
            >
              <div className="about-photo-stage">
                {aboutPhotos.slice(0, 3).map((_, layerIndex) => {
                  const photo = aboutPhotos[(aboutPhotoIndex + layerIndex) % aboutPhotos.length];
                  return (
                    <figure
                      key={`${photo.id}-${layerIndex}`}
                      className={`about-photo-layer layer-${layerIndex}`}
                    >
                      <img src={photo.image} alt={`About visual ${layerIndex + 1}`} />
                    </figure>
                  );
                })}
              </div>

              {aboutPhotos.length > 1 && (
                <div className="about-photo-controls">
                  <button type="button" onClick={showPreviousAboutPhoto} aria-label="Previous photo">
                    <FiArrowLeft />
                  </button>
                  <button type="button" onClick={showNextAboutPhoto} aria-label="Next photo">
                    <FiArrowRight />
                  </button>
                </div>
              )}
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
              <div className="portfolio-row" role="list">
                {currentProjects.map((project) => (
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
                ))}
              </div>
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
                      const meta = TECH_STACK_META[item] || {
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
            <div className="contact-grid">
              {dynamicContacts.map((contact) => {
                const ContactIcon = resolveContactIcon(contact.platform);
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

        <footer className="site-footer">
          <h3>"Keep Moving Forward!"</h3>
          <p>- Disney: Meet the Robinsons</p>
          <p>Copyright 2025 by Samuel Ezra</p>
          <div className="footer-socials">
            {footerCreattieIcons.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.name}
                title={item.name}
                onMouseEnter={(event) => handleFooterIconEnter(event, item.name)}
                onMouseLeave={handleFooterIconLeave}
                onFocus={(event) => handleFooterIconEnter(event, item.name)}
                onBlur={handleFooterIconLeave}
              >
                <video
                  ref={(node) => registerFooterVideoRef(item.name, node)}
                  className="footer-lottie"
                  src={item.previewUrl}
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
