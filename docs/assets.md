# Asset provenance

All demo imagery is stored in `assets/`. Runtime paths are centralized in `src/assets.js`.

## Supplied charts

These are the original Stage 3 raster charts, renamed for readable paths. The image content is unchanged. Chart captions retain the original figure numbers.

| Figure | File in `assets/charts/`         | Original filename                                       |
| ------ | -------------------------------- | ------------------------------------------------------- |
| 5      | `candidate-cities-map.png`       | `Figure5_Map_setting.png`                               |
| 6      | `ict-demand-treemap.png`         | `Figure6_Treemap_ICT.png`                               |
| 7      | `nursing-demand-treemap.png`     | `Figure7_Treemao_Nurse.png`                             |
| 8      | `regional-demand-trends.png`     | `Figure8_Regional ICT and Nursing Job Demand Trend.png` |
| 9      | `ict-demand-heatmap.png`         | `Figure9_CityYear Heatmap_ICT.png`                      |
| 10     | `nursing-demand-heatmap.png`     | `Figure10_CityYear Heatmap_Nurse.png`                   |
| 11     | `ict-growth-stability.png`       | `Figure11_Growth and Stability-ICT.png`                 |
| 12     | `nursing-growth-stability.png`   | `Figure12_Growth and Stability-Nurse.png`               |
| 13     | `dual-career-sustainability.png` | `Figure13_Dual-Career Sustainability Matrix.png`        |
| 14     | `score-composition.png`          | `Figure14_Scope Composition Heat Table.png`             |
| 15     | `scenario-robustness.png`        | `Figure15_Robustness Table.png`                         |
| 16     | `brisbane-sydney-comparison.png` | `Figure16_Head-to-head.png`                             |
| 17     | `recommendation-map.png`         | `Figure17_Map-solution.png`                             |

`ict-demand-trend.png` and `nursing-demand-trend.png` are occupation-specific crops of Figure 8. They retain its axes and city legend; no new chart data was created. Both crops are committed assets, so building requires no Python or image-processing dependency.

## Avatars and style

`assets/avatars/maya-original.png` and `alex-original.png` preserve the supplied avatars. `maya.jpg` and `alex.jpg` are 256-pixel thumbnails used by the demo, matching the previous standalone HTML. `assets/references/style.jpeg` is the supplied visual-style reference, not a runtime dependency.

The original workflow PDF and story DOCX remain outside this frontend project. Their relevant screen copy is already in `src/data.js` and `src/flow.js`; building and exporting do not depend on either document.
