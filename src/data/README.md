# Vocabulary Data

The current deck contains 3000 Spanish-English cards.

This is sample/generated data for app development, import-pipeline testing, and product validation. It is not an authoritative public 3000-word Spanish list, and no external source or license claim is made for it.

The first 60 cards are the original MVP sample cards preserved for compatibility with existing user progress. The remaining cards are deterministically generated from internal seed lists in `scripts/buildGeneratedDeck.ts`.

If replacing this with a real public or commercial deck, update:

- `src/data/chapters.json`
- `src/data/sections.json`
- `src/data/words.json`
- `app/sources.tsx`
- `README.md`

Then run:

```bash
npm run validate:deck
```
