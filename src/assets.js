// Explicit URLs let Vite resolve and bundle every runtime image for static hosting.
export const ASSETS = {
  fig5: new URL("../assets/charts/candidate-cities-map.png", import.meta.url)
    .href,
  fig6: new URL("../assets/charts/ict-demand-treemap.png", import.meta.url)
    .href,
  fig7: new URL("../assets/charts/nursing-demand-treemap.png", import.meta.url)
    .href,
  fig8: new URL("../assets/charts/regional-demand-trends.png", import.meta.url)
    .href,
  fig9: new URL("../assets/charts/ict-demand-heatmap.png", import.meta.url)
    .href,
  fig10: new URL("../assets/charts/nursing-demand-heatmap.png", import.meta.url)
    .href,
  fig11: new URL("../assets/charts/ict-growth-stability.png", import.meta.url)
    .href,
  fig12: new URL(
    "../assets/charts/nursing-growth-stability.png",
    import.meta.url,
  ).href,
  fig13: new URL(
    "../assets/charts/dual-career-sustainability.png",
    import.meta.url,
  ).href,
  fig14: new URL("../assets/charts/score-composition.png", import.meta.url)
    .href,
  fig15: new URL("../assets/charts/scenario-robustness.png", import.meta.url)
    .href,
  fig16: new URL(
    "../assets/charts/brisbane-sydney-comparison.png",
    import.meta.url,
  ).href,
  fig17: new URL("../assets/charts/recommendation-map.png", import.meta.url)
    .href,
  fig8ict: new URL("../assets/charts/ict-demand-trend.png", import.meta.url)
    .href,
  fig8nurse: new URL(
    "../assets/charts/nursing-demand-trend.png",
    import.meta.url,
  ).href,
  maya: new URL("../assets/avatars/maya.jpg", import.meta.url).href,
  alex: new URL("../assets/avatars/alex.jpg", import.meta.url).href,
};
