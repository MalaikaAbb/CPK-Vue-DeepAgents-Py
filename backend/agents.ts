import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

/**
 * Agents for every runtime in this repo.
 *
 * `sampleAgent()` is the agent the Deep Agents landing page registers
 * (https://docs.copilotkit.ai/vue/deepagents — its only code block),
 * verbatim: a LangGraphAgent pointed at the LangGraph server that serves
 * agent/langgraph.json, graph `sample_agent` (the Deep Agents Quickstart's
 * create_deep_agent graph, agent/main.py).
 *
 * [harness] Doc agent ids. The landing page registers only `sample_agent`,
 * while the Vue samples use `default` (no agent-id) and ids no page registers.
 * By the user's rules a page that publishes its own complete backend runs it
 * under its agent id — but no rendered Vue deepagents page publishes any
 * backend (README §9), so every id is the landing page's sample_agent,
 * unchanged.
 */
export function sampleAgent() {
  // Verbatim from the landing page's runtime route.
  return new LangGraphAgent({
    deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL!,
    graphId: "sample_agent",
    langsmithApiKey: process.env.LANGSMITH_API_KEY!,
  });
}

/** [harness] Doc agent ids the Vue samples use. All are sample_agent (see above). */
export const DOC_AGENT_IDS = [
  "default", //            no agent-id: Quickstart, Slots, Frontend Tools, Tool-based, Tool Rendering, Rendering in app, Read-only, HITL, Governed Actions, WebMCP, useInterrupt, Headless Interrupts
  "my-agent", //           Prebuilt Components, Headless UI, Headless Threads
  "sales", //              Programmatic Control
  "support", //            Threads Drawer
  "researcher", //         State Rendering
  "workspace", //          Shared State
  "writer", //             State Streaming
] as const;

export function docAgents() {
  return Object.fromEntries(DOC_AGENT_IDS.map((id) => [id, sampleAgent()]));
}
