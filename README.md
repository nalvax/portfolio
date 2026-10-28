# JRU Computer Programming 1 E-Portfolio

A responsive, static single-page e-portfolio built with Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, and lucide-react. All personal content is kept in `src/content/portfolio.ts`; no backend or database is required.

## Run locally

1. Install Node.js 20 or later.
2. Clone this repository and open its folder.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000. Build the static site with `npm run build`; the exported website is written to `out/`.

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It builds the static Next.js site and publishes it to GitHub Pages whenever you push to `main`.

1. Open the repository: https://github.com/nalvax/portfolio
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).
4. Go to **Settings → Actions → General** and make sure Actions are allowed to run. Under workflow permissions, the workflow's declared permissions are used; no secret or API key is needed.
5. Open the **Actions** tab and select **Deploy portfolio to GitHub Pages**. If a run is already in progress, wait for it to finish; otherwise push a new commit or use **Run workflow** if available.
6. When the workflow finishes successfully, open **Settings → Pages** to find the published URL. For this repository, it should be `https://nalvax.github.io/portfolio/`.

The workflow sets the `/portfolio` base path for GitHub Pages, so links and static assets are generated for this repository URL. A new push to `main` automatically republishes the site. The first deployment can take a few minutes.

### If deployment fails

- Open **Actions → Deploy portfolio to GitHub Pages → the failed run** and read the first red step.
- If the build succeeds but deployment fails, verify **Settings → Pages → Source** is set to **GitHub Actions**.
- If the workflow is disabled, enable Actions in **Settings → Actions → General**, then re-run the workflow.
- The source repository is public, so GitHub Pages can publish it on the free plan.

## Alternative deployment (Vercel or Netlify)

- **Vercel:** Import `nalvax/portfolio`, keep the detected Next.js settings, and deploy. This project uses static export and writes the site to `out/`.
- **Netlify:** Build command `npm run build`; publish directory `out`.

## Personalize your portfolio

Edit only `src/content/portfolio.ts` for your details. Search for `TODO` and replace every placeholder with truthful information. Empty lists display a friendly empty state instead of invented details.

| Data field | Website section |
| --- | --- |
| `site.title`, `site.description`, `site.year` | Browser title, SEO/social metadata, footer year |
| `person.*` | Welcome hero, navigation initials, school/program, contact, social links |
| `about.*` | About Me, skills, and goals |
| `academics.compiledWorks` | Compiled PTs and Products PDF card |
| `academics.documentation` | Project Documentation PDF card |
| `academics.videoPresentation` | Video Project Presentation card |
| `academics.works` | Optional individual work cards |
| `experience` | Work Experience / Internships / Immersions |
| `seminars` | Seminars / Trainings Attended |
| `organizations` | Organization & Community Involvement |
| `awards` | Awards & Recognitions |
| `otherInfo` | Other Information |
| `reflections` | Prelim Term, Midterm, and Final Term reflections |
| `contact.*` | Contact heading and supporting text |

### Replace placeholder assets

- Replace `public/images/portrait.jpg` with your own portrait. Add a real `public/images/og-image.png` before sharing widely.
- Replace `public/files/compiled-pts-and-products.pdf` with your compiled course outputs PDF.
- Replace `public/files/project-documentation.pdf` with project documentation, if applicable.
- Add `public/files/project-presentation.mp4`, or set `academics.videoPresentation.embedUrl` to an appropriate embeddable video URL.
- Add `public/files/resume.pdf` and set `person.resumeFile` to `/files/resume.pdf` if you want a resume button.
- Do not leave placeholder PDFs in the final submission.

### Change theme styling

- Accent color: edit `--accent` and `--accent-strong` near the top of `src/app/globals.css`.
- Fonts: change the `Inter` and `JetBrains_Mono` imports in `src/app/layout.tsx`.
- Theme preference defaults to the system theme and is saved in localStorage after the user toggles it.

## Pre-submission checklist

- [ ] Welcome, About Me, Academics & Relevant Works, Work Experience / Internships / Immersions, Seminars / Trainings Attended, Organization & Community Involvement, Awards & Recognitions, Other Information, and Term Reflections are complete.
- [ ] Upload your real compiled performance tasks/products PDF.
- [ ] Add project documentation and video if applicable.
- [ ] Write your own Prelim, Midterm, and Final Term reflections, each with topics and a narrative.
- [ ] Add your portrait, correct program/year level, email, social links, and resume if desired.
- [ ] Replace all `TODO` text and placeholder assets.
- [ ] Confirm the GitHub Actions deployment succeeds and review the published site at 360, 768, 1024, and 1440px widths.
- [ ] Test keyboard navigation, theme toggle, contact form, all links, and PDF/video buttons.
- [ ] Submit the **live website URL**, not just the source repository.

## Notes

- No personal details have been invented. The display name and other personal fields intentionally remain TODO placeholders.
- Contact form uses a validated `mailto:` flow by default; it does not store or transmit messages to a server.
- The reference website is used for broad layout inspiration only; its content and source code are not copied.
- The project uses Next.js static export. A successful deployment run and browser checks should be completed before treating the site as production-ready.
