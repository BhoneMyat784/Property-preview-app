import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("portal-language", "en"));
});

test("follows system appearance until a manual choice and persists across routes and reloads", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(247, 248, 243)",
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(16, 27, 22)",
  );
  const toggle = page.getByRole("button", { name: "Switch to light mode" });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.goto("/auth");
  await expect(page.getByLabel("Email address")).toHaveCSS(
    "background-color",
    "rgb(27, 43, 34)",
  );
  await expect(page.getByLabel("Email address")).toHaveCSS(
    "color",
    "rgb(231, 240, 233)",
  );
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.goto("/properties");
  await expect(page.getByLabel("City", { exact: true })).toHaveCSS(
    "background-color",
    "rgb(27, 43, 34)",
  );
  await page.getByRole("button", { name: "မြန်မာဘာသာသို့ပြောင်းရန်" }).click();
  await page.getByRole("button", { name: "အလင်းစနစ်သို့ပြောင်းရန်" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("synchronizes choices across tabs and returns to system appearance when cleared", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/auth");
  const second = await context.newPage();
  await second.emulateMedia({ colorScheme: "light" });
  await second.goto("/auth");
  await expect(
    second.getByRole("button", { name: "Switch to dark mode" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(second.locator("html")).toHaveAttribute("data-theme", "dark");
  await second.evaluate(() => localStorage.removeItem("portal-theme"));
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await second.close();
});

test("applies a saved preference before hydration and works when browser storage is unavailable", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("portal-theme", "dark"));
  await page.route("**/*.js*", (route) => route.abort());
  await page.goto("/auth");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(16, 27, 22)",
  );
  await page.unroute("**/*.js*");
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Storage unavailable");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.reload();
  // Language storage is unavailable too, so the default label is Burmese.
  const toggle = page.getByRole("button", {
    name: "အမှောင်စနစ်သို့ပြောင်းရန်",
  });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
