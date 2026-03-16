import { useEffect, useMemo, useState } from "react";
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
import { isSupabaseConfigured } from "../lib/supabaseClient";
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
  isActive: true,
};

const initialCategoryForm = {
  name: "",
  externalUrl: "",
  sortOrder: 0,
  isActive: true,
};

const initialProjectForm = {
  categoryId: "",
  title: "",
  description: "",
  techStack: "",
  repositoryUrl: "",
  sortOrder: 0,
  isActive: true,
};

const initialContactForm = {
  platform: "",
  label: "",
  url: "",
  sortOrder: 0,
  isActive: true,
};

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
      setProjectForm((prev) => ({
        ...prev,
        categoryId: data.categories[0]?.id || prev.categoryId,
      }));
    } catch (error) {
      setErrorMessage(error.message || "Gagal memuat data admin.");
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
      { label: "Contact Links", value: contacts.length },
    ],
    [aboutPhotos.length, certifications.length, contacts.length, projects.length]
  );

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
      setErrorMessage(error.message || "Terjadi kesalahan saat menyimpan data.");
    }
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
        is_active: certificationForm.isActive,
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
        is_active: categoryForm.isActive,
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
        is_active: projectForm.isActive,
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
        is_active: contactForm.isActive,
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
            <a href="/">Kembali ke Website</a>
            <button type="button" className="admin-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="admin-alert">
            Supabase belum terhubung. Isi env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
          </div>
        )}

        {errorMessage && <div className="admin-alert">{errorMessage}</div>}
        {successMessage && <div className="admin-alert">{successMessage}</div>}

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
                  Simpan About
                </button>
              </form>
            </article>

            <article className="admin-card">
              <h3>About Photos</h3>
              <form className="admin-form" onSubmit={onUploadAboutPhoto}>
                <input type="file" accept="image/*" onChange={(e) => setAboutUploadFile(e.target.files?.[0])} />
                <input
                  type="number"
                  value={aboutUploadOrder}
                  onChange={(event) => setAboutUploadOrder(event.target.value)}
                  placeholder="Sort Order"
                />
                <button type="submit" disabled={loading || !isSupabaseConfigured}>
                  Upload Foto
                </button>
              </form>

              <div className="admin-list">
                {aboutPhotos.map((photo) => (
                  <div className="admin-list-item" key={photo.id}>
                    <p>{photo.image_url}</p>
                    <p>Order: {photo.sort_order}</p>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() =>
                          runAction(
                            () => updateAboutPhoto(photo.id, { is_active: !photo.is_active }),
                            "Status foto diubah."
                          )
                        }
                      >
                        {photo.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => runAction(() => deleteAboutPhoto(photo.id), "Foto dihapus.")}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
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
                <label>
                  <input
                    type="checkbox"
                    checked={certificationForm.isActive}
                    onChange={(event) =>
                      setCertificationForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Aktif
                </label>
                <input type="file" accept="image/*" onChange={(e) => setCertImageFile(e.target.files?.[0])} />
                <button type="submit" disabled={loading || !isSupabaseConfigured}>
                  Simpan Sertifikat
                </button>
              </form>
            </article>

            <article className="admin-card">
              <h3>List Sertifikat</h3>
              <div className="admin-list">
                {certifications.map((cert) => (
                  <div key={cert.id} className="admin-list-item">
                    <p>{cert.title}</p>
                    <p>{cert.issuer} · {cert.year}</p>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() =>
                          runAction(
                            () => updateCertification(cert.id, { is_active: !cert.is_active }),
                            "Status sertifikat diubah."
                          )
                        }
                      >
                        {cert.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => runAction(() => deleteCertification(cert.id), "Sertifikat dihapus.")}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
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
                <label>
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(event) =>
                      setCategoryForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Aktif
                </label>
                <button type="submit" disabled={loading || !isSupabaseConfigured}>
                  Simpan Category
                </button>
              </form>

              <div className="admin-list">
                {categories.map((category) => (
                  <div key={category.id} className="admin-list-item">
                    <p>{category.name}</p>
                    <p>{category.external_url || "Internal category"}</p>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() =>
                          runAction(
                            () => updateCategory(category.id, { is_active: !category.is_active }),
                            "Status category diubah."
                          )
                        }
                      >
                        {category.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => runAction(() => deleteCategory(category.id), "Category dihapus.")}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
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
                <label>
                  <input
                    type="checkbox"
                    checked={projectForm.isActive}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Aktif
                </label>
                <input type="file" accept="image/*" onChange={(e) => setProjectImageFile(e.target.files?.[0])} />
                <button type="submit" disabled={loading || !isSupabaseConfigured}>
                  Simpan Project
                </button>
              </form>

              <div className="admin-list">
                {projects.map((project) => (
                  <div key={project.id} className="admin-list-item">
                    <p>{project.title}</p>
                    <p>{project.tech_stack}</p>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() =>
                          runAction(
                            () => updateProject(project.id, { is_active: !project.is_active }),
                            "Status project diubah."
                          )
                        }
                      >
                        {project.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => runAction(() => deleteProject(project.id), "Project dihapus.")}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
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
                <label>
                  <input
                    type="checkbox"
                    checked={contactForm.isActive}
                    onChange={(event) =>
                      setContactForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Aktif
                </label>
                <button type="submit" disabled={loading || !isSupabaseConfigured}>
                  Simpan Contact
                </button>
              </form>
            </article>

            <article className="admin-card">
              <h3>List Contact</h3>
              <div className="admin-list">
                {contacts.map((contact) => (
                  <div key={contact.id} className="admin-list-item">
                    <p>{contact.platform} · {contact.label}</p>
                    <p>{contact.url}</p>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() =>
                          runAction(
                            () => updateContact(contact.id, { is_active: !contact.is_active }),
                            "Status contact diubah."
                          )
                        }
                      >
                        {contact.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => runAction(() => deleteContact(contact.id), "Contact dihapus.")}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </div>
    </div>
  );
}
