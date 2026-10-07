/** Export one static, named HTML screen per Figma import frame. */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "figma-import");

async function captureScreen(page, outputName, viewportHeight = 960) {
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete && image.naturalWidth),
  );
  const screen = await page.evaluate(async () => {
    const clone = document.querySelector(".demo-screen").cloneNode(true);
    clone.querySelectorAll("select").forEach((select) => {
      const preview = document.createElement("div");
      preview.className = select.className + " select-snapshot";
      preview.dataset.component = "OccupationSelect";
      preview.dataset.designName = select.dataset.designName;
      preview.innerHTML =
        '<span></span><svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5"/></svg>';
      preview.firstElementChild.textContent =
        select.selectedOptions[0]?.textContent;
      select.replaceWith(preview);
    });
    clone.querySelectorAll("input[data-member-name]").forEach((input) => {
      const label = document.createElement("h2");
      label.className = input.className;
      label.dataset.designName = "MemberName";
      label.textContent = input.value;
      input.replaceWith(label);
    });
    clone.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      const checkbox = document.createElement("span");
      checkbox.className =
        "city-checkbox" + (input.checked ? " is-checked" : "");
      checkbox.dataset.designName = "CityCheckbox";
      if (input.checked)
        checkbox.innerHTML =
          '<svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>';
      input.replaceWith(checkbox);
    });
    clone
      .querySelectorAll("[data-action], [data-step-id], [tabindex]")
      .forEach((element) => {
        element.removeAttribute("data-action");
        element.removeAttribute("data-step-id");
        element.removeAttribute("tabindex");
      });
    // Static screens remain portable after the dev server has stopped.
    await Promise.all(
      [...clone.querySelectorAll("img")].map(async (image) => {
        const response = await fetch(image.src);
        if (!response.ok) throw new Error(`Cannot embed image: ${image.src}`);
        const blob = await response.blob();
        image.src = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }),
    );
    clone.style.minHeight = "960px";
    return { name: clone.dataset.designName, content: clone.outerHTML };
  });
  const styles = fs.readFileSync(
    path.join(projectRoot, "src", "styles.css"),
    "utf8",
  );
  const html = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=1440,initial-scale=1">\n<title>${screen.name}</title>\n<style>\n${styles}\n</style>\n</head>\n<body class="figma-import-page">\n${screen.content}\n</body>\n</html>\n`;
  fs.writeFileSync(path.join(outputDirectory, outputName), html);
  return {
    filename: outputName,
    frameName: screen.name,
    width: 1440,
    minHeight: viewportHeight,
  };
}

(async () => {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const { startDevelopmentServer, launchBrowser } =
    await import("./browser-utils.mjs");
  const server = await startDevelopmentServer();
  let browser;
  try {
    browser = await launchBrowser(chromium);
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
    });
    const manifest = [];
    const sourceUrl = server.url;

    for (const count of [1, 2, 3, 4]) {
      await page.goto(`${sourceUrl}?members=${count}#/setup`);
      manifest.push(
        await captureScreen(
          page,
          `setup-${count}-member${count === 1 ? "" : "s"}.html`,
        ),
      );
    }
    for (const [count, prefix] of [
      [1, "single"],
      [2, "family"],
    ]) {
      await page.goto(`${sourceUrl}?members=${count}#/setup`);
      const steps = await page.evaluate(() =>
        window.NextChapterDemo.getSteps(),
      );
      for (let index = 0; index < steps.length; index++) {
        await page.evaluate(
          (stepIndex) => window.NextChapterDemo.navigateToStep(stepIndex),
          index,
        );
        manifest.push(
          await captureScreen(
            page,
            `${prefix}-${String(index + 1).padStart(2, "0")}-${steps[index].id}.html`,
          ),
        );
      }
    }

    fs.writeFileSync(
      path.join(outputDirectory, "screen-manifest.json"),
      JSON.stringify(
        { viewport: { width: 1440, minHeight: 960 }, screens: manifest },
        null,
        2,
      ),
    );
    const setupScreens = manifest.filter((screen) =>
      screen.filename.startsWith("setup"),
    );
    const singleScreens = manifest.filter((screen) =>
      screen.filename.startsWith("single"),
    );
    const familyScreens = manifest.filter((screen) =>
      screen.filename.startsWith("family"),
    );
    const links = (screens) =>
      screens
        .map(
          (screen) =>
            `<li><a href="${screen.filename}">${screen.frameName} · ${screen.filename}</a></li>`,
        )
        .join("\n");
    const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Next Chapter · Figma import screens</title><style>body{margin:50px auto;max-width:1000px;padding:0 25px;color:#171a27;background:#fafbfd;font:14px/1.8 -apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif}h1{font-size:28px;letter-spacing:-.6px}h2{font-size:18px;margin-top:30px}p{color:#777f8f}a{color:#8256e9;text-decoration:none}li{margin:8px 0}ul{padding-left:20px}</style></head><body><h1>Next Chapter · Figma import screens</h1><p>Static HTML screens, 1440 px wide. Open one screen and import it as one frame. Run npm run dev from the project directory to open the interactive demo.</p><h2>Analysis setup</h2><ul>${links(setupScreens)}</ul><h2>Single-career flow</h2><ul>${links(singleScreens)}</ul><h2>Family flow · Nursing + ICT</h2><ul>${links(familyScreens)}</ul></body></html>`;
    fs.writeFileSync(path.join(outputDirectory, "index.html"), gallery);
    console.log(
      `Exported ${manifest.length} static HTML screens to figma-import/.`,
    );
  } finally {
    await browser?.close();
    await server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
