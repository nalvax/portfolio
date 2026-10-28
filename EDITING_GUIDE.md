# Editing Benjo's E-Portfolio

The published GitHub Pages website uses **three files in the repository root**:

| File | Edit this for |
| --- | --- |
| `index.html` | Name, headings, section descriptions, links, course information, cards and contact text |
| `styles.css` | Colors, spacing, typography, mobile design and dark/light themes |
| `script.js` | Theme toggle, mobile menu, reflections tabs and rotating hero subtitle |

## How to edit from GitHub

1. Open [this repository](https://github.com/nalvax/portfolio).
2. Click `index.html`, `styles.css`, or `script.js`.
3. Click the pencil icon (**Edit this file**).
4. Use the browser's Find command (Ctrl+F or Command+F) to locate a heading such as `Hi, I'm`, `About Me`, or `--accent`.
5. Modify the content. Select **Commit changes** to save to `main`.
6. Reload the [GitHub Pages website](https://nalvax.github.io/portfolio/) after Pages has published the new commit.

## Common edits

- **Name:** Find `Benjo` in `index.html`.
- **School/program:** Find `Computer Programming 1` and `Jose Rizal University`.
- **Accent color:** Find `--accent` in `styles.css` (the light theme has its own value).
- **Skills:** Edit the chips under `Skills & Tools` in `index.html`.
- **PDF files:** Replace documents under `public/files/`. The links in this root-published homepage currently use `public/files/...`.
- **Reflections:** Find `Term Reflections`; replace the placeholder narrative with real content.
- **Contact:** The form is intentionally disabled until a real destination email is configured. Do not publish an email address you do not want public.

## Important

This repository also contains a separate **Next.js** source project in `src/`. The root `index.html`, `styles.css`, and `script.js` are a simpler standalone GitHub Pages version. If Pages publishes from `main / (root)`, edit these three root files. If Pages publishes via the Next.js **GitHub Actions** workflow, edits to these root files will not change that Next.js build; edit `src/content/portfolio.ts` and the Next.js components instead.

Do not delete the root `index.html`; it is the entry page for branch-based GitHub Pages publishing.
