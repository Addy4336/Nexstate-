import sanitizeHtml from "sanitize-html";

/** Allow-list sanitizer for blog HTML (output of the Tiptap/markdown editors). */
export function sanitizeBlogHtml(html: string): string {
    return sanitizeHtml(html || "", {
        allowedTags: [
            "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre", "code",
            "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "mark", "span", "div", "sub", "sup",
            "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
        ],
        allowedAttributes: {
            a: ["href", "title", "target", "rel"],
            img: ["src", "alt", "title", "width", "height"],
            "*": ["class", "style"],
        },
        allowedStyles: {
            "*": {
                color: [/^#[0-9a-f]{3,8}$/i, /^rgb\([\d\s,]+\)$/i],
                "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb\([\d\s,]+\)$/i],
                "text-align": [/^(left|right|center|justify)$/],
            },
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
        allowedSchemesByTag: { img: ["http", "https"] },
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
            }),
        },
    });
}
