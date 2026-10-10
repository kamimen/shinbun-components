import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

// Chrome is the installed Google Chrome; Firefox and WebKit are the Playwright builds.
// Choose a subset with SHINBUN_BROWSERS, e.g. SHINBUN_BROWSERS=chrome,webkit
const launchers = {
  // locally: the installed Google Chrome; in CI: the Chromium that Playwright installs
  chrome: () =>
    playwrightLauncher({ product: "chromium", launchOptions: process.env.CI ? { headless: true } : { channel: "chrome", headless: true } }),
  firefox: () => playwrightLauncher({ product: "firefox", launchOptions: { headless: true } }),
  webkit: () => playwrightLauncher({ product: "webkit", launchOptions: { headless: true } }),
};
const names = (process.env.SHINBUN_BROWSERS ?? "chrome,firefox,webkit").split(",").map((n) => n.trim());

export default {
  files: "test/browser/*.test.ts",
  hostname: "127.0.0.1",
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
  browsers: names.map((n) => {
    if (!launchers[n]) throw new Error(`Unknown browser "${n}". Use chrome, firefox or webkit.`);
    return launchers[n]();
  }),
  testFramework: { config: { ui: "bdd", timeout: 5000 } },
};
