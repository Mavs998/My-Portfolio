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
  }

  /* ---------- Skills (from résumé — no fabricated scores) ---------- */
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
    
    grid.innerHTML = TOOLS.map(
      (t) => {
        const logoFile = TOOL_LOGOS[t.label];
        const logoImg = logoFile 
          ? '<img src="assets/images/' + esc(logoFile) + '" alt="' + esc(t.label) + ' logo" loading="lazy" />'
          : '<span aria-hidden="true" style="font-size:1.2rem;font-weight:800;">' + esc(t.short) + '</span>';
        return '<li class="tool-item reveal">' +
          '<span class="tool-logo" aria-hidden="true">' + logoImg + '</span>' +
          esc(t.label) + '</li>';
      }
    ).join("");
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
        "<h3>" + esc(s.name) + "</h3><p>" + esc(s.desc) + "</p></article>"
    ).join("");
  }

  /* ---------- Fictional sample data (demonstration only) ---------- */
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
    cols.forEach((c) => (h += "<th scope=\"col\">" + esc(c) + "</th>"));
    h += "</tr></thead><tbody>";
    rows.forEach((r) => {
      h += "<tr>";
      r.forEach((cell, i) => (h += "<td" + (typeof cell === "string" && cell.startsWith("<span") ? "" : "") + ">" + cell + "</td>"));
      h += "</tr>";
    });
    h += "</tbody>";
    if (caption) h += "<caption>" + caption + "</caption>";
    return h + "</table></div>";
  }

  /* ---------- Project gallery ---------- */
  const PROJECTS = [
    {
      title: "Customer Data Entry",
      badge: "Sample Project",
      desc: "Structured customer records with name, email, location, and status in a clean, organized spreadsheet.",
      thumb: "sheet",
      demo: () =>
        tableHTML(["Customer ID", "Name", "Email", "City", "Status"],
          CUSTOMERS.map((c) => [c.id, c.name, '<span class="email">' + esc(c.email) + "</span>", c.city, pill(c.status)]),
          "Fictional demonstration data — not real customer records.")
    },
    {
      title: "Data Cleaning & Validation",
      badge: "Demonstration",
      desc: "Before-and-after cleanup: messy spacing, capitalization, duplicates, and missing values corrected live.",
      thumb: "sparkle",
      demo: () => cleanDemoHTML()
    },
    {
      title: "Business Research Database",
      badge: "Practice Project",
      desc: "Compiled business research with categories, websites, and contact status for outreach campaigns.",
      thumb: "globe",
      demo: () =>
        tableHTML(["Business Name", "Category", "Website", "Contact Status"],
          RESEARCH.map((r) => [esc(r.biz), esc(r.cat), '<span class="email">' + esc(r.site) + "</span>", pill(r.status)]),
          "All businesses are fictional demonstration data.")
    },
    {
      title: "PDF-to-Spreadsheet Workflow",
      badge: "Demonstration",
      desc: "Visual walkthrough showing how invoice, report, or form PDFs can be converted to organized spreadsheets.",
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
          "Values above are fictional, transcribed as a practice exercise.") +
        '<p class="note">This demonstrates the workflow. The site does not convert real PDFs in your browser.</p>'
    },
    {
      title: "Email Organization System",
      badge: "Practice Project",
      desc: "Sample inbox workflow showing categories, priorities, and status tracking for efficient email management.",
      thumb: "mail",
      demo: () => inboxDemoHTML()
    },
    {
      title: "Research & Data Compilation",
      badge: "Sample Project",
      desc: "Organized research data with fields for easy filtering, sorting, and compilation into reports.",
      thumb: "folder",
      demo: () =>
        tableHTML(["Project", "Status", "Fields", "Records"],
          [["Contact List", "Completed", "Name, Email, Phone, Company", "150"],
           ["Market Research", "In Progress", "Company, Industry, Website, Contact", "45"],
           ["Prospect Database", "Completed", "Name, Title, Company, Email, Phone", "320"],
           ["Vendor List", "Completed", "Vendor, Service, Contact, Website, Price", "87"]],
          "All data is fictional and for demonstration purposes only.")
    }
  ];

  function renderPortfolio() {
    const grid = $("#portfolioGrid");
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(
      (p, i) =>
        '<article class="card portfolio-card reveal">' +
        '<div class="portfolio-thumb" aria-hidden="true">' + ICON[p.thumb] + "</div>" +
        '<div class="badge-row"><span class="badge ' + (p.badge === "Demonstration" ? "badge-demo" : "badge-sample") + '">' +
        esc(p.badge) + "</span></div>" +
        "<h3>" + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p>" +
        '<button type="button" class="btn btn-outline btn-sm" data-demo="' + i + '">View Demo</button>' +
        "</article>"
    ).join("");
  }

  /* =========================================================
     Hero showcase window (fictional sample data, tabbed)
     ========================================================= */
  function renderShowcase() {
    const sheet = $("#panel-sheet");
    if (!sheet) return;

    /* Spreadsheet panel */
    const activeCount = CUSTOMERS.filter((c) => c.status === "Active").length;
    const cityCount = new Set(CUSTOMERS.map((c) => c.city)).size;
    sheet.innerHTML =
      '<div class="panel-stats">' +
      '<span class="stat-chip"><strong>' + CUSTOMERS.length + "</strong>Records</span>" +
      '<span class="stat-chip"><strong>' + activeCount + "</strong>Active</span>" +
      '<span class="stat-chip"><strong>' + cityCount + "</strong>Cities covered</span>" +
      '<span class="stat-chip"><strong>5</strong>Fields per record</span>' +
      "</div>" +
      tableHTML(["ID", "Name", "Email", "City", "Status"],
        CUSTOMERS.map((c) => [c.id, esc(c.name), '<span class="email">' + esc(c.email) + "</span>", esc(c.city), pill(c.status)])) +
      '<p class="panel-note">Fictional customer records. Try adding, editing and sorting rows in the <a href="#demo">live demo below</a>.</p>';

    /* Data cleaning panel */
    const cleaned = cleanRows(MESSY);
    $("#panel-clean").innerHTML =
      '<div class="clean-cols-sm">' +
      "<div><h4>Before (raw)</h4><pre class=\"clean-pre\">" + esc(fmt(MESSY)) + "</pre></div>" +
      "<div><h4>After (cleaned)</h4><pre class=\"clean-pre clean-after\">" + esc(fmt(cleaned)) + "</pre></div>" +
      "</div>" +
      '<p class="panel-note">Duplicates removed, spacing and capitalization normalized, missing values handled. ' +
      "Run it yourself in the <a href=\"#portfolio\">Data Cleaning demo</a> under Portfolio.</p>";

    /* Inbox panel */
    const cats = Object.keys(INBOX);
    $("#panel-inbox").innerHTML =
      '<div class="inbox-pills" role="group" aria-label="Mail categories">' +
      cats.map((c, i) =>
        '<button type="button" data-inbox-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' +
        esc(c) + " (" + INBOX[c].length + ")</button>").join("") +
      "</div><div class=\"inbox-list\" id=\"inboxPanelList\"></div>" +
      '<p class="panel-note">Illustrative inbox with fictional messages, organized by category.</p>';

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

    /* Products panel */
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
      '<p class="panel-note">All products, SKUs and prices are fictional demonstration data.</p>';

    /* Tabs */
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
    after.textContent = "Click “Run Data Cleaning” to process the rows on the left.";
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
    h += '<p class="note">Illustrative inbox with fictional messages, showing how mail can be categorized.</p>';
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
    show(cats0());
    function cats0() { return btns[0].dataset.cat; }
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
  });

  /* =========================================================
     Interactive Data Entry Demo (section H)
     Frontend-only. Saved to localStorage. Fictional data.
     ========================================================= */
  const STORAGE_KEY = "mjm-demo-customers-v1";
  const SEED = CUSTOMERS.slice(0, 6).map((c) => ({ ...c }));

  const demoState = {
    rows: [],
    nextId: 1009,
    query: "",
    sortKey: null,
    sortDir: 1,
    editingId: null
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
    } catch (err) { /* storage unavailable or corrupt: fall back to seed */ }
    demoState.rows = SEED.map((c, i) => ({ ...c, idNum: 1001 + i }));
  }

  function saveRows() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState.rows)); }
    catch (err) { /* private mode etc. — demo still works in-memory */ }
  }

  function demoMsg(text, ok) {
    const el = $("#demoMsg");
    el.textContent = text;
    el.className = "demo-msg " + (ok ? "ok" : "err");
    clearTimeout(demoMsg._t);
    demoMsg._t = setTimeout(() => { el.textContent = ""; }, 5000);
  }

  function visibleRows() {
    let rows = demoState.rows;
    const q = demoState.query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        [r.name, r.email, r.city, r.status, r.id].join(" ").toLowerCase().includes(q));
    }
    if (demoState.sortKey) {
      const k = demoState.sortKey;
      rows = rows.slice().sort((a, b) => String(a[k]).localeCompare(String(b[k]), undefined, { numeric: true }) * demoState.sortDir);
    }
    return rows;
  }

  function renderDemoTable() {
    const tbody = $("#demoTbody");
    const rows = visibleRows();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No records match your search.</td></tr>';
    } else {
      tbody.innerHTML = rows.map((r) =>
        "<tr>" +
        "<td>" + esc(r.id) + "</td>" +
        "<td>" + esc(r.name) + "</td>" +
        '<td class="email">' + esc(r.email) + "</td>" +
        "<td>" + esc(r.city) + "</td>" +
        "<td>" + pill(r.status) + "</td>" +
        '<td class="row-actions">' +
        '<button type="button" data-edit-row="' + esc(r.id) + '">Edit</button>' +
        '<button type="button" class="delete-btn" data-del-row="' + esc(r.id) + '">Delete</button>' +
        "</td></tr>"
      ).join("");
    }
    const total = demoState.rows.length;
    $("#demoCount").textContent =
      rows.length === total ? "Records: " + total
      : "Showing " + rows.length + " of " + total + " records";
    $$(".sort-btn").forEach((b) => {
      if (b.dataset.sort === demoState.sortKey) b.setAttribute("aria-sort", demoState.sortDir === 1 ? "ascending" : "descending");
      else b.removeAttribute("aria-sort");
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

  function wireDemo() {
    loadRows();
    renderDemoTable();

    $("#demoSearch").addEventListener("input", (e) => {
      demoState.query = e.target.value;
      renderDemoTable();
    });

    $$(".sort-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const key = btn.dataset.sort;
        if (demoState.sortKey === key) demoState.sortDir *= -1;
        else { demoState.sortKey = key; demoState.sortDir = 1; }
        renderDemoTable();
      })
    );

    $("#demoAddBtn").addEventListener("click", () => openDemoForm(null));
    $("#formCancelBtn").addEventListener("click", closeDemoForm);

    $("#recordForm").addEventListener("submit", (e) => {
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
        demoMsg("Please fix the highlighted fields.", false);
        return;
      }
      const cleanName = name.trim().replace(/\s+/g, " ");
      if (demoState.editingId) {
        const row = demoState.rows.find((r) => r.id === demoState.editingId);
        Object.assign(row, { name: cleanName, email: email.trim().toLowerCase(), city: city.trim(), status });
        demoMsg("Record " + row.id + " updated successfully.", true);
      } else {
        const idNum = demoState.nextId++;
        demoState.rows.push({
          id: "C-" + idNum, idNum, name: cleanName,
          email: email.trim().toLowerCase(), city: city.trim(), status
        });
        demoMsg("New record added (C-" + idNum + ").", true);
      }
      saveRows();
      renderDemoTable();
      closeDemoForm();
    });

    $("#demoTbody").addEventListener("click", (e) => {
      const edit = e.target.closest("[data-edit-row]");
      const del = e.target.closest("[data-del-row]");
      if (edit) {
        const row = demoState.rows.find((r) => r.id === edit.dataset.editRow);
        openDemoForm(row);
      } else if (del) {
        const id = del.dataset.delRow;
        const row = demoState.rows.find((r) => r.id === id);
        if (row && window.confirm("Delete record " + id + " (" + row.name + ")?")) {
          demoState.rows = demoState.rows.filter((r) => r.id !== id);
          saveRows();
          renderDemoTable();
          demoMsg("Record " + id + " deleted.", true);
          if (demoState.editingId === id) closeDemoForm();
        }
      }
    });

    $("#demoResetBtn").addEventListener("click", () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
      demoState.rows = SEED.map((c, i) => ({ ...c, idNum: 1001 + i }));
      demoState.nextId = 1009;
      demoState.query = "";
      demoState.sortKey = null;
      $("#demoSearch").value = "";
      closeDemoForm();
      renderDemoTable();
      demoMsg("Demo reset to the original sample records.", true);
    });
  }

  /* ---------- Contact form (Formspree AJAX handles submission) ---------- */
  function wireContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    
    // Basic field validation before Formspree processes
    const fields = [
      { input: $("#cName"), err: $("#cErrName"), test: (v) => v.trim().length >= 2, msg: "Please enter your name." },
      { input: $("#cEmail"), err: $("#cErrEmail"), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: "Please enter a valid email address." },
      { input: $("#cSubject"), err: $("#cErrSubject"), test: (v) => v.trim().length >= 3, msg: "Please add a short subject." },
      { input: $("#cMessage"), err: $("#cErrMessage"), test: (v) => v.trim().length >= 10, msg: "Message should be at least 10 characters." }
    ];

    fields.forEach((f) => {
      f.input.addEventListener("input", () => setFieldError(f.input, f.err, ""));
      f.input.addEventListener("blur", () => {
        if (!f.test(f.input.value)) {
          setFieldError(f.input, f.err, f.msg);
        }
      });
    });

    // Clear error messages on focus
    form.addEventListener("submit", (e) => {
      let firstBad = null;
      fields.forEach((f) => {
        const bad = !f.test(f.input.value);
        setFieldError(f.input, f.err, bad ? f.msg : "");
        if (bad && !firstBad) firstBad = f.input;
      });
      if (firstBad) {
        e.preventDefault();
        firstBad.focus();
      }
      // Formspree AJAX will handle the actual submission if validation passes
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

    // Active section highlighting
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
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Back to top + year ---------- */
  function wireMisc() {
    const btn = $("#backToTop");
    window.addEventListener("scroll", () => {
      btn.hidden = window.scrollY < 500;
    }, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    $("#year").textContent = String(new Date().getFullYear());
  }

  /* ---------- init ---------- */
  function init() {
    applyProfile();
    renderSkills();
    renderTools();
    renderServices();
    renderPortfolio();
    renderShowcase();
    wireDemo();
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
