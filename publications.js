// Reads publication metadata from publications.json and embeds each PDF
// directly in the Publications page. The PDF itself retains its original layout.
async function loadPublications() {
    const container = document.getElementById("publication-list");
    if (!container) return;

    try {
        const response = await fetch("publications.json");
        if (!response.ok) throw new Error("Unable to load publications.json");

        const data = await response.json();
        const publications = Array.isArray(data.publications) ? data.publications : [];
        container.replaceChildren();

        if (publications.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No publications have been added yet.";
            container.appendChild(empty);
            return;
        }

        for (const publication of publications) {
            const article = document.createElement("article");
            const heading = document.createElement("h3");
            const details = document.createElement("p");

            heading.textContent = publication.title || "Untitled publication";
            details.textContent =
                (publication.author || "Author not listed") +
                (publication.date ? " · " + publication.date : "");

            const filename = String(publication.filename || "");
            if (filename && !filename.includes("/") && !filename.includes("\\")) {
                const pdfUrl = "pdfs/" + encodeURIComponent(filename);

                const viewer = document.createElement("iframe");
                viewer.src = pdfUrl;
                viewer.title = "PDF: " + (publication.title || "Publication");
                viewer.className = "publication-pdf";
                viewer.loading = "lazy";

                const fallback = document.createElement("p");
                fallback.textContent = "If the PDF does not display in your browser, ";

                const link = document.createElement("a");
                link.href = pdfUrl;
                link.textContent = "open the PDF separately";
                link.target = "_blank";
                link.rel = "noopener";
                fallback.appendChild(link);

                article.append(heading, details, viewer, fallback);
            } else {
                const missing = document.createElement("p");
                missing.textContent = "PDF file has not been configured.";
                article.append(heading, details, missing);
            }

            container.appendChild(article);
        }
    } catch (error) {
        container.textContent = "Publications could not be loaded. Please try again later.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadPublications);
