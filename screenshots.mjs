// Drives a real Chrome through every scenario and saves the screenshots used
// in the READMEs. It doubles as an end to end check: each step prints what it saw.
//
// Start these first (see README): the backend with TOKEN_SECONDS=8,
// then npm start in 02-theme-context and 03-student-portal.
//   node screenshots.mjs
import { mkdirSync } from "fs";
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const THEME = "http://localhost:3002";
const PORTAL = "http://localhost:3003";
const TOKEN_SECONDS = Number(process.env.TOKEN_SECONDS ?? 8);
const OUT = "screenshots";

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, defaultViewport: { width: 1000, height: 640 } });
const page = await browser.newPage();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(name, note) {
  await wait(400);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${name.padEnd(28)} ${page.url().replace(/^http:\/\/localhost:\d+/, "").padEnd(32)} ${note}`);
}

async function login(email, password) {
  await page.goto(`${PORTAL}/login`, { waitUntil: "networkidle0" });
  await page.$eval('input[name="email"]', (el, v) => (el.value = v), email);
  await page.$eval('input[name="password"]', (el, v) => (el.value = v), password);
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}), page.click("form button")]);
  await page.waitForFunction(() => location.pathname === "/dashboard", { timeout: 10000 });
  await page.waitForSelector("h1");
}

async function text(selector) {
  return page.$eval(selector, (el) => el.innerText.trim()).catch(() => "");
}

// 02: prop drilling vs context
await page.goto(`${THEME}/drilling`, { waitUntil: "networkidle0" });
await shot("02-prop-drilling", "theme passed through every level");
await page.goto(`${THEME}/context`, { waitUntil: "networkidle0" });
await shot("02-context-light", await text("h1"));
await page.click("button");
await shot("02-context-dark", await text("h1"));

// 03: logged out
await page.goto(`${PORTAL}/dashboard`, { waitUntil: "networkidle0" });
await page.waitForFunction(() => location.pathname === "/login");
await shot("03-dashboard-logged-out", "server redirected to /login");

// 03: student
await login("ahmed@giu-uni.de", "student123");
await shot("03-dashboard-student", await text("h1"));

// The httpOnly cookie, as the browser and as JavaScript see it
const cookies = await page.cookies(PORTAL);
const fromJs = await page.evaluate(() => document.cookie);
const token = cookies.find((c) => c.name === "token");
await page.setContent(`
  <body style="font-family:system-ui;padding:32px;background:#f1f5f9">
    <h2>The token cookie after login</h2>
    <table style="border-collapse:collapse;background:white" cellpadding="10" border="1">
      <tr><th align="left">name</th><td><code>${token.name}</code></td></tr>
      <tr><th align="left">value</th><td><code>${token.value.slice(0, 48)}...</code></td></tr>
      <tr><th align="left">httpOnly</th><td><b>${token.httpOnly}</b></td></tr>
      <tr><th align="left">sameSite</th><td>${token.sameSite}</td></tr>
      <tr><th align="left">path</th><td>${token.path}</td></tr>
    </table>
    <h2>What JavaScript sees: <code>document.cookie</code></h2>
    <pre style="background:white;padding:12px;font-size:18px">"${fromJs}"</pre>
    <p>The browser has the cookie and sends it, but page code cannot read it.</p>
  </body>`);
await shot("01-httponly-cookie", `httpOnly=${token.httpOnly}, document.cookie="${fromJs}"`);

await login("ahmed@giu-uni.de", "student123");
await page.click("a[href='/students/1/courses']");
await page.waitForFunction(() => location.pathname === "/students/1/courses");
await page.waitForSelector("li");
await shot("03-student-courses", "server component with apiserver()");

await page.goto(`${PORTAL}/students/2/courses`, { waitUntil: "networkidle0" });
await page.waitForFunction(() => location.pathname === "/unauthorized");
await shot("03-student-other-courses", "403 from the server side");

await page.goto(`${PORTAL}/courses`, { waitUntil: "networkidle0" });
await page.waitForFunction(() => location.pathname === "/unauthorized", { timeout: 10000 });
await shot("03-student-admin-page", "403 caught by the interceptor");

// 03: expiry
await login("ahmed@giu-uni.de", "student123");
await page.click("main button");
await page.waitForSelector("main li");
await shot("03-before-expiry", "browser request works");
console.log(`waiting ${TOKEN_SECONDS + 2} seconds for the token to expire...`);
await wait((TOKEN_SECONDS + 2) * 1000);
await page.click("main button");
await page.waitForFunction(() => location.pathname === "/login", { timeout: 10000 });
await shot("03-after-expiry", await text("form p"));

// 03: admin
await login("nada@giu-uni.de", "admin123");
await shot("03-dashboard-admin", "navbar shows the admin badge");
await page.click("nav a[href='/courses']");
await page.waitForSelector("main li");
await shot("03-admin-courses", "same Courses link, admin page");

await page.click("nav button");
await page.waitForFunction(() => location.pathname === "/login");
await shot("03-logged-out", "after Log out");

await browser.close();
