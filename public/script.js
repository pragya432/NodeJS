/* =========================================================
   NODE.JS LABORATORY PORTFOLIO
   Vanilla JavaScript
========================================================= */


/* =========================================================
   GITHUB PLACEHOLDER
========================================================= */

const GITHUB_URL = "YOUR_GITHUB_REPOSITORY_URL";


/* =========================================================
   LABORATORY DATA
========================================================= */

const labs = [

    {
        id: 1,

        number: "LAB 01",

        title: "Getting Started with Node.js",

        description:
            "Introduction to Node.js, npm and creating the first Node.js application.",

        objective:
            "Understand the Node.js environment, runtime execution and the basic process of creating and running a Node.js application.",

        topics: [
            "Node.js",
            "npm",
            "JavaScript",
            "Runtime Environment",
            "Git & GitHub"
        ],

        technologies: [
            "Node.js",
            "JavaScript",
            "npm",
            "Git",
            "GitHub"
        ],

        screenshots: [
            {
                src: "/lab-01/lab1-output.png",
                title: "Lab 01 Output"
            },
            {
                src: "/lab-01/lab1-node-version.png",
                title: "Node.js Version"
            }
        ],

        tasks: [
            "Install and verify Node.js.",
            "Verify the Node.js and npm versions.",
            "Create the first Node.js application.",
            "Execute the application using Node.js.",
            "Document the implementation and output."
        ]
    },


    {
        id: 2,

        number: "LAB 02",

        title: "Node.js HTTP Server",

        description:
            "Creating an HTTP server using Node.js and understanding request-response communication.",

        objective:
            "Understand how Node.js handles HTTP requests and responses using its built-in HTTP module.",

        topics: [
            "HTTP",
            "createServer()",
            "Request",
            "Response",
            "Status Codes",
            "localhost"
        ],

        technologies: [
            "Node.js",
            "JavaScript",
            "HTTP"
        ],

        screenshots: [
            {
                src: "/lab-02/lab2-output.png",
                title: "Lab 02 HTTP Server Output"
            }
        ],

        tasks: [
            "Import the built-in HTTP module.",
            "Create an HTTP server.",
            "Handle incoming requests.",
            "Send responses to the client.",
            "Run the server on localhost."
        ]
    },


    {
        id: 3,

        number: "LAB 03",

        title: "Student Directory API",

        description:
            "Building a dynamic Student Directory API using route parameters and JavaScript array methods.",

        objective:
            "Build a dynamic API capable of returning specific student information based on route parameters.",

        topics: [
            "Route Parameters",
            "req.url",
            "find()",
            "filter()",
            "JSON",
            "HTTP 404",
            "Student Directory"
        ],

        technologies: [
            "Node.js",
            "HTTP",
            "JavaScript",
            "REST API"
        ],

        screenshots: [
            {
                src: "/lab-03/students-output.png",
                title: "Student Directory Output"
            },
            {
                src: "/lab-03/items-output.png",
                title: "Items Output"
            }
        ],

        tasks: [
            "Set up the Student Directory project.",
            "Create the Student Directory server.",
            "Read route parameters from the URL.",
            "Return specific student information.",
            "Use find() and filter() array methods.",
            "Handle unavailable students using HTTP 404.",
            "Implement student and course filtering."
        ]
    }

];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const labsContainer =
    document.getElementById("labsContainer");

const labSearch =
    document.getElementById("labSearch");

const clearSearch =
    document.getElementById("clearSearch");

const noResults =
    document.getElementById("noResults");

const searchStatus =
    document.getElementById("searchStatus");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const siteHeader =
    document.querySelector(".site-header");

const modal =
    document.getElementById("labModal");

const modalContent =
    document.getElementById("modalContent");

const modalClose =
    document.getElementById("modalClose");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxClose =
    document.getElementById("lightboxClose");


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   CREATE LAB CARD
========================================================= */

function createLabCard(lab) {

    const firstScreenshot =
        lab.screenshots[0];

    const topicsHTML =
        lab.topics
            .map(topic => `
                <span class="topic">
                    ${escapeHTML(topic)}
                </span>
            `)
            .join("");

    const technologiesHTML =
        lab.technologies
            .map(technology => `
                <span class="tech-badge">
                    ${escapeHTML(technology)}
                </span>
            `)
            .join("");

    return `

        <article class="lab-card reveal visible">

            <div class="lab-card-top">

                <span class="lab-number">
                    ${escapeHTML(lab.number)}
                </span>

                <h3>
                    ${escapeHTML(lab.title)}
                </h3>

                <p class="lab-description">
                    ${escapeHTML(lab.description)}
                </p>

            </div>


            <div class="lab-card-body">

                <span class="lab-label">
                    OBJECTIVE
                </span>

                <p class="lab-objective">
                    ${escapeHTML(lab.objective)}
                </p>


                <span class="lab-label">
                    TOPICS
                </span>

                <div class="topic-list">
                    ${topicsHTML}
                </div>


                <span class="lab-label">
                    TECHNOLOGIES
                </span>

                <div class="tech-list">
                    ${technologiesHTML}
                </div>

            </div>


            <div class="lab-output">

                <span class="lab-label">
                    OUTPUT
                </span>

                <button
                    class="output-frame"
                    type="button"
                    data-lightbox="${escapeHTML(firstScreenshot.src)}"
                    data-title="${escapeHTML(firstScreenshot.title)}"
                >

                    <img
                        src="${escapeHTML(firstScreenshot.src)}"
                        alt="${escapeHTML(firstScreenshot.title)}"
                    >

                    <div class="output-placeholder">

                        <span>${escapeHTML(lab.number)}</span>

                        <strong>
                            Output Screenshot
                        </strong>

                        <small>
                            Actual screenshot not found
                        </small>

                    </div>

                </button>

            </div>


            <div class="lab-actions">

                <button
                    type="button"
                    class="lab-button primary details-button"
                    data-lab-id="${lab.id}"
                >
                    View Details
                </button>


                <a
                    href="https://github.com/pragya432/NodeJS"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="lab-button github-link"
                >
                    View GitHub
                </a>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER LABS
========================================================= */

function renderLabs(labsToRender) {

    if (!labsToRender.length) {

        labsContainer.innerHTML = "";

        noResults.hidden = false;

        searchStatus.textContent =
            "0 laboratories match your search.";

        return;
    }

    noResults.hidden = true;

    labsContainer.innerHTML =
        labsToRender
            .map(createLabCard)
            .join("");

    searchStatus.textContent =
        `${labsToRender.length} ${labsToRender.length === 1 ? "laboratory" : "laboratories"} available.`;

    setupOutputImages();

    setupDetailsButtons();

    setupGitHubLinks();
}


/* =========================================================
   SEARCH
========================================================= */

function searchLabs(searchTerm) {

    const term =
        searchTerm
            .trim()
            .toLowerCase();

    if (!term) {

        renderLabs(labs);

        return;
    }

    const results =
        labs.filter(lab => {

            const searchableText = [

                lab.number,

                lab.title,

                lab.description,

                lab.objective,

                ...lab.topics,

                ...lab.technologies

            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(term);
        });


    renderLabs(results);
}


labSearch.addEventListener("input", event => {

    searchLabs(event.target.value);

});


clearSearch.addEventListener("click", () => {

    labSearch.value = "";

    searchLabs("");

    labSearch.focus();

});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

menuToggle.addEventListener("click", () => {

    const isOpen =
        navMenu.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );

});


/* Close mobile menu after clicking link */

document.querySelectorAll(".nav-menu a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


/* =========================================================
   NAVBAR SCROLL
========================================================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   LAB DETAILS MODAL
========================================================= */

function openLabModal(labId) {

    const lab =
        labs.find(item => item.id === labId);

    if (!lab) {
        return;
    }


    const topicsHTML =
        lab.topics
            .map(topic => `
                <span class="topic">
                    ${escapeHTML(topic)}
                </span>
            `)
            .join("");


    const technologiesHTML =
        lab.technologies
            .map(technology => `
                <span class="tech-badge">
                    ${escapeHTML(technology)}
                </span>
            `)
            .join("");


    const tasksHTML =
        lab.tasks
            .map((task, index) => `
                <div class="modal-task">

                    <strong>
                        Task ${index + 1}
                    </strong>

                    <span>
                        ${escapeHTML(task)}
                    </span>

                </div>
            `)
            .join("");


    const screenshotsHTML =
        lab.screenshots
            .map(image => `
                <button
                    type="button"
                    class="modal-screenshot"
                    data-lightbox="${escapeHTML(image.src)}"
                    data-title="${escapeHTML(image.title)}"
                >

                    <img
                        src="${escapeHTML(image.src)}"
                        alt="${escapeHTML(image.title)}"
                    >

                </button>
            `)
            .join("");


    modalContent.innerHTML = `

        <span class="modal-number">
            ${escapeHTML(lab.number)}
        </span>

        <h2 class="modal-title">
            ${escapeHTML(lab.title)}
        </h2>

        <p class="modal-description">
            ${escapeHTML(lab.description)}
        </p>


        <div class="modal-section">

            <h4>OBJECTIVE</h4>

            <p>
                ${escapeHTML(lab.objective)}
            </p>

        </div>


        <div class="modal-section">

            <h4>TASKS</h4>

            <div class="modal-task-list">
                ${tasksHTML}
            </div>

        </div>


        <div class="modal-section">

            <h4>TOPICS</h4>

            <div class="modal-topics">
                ${topicsHTML}
            </div>

        </div>


        <div class="modal-section">

            <h4>TECHNOLOGIES</h4>

            <div class="modal-topics">
                ${technologiesHTML}
            </div>

        </div>


        <div class="modal-section">

            <h4>OUTPUT SCREENSHOTS</h4>

            <div class="modal-screenshots">
                ${screenshotsHTML}
            </div>

        </div>


        <div class="modal-actions">

            <a
                href="${GITHUB_URL}"
                target="_blank"
                rel="noopener noreferrer"
                class="lab-button primary github-link"
            >
                View GitHub
            </a>

            <button
                type="button"
                class="lab-button"
                id="modalCloseBottom"
            >
                Close
            </button>

        </div>

    `;


    modal.classList.add("active");

    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");


    setupModalImages();

    setupGitHubLinks();


    const bottomClose =
        document.getElementById("modalCloseBottom");

    if (bottomClose) {

        bottomClose.addEventListener(
            "click",
            closeLabModal
        );

    }

}


/* =========================================================
   CLOSE LAB MODAL
========================================================= */

function closeLabModal() {

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


modalClose.addEventListener(
    "click",
    closeLabModal
);


document
    .querySelector(".modal-backdrop")
    .addEventListener(
        "click",
        closeLabModal
);


/* =========================================================
   DETAILS BUTTONS
========================================================= */

function setupDetailsButtons() {

    document
        .querySelectorAll(".details-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const labId =
                    Number(
                        button.dataset.labId
                    );

                openLabModal(labId);

            });

        });

}


/* =========================================================
   GITHUB LINKS
========================================================= */

function setupGitHubLinks() {

    document
        .querySelectorAll(".github-link")
        .forEach(link => {

            link.href = "https://github.com/pragya432/NodeJS";

        });

}


/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(imageSrc, title) {

    lightboxImage.src = imageSrc;

    lightboxImage.alt = title;

    lightboxTitle.textContent = title;

    lightbox.classList.add("active");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeLightbox() {

    lightbox.classList.remove("active");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    lightboxImage.src = "";

    document.body.classList.remove(
        "modal-open"
    );

}


function setupLightboxButtons() {

    document
        .querySelectorAll("[data-lightbox]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openLightbox(
                        button.dataset.lightbox,
                        button.dataset.title || "Laboratory Output"
                    );

                }
            );

        });

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {

        closeLightbox();

    }

});


/* =========================================================
   OUTPUT IMAGE HANDLING
========================================================= */

function setupOutputImages() {

    document
        .querySelectorAll(".output-frame")
        .forEach(frame => {

            const image =
                frame.querySelector("img");

            image.addEventListener(
                "load",
                () => {

                    frame.classList.add(
                        "image-loaded"
                    );

                },
                { once: true }
            );


            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "failed"
                    );

                },
                { once: true }
            );

            if (image.complete && image.naturalWidth > 0) {

                frame.classList.add(
                    "image-loaded"
                );

            }

        });


    setupLightboxButtons();

}


/* =========================================================
   MODAL IMAGE HANDLING
========================================================= */

function setupModalImages() {

    document
        .querySelectorAll(".modal-screenshot")
        .forEach(button => {

            const image =
                button.querySelector("img");

            image.addEventListener(
                "error",
                () => {

                    button.style.display =
                        "none";

                },
                { once: true }
            );


            image.addEventListener(
                "load",
                () => {

                    button.classList.add(
                        "image-loaded"
                    );

                },
                { once: true }
            );


            button.addEventListener(
                "click",
                () => {

                    openLightbox(
                        button.dataset.lightbox,
                        button.dataset.title
                    );

                }
            );

        });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


function setupRevealAnimations() {

    document
        .querySelectorAll(".reveal")
        .forEach(element => {

            revealObserver.observe(
                element
            );

        });

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeLabModal();

            closeLightbox();

            navMenu.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderLabs(labs);

        setupGitHubLinks();

        setupRevealAnimations();

    }
);