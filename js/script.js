/* =========================================================
   Michael John Minor — Portfolio site behavior (vanilla JS)
   Frontend-only. No server, no real database.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const P = window.PROFILE || {};

  /* ---------- Google Analytics event helper ---------- */
  function trackEvent(name, params) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, params || {});
      }
    } catch (_) { /* GA not configured — silent */ }
  }

  /* ---------- SVG icons (inline, no external assets) ---------- */
  const ICON = {
    keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M9 14h6"/></svg>',
    sheet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    googleSheets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h2M14 13h2M8 17h2M14 17h2"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    format: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2M12 5v14M9 19h6"/><path d="M4 12h4M16 12h4"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 12h3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6M9 9h2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>'
  };

  /* ---------- profile-driven text ---------- */
  function applyProfile() {
    const avail = $(".js-availability-text");
    if (avail && P.availability) avail.textContent = P.availability;
    $$(".js-profile").forEach((el) => {
      const key = el.dataset.field;
      if (key && P[key]) el.textContent = P[key];
    });
    if (P.linkedin) {
      const li = $(".placeholder-item");
      if (li) {
        li.classList.remove("placeholder-item");
        li.querySelector("div").innerHTML =
          '<strong>LinkedIn</strong><br><a href="' + esc(P.linkedin) +
          '" target="_blank" rel="noopener">View LinkedIn profile</a>';
      }
    }
    // Update résumé download link in hero if profilePath available
    if (P.resumePath) {
      const heroResume = $("#resumeDownloadHero");
      if (heroResume) heroResume.href = P.resumePath;
    }
  }

  /* ---------- Dark mode ---------- */
  function wireTheme() {
    const btn = $("#themeToggle");
    if (!btn) return;
    const stored = localStorage.getItem("mjm-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initial);

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("mjm-theme", next); } catch (_) {}
      btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  /* ---------- Skills ---------- */
  const SKILLS = [
    { icon: "keyboard", name: "Data Entry Accuracy", desc: "Fast, careful typing and record entry with systematic accuracy checks and spot verification." },
    { icon: "sheet", name: "Spreadsheet Management", desc: "Excel and Google Sheets: tables, formulas, sorting, filtering, structured formatting." },
    { icon: "sparkle", name: "Data Cleaning & Validation", desc: "Removing duplicates, trimming spaces, fixing capitalization, standardizing values." },
    { icon: "globe", name: "Web Research & Collection", desc: "Structured web research and reliable data collection into organized tables and lists." },
    { icon: "folder", name: "File & Folder Organization", desc: "Logical structures, consistent naming conventions, and searchable file management systems." },
    { icon: "doc", name: "Document Preparation", desc: "Formatted reports, letters, and documents using Word, Google Docs, and Excel." },
    { icon: "mail", name: "Email & Inbox Management", desc: "Inbox triage, folder organization, labeling systems, and follow-up tracking." },
    { icon: "format", name: "Writing Polish & Grammar", desc: "Grammarly editing, consistency checks, and professional tone refinement." },
    { icon: "pdf", name: "PDF to Document Conversion", desc: "Extracting tables and text from PDFs into organized spreadsheets and documents." },
    { icon: "clock", name: "Deadline & Task Management", desc: "Meeting timelines across multiple tasks with clear communication and status updates." },
    { icon: "sparkle", name: "AI Productivity Tools", desc: "ChatGPT, Gemini, and productivity AI workflows for research assistance and ideation." },
    { icon: "globe", name: "Translation & Localization", desc: "DeepL for accurate translation and content localization across languages." }
  ];

  function renderSkills() {
    const grid = $("#skillsGrid");
    if (!grid) return;
    grid.innerHTML = SKILLS.map(
      (s) =>
        '<article class="card skill-card reveal">' +
        '<div class="card-icon" aria-hidden="true">' + ICON[s.icon] + "</div>" +
        "<h3>" + esc(s.name) + "</h3><p>" + esc(s.desc) + "</p></article>"
    ).join("");
  }

  /* ---------- Tools ---------- */
  const TOOLS = [
    { label: "Microsoft Excel", short: "XL", color: "#1d6f42" },
    { label: "Microsoft Word", short: "W", color: "#2b579a" },
    { label: "Google Sheets", short: "GS", color: "#0f9d58" },
    { label: "Google Docs", short: "GD", color: "#4285f4" },
    { label: "Google Drive", short: "GV", color: "#f4b400" },
    { label: "Microsoft OneDrive", short: "OD", color: "#0078d4" },
    { label: "Gmail", short: "GM", color: "#d14836" },
    { label: "Microsoft Outlook", short: "OL", color: "#0078d4" },
    { label: "Google Forms", short: "GF", color: "#9c27b0" },
    { label: "ChatGPT", short: "AI", color: "#10a37f" },
    { label: "Google Gemini", short: "GM", color: "#8f0000" },
    { label: "Grammarly", short: "GR", color: "#15a29b" },
    { label: "DeepL", short: "DL", color: "#0c42f4" }
  ];

  function renderTools() {
    const grid = $("#toolsGrid");
    if (!grid) return;
    const TOOL_LOGOS = {
      "Microsoft Excel": "excel-logo-8033473_1280.webp",
      "Microsoft Word": "microsoft-word.webp",
      "Google Sheets": "google sheets.webp",
      "Google Docs": "Google_Docs_Logo.webp",
      "Google Drive": "google-drive-logo.webp",
      "Microsoft OneDrive": "Microsoft-OneDrive.webp",
      "Gmail": "gmail.webp",
      "Microsoft Outlook": "Microsoft_Outlook-Logo.webp",
      "Google Forms": "google-forms.webp",
      "ChatGPT": "chatgpt.webp",
      "Google Gemini": "Google-Gemini.webp",
      "Grammarly": "gramarly.webp",
      "DeepL": "deeplL.webp"
    };
    grid.innerHTML = TOOLS.map((t) => {
      const logoFile = TOOL_LOGOS[t.label];
      const logoImg = logoFile
        ? '<img src="assets/images/' + esc(logoFile) + '" alt="' + esc(t.label) + ' logo" loading="lazy" />'
        : '<span aria-hidden="true" style="font-size:1.2rem;font-weight:800;">' + esc(t.short) + '</span>';
      return '<li class="tool-item reveal"><span class="tool-logo" aria-hidden="true">' + logoImg + '</span>' + esc(t.label) + '</li>';
    }).join("");
  }

  /* ---------- Services ---------- */
  const SERVICES = [
    { icon: "sheet", name: "Data Entry & Spreadsheet Management", desc: "New records, updates, and well-maintained Excel or Google Sheets workbooks you can trust." },
    { icon: "sparkle", name: "Data Cleaning & Validation", desc: "Duplicates, typos, odd spacing, and inconsistent naming cleaned into a uniform dataset." },
    { icon: "globe", name: "Web Research & Data Collection", desc: "Finding business, product, or contact details online and organizing them into structured lists." },
    { icon: "pdf", name: "PDF & Document Conversion", desc: "Pulling tables and text from PDFs into tidy spreadsheets or Word documents." },
    { icon: "mail", name: "Email & Inbox Organization", desc: "Labels, filters, and triage so important messages surface first and nothing is lost." },
    { icon: "folder", name: "File & Document Organization", desc: "Folder systems and naming conventions that keep your files findable and accessible." },
    { icon: "doc", name: "Document Preparation & Formatting", desc: "Reports, letters, and professional documents formatted and polished for presentation." },
    { icon: "clock", name: "Research & Administrative Support", desc: "Fact-checking, data verification, scheduling, and general VA task support on schedule." }
  ];

  function renderServices() {
    const grid = $("#servicesGrid");
    if (!grid) return;
    grid.innerHTML = SERVICES.map(
      (s) =>
        '<article class="card service-card reveal">' +
        '<div class="card-icon" aria-hidden="true">' + ICON[s.icon] + "</div>" +
        "<h3>" + esc(s.name) + "</h3><p>" + esc(s.desc) + "</p>" +
        '<a href="#contact" class="btn btn-outline btn-sm" style="margin-top:0.75rem;align-self:flex-start;">Get a Quote</a>' +
        "</article>"
    ).join("");
  }

  /* ---------- Demonstration data ---------- */
  const CUSTOMERS = [
    { id: "C-1001", name: "Sarah Johnson", email: "sarah.j@example.com", city: "New York", status: "Active" },
    { id: "C-1002", name: "Marcus Chen", email: "m.chen@example.com", city: "San Francisco", status: "Active" },
    { id: "C-1003", name: "Elena Rodriguez", email: "elena.r@example.com", city: "Miami", status: "Pending" },
    { id: "C-1004", name: "James O'Connor", email: "j.oconnor@example.com", city: "Boston", status: "Active" },
    { id: "C-1005", name: "Lisa Thompson", email: "lisa.t@example.com", city: "Seattle", status: "Active" },
    { id: "C-1006", name: "David Kumar", email: "d.kumar@example.com", city: "Chicago", status: "Inactive" },
    { id: "C-1007", name: "Amanda Walsh", email: "amanda.w@example.com", city: "Austin", status: "Pending" },
    { id: "C-1008", name: "Robert Martinez", email: "r.martinez@example.com", city: "Denver", status: "Active" }
  ];

  const RESEARCH = [
    { biz: "Digital Marketing Agency", cat: "Business Services", site: "dma-example.com", status: "Contacted" },
    { biz: "Local Coffee Roastery", cat: "Food & Beverage", site: "coffeeroast-example.com", status: "Email found" },
    { biz: "Tech Startup Hub", cat: "Technology", site: "techstartup-example.com", status: "Contacted" },
    { biz: "Fitness Coaching Studio", cat: "Health & Wellness", site: "fitnessstudio-example.com", status: "Email found" },
    { biz: "Graphic Design Studio", cat: "Creative Services", site: "graphicdesign-example.com", status: "Not contacted" },
    { biz: "Cleaning Services Co.", cat: "Home Services", site: "cleaning-example.com", status: "Email found" }
  ];

  const PRODUCTS = [
    { name: "Project Management Course", sku: "COURSE-PM-001", cat: "Digital Products", price: "$49.00" },
    { name: "Data Entry Template Pack", sku: "TEMPLATE-DE-002", cat: "Office Tools", price: "$19.99" },
    { name: "Email Management Checklist", sku: "CHECKLIST-EM-003", cat: "Productivity", price: "$9.99" },
    { name: "Research Workflow Guide", sku: "GUIDE-RES-004", cat: "Digital Products", price: "$14.99" },
    { name: "Document Organization Kit", sku: "KIT-ORG-005", cat: "Office Tools", price: "$24.99" },
    { name: "Spreadsheet Formula Library", sku: "LIBRARY-SS-006", cat: "Digital Products", price: "$29.99" }
  ];

  const INBOX = {
    Important: [
      { from: "Client Request", subj: "Urgent: Data entry spreadsheet needed by Friday", meta: "Today, 10:30 AM" },
      { from: "Project Lead", subj: "Research compilation due for approval", meta: "Today, 9:15 AM" }
    ],
    "In Progress": [
      { from: "Manager", subj: "Follow-up on file organization project", meta: "Yesterday" },
      { from: "Team", subj: "Data cleaning task in progress", meta: "Yesterday" }
    ],
    "Completed": [
      { from: "Client", subj: "Thank you - spreadsheet completed", meta: "2 days ago" },
      { from: "Supervisor", subj: "Document prep approved and delivered", meta: "3 days ago" }
    ],
    "Follow-up": [
      { from: "Admin", subj: "Waiting for contact list response", meta: "4 days ago" },
      { from: "Team Lead", subj: "Awaiting feedback on research list", meta: "5 days ago" }
    ]
  };

  /* ---------- table render helpers ---------- */
  function pill(status) {
    const cls = status === "Active" || status === "Contacted" ? "status-active"
      : status === "Pending" || status === "Email found" ? "status-pending"
      : "status-inactive";
    return '<span class="status-pill ' + cls + '">' + esc(status) + "</span>";
  }

  function tableHTML(cols, rows, caption) {
    let h = '<div class="table-scroll" tabindex="0" role="region" aria-label="Sample data table, scrollable"><table class="data-table"><thead><tr>';
    cols.forEach((c) => (h += '<th scope="col">' + esc(c) + "</th>"));
    h += "</tr></thead><tbody>";
    rows.forEach((r) => {
      h += "<tr>";
      r.forEach((cell) => (h += "<td>" + cell + "</td>"));
      h += "</tr>";
    });
    h += "</tbody>";
    if (caption) h += "<caption>" + esc(caption) + "</caption>";
    return h + "</table></div>";
  }

  /* ---------- Portfolio projects ---------- */
  const PROJECTS = [
    {
      title: "Customer Data Entry",
      badge: "Sample Project",
      category: "data-entry",
      desc: "Structured customer records with name, email, location, and status in a clean, organized spreadsheet.",
      tools: "Microsoft Excel, Google Sheets",
      thumb: "sheet",
      demo: () => tableHTML(
        ["Customer ID", "Name", "Email", "City", "Status"],
        CUSTOMERS.map((c) => [c.id, c.name, '<span class="email">' + esc(c.email) + "</span>", c.city, pill(c.status)]),
        "Demonstration data — not real customer records. Shows how I structure and manage data accurately."
      )
    },
    {
      title: "Data Cleaning & Validation",
      badge: "Demonstration",
      category: "cleaning",
      desc: "Before-and-after cleanup: messy spacing, capitalization, duplicates, and missing values corrected live.",
      tools: "Excel, manual validation techniques",
      thumb: "sparkle",
      demo: () => cleanDemoHTML()
    },
    {
      title: "Business Research Database",
      badge: "Practice Project",
      category: "research",
      desc: "Compiled business research with categories, websites, and contact status for outreach campaigns.",
      tools: "Google Sheets, web research, DeepL",
      thumb: "globe",
      demo: () => tableHTML(
        ["Business Name", "Category", "Website", "Contact Status"],
        RESEARCH.map((r) => [esc(r.biz), esc(r.cat), '<span class="email">' + esc(r.site) + "</span>", pill(r.status)]),
        "Demonstration data — shows my approach to research organization and categorization."
      )
    },
    {
      title: "PDF-to-Spreadsheet Workflow",
      badge: "Demonstration",
      category: "data-entry",
      desc: "Visual walkthrough showing how invoice, report, or form PDFs can be converted to organized spreadsheets.",
      tools: "Microsoft Excel, manual extraction",
      thumb: "pdf",
      demo: () =>
        '<div class="flow">' +
        '<div class="flow-step"><span aria-hidden="true">&#128196;</span>Source PDF<br><small>invoice / report / form</small></div>' +
        '<div class="flow-arrow" aria-hidden="true">&rarr;</div>' +
        '<div class="flow-step"><span aria-hidden="true">&#128269;</span>Extract<br><small>identify tables &amp; fields</small></div>' +
        '<div class="flow-arrow" aria-hidden="true">&rarr;</div>' +
        '<div class="flow-step"><span aria-hidden="true">&#9997;</span>Organize<br><small>map to spreadsheet columns</small></div>' +
        '<div class="flow-arrow" aria-hidden="true">&rarr;</div>' +
        '<div class="flow-step"><span aria-hidden="true">&#128202;</span>Verify &amp; Deliver<br><small>accuracy check &amp; format</small></div>' +
        "</div>" +
        tableHTML(["Invoice No.", "Date", "Company", "Amount"],
          [["INV-2041", "2026-06-03", "Tech Solutions Inc.", "$850.00"],
           ["INV-2042", "2026-06-05", "Marketing Pro Agency", "$1,250.00"],
           ["INV-2043", "2026-06-11", "Design Studio Co.", "$695.50"]],
          "Sample data — demonstrates my PDF-to-spreadsheet workflow and accuracy verification process.") +
        '<p class="note">This demonstrates the workflow. The site does not convert real PDFs in your browser.</p>'
    },
    {
      title: "Email Organization System",
      badge: "Practice Project",
      category: "admin",
      desc: "Sample inbox workflow showing categories, priorities, and status tracking for efficient email management.",
      tools: "Gmail, Microsoft Outlook",
      thumb: "mail",
      demo: () => inboxDemoHTML()
    },
    {
      title: "Research & Data Compilation",
      badge: "Sample Project",
      category: "research",
      desc: "Organized research data with fields for easy filtering, sorting, and compilation into reports.",
      tools: "Google Sheets, web research",
      thumb: "folder",
      demo: () => tableHTML(
        ["Project", "Status", "Fields", "Records"],
        [["Contact List", "Completed", "Name, Email, Phone, Company", "150"],
         ["Market Research", "In Progress", "Company, Industry, Website, Contact", "45"],
         ["Prospect Database", "Completed", "Name, Title, Company, Email, Phone", "320"],
         ["Vendor List", "Completed", "Vendor, Service, Contact, Website, Price", "87"]],
        "Demonstration data — shows how I compile and track research projects with clear status management."
      )
    }
  ];

  let activeFilter = "all";
  let portfolioSearchQuery = "";

  function renderPortfolio() {
    const grid = $("#portfolioGrid");
    if (!grid) return;

    const q = portfolioSearchQuery.trim().toLowerCase();
    grid.innerHTML = PROJECTS.map((p, i) => {
      const matchesFilter = activeFilter === "all" || p.category === activeFilter;
      const matchesSearch = !q || (p.title + " " + p.desc + " " + (p.tools || "")).toLowerCase().includes(q);
      const hidden = !(matchesFilter && matchesSearch);
      return '<article class="card portfolio-card reveal' + (hidden ? " hidden" : "") + '" data-index="' + i + '">' +
        '<div class="portfolio-thumb" aria-hidden="true">' + ICON[p.thumb] + "</div>" +
        '<div class="badge-row"><span class="badge ' + (p.badge === "Demonstration" ? "badge-demo" : "badge-sample") + '">' +
        esc(p.badge) + "</span></div>" +
        "<h3>" + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p>" +
        (p.tools ? '<p style="font-size:0.78rem;color:var(--muted);margin-top:0.3rem;"><strong>Tools:</strong> ' + esc(p.tools) + '</p>' : '') +
        '<button type="button" class="btn btn-outline btn-sm" data-demo="' + i + '">View Demo</button>' +
        "</article>";
    }).join("");

    const visible = grid.querySelectorAll(".portfolio-card:not(.hidden)");
    if (!visible.length) {
      grid.innerHTML += '<p style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1;">No projects match your search.</p>';
    }
  }

  function wirePortfolioFilters() {
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        renderPortfolio();
        trackEvent("portfolio_filter", { filter: activeFilter });
      });
    });

    const searchInput = $("#portfolioSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        portfolioSearchQuery = e.target.value;
        renderPortfolio();
      });
    }
  }

  /* =========================================================
     Hero showcase window
     ========================================================= */
  function renderShowcase() {
    const sheet = $("#panel-sheet");
    if (!sheet) return;

    const activeCount = CUSTOMERS.filter((c) => c.status === "Active").length;
    const cityCount = new Set(CUSTOMERS.map((c) => c.city)).size;
    sheet.innerHTML =
      '<div class="panel-stats">' +
      '<span class="stat-chip"><strong>' + CUSTOMERS.length + "</strong>Records</span>" +
      '<span class="stat-chip"><strong>' + activeCount + "</strong>Active</span>" +
      '<span class="stat-chip"><strong>' + cityCount + "</strong>Cities</span>" +
      '<span class="stat-chip"><strong>5</strong>Fields</span>' +
      "</div>" +
      tableHTML(["ID", "Name", "Email", "City", "Status"],
        CUSTOMERS.map((c) => [c.id, esc(c.name), '<span class="email">' + esc(c.email) + "</span>", esc(c.city), pill(c.status)])) +
      '<p class="panel-note">Demonstration data showing how I organize customer records. See the live workspace below to edit records.</p>';

    const cleaned = cleanRows(MESSY);
    $("#panel-clean").innerHTML =
      '<div class="clean-cols-sm">' +
      "<div><h4>Before (raw)</h4><pre class=\"clean-pre\">" + esc(fmt(MESSY)) + "</pre></div>" +
      "<div><h4>After (cleaned)</h4><pre class=\"clean-pre clean-after\">" + esc(fmt(cleaned)) + "</pre></div>" +
      "</div>" +
      '<p class="panel-note">Duplicates removed, spacing and capitalization normalized, missing values handled.</p>';

    const cats = Object.keys(INBOX);
    $("#panel-inbox").innerHTML =
      '<div class="inbox-pills" role="group" aria-label="Mail categories">' +
      cats.map((c, i) =>
        '<button type="button" data-inbox-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' +
        esc(c) + " (" + INBOX[c].length + ")</button>").join("") +
      "</div><div class=\"inbox-list\" id=\"inboxPanelList\"></div>" +
      '<p class="panel-note">Demonstration inbox showing my email organization and categorization system.</p>';

    const inboxList = $("#inboxPanelList");
    function showInbox(cat) {
      $$("#panel-inbox [data-inbox-cat]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.inboxCat === cat)));
      inboxList.innerHTML = INBOX[cat].map((m) =>
        '<div class="inbox-item"><strong>' + esc(m.subj) + "</strong>" +
        '<span class="from">' + esc(m.from) + " &middot; " + esc(m.meta) + "</span></div>").join("");
    }
    $$("#panel-inbox [data-inbox-cat]").forEach((b) =>
      b.addEventListener("click", () => showInbox(b.dataset.inboxCat)));
    showInbox(cats[0]);

    $("#panel-products").innerHTML =
      '<div class="product-cards">' +
      PRODUCTS.map((p) =>
        '<div class="product-card">' +
        '<div class="p-img" aria-hidden="true">' + esc(p.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()) + "</div>" +
        "<strong>" + esc(p.name) + "</strong>" +
        '<span class="p-sku">' + esc(p.sku) + "</span>" +
        '<div class="p-row"><span class="muted">' + esc(p.cat) + '</span><span class="p-price">' + esc(p.price) + "</span></div>" +
        "</div>").join("") +
      "</div>" +
      '<p class="panel-note">Demonstration data — shows how I prepare structured product information.</p>';

    const tabs = $$(".showcase-tabs [role='tab']");
    function selectTab(tab) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        $("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach((t) => {
      t.addEventListener("click", () => selectTab(t));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const i = tabs.indexOf(t);
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        selectTab(next);
      });
    });
  }

  /* ---------- Data cleaning demo ---------- */
  const MESSY = [
    ["  sarah johnson  ", "Sarah.Johnson@Example.COM", "new york", "active "],
    ["MARCUS CHEN", "", "san francisco", "Pending"],
    ["marcus chen ", "m.chen@example.com", "San Francisco", "pending"],
    ["ELENA RODRIGUEZ", "elena.r@example.com", "miami", " ACTIVE"],
    ["James OConnor", "j.oconnor@example.com", "", "inactive"],
    ["sarah johnson", "sarah.j@example.com", "New York", "Active"]
  ];

  function titleCase(s) {
    return s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }

  function cleanRows(rows) {
    const seen = new Set();
    const out = [];
    rows.forEach((r) => {
      const name = titleCase(r[0].replace(/\s+/g, " ").trim());
      const emailRaw = r[1].trim().toLowerCase();
      const email = emailRaw || "not-provided@example.com";
      const city = r[2].trim() ? titleCase(r[2].replace(/\s+/g, " ").trim()) : "—";
      const status = titleCase(r[3].trim().toLowerCase());
      const key = name.replace(/\s/g, "").toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push([name, email, city, ["Active", "Pending", "Inactive"].includes(status) ? status : "Pending"]);
    });
    return out;
  }

  function fmt(rows) {
    return rows.map((r) => r.map((c) => String(c).padEnd(24)).join("|").trimEnd()).join("\n");
  }

  function cleanDemoHTML() {
    const tpl = $("#tplCleanDemo");
    return tpl ? tpl.innerHTML : "";
  }

  function wireCleanDemo() {
    const btn = $("#runClean");
    if (!btn) return;
    const before = $("#cleanBefore");
    const after = $("#cleanAfter");
    const msg = $("#cleanMsg");
    before.textContent = fmt(MESSY);
    after.textContent = 'Click "Run Data Cleaning" to process the rows on the left.';
    btn.addEventListener("click", () => {
      const cleaned = cleanRows(MESSY);
      after.textContent = fmt(cleaned);
      msg.textContent = "Done: " + MESSY.length + " rows in, " + cleaned.length +
        " unique clean rows out (duplicates removed, spacing/caps fixed, missing values handled).";
      msg.className = "demo-msg ok";
    });
  }

  /* ---------- Inbox demo ---------- */
  function inboxDemoHTML() {
    const cats = Object.keys(INBOX);
    let h = '<div class="inbox"><div class="inbox-cats" role="group" aria-label="Mail categories">';
    cats.forEach((c, i) => {
      h += '<button type="button" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' +
        esc(c) + " (" + INBOX[c].length + ")</button>";
    });
    h += "</div><div class=\"inbox-list\" id=\"inboxList\" aria-live=\"polite\"></div></div>";
    h += '<p class="note">Demonstration showing how I organize and categorize email messages for efficient management.</p>';
    return h;
  }

  function wireInbox(root) {
    const list = $("#inboxList", root);
    const btns = $$("[data-cat]", root);
    function show(cat) {
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === cat)));
      list.innerHTML = INBOX[cat].map(
        (m) => '<div class="inbox-item"><strong>' + esc(m.subj) + "</strong>" +
          '<span class="from">' + esc(m.from) + " &middot; " + esc(m.meta) + "</span></div>"
      ).join("");
    }
    btns.forEach((b) => b.addEventListener("click", () => show(b.dataset.cat)));
    show(btns[0].dataset.cat);
  }

  /* ---------- Generic modal ---------- */
  const modal = $("#projectModal");
  let lastFocused = null;

  function openModal(title, bodyHTML, afterOpen) {
    lastFocused = document.activeElement;
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = bodyHTML;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (afterOpen) afterOpen($("#modalBody"));
    const closeBtn = $(".modal-close", modal);
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key !== "Tab") return;
    const focusables = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
      .filter((el) => !el.disabled && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (modal) {
    $$("[data-close-modal]", modal).forEach((el) => el.addEventListener("click", closeModal));
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-demo]");
    if (!btn) return;
    const p = PROJECTS[Number(btn.dataset.demo)];
    openModal(p.title + " — " + p.badge, p.demo(), (body) => {
      if (p.thumb === "sparkle") wireCleanDemo();
      if (p.thumb === "mail") wireInbox(body);
    });
    trackEvent("portfolio_project_view", { project_title: p.title });
  });

  /* =========================================================
     Interactive Data Workspace (section H)
     Uses localStorage for persistence.
     ========================================================= */
  const STORAGE_KEY = "mjm-demo-customers-v2";
  const PAGE_SIZE = 10;
  const SEED = CUSTOMERS.slice().map((c, i) => ({ ...c, idNum: 1001 + i, created: Date.now() - (7 - i) * 86400000 }));

  const demoState = {
    rows: [],
    nextId: 1009,
    query: "",
    statusFilter: "",
    sortKey: null,
    sortDir: 1,
    editingId: null,
    page: 1,
    selected: new Set(),
    pendingImport: null
  };

  function loadRows() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          demoState.rows = parsed;
          demoState.nextId = Math.max(...parsed.map((r) => Number(r.idNum || 0)), 1008) + 1;
          return;
        }
      }
    } catch (_) {}
    demoState.rows = SEED.map((c) => ({ ...c }));
  }

  function saveRows() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState.rows)); }
    catch (_) {}
    refreshAnalyticsDashboard();
  }

  function showDemoMsg(text, ok) {
    const el = $("#demoMsg");
    el.textContent = text;
    el.className = "demo-msg " + (ok ? "ok" : "err");
    clearTimeout(showDemoMsg._t);
    showDemoMsg._t = setTimeout(() => { el.textContent = ""; el.className = "demo-msg"; }, 6000);
  }

  function visibleRows() {
    let rows = demoState.rows;
    const q = demoState.query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        [r.name, r.email, r.city, r.status, r.id].join(" ").toLowerCase().includes(q));
    }
    if (demoState.statusFilter) {
      rows = rows.filter((r) => r.status === demoState.statusFilter);
    }
    if (demoState.sortKey) {
      const k = demoState.sortKey;
      rows = rows.slice().sort((a, b) =>
        String(a[k]).localeCompare(String(b[k]), undefined, { numeric: true }) * demoState.sortDir);
    }
    return rows;
  }

  function pagedRows() {
    const all = visibleRows();
    const start = (demoState.page - 1) * PAGE_SIZE;
    return { rows: all.slice(start, start + PAGE_SIZE), total: all.length };
  }

  function renderDemoTable() {
    const tbody = $("#demoTbody");
    const { rows, total } = pagedRows();
    const allVisible = visibleRows();

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No records match your search.</td></tr>';
    } else {
      tbody.innerHTML = rows.map((r) => {
        const checked = demoState.selected.has(r.id);
        return "<tr" + (checked ? ' class="selected-row"' : "") + ">" +
          '<td><input type="checkbox" aria-label="Select ' + esc(r.name) + '" data-sel-id="' + esc(r.id) + '"' + (checked ? " checked" : "") + " /></td>" +
          "<td>" + esc(r.id) + "</td>" +
          "<td>" + esc(r.name) + "</td>" +
          '<td class="email">' + esc(r.email) + "</td>" +
          "<td>" + esc(r.city) + "</td>" +
          "<td>" + pill(r.status) + "</td>" +
          '<td class="row-actions">' +
          '<button type="button" data-edit-row="' + esc(r.id) + '">Edit</button>' +
          '<button type="button" class="delete-btn" data-del-row="' + esc(r.id) + '">Delete</button>' +
          "</td></tr>";
      }).join("");
    }

    const selCount = demoState.selected.size;
    const countEl = $("#demoCount");
    let countText = total === demoState.rows.length
      ? "Records: " + demoState.rows.length
      : "Showing " + total + " of " + demoState.rows.length + " records";
    if (selCount) countText += " (" + selCount + " selected)";
    countEl.textContent = countText;

    // Select all checkbox state
    const selectAll = $("#selectAll");
    if (selectAll) {
      const pageIds = rows.map((r) => r.id);
      const allChecked = pageIds.length > 0 && pageIds.every((id) => demoState.selected.has(id));
      const someChecked = pageIds.some((id) => demoState.selected.has(id));
      selectAll.checked = allChecked;
      selectAll.indeterminate = !allChecked && someChecked;
    }

    // Sort indicators
    $$(".sort-btn").forEach((b) => {
      if (b.dataset.sort === demoState.sortKey) {
        b.setAttribute("aria-sort", demoState.sortDir === 1 ? "ascending" : "descending");
      } else {
        b.removeAttribute("aria-sort");
      }
    });

    // Bulk bar
    const bulkBar = $("#bulkBar");
    if (bulkBar) {
      bulkBar.hidden = selCount === 0;
      const bulkCount = $("#bulkCount");
      if (bulkCount) bulkCount.textContent = selCount + " record" + (selCount === 1 ? "" : "s") + " selected";
    }

    renderPagination(total);
  }

  function renderPagination(total) {
    const el = $("#demoPagination");
    if (!el) return;
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) { el.innerHTML = ""; return; }
    let h = "";
    h += '<button class="page-btn" data-page="prev" ' + (demoState.page <= 1 ? "disabled" : "") + ' aria-label="Previous page">&lsaquo;</button>';
    for (let i = 1; i <= pages; i++) {
      h += '<button class="page-btn' + (i === demoState.page ? " current" : "") + '" data-page="' + i + '" aria-label="Page ' + i + '" aria-current="' + (i === demoState.page ? "page" : "false") + '">' + i + '</button>';
    }
    h += '<button class="page-btn" data-page="next" ' + (demoState.page >= pages ? "disabled" : "") + ' aria-label="Next page">&rsaquo;</button>';
    el.innerHTML = h;
    $$(".page-btn", el).forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.page;
        const pages2 = Math.ceil(visibleRows().length / PAGE_SIZE);
        if (v === "prev") demoState.page = Math.max(1, demoState.page - 1);
        else if (v === "next") demoState.page = Math.min(pages2, demoState.page + 1);
        else demoState.page = Number(v);
        renderDemoTable();
      });
    });
  }

  function validateRecord(name, email, city) {
    const errors = {};
    if (!name.trim() || name.trim().length < 2) errors.name = "Enter a full name (2+ characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = "Enter a valid email like name@example.com.";
    if (!city.trim()) errors.city = "City is required.";
    return errors;
  }

  function setFieldError(input, errEl, message) {
    if (message) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      errEl.textContent = message;
    } else {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
      errEl.textContent = "";
    }
  }

  function openDemoForm(prefill) {
    const form = $("#demoForm");
    form.hidden = false;
    $("#fName").value = prefill ? prefill.name : "";
    $("#fEmail").value = prefill ? prefill.email : "";
    $("#fCity").value = prefill ? prefill.city : "";
    $("#fStatus").value = prefill ? prefill.status : "Active";
    $("#formSubmitBtn").textContent = prefill ? "Update Record" : "Save Record";
    demoState.editingId = prefill ? prefill.id : null;
    ["errName", "errEmail", "errCity"].forEach((id) => ($("#" + id).textContent = ""));
    $("#fName").focus();
  }

  function closeDemoForm() {
    $("#demoForm").hidden = true;
    demoState.editingId = null;
  }

  /* ---- CSV utilities ---- */
  function escapeCSVCell(val) {
    const s = String(val == null ? "" : val);
    // Prevent formula injection
    const safe = s.replace(/^[=+\-@\t\r]/, "'$&");
    if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
      return '"' + safe.replace(/"/g, '""') + '"';
    }
    return safe;
  }

  function rowsToCSV(rows) {
    const header = ["ID", "Name", "Email", "City", "Status"];
    const lines = [header.map(escapeCSVCell).join(",")];
    rows.forEach((r) => {
      lines.push([r.id, r.name, r.email, r.city, r.status].map(escapeCSVCell).join(","));
    });
    return lines.join("\r\n");
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }

  function parseCSV(text) {
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter((l) => l.trim());
    const parseRow = (line) => {
      const cols = [];
      let cur = "";
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inQ) {
          if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (c === '"') { inQ = false; }
          else { cur += c; }
        } else {
          if (c === '"') { inQ = true; }
          else if (c === ",") { cols.push(cur); cur = ""; }
          else { cur += c; }
        }
      }
      cols.push(cur);
      return cols;
    };
    return lines.map(parseRow);
  }

  function buildImportPreview(rows, headers) {
    // Validate headers
    const required = ["name", "email", "city", "status"];
    const hdrs = headers.map((h) => h.trim().toLowerCase());
    const missing = required.filter((r) => !hdrs.includes(r));

    if (missing.length) {
      return { valid: false, error: "Missing required columns: " + missing.join(", ") + ". Expected: Name, Email, City, Status." };
    }

    const nameIdx = hdrs.indexOf("name");
    const emailIdx = hdrs.indexOf("email");
    const cityIdx = hdrs.indexOf("city");
    const statusIdx = hdrs.indexOf("status");

    const valid = [];
    const invalid = [];

    rows.forEach((cols, i) => {
      const name = (cols[nameIdx] || "").trim();
      const email = (cols[emailIdx] || "").trim().toLowerCase();
      const city = (cols[cityIdx] || "").trim();
      const statusRaw = (cols[statusIdx] || "").trim();
      const status = ["Active", "Pending", "Inactive"].includes(statusRaw) ? statusRaw : "Pending";

      const errs = validateRecord(name, email, city);
      if (Object.keys(errs).length) {
        invalid.push({ row: i + 2, name, reason: Object.values(errs).join("; ") });
      } else {
        valid.push({ name, email, city, status });
      }
    });

    return { valid: true, validRows: valid, invalidRows: invalid };
  }

  function runDataQuality() {
    const rows = demoState.rows;
    const total = rows.length;
    let missingEmail = 0, missingCity = 0, missingName = 0;
    let invalidEmail = 0;
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    rows.forEach((r) => {
      if (!r.name || r.name.trim().length < 2) missingName++;
      if (!r.email || !emailRE.test(r.email.trim())) invalidEmail++;
      if (!r.city || r.city.trim() === "") missingCity++;
    });

    // Duplicate detection
    const seen = new Map();
    rows.forEach((r) => {
      const key = r.name.trim().toLowerCase() + "|" + r.email.trim().toLowerCase();
      seen.set(key, (seen.get(key) || 0) + 1);
    });
    const duplicates = Array.from(seen.values()).filter((v) => v > 1).reduce((a, b) => a + b - 1, 0);

    // Whitespace issues
    let whitespaceIssues = 0;
    rows.forEach((r) => {
      if (r.name !== r.name.trim() || r.city !== r.city.trim()) whitespaceIssues++;
    });

    const issues = missingName + invalidEmail + missingCity + duplicates + whitespaceIssues;
    const quality = total > 0 ? Math.round(((total - Math.min(issues, total)) / total) * 100) : 100;

    return { total, missingName, invalidEmail, missingCity, duplicates, whitespaceIssues, quality, issues };
  }

  function autoCleanData() {
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const validStatuses = ["Active", "Pending", "Inactive"];
    const seen = new Map();
    const cleaned = [];

    demoState.rows.forEach((r) => {
      const name = titleCase(r.name.replace(/\s+/g, " ").trim());
      const email = r.email.trim().toLowerCase();
      const city = titleCase(r.city.replace(/\s+/g, " ").trim());
      const status = validStatuses.includes(r.status) ? r.status : "Pending";

      const key = name.toLowerCase() + "|" + email;
      if (!seen.has(key)) {
        seen.set(key, true);
        cleaned.push({ ...r, name, email, city, status });
      }
    });

    const before = demoState.rows.length;
    demoState.rows = cleaned;
    demoState.nextId = Math.max(...cleaned.map((r) => Number(r.idNum || 0)), 1008) + 1;
    saveRows();
    renderDemoTable();
    return { before, after: cleaned.length, removed: before - cleaned.length };
  }

  function wireDemo() {
    loadRows();
    renderDemoTable();

    // Search
    const searchEl = $("#demoSearch");
    if (searchEl) {
      searchEl.addEventListener("input", (e) => {
        demoState.query = e.target.value;
        demoState.page = 1;
        renderDemoTable();
      });
    }

    // Status filter
    const filterEl = $("#demoFilter");
    if (filterEl) {
      filterEl.addEventListener("change", (e) => {
        demoState.statusFilter = e.target.value;
        demoState.page = 1;
        renderDemoTable();
      });
    }

    // Sort buttons
    $$(".sort-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const key = btn.dataset.sort;
        if (demoState.sortKey === key) demoState.sortDir *= -1;
        else { demoState.sortKey = key; demoState.sortDir = 1; }
        renderDemoTable();
      })
    );

    // Add record
    const addBtn = $("#demoAddBtn");
    if (addBtn) addBtn.addEventListener("click", () => openDemoForm(null));

    const cancelBtn = $("#formCancelBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", closeDemoForm);

    // Form submit
    const form = $("#recordForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("#fName").value;
        const email = $("#fEmail").value;
        const city = $("#fCity").value;
        const status = $("#fStatus").value;
        const errors = validateRecord(name, email, city);
        setFieldError($("#fName"), $("#errName"), errors.name);
        setFieldError($("#fEmail"), $("#errEmail"), errors.email);
        setFieldError($("#fCity"), $("#errCity"), errors.city);
        if (Object.keys(errors).length) {
          showDemoMsg("Please fix the highlighted fields.", false);
          return;
        }
        const cleanName = name.trim().replace(/\s+/g, " ");
        // Duplicate check
        const isDup = demoState.rows.some((r) =>
          r.id !== demoState.editingId &&
          r.name.trim().toLowerCase() === cleanName.trim().toLowerCase() &&
          r.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        if (isDup) {
          if (!window.confirm("A record with this name and email already exists. Save anyway?")) return;
        }
        if (demoState.editingId) {
          const row = demoState.rows.find((r) => r.id === demoState.editingId);
          if (row) Object.assign(row, { name: cleanName, email: email.trim().toLowerCase(), city: city.trim(), status });
          showDemoMsg("Record " + (row ? row.id : "") + " updated.", true);
        } else {
          const idNum = demoState.nextId++;
          demoState.rows.push({
            id: "C-" + idNum, idNum, name: cleanName,
            email: email.trim().toLowerCase(), city: city.trim(), status,
            created: Date.now()
          });
          showDemoMsg("New record added (C-" + idNum + ").", true);
        }
        saveRows();
        renderDemoTable();
        closeDemoForm();
      });
    }

    // Row actions (edit / delete)
    const tbody = $("#demoTbody");
    if (tbody) {
      tbody.addEventListener("click", (e) => {
        const edit = e.target.closest("[data-edit-row]");
        const del  = e.target.closest("[data-del-row]");
        const selCb = e.target.closest("[data-sel-id]");

        if (selCb) {
          const id = selCb.dataset.selId;
          if (selCb.checked) demoState.selected.add(id);
          else demoState.selected.delete(id);
          renderDemoTable();
        } else if (edit) {
          const row = demoState.rows.find((r) => r.id === edit.dataset.editRow);
          if (row) openDemoForm(row);
        } else if (del) {
          const id = del.dataset.delRow;
          const row = demoState.rows.find((r) => r.id === id);
          if (row && window.confirm("Delete record " + id + " (" + row.name + ")?")) {
            demoState.rows = demoState.rows.filter((r) => r.id !== id);
            demoState.selected.delete(id);
            saveRows();
            renderDemoTable();
            showDemoMsg("Record " + id + " deleted.", true);
            if (demoState.editingId === id) closeDemoForm();
          }
        }
      });
    }

    // Select all
    const selectAll = $("#selectAll");
    if (selectAll) {
      selectAll.addEventListener("change", () => {
        const { rows } = pagedRows();
        rows.forEach((r) => {
          if (selectAll.checked) demoState.selected.add(r.id);
          else demoState.selected.delete(r.id);
        });
        renderDemoTable();
      });
    }

    // Bulk delete
    const bulkDeleteBtn = $("#bulkDeleteBtn");
    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener("click", () => {
        const count = demoState.selected.size;
        if (!count) return;
        if (!window.confirm("Delete " + count + " selected record" + (count === 1 ? "" : "s") + "? This cannot be undone.")) return;
        demoState.rows = demoState.rows.filter((r) => !demoState.selected.has(r.id));
        demoState.selected.clear();
        saveRows();
        renderDemoTable();
        showDemoMsg(count + " records deleted.", true);
      });
    }

    // Bulk deselect
    const bulkDeselectBtn = $("#bulkDeselectBtn");
    if (bulkDeselectBtn) {
      bulkDeselectBtn.addEventListener("click", () => {
        demoState.selected.clear();
        renderDemoTable();
      });
    }

    // Actions menu toggle
    const menuBtn = $("#demoMenuBtn");
    const menu = $("#demoMenu");
    if (menuBtn && menu) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = menu.hidden;
        menu.hidden = !open;
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", () => {
        menu.hidden = true;
        menuBtn.setAttribute("aria-expanded", "false");
      });
      menu.addEventListener("click", (e) => e.stopPropagation());
    }

    function closeMenu() {
      if (menu) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
    }

    // Export all
    const exportBtn = $("#demoExportBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        downloadCSV(rowsToCSV(demoState.rows), "demo-records.csv");
        showDemoMsg("Exported " + demoState.rows.length + " records to CSV.", true);
        closeMenu();
        trackEvent("csv_export", { type: "all", count: demoState.rows.length });
      });
    }

    // Export filtered
    const exportFilteredBtn = $("#demoExportFilteredBtn");
    if (exportFilteredBtn) {
      exportFilteredBtn.addEventListener("click", () => {
        const rows = visibleRows();
        downloadCSV(rowsToCSV(rows), "demo-records-filtered.csv");
        showDemoMsg("Exported " + rows.length + " filtered records to CSV.", true);
        closeMenu();
        trackEvent("csv_export", { type: "filtered", count: rows.length });
      });
    }

    // Export before reset shortcut
    const exportBeforeReset = $("#demoExportBeforeReset");
    if (exportBeforeReset) {
      exportBeforeReset.addEventListener("click", () => {
        downloadCSV(rowsToCSV(demoState.rows), "demo-records-backup.csv");
        showDemoMsg("Exported " + demoState.rows.length + " records.", true);
      });
    }

    // Download template
    const templateBtn = $("#demoTemplateBtn");
    if (templateBtn) {
      templateBtn.addEventListener("click", () => {
        const csv = "Name,Email,City,Status\nJohn Smith,john.smith@example.com,New York,Active\nJane Doe,jane.doe@example.com,Los Angeles,Pending";
        downloadCSV(csv, "data-entry-template.csv");
        closeMenu();
        trackEvent("csv_template_download");
      });
    }

    // Import CSV
    const importBtn = $("#demoImportBtn");
    const csvFileInput = $("#csvFileInput");
    if (importBtn && csvFileInput) {
      importBtn.addEventListener("click", () => {
        csvFileInput.click();
        closeMenu();
      });
      csvFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        csvFileInput.value = "";
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target.result;
          const allRows = parseCSV(text);
          if (allRows.length < 2) {
            showDemoMsg("CSV file is empty or has no data rows.", false);
            return;
          }
          const [headers, ...dataRows] = allRows;
          const result = buildImportPreview(dataRows, headers);
          if (!result.valid) {
            showDemoMsg(result.error, false);
            return;
          }
          demoState.pendingImport = result;
          renderImportPreview(result);
        };
        reader.readAsText(file, "UTF-8");
      });
    }

    function renderImportPreview(result) {
      const panel = $("#importPreview");
      if (!panel) return;
      panel.hidden = false;
      const summary = result.validRows.length + " valid rows ready to import" +
        (result.invalidRows.length ? ", " + result.invalidRows.length + " rows skipped (invalid)" : "") + ".";
      $("#importSummary").textContent = summary;
      const thead = $("#importThead");
      thead.innerHTML = "<tr><th>Name</th><th>Email</th><th>City</th><th>Status</th></tr>";
      const tbody = $("#importTbody");
      const preview = result.validRows.slice(0, 8);
      tbody.innerHTML = preview.map((r) =>
        "<tr><td>" + esc(r.name) + "</td><td class='email'>" + esc(r.email) + "</td><td>" + esc(r.city) + "</td><td>" + pill(r.status) + "</td></tr>"
      ).join("");
      if (result.validRows.length > 8) {
        tbody.innerHTML += '<tr><td colspan="4" class="empty-row">…and ' + (result.validRows.length - 8) + ' more rows</td></tr>';
      }
    }

    const importConfirmBtn = $("#importConfirmBtn");
    if (importConfirmBtn) {
      importConfirmBtn.addEventListener("click", () => {
        if (!demoState.pendingImport || !demoState.pendingImport.validRows.length) return;
        const newRows = demoState.pendingImport.validRows.map((r) => {
          const idNum = demoState.nextId++;
          return { ...r, id: "C-" + idNum, idNum, created: Date.now() };
        });
        demoState.rows = [...demoState.rows, ...newRows];
        saveRows();
        renderDemoTable();
        $("#importPreview").hidden = true;
        demoState.pendingImport = null;
        showDemoMsg("Imported " + newRows.length + " records successfully.", true);
        trackEvent("csv_import", { count: newRows.length });
      });
    }

    const importCancelBtn = $("#importCancelBtn");
    if (importCancelBtn) {
      importCancelBtn.addEventListener("click", () => {
        $("#importPreview").hidden = true;
        demoState.pendingImport = null;
      });
    }

    // Data quality check
    const qualityBtn = $("#demoQualityBtn");
    if (qualityBtn) {
      qualityBtn.addEventListener("click", () => {
        const q = runDataQuality();
        renderQualityPanel(q);
        $("#qualityPanel").hidden = false;
        closeMenu();
      });
    }

    // Auto-clean
    const cleanBtn = $("#demoCleanBtn");
    if (cleanBtn) {
      cleanBtn.addEventListener("click", () => {
        if (!window.confirm("Auto-clean will: trim whitespace, fix capitalization, remove exact duplicates, and normalize statuses. Continue?")) return;
        const result = autoCleanData();
        showDemoMsg("Cleaned: " + result.removed + " duplicates removed. " + result.after + " records remain.", true);
        refreshAnalyticsDashboard();
        closeMenu();
      });
    }

    const qualityCleanBtn = $("#qualityCleanBtn");
    if (qualityCleanBtn) {
      qualityCleanBtn.addEventListener("click", () => {
        if (!window.confirm("Apply auto-clean to all records? Duplicates will be removed, whitespace trimmed, capitalization normalized.")) return;
        const result = autoCleanData();
        showDemoMsg("Cleaned: " + result.removed + " duplicates removed.", true);
        $("#qualityPanel").hidden = true;
        refreshAnalyticsDashboard();
      });
    }

    const qualityCloseBtn = $("#qualityCloseBtn");
    if (qualityCloseBtn) {
      qualityCloseBtn.addEventListener("click", () => { $("#qualityPanel").hidden = true; });
    }

    // Reset
    const resetBtn = $("#demoResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (!window.confirm("Reset all records back to the original demo data? Your changes will be lost.\n\nTip: Export first to keep your data.")) return;
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        demoState.rows = SEED.map((c) => ({ ...c }));
        demoState.nextId = 1009;
        demoState.query = "";
        demoState.statusFilter = "";
        demoState.sortKey = null;
        demoState.selected.clear();
        demoState.page = 1;
        const searchEl2 = $("#demoSearch");
        if (searchEl2) searchEl2.value = "";
        const filterEl2 = $("#demoFilter");
        if (filterEl2) filterEl2.value = "";
        closeDemoForm();
        $("#importPreview").hidden = true;
        $("#qualityPanel").hidden = true;
        renderDemoTable();
        showDemoMsg("Demo reset to the original sample records.", true);
        refreshAnalyticsDashboard();
        closeMenu();
      });
    }
  }

  function renderQualityPanel(q) {
    const el = $("#qualityMetrics");
    if (!el) return;
    const items = [
      { label: "Total Records", value: q.total, cls: "kpi-blue" },
      { label: "Quality Score", value: q.quality + "%", cls: q.quality >= 90 ? "q-good" : q.quality >= 70 ? "q-warn" : "q-bad" },
      { label: "Missing Name", value: q.missingName, cls: q.missingName === 0 ? "q-good" : "q-bad" },
      { label: "Invalid Email", value: q.invalidEmail, cls: q.invalidEmail === 0 ? "q-good" : "q-bad" },
      { label: "Missing City", value: q.missingCity, cls: q.missingCity === 0 ? "q-good" : "q-bad" },
      { label: "Duplicates", value: q.duplicates, cls: q.duplicates === 0 ? "q-good" : "q-warn" },
      { label: "Whitespace Issues", value: q.whitespaceIssues, cls: q.whitespaceIssues === 0 ? "q-good" : "q-warn" }
    ];
    el.innerHTML = items.map((m) =>
      '<div class="quality-metric ' + m.cls + '">' +
      '<div class="q-label">' + esc(m.label) + "</div>" +
      '<div class="q-value">' + esc(String(m.value)) + "</div>" +
      "</div>"
    ).join("");
  }

  /* =========================================================
     Analytics Dashboard
     Derives values from the live demoState.rows dataset.
     ========================================================= */
  let charts = {};

  function computeAnalytics() {
    const rows = demoState.rows;
    const q = runDataQuality();
    const byCat = {};
    rows.forEach((r) => {
      byCat[r.status] = (byCat[r.status] || 0) + 1;
    });
    return { rows, q, byCat };
  }

  function refreshAnalyticsDashboard() {
    const kpisEl = $("#analyticsKpis");
    if (!kpisEl) return;
    const { rows, q, byCat } = computeAnalytics();

    // KPI cards
    const active = (byCat["Active"] || 0);
    const pending = (byCat["Pending"] || 0);
    const inactive = (byCat["Inactive"] || 0);
    kpisEl.innerHTML = [
      { label: "Total Records", value: q.total, cls: "" },
      { label: "Quality Score", value: q.quality + "%", cls: q.quality >= 90 ? "kpi-green" : q.quality >= 70 ? "kpi-amber" : "kpi-red" },
      { label: "Active", value: active, cls: "kpi-green" },
      { label: "Pending", value: pending, cls: "kpi-amber" },
      { label: "Inactive", value: inactive, cls: "kpi-red" },
      { label: "Data Issues", value: q.issues, cls: q.issues === 0 ? "kpi-green" : "kpi-amber" }
    ].map((k) =>
      '<div class="kpi-card"><div class="kpi-value ' + k.cls + '">' + esc(String(k.value)) + '</div><div class="kpi-label">' + esc(k.label) + "</div></div>"
    ).join("");

    // Status chart
    renderStatusChart(byCat);

    // Quality chart
    renderQualityChart(q);
  }

  function renderStatusChart(byCat) {
    const canvas = $("#chartStatus");
    if (!canvas) return;
    if (typeof Chart === "undefined") {
      canvas.insertAdjacentHTML("afterend", '<p class="chart-desc" style="color:var(--muted);font-size:0.8rem;">Chart.js not loaded — charts unavailable.</p>');
      return;
    }
    const labels = Object.keys(byCat);
    const data = labels.map((l) => byCat[l]);
    const colors = { Active: "#16865B", Pending: "#c4a020", Inactive: "#b34740" };
    const bg = labels.map((l) => colors[l] || "#8ba094");

    if (charts.status) { charts.status.destroy(); }
    charts.status = new Chart(canvas, {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: bg, borderWidth: 2, borderColor: getComputedStyle(document.documentElement).getPropertyValue("--white") || "#fff" }] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => " " + ctx.label + ": " + ctx.raw + " records" } }
        }
      }
    });

    const legendEl = $("#statusLegend");
    if (legendEl) {
      legendEl.innerHTML = labels.map((l, i) =>
        '<span style="display:inline-flex;align-items:center;gap:4px;margin-right:8px;font-size:0.75rem;">' +
        '<span style="width:10px;height:10px;border-radius:50%;background:' + bg[i] + ';display:inline-block;"></span>' +
        esc(l) + ": " + data[i] + "</span>"
      ).join("");
    }
  }

  function renderQualityChart(q) {
    const canvas = $("#chartQuality");
    if (!canvas) return;
    if (typeof Chart === "undefined") return;

    const labels = ["Valid Records", "Missing Name", "Invalid Email", "Missing City", "Duplicates"];
    const data = [
      q.total - q.issues,
      q.missingName,
      q.invalidEmail,
      q.missingCity,
      q.duplicates
    ];
    const colors = ["#16865B", "#b34740", "#e07b39", "#c4a020", "#8b4d9e"];

    if (charts.quality) { charts.quality.destroy(); }
    charts.quality = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Count",
          data,
          backgroundColor: colors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => " " + ctx.label + ": " + ctx.raw } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "rgba(0,0,0,0.06)" } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });

    const descEl = $("#qualityDesc");
    if (descEl) {
      descEl.textContent = q.issues === 0
        ? "All " + q.total + " records pass quality checks."
        : q.issues + " issue" + (q.issues === 1 ? "" : "s") + " found across " + q.total + " records. Quality score: " + q.quality + "%.";
    }
  }

  /* =========================================================
     Task Manager
     ========================================================= */
  const TASK_KEY = "mjm-tasks-v1";
  const TASK_SEED = [
    { id: "T-001", title: "Compile contact list for email campaign", priority: "High", dueDate: "2026-10-22", status: "In Progress", notes: "Use company website + LinkedIn", created: Date.now() - 86400000 * 3 },
    { id: "T-002", title: "Clean and format Q3 sales spreadsheet", priority: "High", dueDate: "2026-10-21", status: "Completed", notes: "Remove duplicates, fix headers", created: Date.now() - 86400000 * 5 },
    { id: "T-003", title: "Research competitor pricing pages", priority: "Medium", dueDate: "2026-10-24", status: "To Do", notes: "", created: Date.now() - 86400000 * 2 },
    { id: "T-004", title: "Organize shared Google Drive folder", priority: "Low", dueDate: "2026-10-28", status: "To Do", notes: "Rename files with consistent naming", created: Date.now() - 86400000 },
    { id: "T-005", title: "Prepare weekly status report template", priority: "Medium", dueDate: "2026-10-20", status: "To Do", notes: "Include KPIs from last week", created: Date.now() - 86400000 * 4 },
    { id: "T-006", title: "Convert invoice PDFs to spreadsheet", priority: "High", dueDate: "2026-10-19", status: "Completed", notes: "15 invoices from October", created: Date.now() - 86400000 * 6 }
  ];

  const taskState = {
    tasks: [],
    nextId: 7,
    searchQ: "",
    filterStatus: "",
    filterPriority: "",
    sortKey: "dueDate",
    editingId: null
  };

  function loadTasks() {
    try {
      const raw = localStorage.getItem(TASK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          taskState.tasks = parsed;
          taskState.nextId = Math.max(...parsed.map((t) => parseInt(t.id.replace("T-", "")) || 0), 6) + 1;
          return;
        }
      }
    } catch (_) {}
    taskState.tasks = TASK_SEED.map((t) => ({ ...t }));
  }

  function saveTasks() {
    try { localStorage.setItem(TASK_KEY, JSON.stringify(taskState.tasks)); }
    catch (_) {}
  }

  function showTaskMsg(text, ok) {
    const el = $("#taskMsg");
    if (!el) return;
    el.textContent = text;
    el.className = "demo-msg " + (ok ? "ok" : "err");
    clearTimeout(showTaskMsg._t);
    showTaskMsg._t = setTimeout(() => { el.textContent = ""; el.className = "demo-msg"; }, 5000);
  }

  function isOverdue(task) {
    if (!task.dueDate || task.status === "Completed") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate + "T00:00:00");
    return due < today;
  }

  function effectiveStatus(task) {
    return isOverdue(task) ? "Overdue" : task.status;
  }

  function filteredTasks() {
    let tasks = taskState.tasks.map((t) => ({ ...t, _status: effectiveStatus(t) }));

    const q = taskState.searchQ.trim().toLowerCase();
    if (q) tasks = tasks.filter((t) => (t.title + " " + t.notes).toLowerCase().includes(q));

    if (taskState.filterStatus) tasks = tasks.filter((t) => t._status === taskState.filterStatus);
    if (taskState.filterPriority) tasks = tasks.filter((t) => t.priority === taskState.filterPriority);

    tasks.sort((a, b) => {
      if (taskState.sortKey === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (taskState.sortKey === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
      }
      if (taskState.sortKey === "status") {
        const order = { Overdue: 0, "In Progress": 1, "To Do": 2, Completed: 3 };
        return (order[a._status] ?? 4) - (order[b._status] ?? 4);
      }
      if (taskState.sortKey === "created") return (b.created || 0) - (a.created || 0);
      return 0;
    });

    return tasks;
  }

  function renderTaskStats() {
    const el = $("#taskStats");
    if (!el) return;
    const all = taskState.tasks.map((t) => ({ ...t, _status: effectiveStatus(t) }));
    const counts = { "To Do": 0, "In Progress": 0, Completed: 0, Overdue: 0 };
    all.forEach((t) => { counts[t._status] = (counts[t._status] || 0) + 1; });
    el.innerHTML =
      '<span class="task-stat-pill tstat-todo">To Do: ' + (counts["To Do"] || 0) + "</span>" +
      '<span class="task-stat-pill tstat-inprog">In Progress: ' + (counts["In Progress"] || 0) + "</span>" +
      '<span class="task-stat-pill tstat-done">Completed: ' + (counts["Completed"] || 0) + "</span>" +
      '<span class="task-stat-pill tstat-overdue">Overdue: ' + (counts["Overdue"] || 0) + "</span>";
  }

  function renderTaskList() {
    const el = $("#taskList");
    if (!el) return;
    const tasks = filteredTasks();
    renderTaskStats();

    if (!tasks.length) {
      el.innerHTML = '<div class="task-empty">No tasks match your filter. <button type="button" class="btn-text" id="clearTaskFilters">Clear filters</button></div>';
      const clearBtn = $("#clearTaskFilters");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          taskState.searchQ = "";
          taskState.filterStatus = "";
          taskState.filterPriority = "";
          const sEl = $("#taskSearch"); if (sEl) sEl.value = "";
          const fsEl = $("#taskFilterStatus"); if (fsEl) fsEl.value = "";
          const fpEl = $("#taskFilterPriority"); if (fpEl) fpEl.value = "";
          renderTaskList();
        });
      }
      return;
    }

    const prioClass = { High: "priority-high", Medium: "priority-medium", Low: "priority-low" };
    const statusClass = { "To Do": "tstatus-todo", "In Progress": "tstatus-inprog", Completed: "tstatus-done", Overdue: "tstatus-overdue" };

    el.innerHTML = tasks.map((t) => {
      const isDone = t.status === "Completed";
      const isOvd = t._status === "Overdue";
      const dispStatus = t._status;
      let dueTxt = "";
      if (t.dueDate) {
        const d = new Date(t.dueDate + "T00:00:00");
        dueTxt = "Due: " + d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        if (isOvd) dueTxt += " ⚠ Overdue";
      }
      return '<div class="task-card' + (isDone ? " done-task" : "") + (isOvd ? " overdue-task" : "") + '" data-task-id="' + esc(t.id) + '">' +
        '<div class="task-left">' +
        '<p class="task-title">' + esc(t.title) + "</p>" +
        '<div class="task-meta">' +
        '<span class="priority-badge ' + (prioClass[t.priority] || "") + '">' + esc(t.priority) + "</span>" +
        '<span class="task-status-badge ' + (statusClass[dispStatus] || "") + '">' + esc(dispStatus) + "</span>" +
        (dueTxt ? '<span>' + esc(dueTxt) + "</span>" : "") +
        "</div>" +
        (t.notes ? '<p class="task-notes">' + esc(t.notes) + "</p>" : "") +
        "</div>" +
        '<div class="task-right">' +
        (isDone
          ? '<button type="button" class="task-undone" data-task-id="' + esc(t.id) + '">↩ Undo</button>'
          : '<button type="button" class="task-done" data-task-id="' + esc(t.id) + '">✓ Done</button>') +
        '<button type="button" class="task-edit" data-task-id="' + esc(t.id) + '">Edit</button>' +
        '<button type="button" class="task-delete" data-task-id="' + esc(t.id) + '">Delete</button>' +
        "</div>" +
        "</div>";
    }).join("");
  }

  function openTaskForm(prefill) {
    const wrap = $("#taskFormWrap");
    if (!wrap) return;
    wrap.hidden = false;
    $("#tTitle").value = prefill ? prefill.title : "";
    $("#tPriority").value = prefill ? prefill.priority : "Medium";
    $("#tDue").value = prefill ? (prefill.dueDate || "") : "";
    $("#tStatus").value = prefill ? (["To Do", "In Progress", "Completed"].includes(prefill.status) ? prefill.status : "To Do") : "To Do";
    $("#tNotes").value = prefill ? (prefill.notes || "") : "";
    $("#taskSubmitBtn").textContent = prefill ? "Update Task" : "Save Task";
    taskState.editingId = prefill ? prefill.id : null;
    const errEl = $("#errTTitle"); if (errEl) errEl.textContent = "";
    $("#tTitle").focus();
  }

  function closeTaskForm() {
    const wrap = $("#taskFormWrap");
    if (wrap) wrap.hidden = true;
    taskState.editingId = null;
  }

  function wireTaskManager() {
    loadTasks();
    renderTaskList();

    const searchEl = $("#taskSearch");
    if (searchEl) {
      searchEl.addEventListener("input", (e) => { taskState.searchQ = e.target.value; renderTaskList(); });
    }

    const filterStatus = $("#taskFilterStatus");
    if (filterStatus) {
      filterStatus.addEventListener("change", (e) => { taskState.filterStatus = e.target.value; renderTaskList(); });
    }

    const filterPriority = $("#taskFilterPriority");
    if (filterPriority) {
      filterPriority.addEventListener("change", (e) => { taskState.filterPriority = e.target.value; renderTaskList(); });
    }

    const sortSelect = $("#taskSort");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => { taskState.sortKey = e.target.value; renderTaskList(); });
    }

    const addTaskBtn = $("#addTaskBtn");
    if (addTaskBtn) addTaskBtn.addEventListener("click", () => openTaskForm(null));

    const taskCancelBtn = $("#taskCancelBtn");
    if (taskCancelBtn) taskCancelBtn.addEventListener("click", closeTaskForm);

    const taskForm = $("#taskForm");
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $("#tTitle").value.trim();
        const errEl = $("#errTTitle");
        if (!title || title.length < 2) {
          if (errEl) errEl.textContent = "Enter a task title (2+ characters).";
          $("#tTitle").classList.add("invalid");
          return;
        }
        if (errEl) errEl.textContent = "";
        $("#tTitle").classList.remove("invalid");

        const task = {
          title,
          priority: $("#tPriority").value,
          dueDate: $("#tDue").value || "",
          status: $("#tStatus").value,
          notes: $("#tNotes").value.trim()
        };

        if (taskState.editingId) {
          const idx = taskState.tasks.findIndex((t) => t.id === taskState.editingId);
          if (idx >= 0) taskState.tasks[idx] = { ...taskState.tasks[idx], ...task };
          showTaskMsg("Task updated.", true);
        } else {
          const newId = "T-" + String(taskState.nextId++).padStart(3, "0");
          taskState.tasks.push({ id: newId, ...task, created: Date.now() });
          showTaskMsg("Task added.", true);
        }

        saveTasks();
        renderTaskList();
        closeTaskForm();
      });
    }

    const taskList = $("#taskList");
    if (taskList) {
      taskList.addEventListener("click", (e) => {
        const doneBtn = e.target.closest(".task-done");
        const undoneBtn = e.target.closest(".task-undone");
        const editBtn = e.target.closest(".task-edit");
        const deleteBtn = e.target.closest(".task-delete");

        if (doneBtn) {
          const id = doneBtn.dataset.taskId;
          const task = taskState.tasks.find((t) => t.id === id);
          if (task) { task.status = "Completed"; saveTasks(); renderTaskList(); }
        } else if (undoneBtn) {
          const id = undoneBtn.dataset.taskId;
          const task = taskState.tasks.find((t) => t.id === id);
          if (task) { task.status = "To Do"; saveTasks(); renderTaskList(); }
        } else if (editBtn) {
          const id = editBtn.dataset.taskId;
          const task = taskState.tasks.find((t) => t.id === id);
          if (task) openTaskForm(task);
        } else if (deleteBtn) {
          const id = deleteBtn.dataset.taskId;
          const task = taskState.tasks.find((t) => t.id === id);
          if (task && window.confirm("Delete task: \"" + task.title + "\"?")) {
            taskState.tasks = taskState.tasks.filter((t) => t.id !== id);
            saveTasks();
            renderTaskList();
            showTaskMsg("Task deleted.", true);
            if (taskState.editingId === id) closeTaskForm();
          }
        }
      });
    }

    // Export tasks
    const exportTasksBtn = $("#exportTasksBtn");
    if (exportTasksBtn) {
      exportTasksBtn.addEventListener("click", () => {
        const header = ["ID", "Title", "Priority", "Due Date", "Status", "Notes"];
        const lines = [header.join(",")];
        taskState.tasks.forEach((t) => {
          lines.push([t.id, t.title, t.priority, t.dueDate || "", t.status, t.notes || ""].map(escapeCSVCell).join(","));
        });
        downloadCSV(lines.join("\r\n"), "tasks-export.csv");
        showTaskMsg("Exported " + taskState.tasks.length + " tasks to CSV.", true);
        trackEvent("task_export", { count: taskState.tasks.length });
      });
    }

    // Reset tasks
    const resetTasksBtn = $("#resetTasksBtn");
    if (resetTasksBtn) {
      resetTasksBtn.addEventListener("click", () => {
        if (!window.confirm("Reset all tasks back to the sample data?")) return;
        try { localStorage.removeItem(TASK_KEY); } catch (_) {}
        taskState.tasks = TASK_SEED.map((t) => ({ ...t }));
        taskState.nextId = 7;
        taskState.searchQ = "";
        taskState.filterStatus = "";
        taskState.filterPriority = "";
        const sEl = $("#taskSearch"); if (sEl) sEl.value = "";
        const fsEl = $("#taskFilterStatus"); if (fsEl) fsEl.value = "";
        const fpEl = $("#taskFilterPriority"); if (fpEl) fpEl.value = "";
        closeTaskForm();
        renderTaskList();
        showTaskMsg("Tasks reset to demo data.", true);
      });
    }
  }

  /* ---------- Contact form ---------- */
  function wireContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const fields = [
      { input: $("#cName"), err: $("#cErrName"), test: (v) => v.trim().length >= 2, msg: "Please enter your name." },
      { input: $("#cEmail"), err: $("#cErrEmail"), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: "Please enter a valid email address." },
      { input: $("#cSubject"), err: $("#cErrSubject"), test: (v) => v.trim().length >= 3, msg: "Please add a short subject." },
      { input: $("#cMessage"), err: $("#cErrMessage"), test: (v) => v.trim().length >= 10, msg: "Message should be at least 10 characters." }
    ];
    fields.forEach((f) => {
      f.input.addEventListener("input", () => setFieldError(f.input, f.err, ""));
      f.input.addEventListener("blur", () => {
        if (!f.test(f.input.value)) setFieldError(f.input, f.err, f.msg);
      });
    });
    form.addEventListener("submit", (e) => {
      let firstBad = null;
      fields.forEach((f) => {
        const bad = !f.test(f.input.value);
        setFieldError(f.input, f.err, bad ? f.msg : "");
        if (bad && !firstBad) firstBad = f.input;
      });
      if (firstBad) { e.preventDefault(); firstBad.focus(); }
      // Formspree handles submission after validation passes
    });

    // Track résumé download
    const resumeLinks = $$("a[href*='Resume'], a[href*='resume']");
    resumeLinks.forEach((a) => {
      a.addEventListener("click", () => trackEvent("resume_download_click", { location: a.id || "link" }));
    });

    // Track contact button clicks
    const contactLinks = $$("a[href='#contact'], a[href='mailto:']");
    contactLinks.forEach((a) => {
      a.addEventListener("click", () => trackEvent("contact_click"));
    });
  }

  /* ---------- Navigation ---------- */
  function wireNav() {
    const toggle = $("#navToggle");
    const menu = $("#navMenu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      menu.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("open")) {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    }

    const header = $("#siteHeader");
    const onScrollHeader = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();

    const sections = $$("main section[id]");
    const linkFor = (id) => $('.nav-menu a[href="#' + id + '"]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$(".nav-link").forEach((l) => l.classList.remove("active-link"));
          const link = linkFor(entry.target.id);
          if (link) link.classList.add("active-link");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  function wireReveal() {
    const els = $$(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Analytics dashboard lazy init when section scrolls into view ---------- */
  function wireAnalyticsInit() {
    const section = $("#analytics");
    if (!section) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          refreshAnalyticsDashboard();
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    io.observe(section);
  }

  /* ---------- Back to top + year ---------- */
  function wireMisc() {
    const btn = $("#backToTop");
    window.addEventListener("scroll", () => { btn.hidden = window.scrollY < 500; }, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    const yr = $("#year");
    if (yr) yr.textContent = String(new Date().getFullYear());
  }

  /* ---------- init ---------- */
  function init() {
    wireTheme();
    applyProfile();
    renderSkills();
    renderTools();
    renderServices();
    renderPortfolio();
    wirePortfolioFilters();
    renderShowcase();
    wireDemo();
    wireTaskManager();
    wireAnalyticsInit();
    wireContactForm();
    wireNav();
    wireReveal();
    wireMisc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
