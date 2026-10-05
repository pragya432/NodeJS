/* ==========================================================================
   NODE.JS LABORATORY PORTFOLIO — JAVASCRIPT (script.js)
   CS403NOD — BCA VII Semester
   Vanilla JavaScript (ES6+ / No Frameworks)
   ========================================================================== */

// GitHub Repository Constant
const GITHUB_REPO_URL = "https://github.com/pragya432/NodeJS";

/* --------------------------------------------------------------------------
   1. LABORATORY DATA STORE
   -------------------------------------------------------------------------- */
const labs = [
    {
        id: 1,
        number: "LAB 01",
        title: "Getting Started with Node.js",
        shortDescription: "Introduction to Node.js, npm and creating the first Node.js application.",
        description: "Introduction to Node.js runtime environment, package management with npm, and creating, executing, and documenting your first Node.js application.",
        objective: "Understand the Node.js environment, runtime execution and the basic process of creating and running a Node.js application.",
        tasks: [
            "Install and verify Node.js.",
            "Verify the Node.js and npm versions.",
            "Create the first Node.js application.",
            "Execute the application using Node.js.",
            "Document the implementation and output."
        ],
        topics: ["Node.js", "npm", "JavaScript", "Runtime Environment", "Git", "GitHub"],
        technologies: ["Node.js", "JavaScript", "npm", "Git", "GitHub"],
        screenshots: [
            { src: "lab-01/lab1-output.png", title: "Lab 01 Application Output" },
            { src: "lab-01/lab1-node-version.png", title: "Node.js & npm Version Check" }
        ],
        githubUrl: GITHUB_REPO_URL
    },
    {
        id: 2,
        number: "LAB 02",
        title: "Node.js HTTP Server",
        shortDescription: "Creating an HTTP server using Node.js and understanding request-response communication.",
        description: "Creating an HTTP server using Node.js's built-in http module to handle incoming client requests, write responses, set HTTP headers, and run on localhost.",
        objective: "Understand how Node.js handles HTTP requests and responses using its built-in HTTP module.",
        tasks: [
            "Import the built-in HTTP module.",
            "Create an HTTP server.",
            "Handle incoming requests.",
            "Send responses to the client.",
            "Run the server on localhost.",
            "Verify the server output in the browser or terminal."
        ],
        topics: ["HTTP", "createServer()", "Request", "Response", "Status Codes", "localhost", "HTTP Server"],
        technologies: ["Node.js", "JavaScript", "HTTP"],
        screenshots: [
            { src: "lab-02/lab2-output.png", title: "Lab 02 HTTP Server Output" },
            { src: "lab-02/about.png", title: "About Page Route Output" },
            { src: "lab-02/profile.png", title: "Profile Route Output" },
            { src: "lab-02/college.png", title: "College Information Route Output" },
            { src: "lab-02/error-testing.png", title: "Error Handling & 404 Route Test" }
        ],
        githubUrl: GITHUB_REPO_URL
    },
    {
        id: 3,
        number: "LAB 03",
        title: "Student Directory API",
        shortDescription: "Building a dynamic Student Directory API using route parameters and JavaScript array methods.",
        description: "Building a dynamic REST API capable of returning specific student information based on route parameters and filtering data using JavaScript array methods.",
        objective: "Build a dynamic API capable of returning specific student information based on route parameters and filtering data using JavaScript array methods.",
        tasks: [
            "Set up the Student Directory project.",
            "Create the Student Directory server.",
            "Read route parameters from the URL.",
            "Return specific student information.",
            "Use find() to locate a specific student.",
            "Use filter() for filtering data.",
            "Return JSON responses.",
            "Handle unavailable students using HTTP 404.",
            "Implement student and course filtering."
        ],
        topics: ["Route Parameters", "req.url", "find()", "filter()", "JSON", "HTTP 404", "Student Directory", "API", "Data Filtering"],
        technologies: ["Node.js", "HTTP", "JavaScript", "REST API"],
        screenshots: [
            { src: "lab-03/students-output.png", title: "Student Directory Full API Response" },
            { src: "lab-03/students1-server.png", title: "Single Student ID Parameter Query" },
            { src: "lab-03/students99-server.png", title: "HTTP 404 Student Not Found Response" },
            { src: "lab-03/items-output.png", title: "Filtered Items API Output" }
        ],
        githubUrl: GITHUB_REPO_URL
    },
    {
        id: 4,
        number: "LAB 04",
        title: "Query Parameters — Search, Filter & Sort",
        shortDescription: "Working with URL query parameters to search, filter and sort data in a Node.js application.",
        description: "Working with URL query parameters to search, filter and sort data dynamically in a Node.js HTTP server using standard URLSearchParams.",
        objective: "Understand how query parameters are received from a URL and use them to create dynamic search, filtering and sorting functionality.",
        tasks: [
            "Create a Node.js HTTP server.",
            "Read query parameters from the request URL.",
            "Implement a search operation.",
            "Implement filtering using query parameters.",
            "Implement sorting using query parameters.",
            "Combine multiple query parameters.",
            "Return the processed data as a response.",
            "Test different URLs and query combinations."
        ],
        topics: ["Query Parameters", "URL", "Search", "Filter", "Sort", "req.url", "URLSearchParams", "HTTP Response", "Dynamic Data"],
        technologies: ["Node.js", "JavaScript", "HTTP", "URLSearchParams"],
        screenshots: [
            { src: "lab-04/lab4-output.png", title: "Lab 04 Query Parameters Search & Sort Output" }
        ],
        githubUrl: GITHUB_REPO_URL
    },
    {
        id: 5,
        number: "LAB 05",
        title: "Asynchronous Programming in Node.js",
        shortDescription: "Understanding callbacks, Promises and async/await for asynchronous and non-blocking programming in Node.js.",
        description: "Understanding callbacks, Promises and async/await for asynchronous and non-blocking programming in Node.js runtime environment.",
        objective: "Understand how asynchronous programming works in Node.js and implement callbacks, Promises and async/await.",
        tasks: [
            "Understand synchronous and asynchronous execution.",
            "Create a callback-based asynchronous operation.",
            "Work with callback functions.",
            "Create and consume a Promise.",
            "Handle Promise success and failure.",
            "Implement async/await.",
            "Handle asynchronous errors.",
            "Observe non-blocking execution.",
            "Compare callbacks, Promises and async/await."
        ],
        topics: ["Asynchronous Programming", "Callbacks", "Promises", "async", "await", "Non-blocking Execution", "Error Handling", "Event Loop"],
        technologies: ["Node.js", "JavaScript", "Callbacks", "Promises", "async/await"],
        screenshots: [
            { src: "lab-05/lab5-output.png", title: "Asynchronous Execution Summary Output" },
            { src: "lab-05/callback-output.png", title: "Callback Implementation Output" },
            { src: "lab-05/promise-version.png", title: "Promise Version Output" },
            { src: "lab-05/async-await-version.png", title: "Async / Await Version Output" },
            { src: "lab-05/chainng-version.png", title: "Promise Chaining Execution Output" },
            { src: "lab-05/concurrent-orders.png", title: "Concurrent Asynchronous Orders Output" }
        ],
        githubUrl: GITHUB_REPO_URL
    },
    {
        id: 6,
        number: "LAB 06",
        title: "Asynchronous I/O & Error Handling",
        shortDescription: "Working with asynchronous file operations and handling errors using callbacks, Promises, async/await and try/catch.",
        description: "Working with asynchronous file-system operations and implementing robust error handling using callbacks, Promises, async/await and try/catch blocks.",
        objective: "Understand asynchronous I/O in Node.js and implement proper error handling while working with file-system operations.",
        tasks: [
            "Work with the Node.js File System module.",
            "Perform asynchronous file operations.",
            "Implement file operations using callbacks.",
            "Implement file operations using Promises.",
            "Implement file operations using async/await.",
            "Handle file-system errors.",
            "Use try/catch with async/await.",
            "Demonstrate non-blocking I/O.",
            "Document the output and error-handling behavior."
        ],
        topics: ["Asynchronous I/O", "File System", "fs module", "Callbacks", "Promises", "async/await", "try/catch", "Error Handling", "Non-blocking I/O"],
        technologies: ["Node.js", "JavaScript", "File System", "Callbacks", "Promises", "async/await"],
        screenshots: [
            { src: "lab-06/lab6-output.png", title: "Lab 06 File System Asynchronous I/O Output" },
            { src: "lab-06/read-comparison.png", title: "Sync vs Async File Read Comparison Output" }
        ],
        githubUrl: GITHUB_REPO_URL
    },
    {
        id: 7,
        number: "LAB 07",
        title: "Implementing EventEmitter — Event-Driven Programming",
        shortDescription: "Understanding and implementing Node.js EventEmitter through custom events, multiple listeners, .once(), error handling, class extension and a real-time order tracking system.",
        description: "Understanding and implementing Node.js EventEmitter through custom events, multiple listeners, .once(), error handling, class extension and a real-time order tracking system.",
        objective: "After completing this lab, the student should be able to: Create and use the EventEmitter class to register and trigger custom events; Register multiple independent listeners for the same event; Use .once() correctly for one-time events; Handle the special error event safely without crashing the process; Build a class that extends EventEmitter; Combine these concepts into a small event-driven system.",
        tasks: [
            "Task 1 — Project Setup: Create NodeJS-Lab/Lab-07 structure containing events-basic.js, order-system.js, once-vs-on.js, error-handling.js, notification-center.js, order-tracker.js, reflection-notes.txt, and README.md.",
            "Task 2 — Your First Custom Event: Create events-basic.js using EventEmitter to register a 'greet' listener, emit 'greet', and pass name parameter.",
            "Task 3 — Multiple Listeners on One Event: Create order-system.js where orders.emit('placed', item) triggers 4 independent listeners (Kitchen, Billing, SMS confirmation, Loyalty Points).",
            "Task 4 — .once() vs .on(): Create once-vs-on.js simulating login system using app.once('firstLogin', ...) for one-time bonus and app.on('login', ...) for normal logins.",
            "Task 5 — Handling the 'error' Event Safely: Create error-handling.js demonstrating unhandled error crash vs adding proper risky.on('error', ...) handler.",
            "Task 6 — Extending EventEmitter With a Class: Create notification-center.js defining custom NotificationCenter class extending EventEmitter to listen for 'newMessage' and 'userOnline' events.",
            "Task 7 — Mini Project: Real-Time Order Tracking System: Create order-tracker.js building OrderTracker class extending EventEmitter supporting orderPlaced, orderPrepared, orderDelivered, firstOrderBonus, error listener, and setTimeout delays.",
            "Task 8 — Reflection Notes: Create reflection-notes.txt explaining how EventEmitter connects to Observer Pattern and identifying core Node.js APIs (Streams, HTTP Server) using event-driven pattern."
        ],
        topics: ["EventEmitter", "Custom Events", "Event Listeners", ".on()", ".once()", "Multiple Listeners", "Error Events", "Extending EventEmitter", "Event-Driven Programming", "Observer Pattern"],
        technologies: ["Node.js", "JavaScript", "EventEmitter"],
        screenshots: [
            { src: "lab-07/lab7-output.png", title: "Lab 07 Basic EventEmitter Output" },
            { src: "lab-07/error-output.png", title: "Graceful Error Handling Output" },
            { src: "lab-07/order-tracker-output.png", title: "Real-Time Order Tracker System Output" }
        ],
        githubUrl: GITHUB_REPO_URL
    }
];

/* --------------------------------------------------------------------------
   2. DOM ELEMENT REFERENCES
   -------------------------------------------------------------------------- */
const labsGrid = document.getElementById("labsGrid");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const labCountBadge = document.getElementById("labCountBadge");
const noResults = document.getElementById("noResults");
const resetSearchBtn = document.getElementById("resetSearchBtn");

const labModal = document.getElementById("labModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightboxBtn = document.getElementById("closeLightboxBtn");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

/* --------------------------------------------------------------------------
   3. RENDER LAB CARDS
   -------------------------------------------------------------------------- */
function renderLabs(labsToRender) {
    if (!labsGrid) return;
    
    labsGrid.innerHTML = "";

    if (labsToRender.length === 0) {
        if (noResults) noResults.hidden = false;
        if (labCountBadge) labCountBadge.textContent = "0 laboratories found.";
        return;
    }

    if (noResults) noResults.hidden = true;
    if (labCountBadge) {
        labCountBadge.textContent = labsToRender.length === 1 
            ? "1 laboratory available." 
            : `${labsToRender.length} laboratories available.`;
    }

    labsToRender.forEach(lab => {
        const cardNode = createLabCard(lab);
        labsGrid.appendChild(cardNode);
    });
}

/* --------------------------------------------------------------------------
   4. CREATE LAB CARD HTML NODE
   -------------------------------------------------------------------------- */
function createLabCard(lab) {
    const card = document.createElement("article");
    card.className = "lab-card";
    card.setAttribute("data-lab-id", lab.id);

    const topicsHtml = lab.topics
        .slice(0, 4)
        .map(topic => `<span class="badge">${escapeHtml(topic)}</span>`)
        .join(" ");

    const extraTopicsCount = lab.topics.length - 4;
    const extraTopicsBadge = extraTopicsCount > 0 
        ? `<span class="badge">+${extraTopicsCount}</span>` 
        : "";

    const techHtml = lab.technologies
        .map(tech => `<span class="badge badge-tech">${escapeHtml(tech)}</span>`)
        .join(" ");

    card.innerHTML = `
        <div class="lab-card-content">
            <div class="lab-card-header">
                <span class="lab-number-badge">${escapeHtml(lab.number)}</span>
            </div>
            <h3 class="lab-card-title">${escapeHtml(lab.title)}</h3>
            <p class="lab-card-desc">${escapeHtml(lab.shortDescription)}</p>
            
            <div class="lab-card-tags-section">
                <div class="tags-label">Topics</div>
                <div class="tags-container">
                    ${topicsHtml} ${extraTopicsBadge}
                </div>
            </div>

            <div class="lab-card-tags-section">
                <div class="tags-label">Technologies</div>
                <div class="tags-container">
                    ${techHtml}
                </div>
            </div>
        </div>

        <div class="lab-card-actions">
            <button type="button" class="btn btn-primary btn-sm view-details-btn">
                View Details
            </button>
            <a href="${escapeHtml(lab.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                GitHub ↗
            </a>
        </div>
    `;

    const viewBtn = card.querySelector(".view-details-btn");
    if (viewBtn) {
        viewBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openLabModal(lab.id);
        });
    }

    card.addEventListener("click", () => {
        openLabModal(lab.id);
    });

    return card;
}

/* --------------------------------------------------------------------------
   5. OPEN REUSABLE LAB DETAIL MODAL
   -------------------------------------------------------------------------- */
function openLabModal(labId) {
    const lab = labs.find(item => item.id === labId);
    if (!lab || !labModal || !modalBody) return;

    const tasksHtml = lab.tasks.map((taskText, index) => {
        const numStr = (index + 1) < 10 ? `0${index + 1}` : `${index + 1}`;
        return `
            <div class="task-item">
                <span class="task-number">${numStr}</span>
                <span class="task-text">${formatCodeSnippets(escapeHtml(taskText))}</span>
            </div>
        `;
    }).join("");

    const topicsHtml = lab.topics
        .map(t => `<span class="badge badge-green">${escapeHtml(t)}</span>`)
        .join(" ");

    const techHtml = lab.technologies
        .map(t => `<span class="badge badge-tech">${escapeHtml(t)}</span>`)
        .join(" ");

    const screenshotsHtml = lab.screenshots.map((screen) => {
        return `
            <div class="screenshot-card" onclick="openLightbox('${escapeHtml(screen.src)}', '${escapeHtml(screen.title)}')">
                <div class="screenshot-thumb-wrapper">
                    <img 
                        src="${escapeHtml(screen.src)}" 
                        alt="${escapeHtml(screen.title)}" 
                        class="screenshot-thumb"
                        onerror="handleImageError(this, '${escapeHtml(screen.title)}')"
                    >
                    <div class="screenshot-zoom-overlay">
                        🔍 Click to Enlarge
                    </div>
                </div>
                <div class="screenshot-caption">${escapeHtml(screen.title)}</div>
            </div>
        `;
    }).join("");

    modalBody.innerHTML = `
        <div class="modal-header-meta">
            <span class="lab-number-badge">${escapeHtml(lab.number)}</span>
            <span class="badge">CS403NOD</span>
        </div>
        <h2 class="modal-title" id="modalLabTitle">${escapeHtml(lab.title)}</h2>

        <div class="modal-section">
            <div class="modal-section-title">Description</div>
            <p class="modal-text">${escapeHtml(lab.description)}</p>
        </div>

        <div class="modal-section">
            <div class="modal-section-title">Objective</div>
            <p class="modal-text">${escapeHtml(lab.objective)}</p>
        </div>

        <div class="modal-section">
            <div class="modal-section-title">Tasks Performed</div>
            <div class="task-list">
                ${tasksHtml}
            </div>
        </div>

        <div class="modal-section">
            <div class="modal-section-title">Topics & Concepts Covered</div>
            <div class="tags-container">
                ${topicsHtml}
            </div>
        </div>

        <div class="modal-section">
            <div class="modal-section-title">Technologies Used</div>
            <div class="tags-container">
                ${techHtml}
            </div>
        </div>

        <div class="modal-section">
            <div class="modal-section-title">Output Screenshots (${lab.screenshots.length})</div>
            <div class="screenshots-grid">
                ${screenshotsHtml}
            </div>
        </div>

        <div class="modal-actions">
            <a href="${escapeHtml(lab.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                View GitHub Repository ↗
            </a>
            <button type="button" class="btn btn-outline" onclick="closeLabModal()">
                Close
            </button>
        </div>
    `;

    labModal.setAttribute("aria-hidden", "false");
    labModal.classList.add("active");
    document.body.style.overflow = "hidden";

    if (closeModalBtn) {
        closeModalBtn.focus();
    }
}

/* --------------------------------------------------------------------------
   6. CLOSE REUSABLE LAB DETAIL MODAL
   -------------------------------------------------------------------------- */
function closeLabModal() {
    if (!labModal) return;
    labModal.setAttribute("aria-hidden", "true");
    labModal.classList.remove("active");
    
    if (!lightbox || !lightbox.classList.contains("active")) {
        document.body.style.overflow = "";
    }
}

/* --------------------------------------------------------------------------
   7. SCREENSHOT LIGHTBOX FUNCTIONALITY
   -------------------------------------------------------------------------- */
function openLightbox(src, title) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;

    lightbox.setAttribute("aria-hidden", "false");
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    if (closeLightboxBtn) {
        closeLightboxBtn.focus();
    }
}

function closeLightbox() {
    if (!lightbox) return;

    lightbox.setAttribute("aria-hidden", "true");
    lightbox.classList.remove("active");

    if (!labModal || !labModal.classList.contains("active")) {
        document.body.style.overflow = "";
    }
}

/* --------------------------------------------------------------------------
   8. IMAGE FALLBACK HANDLER (FOR MISSING SCREENSHOTS WITH RETRY)
   -------------------------------------------------------------------------- */
function handleImageError(imgElement, title) {
    // Intelligent Retry Strategy: Try case sensitivity swap before showing fallback
    if (!imgElement.getAttribute("data-retried-case")) {
        imgElement.setAttribute("data-retried-case", "true");
        
        const currentSrc = imgElement.src;
        if (currentSrc.includes("/lab-")) {
            imgElement.src = currentSrc.replace("/lab-", "/Lab-");
            return;
        } else if (currentSrc.includes("/Lab-")) {
            imgElement.src = currentSrc.replace("/Lab-", "/lab-");
            return;
        }
    }

    const parentWrapper = imgElement.parentElement;
    if (parentWrapper) {
        parentWrapper.innerHTML = `
            <div class="screenshot-unavailable">
                <span class="unavailable-icon">📷</span>
                <span class="unavailable-text">Screenshot unavailable</span>
            </div>
        `;
    }
}

/* --------------------------------------------------------------------------
   9. SEARCH & FILTER FUNCTIONALITY
   -------------------------------------------------------------------------- */
function searchLabs(query) {
    const cleanQuery = query.trim().toLowerCase();

    if (clearSearchBtn) {
        clearSearchBtn.hidden = cleanQuery.length === 0;
    }

    if (cleanQuery === "") {
        renderLabs(labs);
        return;
    }

    const filtered = labs.filter(lab => {
        const inNumber = lab.number.toLowerCase().includes(cleanQuery);
        const inTitle = lab.title.toLowerCase().includes(cleanQuery);
        const inShortDesc = lab.shortDescription.toLowerCase().includes(cleanQuery);
        const inDesc = lab.description.toLowerCase().includes(cleanQuery);
        const inObj = lab.objective.toLowerCase().includes(cleanQuery);
        const inTopics = lab.topics.some(t => t.toLowerCase().includes(cleanQuery));
        const inTech = lab.technologies.some(t => t.toLowerCase().includes(cleanQuery));
        const inTasks = lab.tasks.some(task => task.toLowerCase().includes(cleanQuery));

        return inNumber || inTitle || inShortDesc || inDesc || inObj || inTopics || inTech || inTasks;
    });

    renderLabs(filtered);
}

/* --------------------------------------------------------------------------
   10. UTILITY HELPERS
   -------------------------------------------------------------------------- */
function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatCodeSnippets(str) {
    return str.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/* --------------------------------------------------------------------------
   11. INITIALIZATION & EVENT LISTENERS
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    renderLabs(labs);

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchLabs(e.target.value);
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            searchLabs("");
            if (searchInput) searchInput.focus();
        });
    }

    if (resetSearchBtn) {
        resetSearchBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            searchLabs("");
            if (searchInput) searchInput.focus();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeLabModal);
    }

    if (labModal) {
        labModal.addEventListener("click", (e) => {
            if (e.target === labModal) {
                closeLabModal();
            }
        });
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target.classList.contains("lightbox-container")) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (lightbox && lightbox.classList.contains("active")) {
                closeLightbox();
            } else if (labModal && labModal.classList.contains("active")) {
                closeLabModal();
            } else if (navLinks && navLinks.classList.contains("show")) {
                navLinks.classList.remove("show");
                if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
            }
        }
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = navLinks.classList.toggle("show");
            menuToggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
});
