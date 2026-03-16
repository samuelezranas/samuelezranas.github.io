import { ensureSupabase, isSupabaseConfigured } from "./supabaseClient";

function parseTechStack(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createStoragePath(folder, fileName) {
  const extension = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
  return `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
}

export async function uploadAsset(file, folder = "general") {
  const client = ensureSupabase();
  const path = createStoragePath(folder, file.name || "file");

  const { error: uploadError } = await client.storage
    .from("website-assets")
    .upload(path, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = client.storage.from("website-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchPublicWebsiteData() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const client = ensureSupabase();

  const [aboutSettingsRes, aboutPhotosRes, certificationsRes, categoriesRes, projectsRes, contactsRes] =
    await Promise.all([
      client.from("about_settings").select("title, lead, resume_url").limit(1).maybeSingle(),
      client
        .from("about_photos")
        .select("id, image_url, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      client
        .from("certifications")
        .select("id, title, issuer, year, image_url, credential_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      client
        .from("portfolio_categories")
        .select("id, name, external_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      client
        .from("portfolio_projects")
        .select("id, title, description, image_url, tech_stack, repository_url, category_id")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      client
        .from("contact_links")
        .select("id, platform, label, url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

  const firstError = [
    aboutSettingsRes.error,
    aboutPhotosRes.error,
    certificationsRes.error,
    categoriesRes.error,
    projectsRes.error,
    contactsRes.error,
  ].find(Boolean);

  if (firstError) {
    throw firstError;
  }

  const categories = categoriesRes.data || [];
  const projects = projectsRes.data || [];

  const categoryById = new Map(categories.map((category) => [category.id, category]));

  const portfolioData = {};
  const portfolioLinks = {};

  categories.forEach((category) => {
    if (category.external_url) {
      portfolioLinks[category.name] = category.external_url;
      return;
    }

    portfolioData[category.name] = [];
  });

  projects.forEach((project) => {
    const category = categoryById.get(project.category_id);
    if (!category || category.external_url) {
      return;
    }

    if (!portfolioData[category.name]) {
      portfolioData[category.name] = [];
    }

    portfolioData[category.name].push({
      title: project.title,
      description: project.description,
      image: project.image_url,
      link: project.repository_url,
      techStack: parseTechStack(project.tech_stack),
    });
  });

  return {
    about: {
      title: aboutSettingsRes.data?.title || "",
      lead: aboutSettingsRes.data?.lead || "",
      resumeUrl: aboutSettingsRes.data?.resume_url || "",
      photos: (aboutPhotosRes.data || []).map((photo) => ({
        id: photo.id,
        image: photo.image_url,
      })),
    },
    certifications: (certificationsRes.data || []).map((cert) => ({
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer,
      year: String(cert.year || ""),
      image: cert.image_url,
      credentialUrl: cert.credential_url || "",
    })),
    portfolioData,
    portfolioLinks,
    contacts: contactsRes.data || [],
  };
}

export async function fetchAdminWebsiteData() {
  const client = ensureSupabase();

  const [aboutSettingsRes, aboutPhotosRes, certificationsRes, categoriesRes, projectsRes, contactsRes] =
    await Promise.all([
      client.from("about_settings").select("*").limit(1).maybeSingle(),
      client.from("about_photos").select("*").order("sort_order", { ascending: true }),
      client.from("certifications").select("*").order("sort_order", { ascending: true }),
      client.from("portfolio_categories").select("*").order("sort_order", { ascending: true }),
      client.from("portfolio_projects").select("*").order("sort_order", { ascending: true }),
      client.from("contact_links").select("*").order("sort_order", { ascending: true }),
    ]);

  const firstError = [
    aboutSettingsRes.error,
    aboutPhotosRes.error,
    certificationsRes.error,
    categoriesRes.error,
    projectsRes.error,
    contactsRes.error,
  ].find(Boolean);

  if (firstError) {
    throw firstError;
  }

  return {
    aboutSettings: aboutSettingsRes.data,
    aboutPhotos: aboutPhotosRes.data || [],
    certifications: certificationsRes.data || [],
    categories: categoriesRes.data || [],
    projects: projectsRes.data || [],
    contacts: contactsRes.data || [],
  };
}

export async function upsertAboutSettings(payload) {
  const client = ensureSupabase();
  const { error } = await client.from("about_settings").upsert(
    {
      id: 1,
      title: payload.title,
      lead: payload.lead,
      resume_url: payload.resumeUrl,
    },
    { onConflict: "id" }
  );

  if (error) {
    throw error;
  }
}

export async function createAboutPhoto(payload) {
  const client = ensureSupabase();
  const { error } = await client.from("about_photos").insert(payload);
  if (error) {
    throw error;
  }
}

export async function updateAboutPhoto(id, payload) {
  const client = ensureSupabase();
  const { error } = await client.from("about_photos").update(payload).eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteAboutPhoto(id) {
  const client = ensureSupabase();
  const { error } = await client.from("about_photos").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function createCertification(payload) {
  const client = ensureSupabase();
  const { error } = await client.from("certifications").insert(payload);
  if (error) {
    throw error;
  }
}

export async function updateCertification(id, payload) {
  const client = ensureSupabase();
  const { error } = await client.from("certifications").update(payload).eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteCertification(id) {
  const client = ensureSupabase();
  const { error } = await client.from("certifications").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function createCategory(payload) {
  const client = ensureSupabase();
  const { error } = await client.from("portfolio_categories").insert(payload);
  if (error) {
    throw error;
  }
}

export async function updateCategory(id, payload) {
  const client = ensureSupabase();
  const { error } = await client.from("portfolio_categories").update(payload).eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteCategory(id) {
  const client = ensureSupabase();
  const { error } = await client.from("portfolio_categories").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function createProject(payload) {
  const client = ensureSupabase();
  const { error } = await client.from("portfolio_projects").insert(payload);
  if (error) {
    throw error;
  }
}

export async function updateProject(id, payload) {
  const client = ensureSupabase();
  const { error } = await client.from("portfolio_projects").update(payload).eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteProject(id) {
  const client = ensureSupabase();
  const { error } = await client.from("portfolio_projects").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function createContact(payload) {
  const client = ensureSupabase();
  const { error } = await client.from("contact_links").insert(payload);
  if (error) {
    throw error;
  }
}

export async function updateContact(id, payload) {
  const client = ensureSupabase();
  const { error } = await client.from("contact_links").update(payload).eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteContact(id) {
  const client = ensureSupabase();
  const { error } = await client.from("contact_links").delete().eq("id", id);
  if (error) {
    throw error;
  }
}
