/**
 * Azure Application Insights instrumentation for Next.js
 * Env: APPLICATIONINSIGHTS_CONNECTION_STRING  (from Azure portal → App Insights → Overview)
 *
 * Captures: server-side exceptions, request durations, dependency calls (SQL, HTTP),
 * custom events/metrics, and traces — viewable in Azure Monitor / App Insights portal.
 *
 * To enable on Azure App Service, also set:
 *   APPLICATIONINSIGHTS_CONNECTION_STRING in Azure App Service → Configuration → App settings
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const connStr = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    if (!connStr) {
      console.info("[instrumentation] APPLICATIONINSIGHTS_CONNECTION_STRING not set — skipping App Insights");
      return;
    }

    try {
      // applicationinsights is an optional Azure dependency — install with:
      //   npm install applicationinsights
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const appInsights = require("applicationinsights");
      appInsights.setup(connStr)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, false)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(false)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "CatalystWire";
      console.info("[instrumentation] Azure Application Insights initialized");
    } catch (err) {
      console.warn("[instrumentation] Failed to initialize App Insights:", err);
    }
  }
}
