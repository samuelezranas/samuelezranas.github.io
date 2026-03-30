import { useEffect, useId, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiCheck,
  FiChevronLeft,
  FiCpu,
  FiEdit2,
  FiExternalLink,
  FiImage,
  FiLogOut,
  FiMaximize2,
  FiPlusCircle,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { FaCss3Alt } from "react-icons/fa6";
import {
  SiAndroid,
  SiCanva,
  SiDart,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLaravel,
  SiMariadb,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiReact,
  SiTensorflow,
  SiVuedotjs,
} from "react-icons/si";
import {
  createAboutPhoto,
  createCategory,
  createCertification,
  createContact,
  createProject,
  deleteAboutPhoto,
  deleteCategory,
  deleteCertification,
  deleteContact,
  deleteProject,
  fetchAdminWebsiteData,
  updateAboutPhoto,
  updateCategory,
  updateCertification,
  updateContact,
  updateProject,
  uploadAsset,
  upsertAboutSettings,
} from "../lib/siteApi";
import { isSupabaseConfigured, supabaseConnectionInfo } from "../lib/supabaseClient";
import "./admin.css";

const TABS = ["Dashboard", "About", "Certification", "Portfolio", "Contact"];
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_AUTH_STORAGE_KEY = "portfolio-admin-auth";

const initialAboutForm = {
  title: "",
  lead: "",
  resumeUrl: "",
};

const initialCertificationForm = {
  title: "",
  issuer: "",
  year: "",
  credentialUrl: "",
  sortOrder: 0,
};

const initialCategoryForm = {
  name: "",
  externalUrl: "",
  sortOrder: 0,
};

const initialProjectForm = {
  categoryId: "",
  title: "",
  description: "",
  techStack: "",
  repositoryUrl: "",
  sortOrder: 0,
};

const initialContactForm = {
  platform: "",
  label: "",
  url: "",
  sortOrder: 0,
};

const CROP_PRESETS = {
  about: { label: "About Photo", width: 4, height: 5, outputWidth: 1000 },
  certification: { label: "Certification", width: 16, height: 9, outputWidth: 1600 },
  project: { label: "Project", width: 16, height: 9, outputWidth: 1600 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getCropPreviewLayout(cropState) {
  const sourceWidth = Number(cropState.sourceWidth || 0);
  const sourceHeight = Number(cropState.sourceHeight || 0);
  const zoom = Number(cropState.zoom || 1);

  if (!sourceWidth || !sourceHeight) {
    return {
      widthPercent: 100,
      heightPercent: 100,
      leftPercent: 0,
      topPercent: 0,
      canPanX: false,
      canPanY: false,
      displayOffsetX: 0,
      displayOffsetY: 0,
    };
  }

  const targetRatio = cropState.preset.width / cropState.preset.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const baseWidth = sourceRatio > targetRatio ? sourceRatio / targetRatio : 1;
  const baseHeight = sourceRatio > targetRatio ? 1 : targetRatio / sourceRatio;

  const scaledWidth = baseWidth * zoom;
  const scaledHeight = baseHeight * zoom;

  const overflowX = Math.max(0, (scaledWidth - 1) / 2);
  const overflowY = Math.max(0, (scaledHeight - 1) / 2);

  const rawOffsetX = clamp(Number(cropState.offsetX || 0), -1, 1);
  const rawOffsetY = clamp(Number(cropState.offsetY || 0), -1, 1);
  const displayOffsetX = overflowX > 0 ? rawOffsetX : 0;
  const displayOffsetY = overflowY > 0 ? rawOffsetY : 0;

  return {
    widthPercent: scaledWidth * 100,
    heightPercent: scaledHeight * 100,
    leftPercent: ((1 - scaledWidth) / 2 + displayOffsetX * overflowX) * 100,
    topPercent: ((1 - scaledHeight) / 2 + displayOffsetY * overflowY) * 100,
    canPanX: overflowX > 0.0001,
    canPanY: overflowY > 0.0001,
    displayOffsetX,
    displayOffsetY,
  };
}

const ADMIN_TECH_ICON_MAP = {
  html: SiHtml5,
  css: FaCss3Alt,
  javascript: SiJavascript,
  react: SiReact,
  vue: SiVuedotjs,
  nodejs: SiNodedotjs,
  php: SiPhp,
  laravel: SiLaravel,
  python: SiPython,
  kotlin: SiKotlin,
  dart: SiDart,
  flutter: SiFlutter,
  tensorflow: SiTensorflow,
  firebase: SiFirebase,
  mysql: SiMysql,
  mariadb: SiMariadb,
  mongodb: SiMongodb,
  android: SiAndroid,
  androidstudio: SiAndroid,
  figma: SiFigma,
  canva: SiCanva,
  flask: SiFlask,
};

const normalizeTechKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

function TechStackBadges({ value }) {
  const techItems = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!techItems.length) {
    return <span className="admin-tech-empty">-</span>;
  }

  return (
    <div className="admin-tech-list" aria-label="Tech stack icons">
      {techItems.map((tech, index) => {
        const Icon = ADMIN_TECH_ICON_MAP[normalizeTechKey(tech)] || FiCpu;
        return (
          <span className="admin-tech-chip" key={`${tech}-${index}`}>
            <Icon size={14} />
            <span>{tech}</span>
          </span>
        );
      })}
    </div>
  );
}

function ActiveToggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      className={`admin-toggle-btn ${checked ? "is-on" : "is-off"}`}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      aria-pressed={checked}
      title={checked ? "Status aktif" : "Status nonaktif"}
    >
      <span className="admin-toggle-thumb" />
      <span className="admin-toggle-label">{checked ? "On" : "Off"}</span>
    </button>
  );
}

function IconButton({ icon: Icon, label, variant = "default", ...props }) {
  return (
    <button type="button" className={`admin-icon-btn ${variant}`} {...props}>
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );
}

function FileInput({ file, onFileChange, accept = "*/*" }) {
  const inputId = useId();
  const handleChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    onFileChange(nextFile);
    // Reset native input so selecting the same file again still triggers onChange.
    event.target.value = "";
  };

  return (
    <div className="admin-file-input">
      <input
        id={inputId}
        className="admin-file-native"
        type="file"
        accept={accept}
        onChange={handleChange}
      />
      <label htmlFor={inputId} className="admin-file-trigger" title="Pilih file">
        <FiUpload size={15} />
      </label>
      <span className="admin-file-name">{file?.name || "Belum ada file dipilih"}</span>
    </div>
  );
}

function formatAdminError(error) {
  const fallbackMessage = "Terjadi kesalahan saat menghubungkan Admin ke database.";
  const rawMessage = error?.message || fallbackMessage;
  const normalizedMessage = String(rawMessage).toLowerCase();

  if (normalizedMessage.includes("failed to fetch")) {
    const hostLabel = supabaseConnectionInfo.url || "(kosong)";
    return `Tidak bisa terhubung ke Supabase (${hostLabel}). Cek VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, lalu pastikan URL project benar dari Supabase Dashboard > Settings > API.`;
  }

  if (
    normalizedMessage.includes("schema cache") ||
    normalizedMessage.includes("relation") ||
    normalizedMessage.includes("does not exist") ||
    normalizedMessage.includes("could not find the table")
  ) {
    return "Tabel CMS belum ada di project Supabase ini. Jalankan SQL dari file supabase/schema.sql di Supabase Dashboard > SQL Editor, lalu klik Refresh Data.";
  }

  return rawMessage;
}

function mapDetailDraft(type, item) {
  if (!item) {
    return null;
  }

  if (type === "about-photo") {
    return {
      image_url: item.image_url || "",
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    };
  }

  if (type === "certification") {
    return {
      title: item.title || "",
      issuer: item.issuer || "",
      year: item.year || "",
      credential_url: item.credential_url || "",
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    };
  }

  if (type === "category") {
    return {
      name: item.name || "",
      external_url: item.external_url || "",
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    };
  }

  if (type === "project") {
    return {
      category_id: item.category_id || "",
      title: item.title || "",
      description: item.description || "",
      tech_stack: item.tech_stack || "",
      repository_url: item.repository_url || "",
      image_url: item.image_url || "",
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    };
  }

  return {
    platform: item.platform || "",
    label: item.label || "",
    url: item.url || "",
    sort_order: item.sort_order || 0,
    is_active: Boolean(item.is_active),
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [aboutForm, setAboutForm] = useState(initialAboutForm);
  const [aboutPhotos, setAboutPhotos] = useState([]);
  const [aboutUploadFile, setAboutUploadFile] = useState(null);
  const [aboutUploadOrder, setAboutUploadOrder] = useState(0);

  const [certificationForm, setCertificationForm] = useState(initialCertificationForm);
  const [certImageFile, setCertImageFile] = useState(null);
  const [certifications, setCertifications] = useState([]);

  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [categories, setCategories] = useState([]);

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projects, setProjects] = useState([]);

  const [contactForm, setContactForm] = useState(initialContactForm);
  const [contacts, setContacts] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  const [detailState, setDetailState] = useState({ type: null, id: null, isEditing: false });
  const [detailDraft, setDetailDraft] = useState(null);
  const [detailImageFile, setDetailImageFile] = useState(null);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState("");
  const [cropState, setCropState] = useState({
    isOpen: false,
    sourceUrl: "",
    sourceFile: null,
    sourceWidth: 0,
    sourceHeight: 0,
    target: "",
    preset: CROP_PRESETS.project,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const loadImageElement = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Gagal memuat gambar untuk crop."));
      image.src = src;
    });

  const openCropper = (target, file, preset) => {
    if (!file) {
      return;
    }

    const sourceUrl = URL.createObjectURL(file);
    setCropState((prev) => {
      if (prev.sourceUrl) {
        URL.revokeObjectURL(prev.sourceUrl);
      }

      return {
        isOpen: true,
        sourceUrl,
        sourceFile: file,
        sourceWidth: 0,
        sourceHeight: 0,
        target,
        preset,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      };
    });
  };

  const closeCropper = () => {
    setCropState((prev) => {
      if (prev.sourceUrl) {
        URL.revokeObjectURL(prev.sourceUrl);
      }

      return {
        isOpen: false,
        sourceUrl: "",
        sourceFile: null,
        sourceWidth: 0,
        sourceHeight: 0,
        target: "",
        preset: CROP_PRESETS.project,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      };
    });
  };

  const applyCrop = async () => {
    if (!cropState.sourceUrl || !cropState.sourceFile) {
      return;
    }

    try {
      const image = await loadImageElement(cropState.sourceUrl);
      const ratio = cropState.preset.width / cropState.preset.height;
      const canvas = document.createElement("canvas");
      canvas.width = cropState.preset.outputWidth;
      canvas.height = Math.round(cropState.preset.outputWidth / ratio);

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Gagal menyiapkan editor crop.");
      }

      const baseScale = Math.max(canvas.width / image.width, canvas.height / image.height);
      const scale = baseScale * cropState.zoom;
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;

      const maxOffsetX = Math.max(0, (drawWidth - canvas.width) / 2);
      const maxOffsetY = Math.max(0, (drawHeight - canvas.height) / 2);

      const shiftX = cropState.offsetX * maxOffsetX;
      const shiftY = cropState.offsetY * maxOffsetY;

      const drawX = (canvas.width - drawWidth) / 2 + shiftX;
      const drawY = (canvas.height - drawHeight) / 2 + shiftY;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      const blob = await new Promise((resolve) => {
        canvas.toBlob((nextBlob) => resolve(nextBlob), "image/jpeg", 0.92);
      });

      if (!blob) {
        throw new Error("Gagal membuat hasil crop.");
      }

      const extension = cropState.sourceFile.name.includes(".")
        ? cropState.sourceFile.name.split(".").pop()
        : "jpg";
      const croppedFile = new File([blob], `${Date.now()}-cropped.${extension}`, {
        type: blob.type || "image/jpeg",
      });

      if (cropState.target === "about-upload") {
        setAboutUploadFile(croppedFile);
      }
      if (cropState.target === "cert-create") {
        setCertImageFile(croppedFile);
      }
      if (cropState.target === "project-create") {
        setProjectImageFile(croppedFile);
      }
      if (cropState.target === "detail-about" || cropState.target === "detail-cert" || cropState.target === "detail-project") {
        setDetailImageFile(croppedFile);
      }

      closeCropper();
      setSuccessMessage(`Crop ${cropState.preset.label} berhasil diterapkan.`);
      window.setTimeout(() => setSuccessMessage(""), 2200);
    } catch (error) {
      setErrorMessage(error?.message || "Terjadi kesalahan saat crop gambar.");
    }
  };

  const cropPreviewLayout = useMemo(() => getCropPreviewLayout(cropState), [cropState]);

  const loadData = async () => {
    if (!isSupabaseConfigured) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchAdminWebsiteData();
      setAboutForm({
        title: data.aboutSettings?.title || "",
        lead: data.aboutSettings?.lead || "",
        resumeUrl: data.aboutSettings?.resume_url || "",
      });
      setAboutPhotos(data.aboutPhotos);
      setCertifications(data.certifications);
      setCategories(data.categories);
      setProjects(data.projects);
      setContacts(data.contacts);
      setContactMessages(data.contactMessages || []);
      setProjectForm((prev) => ({
        ...prev,
        categoryId: data.categories[0]?.id || prev.categoryId,
      }));
    } catch (error) {
      setErrorMessage(formatAdminError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadData();
  }, [isAuthenticated]);

  const dashboardMetrics = useMemo(
    () => [
      { label: "About Photos", value: aboutPhotos.length },
      { label: "Certifications", value: certifications.length },
      { label: "Portfolio Projects", value: projects.length },
      { label: "Messages", value: contactMessages.length },
    ],
    [aboutPhotos.length, certifications.length, contactMessages.length, projects.length]
  );

  const currentDetailItem = useMemo(() => {
    if (!detailState.type || !detailState.id) {
      return null;
    }

    if (detailState.type === "about-photo") {
      return aboutPhotos.find((item) => item.id === detailState.id) || null;
    }
    if (detailState.type === "certification") {
      return certifications.find((item) => item.id === detailState.id) || null;
    }
    if (detailState.type === "category") {
      return categories.find((item) => item.id === detailState.id) || null;
    }
    if (detailState.type === "project") {
      return projects.find((item) => item.id === detailState.id) || null;
    }

    return contacts.find((item) => item.id === detailState.id) || null;
  }, [aboutPhotos, certifications, categories, contacts, detailState.id, detailState.type, projects]);

  useEffect(() => {
    if (!currentDetailItem) {
      setDetailState({ type: null, id: null, isEditing: false });
      setDetailDraft(null);
      setDetailImageFile(null);
      return;
    }

    if (!detailState.isEditing) {
      setDetailDraft(mapDetailDraft(detailState.type, currentDetailItem));
    }
  }, [currentDetailItem, detailState.isEditing, detailState.type]);

  const notifySuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2600);
  };

  const runAction = async (action, successText) => {
    setErrorMessage("");
    try {
      await action();
      await loadData();
      notifySuccess(successText);
    } catch (error) {
      setErrorMessage(formatAdminError(error));
    }
  };

  const moveOrder = async (items, id, direction, updateFn, label) => {
    const currentIndex = items.findIndex((item) => item.id === id);
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const currentItem = items[currentIndex];
    const targetItem = items[targetIndex];

    await runAction(async () => {
      await Promise.all([
        updateFn(currentItem.id, { sort_order: targetItem.sort_order }),
        updateFn(targetItem.id, { sort_order: currentItem.sort_order }),
      ]);
    }, `${label} berhasil dipindahkan.`);
  };

  const openDetail = (type, item) => {
    setDetailState({ type, id: item.id, isEditing: false });
    setDetailDraft(mapDetailDraft(type, item));
    setDetailImageFile(null);
  };

  const startEditDetail = () => {
    if (!detailState.type || !currentDetailItem) {
      return;
    }

    setDetailState((prev) => ({ ...prev, isEditing: true }));
    setDetailDraft(mapDetailDraft(detailState.type, currentDetailItem));
    setDetailImageFile(null);
  };

  const cancelEditDetail = () => {
    setDetailState((prev) => ({ ...prev, isEditing: false }));
    setDetailDraft(mapDetailDraft(detailState.type, currentDetailItem));
    setDetailImageFile(null);
  };

  const closeDetail = () => {
    setDetailState({ type: null, id: null, isEditing: false });
    setDetailDraft(null);
    setDetailImageFile(null);
  };

  const deleteCurrentDetail = async () => {
    if (!detailState.type || !detailState.id) {
      return;
    }

    if (detailState.type === "about-photo") {
      await runAction(async () => {
        await deleteAboutPhoto(detailState.id);
      }, "Foto dihapus.");
      closeDetail();
      return;
    }

    if (detailState.type === "certification") {
      await runAction(async () => {
        await deleteCertification(detailState.id);
      }, "Sertifikat dihapus.");
      closeDetail();
      return;
    }

    if (detailState.type === "category") {
      await runAction(async () => {
        await deleteCategory(detailState.id);
      }, "Category dihapus.");
      closeDetail();
      return;
    }

    if (detailState.type === "project") {
      await runAction(async () => {
        await deleteProject(detailState.id);
      }, "Project dihapus.");
      closeDetail();
      return;
    }

    await runAction(async () => {
      await deleteContact(detailState.id);
    }, "Contact dihapus.");
    closeDetail();
  };

  const saveCurrentDetail = async () => {
    if (!detailState.type || !detailState.id || !detailDraft) {
      return;
    }

    if (detailState.type === "about-photo") {
      await runAction(async () => {
        let imageUrl = detailDraft.image_url;
        if (detailImageFile) {
          imageUrl = await uploadAsset(detailImageFile, "about-photos");
        }
        await updateAboutPhoto(detailState.id, {
          image_url: imageUrl,
          sort_order: Number(detailDraft.sort_order || 0),
          is_active: detailDraft.is_active,
        });
      }, "Foto berhasil diperbarui.");
      setDetailState((prev) => ({ ...prev, isEditing: false }));
      return;
    }

    if (detailState.type === "certification") {
      await runAction(async () => {
        const payload = {
          title: detailDraft.title,
          issuer: detailDraft.issuer,
          year: detailDraft.year,
          credential_url: detailDraft.credential_url,
          sort_order: Number(detailDraft.sort_order || 0),
          is_active: detailDraft.is_active,
        };

        if (detailImageFile) {
          payload.image_url = await uploadAsset(detailImageFile, "certifications");
        }

        await updateCertification(detailState.id, payload);
      }, "Sertifikat berhasil diperbarui.");
      setDetailState((prev) => ({ ...prev, isEditing: false }));
      return;
    }

    if (detailState.type === "category") {
      await runAction(async () => {
        await updateCategory(detailState.id, {
          name: detailDraft.name,
          external_url: detailDraft.external_url || null,
          sort_order: Number(detailDraft.sort_order || 0),
          is_active: detailDraft.is_active,
        });
      }, "Category berhasil diperbarui.");
      setDetailState((prev) => ({ ...prev, isEditing: false }));
      return;
    }

    if (detailState.type === "project") {
      await runAction(async () => {
        const payload = {
          category_id: detailDraft.category_id,
          title: detailDraft.title,
          description: detailDraft.description,
          tech_stack: detailDraft.tech_stack,
          repository_url: detailDraft.repository_url,
          sort_order: Number(detailDraft.sort_order || 0),
          is_active: detailDraft.is_active,
        };

        if (detailImageFile) {
          payload.image_url = await uploadAsset(detailImageFile, "portfolio-projects");
        }

        await updateProject(detailState.id, payload);
      }, "Project berhasil diperbarui.");
      setDetailState((prev) => ({ ...prev, isEditing: false }));
      return;
    }

    await runAction(async () => {
      await updateContact(detailState.id, {
        platform: detailDraft.platform,
        label: detailDraft.label,
        url: detailDraft.url,
        sort_order: Number(detailDraft.sort_order || 0),
        is_active: detailDraft.is_active,
      });
    }, "Contact berhasil diperbarui.");
    setDetailState((prev) => ({ ...prev, isEditing: false }));
  };

  const onSaveAbout = async (event) => {
    event.preventDefault();
    await runAction(() => upsertAboutSettings(aboutForm), "Pengaturan About berhasil disimpan.");
  };

  const onUploadAboutPhoto = async (event) => {
    event.preventDefault();
    if (!aboutUploadFile) {
      setErrorMessage("Pilih file foto terlebih dahulu.");
      return;
    }

    await runAction(async () => {
      const imageUrl = await uploadAsset(aboutUploadFile, "about-photos");
      await createAboutPhoto({
        image_url: imageUrl,
        sort_order: Number(aboutUploadOrder || 0),
        is_active: true,
      });
      setAboutUploadFile(null);
      setAboutUploadOrder(0);
    }, "Foto About berhasil diunggah.");
  };

  const onCreateCertification = async (event) => {
    event.preventDefault();
    if (!certImageFile) {
      setErrorMessage("Gambar sertifikat wajib diunggah.");
      return;
    }

    await runAction(async () => {
      const imageUrl = await uploadAsset(certImageFile, "certifications");
      await createCertification({
        title: certificationForm.title,
        issuer: certificationForm.issuer,
        year: certificationForm.year,
        image_url: imageUrl,
        credential_url: certificationForm.credentialUrl,
        sort_order: Number(certificationForm.sortOrder || 0),
        is_active: true,
      });
      setCertificationForm(initialCertificationForm);
      setCertImageFile(null);
    }, "Sertifikat berhasil ditambahkan.");
  };

  const onCreateCategory = async (event) => {
    event.preventDefault();
    await runAction(async () => {
      await createCategory({
        name: categoryForm.name,
        external_url: categoryForm.externalUrl || null,
        sort_order: Number(categoryForm.sortOrder || 0),
        is_active: true,
      });
      setCategoryForm(initialCategoryForm);
    }, "Category berhasil ditambahkan.");
  };

  const onCreateProject = async (event) => {
    event.preventDefault();
    if (!projectForm.categoryId) {
      setErrorMessage("Pilih category project terlebih dahulu.");
      return;
    }

    if (!projectImageFile) {
      setErrorMessage("Gambar project wajib diunggah.");
      return;
    }

    await runAction(async () => {
      const imageUrl = await uploadAsset(projectImageFile, "portfolio-projects");
      await createProject({
        category_id: projectForm.categoryId,
        title: projectForm.title,
        description: projectForm.description,
        image_url: imageUrl,
        tech_stack: projectForm.techStack,
        repository_url: projectForm.repositoryUrl,
        sort_order: Number(projectForm.sortOrder || 0),
        is_active: true,
      });
      setProjectForm((prev) => ({ ...initialProjectForm, categoryId: prev.categoryId }));
      setProjectImageFile(null);
    }, "Project berhasil ditambahkan.");
  };

  const onCreateContact = async (event) => {
    event.preventDefault();
    await runAction(async () => {
      await createContact({
        platform: contactForm.platform,
        label: contactForm.label,
        url: contactForm.url,
        sort_order: Number(contactForm.sortOrder || 0),
        is_active: true,
      });
      setContactForm(initialContactForm);
    }, "Contact link berhasil ditambahkan.");
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const isValidCredential =
      loginUsername.trim() === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD;

    if (!isValidCredential) {
      setLoginError("Username atau password salah.");
      return;
    }

    window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
    setLoginError("");
    setLoginUsername("");
    setLoginPassword("");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setActiveTab("Dashboard");
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-shell">
        <div className="admin-login-wrap">
          <h1>Admin Login</h1>
          <p>Masuk untuk mengakses dashboard website.</p>
          <form className="admin-form" onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {loginError && <div className="admin-alert">{loginError}</div>}
          <a className="admin-back-link" href="/">
            Kembali ke Website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-wrap">
        <header className="admin-topbar">
          <h1>Website Admin Panel</h1>
          <div className="admin-topbar-actions">
            <IconButton
              icon={FiRefreshCw}
              label="Refresh"
              onClick={loadData}
              disabled={loading || !isSupabaseConfigured}
            />
            <a href="/" className="admin-link-btn">
              <FiExternalLink size={14} />
              <span>Kembali ke Website</span>
            </a>
            <IconButton icon={FiLogOut} label="Logout" onClick={handleLogout} />
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="admin-alert">
            Supabase belum terhubung. Isi env VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
          </div>
        )}

        {errorMessage && <div className="admin-alert">{errorMessage}</div>}

        {detailState.type && currentDetailItem && (
          <section className="admin-detail-page">
            <div className="admin-detail-head">
              <button type="button" className="admin-back-detail-btn" onClick={closeDetail}>
                <FiChevronLeft size={15} />
                <span>Kembali ke List</span>
              </button>
              <div className="admin-detail-actions">
                {detailState.isEditing ? (
                  <>
                    <IconButton
                      icon={FiSave}
                      label="Simpan"
                      variant="success"
                      onClick={saveCurrentDetail}
                      disabled={loading || !isSupabaseConfigured}
                    />
                    <IconButton
                      icon={FiX}
                      label="Batal"
                      variant="ghost"
                      onClick={cancelEditDetail}
                    />
                  </>
                ) : (
                  <>
                    <IconButton
                      icon={FiEdit2}
                      label="Edit"
                      onClick={startEditDetail}
                      disabled={loading || !isSupabaseConfigured}
                    />
                    <IconButton
                      icon={FiTrash2}
                      label="Delete"
                      variant="danger"
                      onClick={deleteCurrentDetail}
                      disabled={loading || !isSupabaseConfigured}
                    />
                  </>
                )}
              </div>
            </div>

            <article className="admin-card admin-detail-card">
              <h3>Detail Data</h3>
              <div className="admin-item-grid">
                {detailState.type === "about-photo" && (
                  <>
                    <p>
                      <strong>URL Gambar:</strong> {currentDetailItem.image_url}
                    </p>
                    <p>
                      <strong>Order:</strong> {currentDetailItem.sort_order}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentDetailItem.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                )}

                {detailState.type === "certification" && (
                  <>
                    <p>
                      <strong>Judul:</strong> {currentDetailItem.title}
                    </p>
                    <p>
                      <strong>Issuer:</strong> {currentDetailItem.issuer}
                    </p>
                    <p>
                      <strong>Tahun:</strong> {currentDetailItem.year}
                    </p>
                    <p>
                      <strong>Credential:</strong> {currentDetailItem.credential_url || "-"}
                    </p>
                    <p>
                      <strong>Order:</strong> {currentDetailItem.sort_order}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentDetailItem.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                )}

                {detailState.type === "category" && (
                  <>
                    <p>
                      <strong>Nama:</strong> {currentDetailItem.name}
                    </p>
                    <p>
                      <strong>External URL:</strong> {currentDetailItem.external_url || "Internal category"}
                    </p>
                    <p>
                      <strong>Order:</strong> {currentDetailItem.sort_order}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentDetailItem.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                )}

                {detailState.type === "project" && (
                  <>
                    <p>
                      <strong>Judul:</strong> {currentDetailItem.title}
                    </p>
                    <p>
                      <strong>Kategori:</strong> {categories.find((item) => item.id === currentDetailItem.category_id)?.name || "-"}
                    </p>
                    <p>
                      <strong>Deskripsi:</strong> {currentDetailItem.description}
                    </p>
                    <p>
                      <strong>Tech Stack:</strong> {currentDetailItem.tech_stack}
                    </p>
                    <p>
                      <strong>Repository:</strong> {currentDetailItem.repository_url || "-"}
                    </p>
                    <p>
                      <strong>Order:</strong> {currentDetailItem.sort_order}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentDetailItem.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                )}

                {detailState.type === "contact" && (
                  <>
                    <p>
                      <strong>Platform:</strong> {currentDetailItem.platform}
                    </p>
                    <p>
                      <strong>Label:</strong> {currentDetailItem.label}
                    </p>
                    <p>
                      <strong>URL:</strong> {currentDetailItem.url}
                    </p>
                    <p>
                      <strong>Order:</strong> {currentDetailItem.sort_order}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentDetailItem.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                )}
              </div>

              {(currentDetailItem.image_url || detailDraft?.image_url) && (
                <div className="admin-detail-image-wrap">
                  <button
                    type="button"
                    className="admin-detail-image-btn"
                    onClick={() => setFullscreenImageUrl(currentDetailItem.image_url || detailDraft?.image_url || "")}
                    title="Lihat gambar full screen"
                  >
                    <img
                      src={currentDetailItem.image_url || detailDraft?.image_url}
                      alt="Preview"
                      className="admin-detail-image"
                    />
                    <span>
                      <FiMaximize2 size={13} /> Klik untuk fullscreen
                    </span>
                  </button>
                </div>
              )}

              {detailState.isEditing && detailDraft && (
                <div className="admin-edit-wrap">
                  {detailState.type === "about-photo" && (
                    <div className="admin-form">
                      <input
                        value={detailDraft.image_url}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, image_url: event.target.value }))
                        }
                        placeholder="Image URL"
                      />
                      <FileInput
                        file={detailImageFile}
                        accept="image/*"
                        onFileChange={(file) => openCropper("detail-about", file, CROP_PRESETS.about)}
                      />
                      <input
                        type="number"
                        value={detailDraft.sort_order}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, sort_order: event.target.value }))
                        }
                        placeholder="Sort Order"
                      />
                      <div className="admin-toggle-row">
                        <span>Status Aktif</span>
                        <ActiveToggle
                          checked={detailDraft.is_active}
                          onChange={(isActive) =>
                            setDetailDraft((prev) => ({ ...prev, is_active: isActive }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {detailState.type === "certification" && (
                    <div className="admin-form">
                      <input
                        value={detailDraft.title}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, title: event.target.value }))
                        }
                        placeholder="Judul"
                      />
                      <input
                        value={detailDraft.issuer}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, issuer: event.target.value }))
                        }
                        placeholder="Issuer"
                      />
                      <input
                        value={detailDraft.year}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, year: event.target.value }))
                        }
                        placeholder="Tahun"
                      />
                      <input
                        value={detailDraft.credential_url}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, credential_url: event.target.value }))
                        }
                        placeholder="Credential URL"
                      />
                      <input
                        type="number"
                        value={detailDraft.sort_order}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, sort_order: event.target.value }))
                        }
                        placeholder="Sort Order"
                      />
                      <FileInput
                        file={detailImageFile}
                        accept="image/*"
                        onFileChange={(file) => openCropper("detail-cert", file, CROP_PRESETS.certification)}
                      />
                      <div className="admin-toggle-row">
                        <span>Status Aktif</span>
                        <ActiveToggle
                          checked={detailDraft.is_active}
                          onChange={(isActive) =>
                            setDetailDraft((prev) => ({ ...prev, is_active: isActive }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {detailState.type === "category" && (
                    <div className="admin-form">
                      <input
                        value={detailDraft.name}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, name: event.target.value }))
                        }
                        placeholder="Nama"
                      />
                      <input
                        value={detailDraft.external_url}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, external_url: event.target.value }))
                        }
                        placeholder="External URL"
                      />
                      <input
                        type="number"
                        value={detailDraft.sort_order}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, sort_order: event.target.value }))
                        }
                        placeholder="Sort Order"
                      />
                      <div className="admin-toggle-row">
                        <span>Status Aktif</span>
                        <ActiveToggle
                          checked={detailDraft.is_active}
                          onChange={(isActive) =>
                            setDetailDraft((prev) => ({ ...prev, is_active: isActive }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {detailState.type === "project" && (
                    <div className="admin-form">
                      <select
                        value={detailDraft.category_id}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, category_id: event.target.value }))
                        }
                      >
                        <option value="">Pilih Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <input
                        value={detailDraft.title}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, title: event.target.value }))
                        }
                        placeholder="Judul"
                      />
                      <textarea
                        value={detailDraft.description}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, description: event.target.value }))
                        }
                        placeholder="Deskripsi"
                      />
                      <input
                        value={detailDraft.tech_stack}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, tech_stack: event.target.value }))
                        }
                        placeholder="Tech Stack"
                      />
                      <input
                        value={detailDraft.repository_url}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, repository_url: event.target.value }))
                        }
                        placeholder="Repository URL"
                      />
                      <input
                        value={detailDraft.image_url}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, image_url: event.target.value }))
                        }
                        placeholder="Image URL"
                      />
                      <input
                        type="number"
                        value={detailDraft.sort_order}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, sort_order: event.target.value }))
                        }
                        placeholder="Sort Order"
                      />
                      <FileInput
                        file={detailImageFile}
                        accept="image/*"
                        onFileChange={(file) => openCropper("detail-project", file, CROP_PRESETS.project)}
                      />
                      <div className="admin-toggle-row">
                        <span>Status Aktif</span>
                        <ActiveToggle
                          checked={detailDraft.is_active}
                          onChange={(isActive) =>
                            setDetailDraft((prev) => ({ ...prev, is_active: isActive }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {detailState.type === "contact" && (
                    <div className="admin-form">
                      <input
                        value={detailDraft.platform}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, platform: event.target.value }))
                        }
                        placeholder="Platform"
                      />
                      <input
                        value={detailDraft.label}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, label: event.target.value }))
                        }
                        placeholder="Label"
                      />
                      <input
                        value={detailDraft.url}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, url: event.target.value }))
                        }
                        placeholder="URL"
                      />
                      <input
                        type="number"
                        value={detailDraft.sort_order}
                        onChange={(event) =>
                          setDetailDraft((prev) => ({ ...prev, sort_order: event.target.value }))
                        }
                        placeholder="Sort Order"
                      />
                      <div className="admin-toggle-row">
                        <span>Status Aktif</span>
                        <ActiveToggle
                          checked={detailDraft.is_active}
                          onChange={(isActive) =>
                            setDetailDraft((prev) => ({ ...prev, is_active: isActive }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          </section>
        )}

        {!detailState.type && (
          <>
            <nav className="admin-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {activeTab === "Dashboard" && (
              <section className="admin-metric-grid">
                {dashboardMetrics.map((metric) => (
                  <article key={metric.label} className="admin-metric">
                    <h4>{metric.label}</h4>
                    <p>{metric.value}</p>
                  </article>
                ))}
              </section>
            )}

            {activeTab === "About" && (
              <section className="admin-grid">
                <article className="admin-card">
                  <h3>About Settings</h3>
                  <form className="admin-form" onSubmit={onSaveAbout}>
                    <input
                      value={aboutForm.title}
                      onChange={(event) => setAboutForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Title"
                    />
                    <textarea
                      value={aboutForm.lead}
                      onChange={(event) => setAboutForm((prev) => ({ ...prev, lead: event.target.value }))}
                      placeholder="Lead"
                    />
                    <input
                      value={aboutForm.resumeUrl}
                      onChange={(event) =>
                        setAboutForm((prev) => ({ ...prev, resumeUrl: event.target.value }))
                      }
                      placeholder="Resume URL"
                    />
                    <button type="submit" disabled={loading || !isSupabaseConfigured}>
                      <FiSave size={14} />
                      <span>Simpan About</span>
                    </button>
                  </form>
                </article>

                <article className="admin-card">
                  <h3>About Photos</h3>
                  <form className="admin-form" onSubmit={onUploadAboutPhoto}>
                    <FileInput
                      file={aboutUploadFile}
                      accept="image/*"
                      onFileChange={(file) => openCropper("about-upload", file, CROP_PRESETS.about)}
                    />
                    <input
                      type="number"
                      value={aboutUploadOrder}
                      onChange={(event) => setAboutUploadOrder(event.target.value)}
                      placeholder="Sort Order"
                    />
                    <button type="submit" disabled={loading || !isSupabaseConfigured}>
                      <FiPlusCircle size={14} />
                      <span>Upload Foto</span>
                    </button>
                  </form>

                  <div className="admin-list">
                    {aboutPhotos.map((photo, index) => (
                      <button
                        key={photo.id}
                        type="button"
                        className="admin-list-item clickable"
                        onClick={() => openDetail("about-photo", photo)}
                      >
                        <div className="admin-item-head">
                          <h4>
                            <FiImage size={14} />
                            <span>Photo</span>
                          </h4>
                          <span className={`admin-status-pill ${photo.is_active ? "on" : "off"}`}>
                            {photo.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p>Order: {photo.sort_order}</p>
                        <p>{photo.image_url}</p>
                        <div className="admin-inline-actions" onClick={(event) => event.stopPropagation()}>
                          <IconButton
                            icon={FiArrowUp}
                            label="Up"
                            variant="ghost"
                            disabled={index === 0 || loading}
                            onClick={() => moveOrder(aboutPhotos, photo.id, -1, updateAboutPhoto, "Foto")}
                          />
                          <IconButton
                            icon={FiArrowDown}
                            label="Down"
                            variant="ghost"
                            disabled={index === aboutPhotos.length - 1 || loading}
                            onClick={() => moveOrder(aboutPhotos, photo.id, 1, updateAboutPhoto, "Foto")}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </article>
              </section>
            )}

            {activeTab === "Certification" && (
              <section className="admin-grid">
                <article className="admin-card">
                  <h3>Tambah Sertifikat</h3>
                  <form className="admin-form" onSubmit={onCreateCertification}>
                    <input
                      value={certificationForm.title}
                      onChange={(event) =>
                        setCertificationForm((prev) => ({ ...prev, title: event.target.value }))
                      }
                      placeholder="Judul Sertifikat"
                    />
                    <input
                      value={certificationForm.issuer}
                      onChange={(event) =>
                        setCertificationForm((prev) => ({ ...prev, issuer: event.target.value }))
                      }
                      placeholder="Issuer"
                    />
                    <input
                      value={certificationForm.year}
                      onChange={(event) =>
                        setCertificationForm((prev) => ({ ...prev, year: event.target.value }))
                      }
                      placeholder="Tahun"
                    />
                    <input
                      value={certificationForm.credentialUrl}
                      onChange={(event) =>
                        setCertificationForm((prev) => ({ ...prev, credentialUrl: event.target.value }))
                      }
                      placeholder="Link Sertifikat"
                    />
                    <input
                      type="number"
                      value={certificationForm.sortOrder}
                      onChange={(event) =>
                        setCertificationForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                      }
                      placeholder="Sort Order"
                    />
                    <FileInput
                      file={certImageFile}
                      accept="image/*"
                      onFileChange={(file) => openCropper("cert-create", file, CROP_PRESETS.certification)}
                    />
                    <button type="submit" disabled={loading || !isSupabaseConfigured}>
                      <FiPlusCircle size={14} />
                      <span>Simpan Sertifikat</span>
                    </button>
                  </form>
                </article>

                <article className="admin-card">
                  <h3>List Sertifikat</h3>
                  <div className="admin-list">
                    {certifications.map((cert, index) => (
                      <button
                        key={cert.id}
                        type="button"
                        className="admin-list-item clickable"
                        onClick={() => openDetail("certification", cert)}
                      >
                        <div className="admin-item-head">
                          <h4>{cert.title}</h4>
                          <span className={`admin-status-pill ${cert.is_active ? "on" : "off"}`}>
                            {cert.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p>{cert.issuer} · {cert.year}</p>
                        <p>Order: {cert.sort_order}</p>
                        <div className="admin-inline-actions" onClick={(event) => event.stopPropagation()}>
                          <IconButton
                            icon={FiArrowUp}
                            label="Up"
                            variant="ghost"
                            disabled={index === 0 || loading}
                            onClick={() =>
                              moveOrder(certifications, cert.id, -1, updateCertification, "Sertifikat")
                            }
                          />
                          <IconButton
                            icon={FiArrowDown}
                            label="Down"
                            variant="ghost"
                            disabled={index === certifications.length - 1 || loading}
                            onClick={() =>
                              moveOrder(certifications, cert.id, 1, updateCertification, "Sertifikat")
                            }
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </article>
              </section>
            )}

            {activeTab === "Portfolio" && (
              <section className="admin-grid">
                <article className="admin-card">
                  <h3>Tambah Category</h3>
                  <form className="admin-form" onSubmit={onCreateCategory}>
                    <input
                      value={categoryForm.name}
                      onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Nama Category"
                    />
                    <input
                      value={categoryForm.externalUrl}
                      onChange={(event) =>
                        setCategoryForm((prev) => ({ ...prev, externalUrl: event.target.value }))
                      }
                      placeholder="External URL (opsional)"
                    />
                    <input
                      type="number"
                      value={categoryForm.sortOrder}
                      onChange={(event) =>
                        setCategoryForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                      }
                      placeholder="Sort Order"
                    />
                    <button type="submit" disabled={loading || !isSupabaseConfigured}>
                      <FiPlusCircle size={14} />
                      <span>Simpan Category</span>
                    </button>
                  </form>

                  <div className="admin-list">
                    {categories.map((category, index) => (
                      <button
                        key={category.id}
                        type="button"
                        className="admin-list-item clickable"
                        onClick={() => openDetail("category", category)}
                      >
                        <div className="admin-item-head">
                          <h4>{category.name}</h4>
                          <span className={`admin-status-pill ${category.is_active ? "on" : "off"}`}>
                            {category.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p>{category.external_url || "Internal category"}</p>
                        <p>Order: {category.sort_order}</p>
                        <div className="admin-inline-actions" onClick={(event) => event.stopPropagation()}>
                          <IconButton
                            icon={FiArrowUp}
                            label="Up"
                            variant="ghost"
                            disabled={index === 0 || loading}
                            onClick={() => moveOrder(categories, category.id, -1, updateCategory, "Category")}
                          />
                          <IconButton
                            icon={FiArrowDown}
                            label="Down"
                            variant="ghost"
                            disabled={index === categories.length - 1 || loading}
                            onClick={() => moveOrder(categories, category.id, 1, updateCategory, "Category")}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="admin-card">
                  <h3>Tambah Project</h3>
                  <form className="admin-form" onSubmit={onCreateProject}>
                    <select
                      value={projectForm.categoryId}
                      onChange={(event) =>
                        setProjectForm((prev) => ({ ...prev, categoryId: event.target.value }))
                      }
                    >
                      <option value="">Pilih Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={projectForm.title}
                      onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Judul Project"
                    />
                    <textarea
                      value={projectForm.description}
                      onChange={(event) =>
                        setProjectForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="Deskripsi Project"
                    />
                    <input
                      value={projectForm.techStack}
                      onChange={(event) =>
                        setProjectForm((prev) => ({ ...prev, techStack: event.target.value }))
                      }
                      placeholder="Tech Stack (pisahkan dengan koma)"
                    />
                    <input
                      value={projectForm.repositoryUrl}
                      onChange={(event) =>
                        setProjectForm((prev) => ({ ...prev, repositoryUrl: event.target.value }))
                      }
                      placeholder="Link Repository"
                    />
                    <input
                      type="number"
                      value={projectForm.sortOrder}
                      onChange={(event) =>
                        setProjectForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                      }
                      placeholder="Sort Order"
                    />
                    <FileInput
                      file={projectImageFile}
                      accept="image/*"
                      onFileChange={(file) => openCropper("project-create", file, CROP_PRESETS.project)}
                    />
                    <button type="submit" disabled={loading || !isSupabaseConfigured}>
                      <FiPlusCircle size={14} />
                      <span>Simpan Project</span>
                    </button>
                  </form>

                  <div className="admin-list">
                    {projects.map((project, index) => (
                      <button
                        key={project.id}
                        type="button"
                        className="admin-list-item clickable"
                        onClick={() => openDetail("project", project)}
                      >
                        <div className="admin-item-head">
                          <h4>{project.title}</h4>
                          <span className={`admin-status-pill ${project.is_active ? "on" : "off"}`}>
                            {project.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <TechStackBadges value={project.tech_stack} />
                        <p>Order: {project.sort_order}</p>
                        <div className="admin-inline-actions" onClick={(event) => event.stopPropagation()}>
                          <IconButton
                            icon={FiArrowUp}
                            label="Up"
                            variant="ghost"
                            disabled={index === 0 || loading}
                            onClick={() => moveOrder(projects, project.id, -1, updateProject, "Project")}
                          />
                          <IconButton
                            icon={FiArrowDown}
                            label="Down"
                            variant="ghost"
                            disabled={index === projects.length - 1 || loading}
                            onClick={() => moveOrder(projects, project.id, 1, updateProject, "Project")}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </article>
              </section>
            )}

            {activeTab === "Contact" && (
              <section className="admin-grid">
                <article className="admin-card">
                  <h3>Tambah Contact</h3>
                  <form className="admin-form" onSubmit={onCreateContact}>
                    <input
                      value={contactForm.platform}
                      onChange={(event) => setContactForm((prev) => ({ ...prev, platform: event.target.value }))}
                      placeholder="Platform"
                    />
                    <input
                      value={contactForm.label}
                      onChange={(event) => setContactForm((prev) => ({ ...prev, label: event.target.value }))}
                      placeholder="Label"
                    />
                    <input
                      value={contactForm.url}
                      onChange={(event) => setContactForm((prev) => ({ ...prev, url: event.target.value }))}
                      placeholder="URL"
                    />
                    <input
                      type="number"
                      value={contactForm.sortOrder}
                      onChange={(event) => setContactForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
                      placeholder="Sort Order"
                    />
                    <button type="submit" disabled={loading || !isSupabaseConfigured}>
                      <FiPlusCircle size={14} />
                      <span>Simpan Contact</span>
                    </button>
                  </form>

                  <h3 className="admin-subsection-title">List Contact</h3>
                  <div className="admin-list">
                    {contacts.map((contact, index) => (
                      <button
                        key={contact.id}
                        type="button"
                        className="admin-list-item clickable"
                        onClick={() => openDetail("contact", contact)}
                      >
                        <div className="admin-item-head">
                          <h4>{contact.platform}</h4>
                          <span className={`admin-status-pill ${contact.is_active ? "on" : "off"}`}>
                            {contact.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p>{contact.label}</p>
                        <p>{contact.url}</p>
                        <p>Order: {contact.sort_order}</p>
                        <div className="admin-inline-actions" onClick={(event) => event.stopPropagation()}>
                          <IconButton
                            icon={FiArrowUp}
                            label="Up"
                            variant="ghost"
                            disabled={index === 0 || loading}
                            onClick={() => moveOrder(contacts, contact.id, -1, updateContact, "Contact")}
                          />
                          <IconButton
                            icon={FiArrowDown}
                            label="Down"
                            variant="ghost"
                            disabled={index === contacts.length - 1 || loading}
                            onClick={() => moveOrder(contacts, contact.id, 1, updateContact, "Contact")}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="admin-card">
                  <h3>Messages</h3>
                  <div className="admin-list">
                    {contactMessages.length === 0 && (
                      <div className="admin-list-item">
                        <p>Belum ada pesan masuk.</p>
                      </div>
                    )}

                    {contactMessages.map((message) => (
                      <article key={message.id} className="admin-list-item admin-message-item">
                        <div className="admin-item-head">
                          <h4>{message.name}</h4>
                          <span className="admin-message-time">
                            {message.created_at ? new Date(message.created_at).toLocaleString("id-ID") : "-"}
                          </span>
                        </div>
                        <p>{message.email}</p>
                        <p>{message.message}</p>
                      </article>
                    ))}
                  </div>
                </article>
              </section>
            )}
          </>
        )}
      </div>

      {successMessage && (
        <div className="admin-toast" role="status" aria-live="polite">
          <FiCheck size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {cropState.isOpen && (
        <div className="admin-crop-overlay" role="presentation" onClick={closeCropper}>
          <div className="admin-crop-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>Crop Image - {cropState.preset.label}</h3>

            <div
              className="admin-crop-preview"
              style={{
                "--crop-ratio": `${cropState.preset.width} / ${cropState.preset.height}`,
              }}
            >
              <img
                src={cropState.sourceUrl}
                alt="Crop preview"
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight, src } = event.currentTarget;
                  if (!naturalWidth || !naturalHeight) {
                    return;
                  }

                  setCropState((prev) => {
                    if (!prev.isOpen || prev.sourceUrl !== src) {
                      return prev;
                    }

                    if (prev.sourceWidth === naturalWidth && prev.sourceHeight === naturalHeight) {
                      return prev;
                    }

                    return {
                      ...prev,
                      sourceWidth: naturalWidth,
                      sourceHeight: naturalHeight,
                    };
                  });
                }}
                style={{
                  width: `${cropPreviewLayout.widthPercent}%`,
                  height: `${cropPreviewLayout.heightPercent}%`,
                  left: `${cropPreviewLayout.leftPercent}%`,
                  top: `${cropPreviewLayout.topPercent}%`,
                }}
              />
            </div>

            <div className="admin-crop-controls">
              <label>
                Zoom
                <input
                  type="range"
                  min="1"
                  max="2.8"
                  step="0.01"
                  value={cropState.zoom}
                  onChange={(event) =>
                    setCropState((prev) => ({ ...prev, zoom: Number(event.target.value) }))
                  }
                />
              </label>

              <label>
                Geser Horizontal
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={cropPreviewLayout.displayOffsetX}
                  disabled={!cropPreviewLayout.canPanX}
                  onChange={(event) =>
                    setCropState((prev) => ({ ...prev, offsetX: Number(event.target.value) }))
                  }
                />
              </label>

              <label>
                Geser Vertikal
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={cropPreviewLayout.displayOffsetY}
                  disabled={!cropPreviewLayout.canPanY}
                  onChange={(event) =>
                    setCropState((prev) => ({ ...prev, offsetY: Number(event.target.value) }))
                  }
                />
              </label>
            </div>

            <div className="admin-crop-actions">
              <IconButton icon={FiCheck} label="Gunakan Hasil Crop" variant="success" onClick={applyCrop} />
              <IconButton icon={FiX} label="Batal" variant="ghost" onClick={closeCropper} />
            </div>
          </div>
        </div>
      )}

      {fullscreenImageUrl && (
        <div className="admin-fullscreen-overlay" onClick={() => setFullscreenImageUrl("")}> 
          <button type="button" className="admin-fullscreen-close" onClick={() => setFullscreenImageUrl("")}> 
            <FiX size={18} />
          </button>
          <img src={fullscreenImageUrl} alt="Fullscreen preview" className="admin-fullscreen-image" />
        </div>
      )}
    </div>
  );
}
