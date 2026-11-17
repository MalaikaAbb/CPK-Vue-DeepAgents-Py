/**
 * The nav, the route headers, the /status table and the doc sync all read from
 * here, so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under https://docs.copilotkit.ai/vue/deepagents,
 * minus that prefix. Groups and folders mirror that sidebar's separators and
 * folders as of the doc sync recorded in doc-snapshot/manifest.json.
 *
 * Pure TypeScript, no Vue imports: the doc-sync Vite plugin imports this file
 * on the Node side too.
 *
 * Statuses reflect code inspection, mount checks and a fake-key end-to-end
 * run — no route has been driven against a live model yet (README §8).
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/vue/deepagents";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};

export interface RouteMeta {
  path: string;
  title: string;
  /** Path under docs.copilotkit.ai, e.g. `/vue/frontend-tools`. */
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  /** The doc sidebar folder the page sits in, under its group's separator. */
  folder?: string;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
  /** Harness-only page, not a doc page (no doc-sync target). */
  harness?: boolean;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/vue/deepagents",
        summary: "What this harness covers, how the pieces fit, and the agent roster.",
        status: "reference",
        statusNote: "Landing page — orientation and doc-drift summary.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        title: "Quickstart",
        docPath: "/vue/deepagents",
        summary:
          "A Vite Vue app with CopilotChat, a Node Copilot Runtime registering the landing page's LangGraphAgent, and the Deep Agents Quickstart's create_deep_agent graph (`sample_agent`) served by the LangGraph CLI.",
        status: "working",
        statusNote:
          "Vue Quickstart host + Deep Agents landing runtime → LangGraphAgent → `npx @langchain/langgraph-cli dev` → sample_agent. Wiring verified end to end (fake key → OpenAI 401).",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components",
        hasDemo: true,
        folder: "Chat",
        title: "Prebuilt Components",
        docPath: "/vue/deepagents/prebuilt-components",
        summary:
          "The drop-in CopilotChat, as the page's only published code sample, against agent `my-agent`.",
        status: "working",
        statusNote:
          "CopilotSidebar, CopilotPopup and useConfigureSuggestions are named but have no code on this page.",
      },
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Slots",
        docPath: "/vue/deepagents/custom-look-and-feel/slots",
        summary:
          "Vue named and scoped slots on CopilotChat: welcome screen, assistant toolbar, disclaimer, class/props on leaves, custom components, nested slots, labels.",
        status: "partial",
        statusNote:
          "Most samples are template fragments; imports were added to mount them. CustomMessageView and CustomToolbarAction are flagged stand-ins. The disclaimer sample never shows its disclaimer (doc bug, README §9).",
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Headless UI",
        docPath: "/vue/deepagents/custom-look-and-feel/headless-ui",
        summary:
          "A chat with no CopilotKit chrome built from useAgent + useCopilotKit, and the complete variant composed from public message leaves.",
        status: "working",
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Programmatic Control",
        docPath: "/vue/deepagents/programmatic-control",
        summary:
          "Run and stop agent `sales` from buttons with agent.addMessage + copilotkit.runAgent, no chat UI.",
        status: "working",
        statusNote:
          "`sales` is sample_agent. The page renders no output, so the default sample adds a CopilotChat on the same agent (harness). The agent.subscribe sample is a fragment, shown not mounted. The page's interrupt-from-a-button section is replaced by a “not available on this framework” note (README §9).",
      },
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        folder: "Chat › Threads",
        title: "Threads Drawer",
        docPath: "/vue/deepagents/prebuilt-components/copilot-threads-drawer",
        summary:
          "CopilotThreadsDrawer beside CopilotChat under a shared CopilotChatConfigurationProvider, plus the toolbar-button, controlled and customization samples.",
        status: "partial",
        statusNote:
          "Intelligence wired per the Vue Intelligence quickstart, with its fixed local-demo identity. Needs CPK_INTELLIGENCE_API_KEY; not yet verified against a live project (README §9).",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        folder: "Chat › Threads",
        title: "Headless Threads",
        docPath: "/vue/deepagents/headless-threads",
        summary:
          "useThreads with a hand-built list — select, rename, archive, delete — beside CopilotChat.",
        status: "partial",
        statusNote:
          "Same Intelligence runtime as the Threads Drawer. Needs CPK_INTELLIGENCE_API_KEY; not yet verified against a live project (README §9).",
      },
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/vue/deepagents/frontend-tools",
        summary:
          "useFrontendTool registers `filter_incidents`; the agent calls it and the handler updates a Vue ref in the browser.",
        status: "working",
        statusNote:
          "sample_agent carries CopilotKitMiddleware (Deep Agents Quickstart), which forwards frontend tools to the model. Wiring verified with a fake key; not driven against a live model.",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        folder: "Controlled",
        title: "Components as Tools",
        docPath: "/vue/deepagents/generative-ui/tool-based",
        summary:
          "useComponent exposes WeatherCard to the agent as `show_weather`; the agent's arguments become the card's props.",
        status: "working",
        statusNote:
          "show_weather reaches sample_agent through its CopilotKitMiddleware. Wiring verified with a fake key; not driven against a live model.",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        folder: "Controlled",
        title: "Tool Call Rendering",
        docPath: "/vue/deepagents/generative-ui/tool-rendering",
        summary:
          "useDefaultRenderTool (zero-config and custom catch-all) and a per-tool useRenderTool for `get_weather`.",
        status: "partial",
        statusNote:
          "Runs on sample_agent, whose Quickstart get_weather takes `location` and returns a string; the page's WeatherToolCard reads `parameters.city`, so the card shows no city. The page's own tool_rendering_agent.py is in the .md export only, not the rendered page (README §9).",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        folder: "Controlled",
        title: "State Rendering",
        docPath: "/vue/deepagents/generative-ui/state-rendering",
        summary:
          "ResearchProgress reads agent `researcher`'s state through useAgent and renders status, progress and draft.",
        status: "broken",
        statusNote:
          "`researcher` is sample_agent. ResearchProgress reads status/completed/total/draft, which no published deepagents backend writes; the shared_state_streaming.py in the page's .md export is not on the rendered page (README §9).",
      },
      {
        path: "/generative-ui/mcp-apps",
        hasDemo: true,
        folder: "Open-ended",
        title: "MCP Apps",
        docPath: "/vue/deepagents/generative-ui/mcp-apps",
        summary:
          "mcpApps.servers on the runtime; the built-in MCPAppsActivityRenderer draws the server's UI resource in a sandboxed iframe.",
        status: "partial",
        statusNote:
          "Needs `npm run mcp:apps`. sample_agent's CopilotKitMiddleware should bind the MCP tools; not yet verified against a live model (README §9).",
      },
      // ── Components and surfaces (A2UI 1.0). Non-Vue doc pages; only their Vue tabs are used. ──
      {
        path: "/generative-ui/components",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Components and surfaces",
        docPath: "/deepagents/generative-ui/components",
        summary:
          "Step 3 of the page's Try it: the provider gets the standard catalog (`:generativeUI=\"{ ui: standardUI }\"`) and the runtime gives the run a `render_ui` tool.",
        status: "partial",
        statusNote:
          "App.vue verbatim with the chart/map plugins; the page's TanStack BuiltInAgent server.ts is shown, not run; render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model (README §9.16).",
      },
      {
        path: "/generative-ui/components/surfaces",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Surfaces",
        docPath: "/deepagents/generative-ui/components/surfaces",
        summary:
          "A page target (`GenerativeUISurface id=\"featured\"`) the chat can render into, limited to ProductGrid / ProductCard, plus a custom error fallback.",
        status: "partial",
        statusNote:
          "Providers (error boundary) + FeaturedProducts mounted by a harness page; ProductRow is a flagged stand-in; `../product` is left missing (one vue-tsc error); render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model (README §9.17).",
      },
      {
        path: "/generative-ui/components/catalogs",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Catalogs",
        docPath: "/deepagents/generative-ui/components/catalogs",
        summary:
          "A custom catalog (`acme/shop@1`: ProductGrid + ProductCard) built with createGenerativeUI and given to the provider.",
        status: "partial",
        statusNote:
          "Catalog + components verbatim; the provider line is wrapped with a chat (harness); values come from the flagged get_products stand-in tool (harness_agent.py); render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model (README §9.17).",
      },
      {
        path: "/generative-ui/components/standard-catalog",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Standard catalog",
        docPath: "/deepagents/generative-ui/components/standard-catalog",
        summary:
          "standardUI as is, and with Card replaced through `overrides` by MyCard.vue.",
        status: "partial",
        statusNote:
          "Providers.vue (slot) gets a chat; the Card → MyCard override gets a harness provider; extends/omit fragments shown, not mounted; render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model.",
      },
      {
        path: "/generative-ui/components/state-and-actions",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "State and actions",
        docPath: "/deepagents/generative-ui/components/state-and-actions",
        summary:
          "App state bound into props (useGenerativeUIState), a click that runs app code (useGenerativeUIFunction), and writable props.",
        status: "partial",
        statusNote:
          "shopUI functions/events + ProductCard mounted; the handler needs `./cart-store`, never published, so it is shown, not mounted (README §9.18); render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model.",
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Theming",
        docPath: "/deepagents/generative-ui/components/theming",
        summary: "A GenerativeUITheme (accent, font, radius) on the standard catalog.",
        status: "partial",
        statusNote:
          "Themed Providers.vue (slot) gets a chat; dark-mode/per-mode/CSS samples shown, not mounted; render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model.",
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Transports",
        docPath: "/deepagents/generative-ui/components/transports",
        summary:
          "The same standard catalog over the tool transport, the markdown transport, and limited to `agentIds: ['shop']`.",
        status: "partial",
        statusNote:
          "Tool, markdown and agentIds provider lines, each wrapped with a chat (harness); no `shop` agent, so agentIds sends no catalog — as published; render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model.",
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Markdown mode",
        docPath: "/deepagents/generative-ui/components/markdown-mode",
        summary:
          "`transport: 'markdown'`: the agent writes `a2ui` code blocks in its reply and the chat renders them as surfaces.",
        status: "partial",
        statusNote:
          "App.vue (slot) gets a chat; the guide travels in context, which CopilotKitMiddleware passes on; the sendContext: false variant relies on forwarded props sample_agent does not read.",
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        folder: "Components and surfaces",
        title: "Adopt from A2UI",
        docPath: "/deepagents/generative-ui/components/from-a2ui",
        summary:
          "The After provider (`:generativeUI=\"{ ui: appUI }\"`) with the page's flights catalog; the Before line is shown, not mounted.",
        status: "partial",
        statusNote:
          "Airport and Arrow are flagged stand-ins; `z` import added to app-ui.ts; render_ui and its guide reach the model through sample_agent's CopilotKitMiddleware (fake-key check); not yet driven against a live model (README §9.19).",
      },
    ],
  },
  {
    title: "Interactivity",
    routes: [
      {
        path: "/shared-state",
        hasDemo: true,
        folder: "Shared state",
        title: "Shared State",
        docPath: "/vue/deepagents/shared-state",
        summary:
          "Read agent `workspace`'s state with useAgent and write it back with setState from a button.",
        status: "partial",
        statusNote:
          "`workspace` is sample_agent. Reading state and the tone write-back work client-side, but no published deepagents backend writes `notes` or reads `preferences` (README §9).",
      },
      {
        path: "/shared-state/rendering-in-app",
        hasDemo: true,
        folder: "Shared state",
        title: "Render agent state in your app",
        docPath: "/vue/deepagents/shared-state/rendering-in-app",
        summary:
          "A canvas outside the chat seeds and renders `default`'s state; the chat and the canvas share one agent.",
        status: "partial",
        statusNote:
          "The Canvas seeds and renders state, but `default` is sample_agent, which has no tool that writes title/items (README §9).",
      },
      {
        path: "/shared-state/streaming",
        hasDemo: true,
        folder: "Shared state",
        title: "State Streaming",
        docPath: "/vue/deepagents/shared-state/streaming",
        summary:
          "StreamingDocument renders agent `writer`'s `document` state with a LIVE indicator while the run streams.",
        status: "broken",
        statusNote:
          "`writer` is sample_agent: no `document` state and no StateStreamingMiddleware. The shared_state_streaming.py that would provide them is in the .md export only, not the rendered page (README §9).",
      },
      {
        path: "/shared-state/agent-readonly",
        hasDemo: true,
        folder: "Shared state",
        title: "Agent Read-Only Context",
        docPath: "/vue/deepagents/shared-state/agent-readonly",
        summary:
          "useAgentContext publishes the active workspace id to the agent as read-only context.",
        status: "working",
        statusNote:
          "sample_agent's CopilotKitMiddleware passes useAgentContext values to the model. Wiring verified with a fake key; not driven against a live model.",
      },
      {
        path: "/human-in-the-loop",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "HITL Overview",
        docPath: "/vue/deepagents/human-in-the-loop",
        summary:
          "useHumanInTheLoop registers `schedule_meeting`; the agent's call renders a time picker that answers with `respond`.",
        status: "partial",
        statusNote:
          "`default` is sample_agent; its CopilotKitMiddleware binds schedule_meeting. The page prints no App.vue (harness mount) and never publishes TimePickerCard.vue (flagged stand-in).",
      },
      {
        path: "/human-in-the-loop/useInterrupt",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Pausing the Agent for Input",
        docPath: "/vue/deepagents/human-in-the-loop/useInterrupt",
        summary:
          "useInterrupt with renderInChat: false — an Approve / Cancel panel for runtime interrupts (page marks it unavailable for Deep Agents).",
        status: "broken",
        statusNote:
          "The page says useInterrupt is not available on this framework and publishes no interrupting backend; App.vue imports an unpublished MeetingChat.vue (flagged stand-in). The runtime nevertheless reports interrupts: true for this agent (README §9).",
      },
      {
        path: "/human-in-the-loop/headless",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Headless Interrupts",
        docPath: "/vue/deepagents/human-in-the-loop/headless",
        summary: "Resolving interrupts from a panel with no chat mounted.",
        status: "broken",
        statusNote:
          "The page says headless interrupts are not available on this framework and publishes only an App.vue importing an unpublished HeadlessInterruptPanel.vue (flagged stand-in) (README §9).",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Governed Action Approval UI",
        docPath: "/vue/deepagents/human-in-the-loop/governed-actions",
        summary:
          "An approval card for `approve_governed_action` that auto-resolves allow/deny verdicts and asks on require_approval.",
        status: "partial",
        statusNote:
          "Tool half: approve_governed_action reaches sample_agent through CopilotKitMiddleware. Interrupt half (GovernedActionApproval): no interrupting backend is published (README §9).",
      },
      {
        path: "/webmcp",
        hasDemo: true,
        title: "WebMCP",
        docPath: "/vue/deepagents/webmcp",
        summary:
          "A frontend tool mirrored to document.modelContext, via useFrontendTool and via CopilotKitCore directly.",
        status: "partial",
        statusNote:
          "Demo shows only OrderSearch.vue with a flagged searchOrders stand-in (user's choice); calls return sample orders. As published, searchOrders is never defined and every call errors (README §9.9). webmcp.ts is shown, not mounted.",
      },
    ],
  },
  {
    title: "Agent capabilities",
    routes: [
      {
        path: "/multi-agent/subagents",
        title: "Sub-agents",
        docPath: "/vue/deepagents/multi-agent/subagents",
        summary:
          "Supervisor → research / writing / critique sub-agents with a live delegation log.",
        status: "broken",
        statusNote:
          "The rendered page publishes no code at all. Its .md export carries a LangGraph create_agent subagents.py (not Deep Agents) with no supervisor graph and an unpublished _header_forwarding_middleware import (README §9).",
      },
    ],
  },
  {
    title: "Harness",
    routes: [
      {
        path: "/status",
        title: "Status overview",
        docPath: "/vue/deepagents",
        summary: "Every route, its doc page and its status in one table.",
        status: "reference",
        harness: true,
      },
      {
        path: "/doc-sync",
        title: "Doc sync",
        docPath: "/vue/deepagents",
        summary:
          "Re-fetch the markdown behind every tracked doc page, diff it against doc-snapshot/, and replace the snapshot.",
        status: "reference",
        harness: true,
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

/** Doc routes only — what doc sync fetches. */
export const DOC_ROUTES: RouteMeta[] = ALL_ROUTES.filter((r) => !r.harness);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}
