# Edit Benjo's Portfolio — One Published Website

**Live URL:** https://nalvax.github.io/portfolio/

## Which files control the live website?

| File | What you can edit |
| --- | --- |
| [index.html](index.html) | Personal information, headings, text, content and links |
| [styles.css](styles.css) | Base colors, spacing, desktop/mobile styles |
| [portfolio-refresh.css](portfolio-refresh.css) | Current design overrides and styling |
| [script.js](script.js) | Rotating titles, dark/light theme, mobile menu, reflections |
| [public/files/](public/files/) | Academic PDFs |

### How to edit using GitHub

1. Select one of the files above, then click the pencil icon.
2. Use Ctrl+F / Command+F to find the text you want to edit.
3. Edit only what you need and click **Commit changes** to save to `main`.
4. Visit the live URL and refresh after GitHub Pages finishes deploying.

### Publishing synchronization

The repository has two website codebases: a standalone HTML site in the root and an older Next.js application in `src/`.

**The standalone root homepage is the canonical published version.** Both supported GitHub Pages publishing sources serve the same standalone homepage:

- **Deploy from a branch:** `main` → `/(root)` serves `index.html`.
- **GitHub Actions:** `.github/workflows/deploy.yml` copies root `index.html`, `styles.css`, `script.js`, `portfolio-refresh.css`, and `public/` into its Pages artifact.

Therefore, do not edit the Next.js `src/app/page.tsx` when trying to update the live website. Its content file `src/content/portfolio.ts` is retained and has been aligned with the current homepage for legacy/development use, but the source files are **not an automatic two-way editor**. For immediate live edits, use the root HTML/CSS/JS files.

If you need to change the rotating hero text, edit the list of titles in `script.js` **and** the initial title in `index.html` to match.

If the site shows old content: check [GitHub Actions](https://github.com/nalvax/portfolio/actions), [Pages settings](https://github.com/nalvax/portfolio/settings/pages), then do a hard refresh (Command+Shift+R / Ctrl+Shift+R).
