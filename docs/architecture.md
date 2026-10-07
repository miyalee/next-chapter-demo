# Architecture

The demo uses native ES modules and Vite, without a UI framework. `index.html` mounts `src/app.js`; images are resolved from `assets/` by `src/assets.js`. No generated HTML is a source of truth.

| Module                           | Responsibility                                                               |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `src/app.js`                     | State, events, routes and capture API                                        |
| `src/assets.js`                  | Explicit runtime image imports                                               |
| `src/data.js`                    | Occupation catalog, baseline city scores, career copy, chart keys and icons  |
| `src/flow.js`                    | Pure step construction, occupation grouping and recommendation context       |
| `src/components.js`              | Pure named HTML render functions                                             |
| `src/styles.css`                 | Colour tokens, component styles, responsive layout and static capture styles |
| `scripts/export-figma-pages.cjs` | Static screen capture, embedded images, manifest and gallery                 |
| `scripts/browser-utils.mjs`      | Local development/preview server and browser lifecycle helpers               |
| `scripts/smoke-test.mjs`         | Browser checks against the built frontend                                    |

## Component hierarchy

```text
SetupScreen
  ApplicationHeader
    Brand
    FamilyContext
    EditAnalysisButton
  SetupContent
    ScreenHeading
    FamilyMembersSection
      FamilyMemberCard / member name
        MemberIdentity
        OccupationSelect
        DataAvailability
      AddFamilyMemberCard
    CitySelectionSection
      CityOptions
    SetupActions
      StartAnalysisButton

Analysis / occupation / phase
  ApplicationHeader
  AnalysisContent
    StepProgress
      ProgressStep / step ID
    AnalysisLayout
      ChartPanel
        CareerOwners
        ChartHeader
        ChartImageContainer
        ChartCaption
      InsightPanel
        EvidenceSection
        MeaningSection
        NextQuestionSection
  BottomNavigation
    PreviousStepButton
    NextStepButton or ExportReportButton
```

Stable member IDs prevent deleting or renaming a family member from changing another member's selected occupation. Family size is not tied to two fixed profile variables. All ten occupation options come from a single catalog. Missing chart coverage is explicit, and repeated occupations share pages instead of duplicating the same image.

`data-component` identifies reusable regions. `data-design-name` supplies readable screen, component and intended layer names. IDs and BEM-style CSS names keep their hierarchy identifiable even if an importer uses its own layer naming rules.

## Capture API

The interactive page exposes a small read/capture interface:

```js
window.NextChapterDemo.getState();
window.NextChapterDemo.getSteps();
window.NextChapterDemo.navigateToStep(0);
window.NextChapterDemo.editAnalysis();
```

The `members` URL parameter initializes the family size, and `careers` can initialize a comma-separated occupation list. Routes use `#/setup` or `#/analysis/<step-id>`. These provide stable entry points for screen capture without clicking through the entire flow.

## Build and static export

`npm run build` writes `dist/` with relative asset URLs. Only runtime images are bundled; original avatar sources and the style reference remain available in the source repository.

`npm run export:figma` starts a temporary local Vite server, captures the named screens with Playwright, inlines each image, and closes the server and browser. Generated static HTML can be opened without a server. `npm test` checks the production build through a temporary preview server. Both commands accept the optional `CHROME_EXECUTABLE_PATH` browser override.

The generated `dist/` and `figma-import/` directories are ignored by Git. Regenerate them after changes to source or assets.
