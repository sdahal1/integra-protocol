# Verification record

Verified 2026-11-12 for the local Integra Practice delivery.

## Source coverage

- 127 physical PDF pages; 31,009 words including the image-only cover transcription.
- Pages 2–127 extracted from the text layer. pdfplumber and pypdf agree exactly after removing whitespace.
- Page 1 visually inspected and transcribed from its rendered cover image. The cover is the PDF's only embedded image.
- The original PDF, complete page-indexed JSON, plain text and Markdown are retained.
- The original PDF SHA-256 is recorded in extraction-report.json and checked by the validation script.
- All source references in the twelve modules point to valid pages. The nine transcripts cover pages 53–91 in order with no gaps.

## Application checks

- All twelve module handoffs and all nine transcript handoffs include their selected original source pages in full.
- All four practice modes render and produce the appropriate handoff.
- The 50 introductory exercise instructions follow their configured order: 14 four-element steps, 22 identity/goal steps and 14 affirmation steps.
- Protocol checks cover ordinary loops, unnamed identity, no-goal/intention/message clarification, no-content clarification, original-topic retest, both additional questions, pause/resume, restart and closing reflection.
- Quiet mode creates no invented responses. Optional written notes survive switching quiet mode back on and returning to the starting question.
- An older session's handoff uses that session's context and notes, with no leakage from a selected newer session or a study module.
- Literal markup in notes is escaped when rendered and preserved as text in handoffs.
- Clipboard success, rejected clipboard access, absent clipboard support and the generated text-download payload are tested.
- Backup validation rejects invalid session identifiers and malformed fields. Import merges by update date; importing an older record does not overwrite a newer one. Storage round-trips and unavailable-storage behavior are checked.

## Browser review

- Loaded through a nested local URL (/app/dist/) to exercise GitHub Pages-style subpath resolution.
- Desktop layout checked at 1280 × 950; phone layout checked at 390 × 844. No horizontal overflow in the handoff or source-reader dialogs.
- Module notes and practice notes appeared in their respective handoffs; a practice handoff excluded unrelated study notes.
- The copy button successfully placed the complete handoff on the browser clipboard.
- Walked through the core flow, no-goal clarification, pause/resume, optional notes and closing reflection.
- A saved reflection remained after refreshing the app.
- Full-text search found the note-taking section on PDF page 103; the reader showed the complete page.
- Browser console contained no warnings or errors during the checked flows.

## Limits

- No GitHub repository or live deployment was created; the included workflow is ready to use in the user's repository.
- Browser checks used responsive viewport simulation, not a physical phone.
- A ChatGPT conversation was not sent or tested against a live model. The prompt can guide a conversation but cannot guarantee model behavior.
- Source assertions, attributed quotations, clinical effectiveness and long-term outcomes were not independently verified. The app distinguishes source claims from its editorial adaptations.
- The extraction preserves wording and line breaks; it does not reproduce all PDF typography. Compare with the original PDF for exact layout.
