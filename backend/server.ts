import { createServer } from "node:http";
import { CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";

import { docAgents, sampleAgent } from "./agents";
import { createMcpAppsRuntime } from "./runtimes/mcp-apps"; // [harness]
import { createThreadsRuntime, threadsMode } from "./runtimes/threads"; // [harness]

/**
 * The Copilot Runtime, as two doc pages split it:
 *
 * - The HOST is the Vue Quickstart's server.ts (https://docs.copilotkit.ai/vue):
 *   a Node server with createCopilotNodeListener on :8200, `cors: true`. The
 *   Deep Agents Vue Quickstart's .md is that page, and it says to keep its Vue
 *   steps and take "the runtime wiring" from your framework's quickstart.
 * - The RUNTIME is the Deep Agents landing page's
 *   (https://docs.copilotkit.ai/vue/deepagents): `agents: { sample_agent:
 *   new LangGraphAgent(...) }` (agents.ts). That page publishes it as a Next.js
 *   route (createCopilotRuntimeHandler + GET/POST/PATCH/DELETE exports); a Vue
 *   app has no Next route, so the Vue Quickstart's Node listener hosts it.
 *
 * [harness] additions:
 *   1. `...docAgents()` — the agent ids the Vue samples use, all sample_agent (agents.ts).
 *   2. Two runtimes doc pages publish separately, on their own base paths:
 *        /api/copilotkit-threads   Intelligence runtime (Threads Drawer, Headless Threads)
 *        /api/copilotkit-mcp-apps  MCP Apps' runtime (mcpApps.servers)
 */
const runtime = new CopilotRuntime({
  agents: {
    sample_agent: sampleAgent(),
    ...docAgents(), // [harness]
  },
});

const port = Number(process.env.PORT ?? 8200);

// ── [harness] the other runtimes, longest prefix first ──────────────────────
const quickstartListener = createCopilotNodeListener({
  runtime,
  basePath: "/api/copilotkit",
  cors: true,
});
const extraListeners = [
  {
    basePath: "/api/copilotkit-threads",
    listener: createCopilotNodeListener({
      runtime: createThreadsRuntime(),
      basePath: "/api/copilotkit-threads",
      cors: true,
    }),
  },
  {
    basePath: "/api/copilotkit-mcp-apps",
    listener: createCopilotNodeListener({
      runtime: createMcpAppsRuntime(),
      basePath: "/api/copilotkit-mcp-apps",
      cors: true,
    }),
  },
];
const dispatch: Parameters<typeof createServer>[1] = (req, res) => {
  const path = req.url ?? "/";
  const match = extraListeners.find(
    (l) => path === l.basePath || path.startsWith(`${l.basePath}/`),
  );
  return (match?.listener ?? quickstartListener)(req, res);
};
// ────────────────────────────────────────────────────────────────────────────

createServer(
  dispatch, // [harness] published: createCopilotNodeListener({ runtime, basePath: "/api/copilotkit", cors: true })
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
  // [harness]
  console.log(`  LangGraph server: ${process.env.LANGGRAPH_DEPLOYMENT_URL ?? "(LANGGRAPH_DEPLOYMENT_URL not set)"}`);
  console.log(`  + /api/copilotkit-threads  (${threadsMode})`);
  console.log(`  + /api/copilotkit-mcp-apps`);
});
