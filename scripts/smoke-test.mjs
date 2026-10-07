/** Exercise user journeys against the built site, including external asset loading. */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { startPreviewServer, launchBrowser } from "./browser-utils.mjs";

const server = await startPreviewServer();
let browser;
try {
  browser = await launchBrowser(chromium);
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  const state = () => page.evaluate(() => window.NextChapterDemo.getState());
  const steps = () => page.evaluate(() => window.NextChapterDemo.getSteps());
  const waitForImages = () =>
    page.waitForFunction(() =>
      [...document.images].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
  const open = async (route = "") => {
    await page.goto(`${server.url}${route}`);
    await page.waitForFunction(() => !!window.NextChapterDemo);
    await waitForImages();
  };
  const jump = async (index) => {
    await page.evaluate(
      (value) => window.NextChapterDemo.navigateToStep(value),
      index,
    );
    await waitForImages();
  };

  await open();
  assert.equal((await state()).members[0].name, "Maya");
  assert.equal(await page.locator("select option").count(), 10);
  assert.equal((await steps()).length, 6);
  await page.locator('[data-action="start-analysis"]').click();
  for (let index = 0; index < 6; index++) {
    await jump(index);
    assert.equal(await page.locator(".chart-image").count(), 1);
    assert.equal(
      await page.locator('[data-design-name="EditAnalysisButton"]').count(),
      1,
    );
    assert.equal(
      await page.locator(".export-report-button").count(),
      index === 5 ? 1 : 0,
    );
  }
  assert.match(await page.locator("h1").innerText(), /Brisbane/);
  await page.locator('[data-action="edit-analysis"]').last().click();
  await page.locator('[data-action="add-member"]').click();
  assert.equal((await state()).members[1].name, "Alex");
  const positions = await page
    .locator(".family-members-grid")
    .evaluate((element) =>
      [...element.children].map((child) => ({
        x: child.offsetLeft,
        y: child.offsetTop,
      })),
    );
  assert.equal(positions[0].y, positions[1].y);
  assert.equal(positions[1].y, positions[2].y);
  assert.ok(positions[0].x < positions[1].x && positions[1].x < positions[2].x);
  await page.locator('[data-action="add-member"]').click();
  await page.locator('[data-action="add-member"]').click();
  assert.equal((await state()).members.length, 4);
  assert.equal(await page.locator("#add-family-member-card").count(), 1);
  await page.locator('[data-member-name="member-3"]').fill("Ethan");
  await page.locator('[data-member-name="member-3"]').press("Tab");
  assert.equal((await state()).members[2].name, "Ethan");
  await page.locator('[data-action="start-analysis"]').click();
  assert.equal((await steps()).length, 13);
  await jump(1);
  assert.equal(await page.locator(".career-owner").count(), 2);
  for (let index = 0; index < 13; index++) await jump(index);
  await page.locator('[data-step-id="candidate-cities"]').click();
  assert.equal((await state()).stepIndex, 0);
  await page.locator('[data-step-id="recommendation"]').click();
  assert.match(await page.locator("h1").innerText(), /Brisbane/);
  await page.locator('[data-design-name="EditAnalysisButton"]').click();
  assert.equal((await state()).members.length, 4);
  await page.locator("#occupation-member-3").selectOption("teacher");
  assert.match(
    await page.locator("#availability-member-3").innerText(),
    /not available/,
  );
  await page
    .locator('[data-action="remove-member"][data-member-id="member-2"]')
    .click();
  assert.equal((await state()).members[1].name, "Ethan");
  assert.equal((await state()).members[1].occupation, "teacher");

  await open("?members=1&careers=teacher#/setup");
  assert.equal((await steps()).length, 2);
  await jump(1);
  assert.match(
    await page.locator("#insight-panel").innerText(),
    /not a scored career recommendation/,
  );
  await open("?members=2#/analysis/career-match");
  assert.equal((await steps())[(await state()).stepIndex].id, "career-match");
  await open("?members=1#/setup");
  await page.locator('[data-action="toggle-cities"]').click();
  await page.locator('[data-action="start-analysis"]').click();
  assert.equal((await state()).screen, "setup");
  assert.match(
    await page.locator("#setup-error").innerText(),
    /Choose at least one city/,
  );
  await page.locator('[data-city="Sydney"]').check();
  await jump(5);
  assert.match(await page.locator("h1").innerText(), /Sydney/);

  await open("?members=4#/setup");
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await jump(12);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "Passed: built asset loading, single/family flows, member editing, missing data, step navigation, recommendation and mobile layout.",
  );
} finally {
  await browser?.close();
  await server.close();
}
