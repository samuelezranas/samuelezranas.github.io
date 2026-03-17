begin;

-- About settings
insert into about_settings (id, title, lead, resume_url)
values (
  1,
  'I''m Samuel Ezra. Here, I craft digital products with a futuristic mindset.',
  'I am an Information Technology undergraduate focused on software engineering, interface design, and visual storytelling. I enjoy building products that are both technically strong and visually memorable. Beyond coding, I care deeply about user flow, visual rhythm, and performance, so every project I build aims to feel smooth, purposeful, and ready for real-world use.',
  'https://drive.google.com/'
)
on conflict (id) do update
set
  title = excluded.title,
  lead = excluded.lead,
  resume_url = excluded.resume_url,
  updated_at = now();

-- About photos
insert into about_photos (id, image_url, sort_order, is_active)
values
  ('11111111-1111-1111-1111-111111111111', '/packages/images/2869.jpg', 0, true)
on conflict (id) do update
set
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Certifications
insert into certifications (id, title, issuer, year, image_url, credential_url, sort_order, is_active)
values
  ('20000000-0000-0000-0000-000000000001', 'Belajar Dasar Structured Query Language (SQL)', 'Dicoding', '2024', '/packages/images/porto-carslification.png', 'https://www.dicoding.com/certificates/KEXLYN56YZG2', 0, true),
  ('20000000-0000-0000-0000-000000000002', 'Belajar Dasar Data Science', 'Dicoding', '2024', '/packages/images/porto-mandiri-news.png', '', 1, true),
  ('20000000-0000-0000-0000-000000000003', 'Memulai Pemrograman Dengan Python', 'Dicoding', '2024', '/packages/images/porto-teman-pasar.jpg', '', 2, true),
  ('20000000-0000-0000-0000-000000000004', 'Cloud Practitioner Essentials', 'AWS Academy', '2023', '/packages/images/porto-redesign.png', '', 3, true),
  ('20000000-0000-0000-0000-000000000005', 'Fundamental Front-End Web', 'Dicoding', '2023', '/packages/images/cronus-index.png', '', 4, true),
  ('20000000-0000-0000-0000-000000000006', 'Responsive Web Design', 'freeCodeCamp', '2023', '/packages/images/porto-graphic-design.png', '', 5, true),
  ('20000000-0000-0000-0000-000000000007', 'Machine Learning Basics', 'Google Cloud Skills Boost', '2023', '/packages/images/porto-cadmus.jpg', '', 6, true),
  ('20000000-0000-0000-0000-000000000008', 'UI Design Essentials', 'Coursera', '2022', '/packages/images/porto-desain-stiker.png', '', 7, true)
on conflict (id) do update
set
  title = excluded.title,
  issuer = excluded.issuer,
  year = excluded.year,
  image_url = excluded.image_url,
  credential_url = excluded.credential_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Portfolio categories
insert into portfolio_categories (id, name, external_url, sort_order, is_active)
values
  ('30000000-0000-0000-0000-000000000001', 'Website', null, 0, true),
  ('30000000-0000-0000-0000-000000000002', 'Application', null, 1, true),
  ('30000000-0000-0000-0000-000000000003', 'Design', 'https://www.behance.net/samuelezranas', 2, true),
  ('30000000-0000-0000-0000-000000000004', 'Photography', 'https://samuelezranas.my.canva.site/portofolio', 3, true)
on conflict (id) do update
set
  name = excluded.name,
  external_url = excluded.external_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Portfolio projects
insert into portfolio_projects (
  id,
  category_id,
  title,
  description,
  image_url,
  tech_stack,
  repository_url,
  sort_order,
  is_active
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Carslification',
    'Car image classification with CNN and price prediction flow for practical sales insights.',
    '/packages/images/porto-carslification.png',
    'HTML, CSS, JavaScript, Python, TensorFlow, Flask',
    'https://github.com/samuelezranas/carslification-classification-prediction',
    0,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    'Cronus Watch',
    'A Laravel commerce website focused on clean architecture and structured SQL data management.',
    '/packages/images/cronus-index.png',
    'Laravel, PHP, MySQL, JavaScript, Bootstrap',
    'https://github.com/samuelezranas/cronus_watch_store',
    1,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000002',
    'Mandiri News App',
    'Android app that delivers curated headlines in real time via NewsAPI integration.',
    '/packages/images/porto-mandiri-news.png',
    'Java, Android Studio, NewsAPI, XML',
    'https://github.com/samuelezranas/mandiri-news-app/',
    0,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000002',
    'OOP Smart Market',
    'Desktop Java application concept for customer and seller transactions in a smart market system.',
    '/packages/images/porto-teman-pasar.jpg',
    'Java, NetBeans, MySQL, OOP',
    'https://github.com/samuelezranas/oop-project-smartmarket.git',
    1,
    true
  )
on conflict (id) do update
set
  category_id = excluded.category_id,
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  tech_stack = excluded.tech_stack,
  repository_url = excluded.repository_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- Contact links
insert into contact_links (id, platform, label, url, sort_order, is_active)
values
  ('50000000-0000-0000-0000-000000000001', 'mail', 'samuelezra2013@gmail.com', 'mailto:samuelezra2013@gmail.com', 0, true),
  ('50000000-0000-0000-0000-000000000002', 'linkedin', 'linkedin.com/in/samuel-ezra-sirait', 'https://www.linkedin.com/in/samuel-ezra-sirait/', 1, true),
  ('50000000-0000-0000-0000-000000000003', 'github', 'github.com/samuelezranas', 'https://github.com/samuelezranas', 2, true),
  ('50000000-0000-0000-0000-000000000004', 'instagram', 'instagram.com/samuelezra34', 'https://www.instagram.com/samuelezra34/', 3, true)
on conflict (id) do update
set
  platform = excluded.platform,
  label = excluded.label,
  url = excluded.url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

commit;
