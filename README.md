# Ada Accessibility Widget (Injectable)

A small, drop-in accessibility widget you can inject into any website.

## Demo

GitHub Pages demo (from `/docs`):
- https://claudi0washere.github.io/ada-accessibility-widget/

## Features

- Floating ADA-style accessibility button
- Modal with:
  - Text size controls
  - Page zoom controls
  - High contrast mode
  - Invert + grayscale filters
  - Letter spacing + line height controls
  - Readable font toggle
  - Reduce motion toggle
- Includes an Accessibility Statement section in the modal
- Saves user settings in `localStorage`

## Inject into any site

```html
<script
  src="https://claudi0washere.github.io/ada-accessibility-widget/ada-widget.js"
  defer
  data-ada-title="Accessibility"
  data-ada-contact="accessibility@example.com"
  data-ada-statement-url="https://example.com/accessibility"
></script>
```

> Notes: This is a best-effort UX widget and does not by itself guarantee legal compliance for all content.
