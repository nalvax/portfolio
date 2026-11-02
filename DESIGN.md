# Portfolio interface refresh

The static homepage uses `refresh.css` for the visual system and `refresh.js` for accessible theme controls, SVG icons and keyboard interactions. Existing content and site-specific behavior remain in their original files.

Light is the default appearance. A visitor can choose a softer dark theme; the choice persists locally. Styles use semantic tokens and respect reduced motion. No new runtime dependencies or build services are required.

Serve the repository root using `python3 -m http.server 8000`. Keep relative asset paths when publishing under a GitHub Pages repository URL. Deploy the homepage, both original CSS/JS files, refresh.css, refresh.js and existing public assets together.

Personal details, missing files and reflection drafts still require the owner's content. This design update does not create coursework or invent accomplishments. Verification used Chromium at 320, 390, 768, 1024, 1440 and 1920 pixels, theme persistence, keyboard controls and existing portfolio interactions. Actual Apple device testing was not performed.
