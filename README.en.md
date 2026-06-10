# ui-replica

[中文](./README.md)

Turn a UI screenshot or design mockup into a runnable frontend page with high visual fidelity.

This repository is not about producing something that only feels roughly similar. The goal is to align layout, spacing, sizing, color, radius, shadow, and visual hierarchy as closely as possible while still using an implementation strategy that remains maintainable instead of flattening the whole page into images.

## What You Can Use It For

- Rebuild a product screenshot as a static frontend page.
- Convert a design mockup into a structured spec before writing HTML, CSS, and JS.
- Handle pages that mix standard layout with a small number of complex icons or decorative assets.
- Iterate through screenshot comparison so the result gets progressively closer to the reference.

## See The Output First

This example shows both the reference image and the recreated page result.

![Google homepage replica example](./examples/google-homepage/overview.png)

Example directory: [`examples/google-homepage`](./examples/google-homepage)

From there you can inspect:

- Reference image: [`reference.png`](./examples/google-homepage/reference.png)
- Recreated result: [`result.png`](./examples/google-homepage/result.png)
- Structured spec: [`spec.md`](./examples/google-homepage/spec.md)
- Page source: [`index.html`](./examples/google-homepage/index.html), [`main.js`](./examples/google-homepage/main.js), [`styles/main.css`](./examples/google-homepage/styles/main.css)
- Screenshot script: [`scripts/capture.js`](./examples/google-homepage/scripts/capture.js)

## When It Fits

Good fit:

- You have a clear screenshot, mockup, or design image and want the page reproduced as accurately as possible.
- Visual alignment matters beyond a rough stylistic match.
- The page includes small icons, logos, or irregular borders that are not ideal for naive hand-drawn approximation.

Not a good fit:

- You only need a page with a similar style, not a close replica.
- Your primary concern is business logic, API integration, or state management rather than visual reconstruction.
- The input is too incomplete to support a precise result, but precision is still required.

## How It Works

The core idea is to decide how each part should be rebuilt before writing the page, instead of jumping straight from image to code.

The workflow is:

1. Read the design dimensions and determine the actual page bounds.
2. Break the page into top-level structure and separate real layout elements from purely decorative ones.
3. Decide which parts should use native layout, SVG, or small asset crops.
4. Build a first version with the correct structural skeleton.
5. Capture the page at the reference size and refine against the screenshot.

This makes it possible to pursue high fidelity without turning semantically important layout into a pile of brittle bitmap fragments.

## Quick Start With The Example

Using `examples/google-homepage`:

```bash
cd examples/google-homepage
npm install
npm run capture
```

This generates `preview.png`. The script starts a local static server and captures the page in a headless browser so you can compare it directly against the reference image.

## If You Want To Reuse The Workflow

At its core, this repository is a Codex `ui-replica` skill that turns "rebuild this UI from an image" into a more disciplined engineering workflow.

The full rules live in [`SKILL.md`](./SKILL.md), with supporting references in:

- [`references/ui-replication-workflow.md`](./references/ui-replication-workflow.md)
- [`references/icon-extraction-workflow.md`](./references/icon-extraction-workflow.md)

## Repository Structure

- `examples/`: examples and directly viewable results
- `SKILL.md`: the full skill definition and hard constraints
- `references/`: detailed workflow and asset extraction notes
- `agents/`: related agent configuration
