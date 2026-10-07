# Next Chapter

A frontend demo that guides Maya and her family through career evidence to a city recommendation. Built with vanilla JavaScript, CSS and Vite. The interface is in English.

## Run locally

Requires Node.js 20.19+ (20.x), or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. This is a module-based frontend; use the local server rather than double-clicking the source `index.html`.

## Build and deploy

```sh
npm run build
npm run preview
```

`dist/` contains the deployable HTML, CSS, JavaScript and image assets. Deploy the **contents of `dist/`** to a static host. Asset URLs are relative, including for GitHub Pages repositories served below a subdirectory. No backend or environment variables are needed. The build runs offline after dependencies have been installed.

## Project structure

```text
next-chapter-demo/
├── index.html              # HTML shell
├── package.json            # Commands and development dependencies
├── package-lock.json       # Reproducible npm dependency versions
├── vite.config.js          # Static build settings
├── src/
│   ├── app.js              # State, event handling and routes
│   ├── assets.js           # Runtime image URLs
│   ├── data.js             # Occupations, city scores and copy
│   ├── flow.js             # Analysis steps and recommendation logic
│   ├── components.js       # Named HTML screens and components
│   └── styles.css          # Tokens, layouts and component styles
├── assets/
│   ├── charts/             # Supplied charts and two solo trend crops
│   ├── avatars/            # Original avatars and runtime thumbnails
│   └── references/         # Visual-style reference
├── scripts/                # Figma export and browser smoke checks
├── docs/                   # Architecture and asset provenance
├── figma-import/           # Generated static screens, ignored by Git
└── dist/                   # Generated production build, ignored by Git
```

## Demo behavior

- Maya, Nursing and eight cities are preselected. Additional family members can be added, renamed or removed; the first is Alex.
- Ten occupations are selectable. Available charts cover Nursing and ICT; other careers show an availability message and their chart steps are skipped.
- Members with the same occupation share its evidence. One covered career has six steps; Nursing and ICT together have thirteen.
- Each analysis screen shows one chart and an explanation. The progress bar navigates freely, and **Edit analysis** returns to setup while retaining choices.
- Both default story flows end with Brisbane. If Brisbane is deselected, the covered baseline scores select another eligible city. Charts remain the original eight-city references.
- **Export report** appears on the final screen as a visual demo button. It does not download a report.

Example routes:

```text
/?members=4#/setup
/?members=2#/analysis/career-match
/?members=2&careers=nurse,teacher#/setup
```

## Export static pages for Figma

Install the browser once, then generate the screens:

```sh
npx playwright install chromium
npm run export:figma
```

Open `figma-import/index.html` to browse 23 independent screens: four setup screens, six single-career screens and thirteen Nursing–ICT family screens. Each screen embeds its CSS and images, has no JavaScript, and converts form fields into static text and shapes. It can be opened directly without the Vite server. The manifest records frame names and order at 1440 px wide and a minimum height of 960 px.

Import selected screens through your HTML-to-Figma workflow. Semantic regions, IDs and `data-design-name` attributes describe the intended layer hierarchy; chart images remain raster assets. See [architecture](docs/architecture.md) for the component tree.

To use an existing Chromium installation instead of Playwright's downloaded browser, set `CHROME_EXECUTABLE_PATH` to the executable path. This is an optional tooling setting, not a frontend dependency.

## Verify changes

After installing Playwright's browser:

```sh
npm test
```

This builds the production site and checks image loading, single/family journeys, member editing, missing-chart handling, navigation, city selection and mobile overflow in a browser.

## Git preparation

Run Git commands from **this project directory**, not its parent. A local `main` repository is initialized; no commit or remote is created.

```sh
git status
git add .
git commit -m "Initial Next Chapter frontend demo"
```

Commit the source, assets, documentation, configuration and lockfile. `node_modules/`, `dist/`, `figma-import/` and local files are ignored and can be regenerated. After creating a remote repository, add its URL and push `main` when ready.

The workflow PDF and story DOCX are reference documents kept outside this project; they are not required to run, build or export the demo. See [asset provenance](docs/assets.md) for the source figure mapping.
