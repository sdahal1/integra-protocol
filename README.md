# Integra Practice

A portable study and practice companion for **Integra Protocol v1.1 by Vladimir Stojakovic**. This is a static website: HTML, CSS, JavaScript and JSON. It runs locally and can be hosted on GitHub Pages. It has no backend, AI API calls, API keys, paid dependencies or build step.

## Start on your Mac

Double-click **Start Local Preview.command**. It starts the app at **http://127.0.0.1:4179/** and opens your browser. Keep the Terminal window open; Control-C stops the server.

Alternatively:

```bash
cd ~/Desktop/Integra-Practice
python3 scripts/serve.py --open
```

Python 3 is required for the local server. If port 4179 is busy, use `python3 scripts/serve.py --port 4180 --open`. Opening `docs/index.html` directly is not supported because browsers restrict loading the JSON files from `file://` URLs.

## What you can do

- **Learn:** twelve modules with explanations, diagrams, source references, examples, cheat sheets, activities, reflection fields and knowledge checks.
- **Practice:** the three introductory exercises and a guided Integra Protocol loop, with clarification branches, original-topic checks, both additional questions, pause/resume and a closing journal.
- **Examples:** all nine original session transcripts, with separate reading notes.
- **Library:** search every page, read the original text, open the supplied PDF, or download the full text/Markdown extraction.
- **Journal:** return to a session, save a ChatGPT recap, or export/import your records between devices.

Quiet mode requires no typed responses during the loop. The source recommends writing only the initial problem definition (PDF p. 103). Optional loop notes, post-session journaling and a typed ChatGPT conversation are labeled app adaptations. Ending a session never certifies a psychological outcome.

## Continue with ChatGPT

Choose **Copy a ChatGPT study handoff** in a module, or **Copy ChatGPT practice handoff** in a practice or saved journal entry. Preview the complete text, then copy and paste into your ChatGPT conversation. **Download .txt** works as an alternative if clipboard access is unavailable or the handoff is too large to paste.

The handoff includes the selected activity, relevant source pages in full, guidance to ask one question at a time, and only that activity's notes. It asks the assistant to use your language, avoid supplying identities or goals, respect pauses, distinguish the author's claims from established facts, and offer a recap at the end. An older Journal entry uses its own situation, stage and notes. Quiet-mode answers that were never written cannot be included; the prompt asks for any missing context.

Sharing is manual. Nothing is sent to ChatGPT by this website. ChatGPT can still make mistakes or depart from the method; the original source is included for comparison. Paste any useful recap into the journal yourself.

## Deploy to GitHub Pages

The complete website is **docs/**. All URLs are relative, so it works at both a domain root and a repository address such as `https://USERNAME.github.io/integra-practice/`.

1. Create a repository in your GitHub account.
2. Push this project, including the hidden `.github` folder, to its `main` branch. From this folder:

   ```bash
   git init -b main
   git add .
   git commit -m "Add Integra Practice"
   git remote add origin https://github.com/YOUR-USERNAME/integra-practice.git
   git push -u origin main
   ```

3. In the repository, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**.
4. The included **Deploy Integra Practice** workflow validates the app and publishes `docs/`. It runs on pushes to `main` and can also be run from the **Actions** tab. If the first push ran before Pages was configured, run the workflow again.
5. Open the Pages URL on your laptop or phone. You can add it to your phone's home screen using the browser's share/menu controls.

The workflow uses GitHub's documented static-site deployment actions: [custom workflows for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). No repository or deployment has been created for you; this folder is ready for your own account.

**Deployment contents:** the package includes the original copyrighted book and complete extraction for your personal study. A public deployment exposes those files as well as the app. Keep the author's notices and choose a hosting arrangement consistent with your permission to share the material. A private repository does not automatically make a Pages site private, and this app has no built-in authentication. Your browser journal is not part of the project files or Git deployment.

For any other static host, upload the **contents** of `docs/` as the website root. No build command or environment variables are required.

## Move between devices

Progress and notes are stored in the browser under `integra-practice-v1`. They do not sync automatically. On the first device, open **Journal → Export backup**. Transfer the JSON file to the other device and choose **Journal → Import backup**. Import merges session IDs and keeps the newer version of each entry. Keep a backup before clearing browser data.

Different domains and ports use separate browser storage. The local app and the GitHub Pages version therefore need export/import to share progress. Hosted use needs a connection to load the app; this version does not promise offline phone access.

## Source extraction and accuracy

The supplied PDF has **127 pages**. Pages 2–127 contain selectable text; page 1 is an image-only cover, transcribed manually against a rendered image. The text-layer extractions from pdfplumber and pypdf matched exactly when whitespace was ignored. Only the cover contains an embedded image.

All wording, including front matter, glossary, references, transcript language and back matter, is retained in the source library. Physical PDF page numbers are used. Extracted line breaks can differ from the original layout. Source claims, credited quotations and reported session outcomes have not been independently authenticated or validated. The original PDF is the reference for layout and exact wording.

The learning modules, diagrams, quizzes and interface are companion adaptations. The book's claims about consciousness, healing and lasting results are attributed to the author, not asserted as demonstrated effects. The app is for study and optional reflection, not clinical care. See **About → Sources, adaptations & your data** for the distinctions.

## Files and validation

| File | Purpose |
| --- | --- |
| `docs/index.html` | Page shell and dialogs |
| `docs/app.js` | Learning screens, practice flow, journal, handoffs and local state |
| `docs/styles.css` | Responsive laptop/phone layouts and diagrams |
| `docs/data/course.json` | Twelve modules, exercise statements, transcript guides and source map |
| `docs/data/pages.json` | Complete page-indexed source text, with extraction methods |
| `docs/library/` | Original PDF, full text and Markdown |
| `provenance/extraction-report.json` | Source hash, extraction method, coverage and limitations |
| `scripts/validate.mjs` | Content coverage, practice transitions, handoff isolation and storage checks |
| `.github/workflows/pages.yml` | GitHub Pages validation and deployment |

With Node.js 18 or newer, run `npm test`. No npm installation is necessary. After editing the app, refresh the browser; there is no compilation step.


## Self-study seminar addition (November 2026)

Open **Seminar** in the navigation or the home-page banner. The seminar lives in `docs/seminar/` and is included when the entire `docs/` folder is deployed. The existing book-based app, its 127-page source, and its `integra-practice-v1` browser data are retained.

The seminar adds 11 chapters, the positive-experience rehearsal, separate Basic v5 and Standard v5 procedures, a seminar-version Advanced v3 procedure, all 30 video transcripts, all three handouts, and extracted on-screen text. Its **What changed from the book** section identifies new material and changed instructions, including starting-topic rules, the no-goal exception, note-taking and closing questions. Video 01 says the seminar supersedes the earlier book in a discrepancy; the two practice versions remain explicitly labeled.

Download the complete seminar guide, transcripts and slide OCR from **Seminar → Source library**. The PDF is `docs/seminar/library/full-guide.pdf`. It includes the learning material, practice instructions, comparison, full audio transcripts and on-screen text. The original book PDF remains under `docs/library/`.

Seminar notes use `integra-seminar-v1`, separate from the book journal. Export/import in each section moves that section’s data. Both offer manual ChatGPT handoffs; no model API is called.

Processing was local: MLX Whisper large-v3-turbo, Silero VAD, second-pass review, Apple Vision OCR of 3,127 scene-change frames, and PDF text extraction. The three handout text layers matched a second extractor after whitespace normalization. No ChatCut or cloud transcription was used for this addition. Review details and limitations are in `provenance/seminar-review.json` and the seminar download library. Five quiet replies in video 16 are explicitly supplemented from on-screen captions. The transcripts are not fully listening-verified; OCR may miss very brief or transitional frames.

The original audio/video and PDFs are unchanged. Media is not duplicated into the site. Public hosting makes the included source text available to visitors. No push or deployment was performed.

The user’s `docs/` layout is preserved. Local serving, validation and the GitHub Pages workflow now consistently reference `docs/`; the stale `dist/` references were corrected.
