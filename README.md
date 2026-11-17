# CopilotKit Vue + Deep Agents (Python) Test Suite

A navigable, working test harness for CopilotKit's **Vue** frontend against a **Deep Agents (Python)** agent. Each Vue doc page is a route that runs that page's own code.

| | |
|---|---|
| **Doc sync date** | Machine-maintained: `doc-snapshot/manifest.json` → `syncedAt` (baseline taken 2026-11-13, 22 pages; 9 Components and surfaces pages added the same day). |
| **CopilotKit packages** | `@copilotkit/vue` 1.87.0 · `@copilotkit/core` 1.87.0 · `@copilotkit/runtime` 1.87.0 (`LangGraphAgent` from `@copilotkit/runtime/langgraph`) · `copilotkit` 0.1.97 (Python) |
| **Deep Agents** | `deepagents` 0.7.37 · `langgraph` 1.2.21 · `langchain` 1.5.0 · `langchain-openai` 1.7.4 · served by `@langchain/langgraph-cli` 1.7.2 (`npx`, as the Quickstart says), which runs `langgraph-api` 0.18.0 · Python 3.12 (as the published `langgraph.json` pins) |
| **Frontend** | Vite 8.3 · Vue 3.5 · vue-router 5.5 · TypeScript 6.0 · Tailwind 4.3 (harness chrome only) · zod 3.25.76 · chart.js 4.6 · maplibre-gl 5.24 (Components and surfaces) |
| **Build status** | No CI. `vite build` ✅. `vue-tsc` reports 8 errors, all in published doc code (§9.10). All 89 URLs (every route and every demo sample) mounted in headless Chrome with **zero console or page errors** (the two `App.vue` samples that call `http://localhost:8200` directly — Quickstart, Components and surfaces — were rechecked with the runtime on 8200). The full chain (runtime → `LangGraphAgent` → LangGraph CLI → `create_deep_agent` graph → OpenAI) was driven with a **fake** key on agent ids `default` and `sales`: each run reached OpenAI and failed only with `401 Incorrect API key`. From the browser (Catalogs sample), the run that reached the Deep Agent carried the `render_ui` tool and the `ProductCard` schema. Transports: the tool sample's run reached the LangGraph server with `render_ui` in its state, the markdown sample's with the a2ui guide and no tool, and the `agentIds: ['shop']` sample's with neither. **No route has been driven against a live model yet.** |

---

## 2. Overview

Deep Agents is LangChain's framework for long-horizon agents: `create_deep_agent` returns a compiled LangGraph graph with planning, a virtual file system and sub-agents built in. CopilotKit connects that graph to a Vue app: the Copilot Runtime registers a `LangGraphAgent` that talks to a LangGraph server, and `@copilotkit/vue` renders the conversation, tools, state and interrupts.

This repo turns the Quickstart and the Basics, Generative UI, Interactivity and Agent capabilities sections of the Vue Deep Agents sidebar (22 pages), plus the nine **Components and surfaces** pages under `/deepagents/generative-ui/components` (their **Vue** code tabs only), into one navigable Vite app. Every route mounts the page's code verbatim, bugs included, and shows the exact files that run. Anything the harness had to add is marked **[harness]** in the file, in a pink **Harness** callout on the notes page, and, for stand-in components, with a **HARNESS STAND-IN** badge on screen.

Tracks: **<https://docs.copilotkit.ai/vue/deepagents>**

---

## 3. Architecture

```
Browser — Vite dev server · localhost:5173
  │  @copilotkit/vue/v2; each /<route>/demo-chat mounts that page's own App.vue
  │  runtime-url="/api/copilotkit…" ──► Vite proxy /api → :8200
  ▼
Node · backend/server.ts · localhost:8200
  │  Vue Quickstart's host: createServer + createCopilotNodeListener({ cors: true })
  │  Deep Agents landing page's runtime: LangGraphAgent({ deploymentUrl, graphId: "sample_agent" })
  │  /api/copilotkit                 every doc agent id → sample_agent (table below)
  │  /api/copilotkit-threads         Intelligence quickstart's runtime (if key set) [harness: own path]
  │  /api/copilotkit-mcp-apps        MCP Apps' runtime (mcpApps.servers)          [harness: own path]
  ▼  LANGGRAPH_DEPLOYMENT_URL
Python · agent/ · `npx @langchain/langgraph-cli dev --config langgraph.harness.json` · localhost:8123   (Python 3.12)
  │  langgraph.harness.json (= langgraph.json verbatim, graph path changed) graphs:
  │    sample_agent   harness_agent.py → main.py unchanged — Deep Agents Quickstart, Python tab:
  │                   create_deep_agent(model="openai:gpt-6-luna", tools=[get_weather],
  │                                     middleware=[CopilotKitMiddleware()])
  │                   + [harness] get_products stand-in tool (§9.17)
  ▼
OpenAI ("gpt-6-luna")                MCP Apps example server on :3101 (MCP Apps route only)
```

**Three processes.** The agent is **Python** (Deep Agents, served by the LangGraph CLI). The Copilot Runtime is **TypeScript on Node** (`tsx`). The frontend is Vite.

**Where each piece comes from.**
- **The Vue Deep Agents Quickstart's `.md` is the built-in Vue Quickstart** (`BuiltInAgent`), which says to keep its Vue frontend steps and take "the runtime wiring" from your framework's quickstart. So `App.vue`, `main.ts` and the Node host come from the Vue Quickstart.
- **The landing page's only code block is the runtime**, published as a Next.js route (`createCopilotRuntimeHandler` + `GET/POST/PATCH/DELETE`). Its `agents: { sample_agent: new LangGraphAgent(...) }` is used verbatim, hosted in the Vue Quickstart's Node listener (a Vite app has no Next route).
- **The `sample_agent` graph** comes from the Deep Agents Quickstart that the landing page links as its guide (`/deepagents/quickstart`), **Python** tab: `main.py` + `langgraph.json` verbatim, started with the page's own command, `npx @langchain/langgraph-cli dev --port 8123 --no-browser`, plus `--config langgraph.harness.json`: that config serves `sample_agent` from the flagged `harness_agent.py`, which imports `main.py` unchanged and adds one stand-in tool, `get_products` (§9.17). The page's TypeScript and FastAPI tabs are not used.

### Agent ids → graphs

The landing page registers only `sample_agent`. By your rules, a page that publishes its own **complete** backend runs it under its agent id; every other id is `sample_agent`. **No rendered Vue deepagents page publishes a backend** (§9.2), so every id is `sample_agent` (`backend/agents.ts`).

| Agent id | Graph | Used by |
|---|---|---|
| `default` | `sample_agent` | Quickstart, Slots, Frontend Tools, Components as Tools, Tool Rendering, Render state in app, Agent Read-Only Context, HITL Overview, Pausing the Agent for Input, Headless Interrupts, Governed Actions, WebMCP |
| `my-agent` | `sample_agent` | Prebuilt Components, Headless UI, Headless Threads |
| `sales` | `sample_agent` | Programmatic Control |
| `support` | `sample_agent` | Threads Drawer |
| `researcher` | `sample_agent` | State Rendering |
| `workspace` | `sample_agent` | Shared State |
| `writer` | `sample_agent` | State Streaming |

The nine **Components and surfaces** routes all use `default` (`sample_agent`). Their `render_ui` tool is added per run by the runtime when the provider sends a catalog; no runtime option is set (§9.16).

**What `sample_agent` can and cannot do.** It carries `CopilotKitMiddleware` ("for frontend tools and context"), so frontend tools, `useHumanInTheLoop` tools, MCP tools sent with the run, and `useAgentContext` values reach the model. Its backend tools are `get_weather(location)`, the flagged stand-in `get_products()` (§9.17), plus Deep Agents' built-ins (`write_todos`, file tools, `task`). It writes no custom state keys and never calls `interrupt()`.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | **24.12+** (or 22.18+) | `create-vue`'s scaffold requires it. Developed on 24.16. |
| npm | 10+ | Developed on npm 12. `npx` fetches `@langchain/langgraph-cli` on first run. |
| uv | 0.11+ | `uv sync` creates `agent/.venv` (for editors and imports). The LangGraph CLI downloads its own uv (0.9.11) and builds its own server environment from `langgraph.json` → `dependencies: ["."]`. |
| Python | 3.12 | Pinned by the published `langgraph.json` (`"python_version": "3.12"`) and `agent/.python-version`; uv provides it. |
| OpenAI API key | — | Required, in `agent/.env`. The graph uses `openai:gpt-6-luna` as published. |
| CopilotKit Intelligence key | — | Optional, only for the two Threads routes. |

---

## 5. Setup

```bash
git clone <this-repo> deepagents-py && cd deepagents-py
cd agent && uv sync && cd ..            # Quickstart deps: deepagents, copilotkit, langchain-openai
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cp .env.example agent/.env              # set OPENAI_API_KEY
cp .env.example backend/.env            # LANGGRAPH_DEPLOYMENT_URL is pre-filled
```

| File | Variable | What it does |
|---|---|---|
| `agent/.env` | `OPENAI_API_KEY` | **Required.** Read by the graph (`langgraph.json` → `"env": ".env"`). The Quickstart's "Configure your environment" step. |
| `backend/.env` | `LANGGRAPH_DEPLOYMENT_URL` | **Required.** Where `LangGraphAgent` finds the graph: `http://localhost:8123`. |
| `backend/.env` | `LANGSMITH_API_KEY` | Optional. The landing page's `langsmithApiKey`; not needed for a local dev server. |
| `backend/.env` | `CPK_INTELLIGENCE_API_KEY` | Optional. Intelligence for the Threads runtime. `cd backend && npx copilotkit@latest login && npx copilotkit@latest project select` writes it to `backend/.env`. |
| `backend/.env` | `APP_USER_ID` | Optional. The fixed local identity for Threads (default `local-user`). |
| `backend/.env` | `MCP_APPS_URL` · `PORT` · `COPILOTKIT_TELEMETRY_DISABLED` | Optional. MCP server URL (default `http://localhost:3101/mcp`), runtime port (default 8200), telemetry opt-out. |

**Ports:** agent **8123**, runtime **8200**, frontend **5173** (`strictPort`), MCP Apps example **3101** (MCP Apps route only).

---

## 6. Running the project

Three terminals:

```bash
# 1 — Deep Agent (Deep Agents Quickstart, "Start your agent")
cd agent && npx @langchain/langgraph-cli dev --port 8123 --no-browser --config langgraph.harness.json
```
`--config langgraph.harness.json` is the harness's only change to the Quickstart command: it adds the `get_products` stand-in tool for the Catalogs and Surfaces routes (§9.17). Without it the graph is the Quickstart's exactly, and those routes answer with a request for product data.
Success: `Application started up` in the log (after a warning that launching a Python server from the JS CLI is experimental, §9.1). `curl -s -X POST localhost:8123/assistants/search -H 'content-type: application/json' -d '{}'` lists `sample_agent`. The first start downloads uv and the server's Python dependencies; later starts are quick.

```bash
# 2 — Copilot Runtime
cd backend && npm run dev
```
Success:
```
Copilot Runtime listening at http://localhost:8200/api/copilotkit
  LangGraph server: http://localhost:8123
  + /api/copilotkit-threads  (sse)
  + /api/copilotkit-mcp-apps
```
(`(intelligence)` instead of `(sse)` when `CPK_INTELLIGENCE_API_KEY` is set.) `curl -s localhost:8200/api/copilotkit/info` lists `sample_agent` and the seven doc ids.

```bash
# 3 — Vue app
cd frontend && npm run dev               # → http://localhost:5173/
```

Open **<http://localhost:5173>**. The landing page's **Connection** panel probes all three runtime paths.

**MCP Apps route only:** `cd backend && npm run mcp:apps` (official ext-apps example on :3101).

---

## 7. What to expect: walkthrough per section

Each route has a notes page (`/<route>`: notes, Try-it prompts with pass/fail, the exact source that runs, unmounted samples as published, Harness and gap callouts) and a demo (`/<route>/demo-chat`, opened with **Open demo ↗**; a **Sample** picker where a page has several samples).

### Getting Started
**`/quickstart`**: `CopilotChat` → runtime → `sample_agent`. **Try:** `Hello! What can you do?`, then `What is the weather in Paris?` **Pass:** a streamed reply; for the weather prompt a `get_weather` call ("The weather in Paris is sunny."). The Inspector's AG-UI Events show `RUN_STARTED → STEP_STARTED → … → RUN_FINISHED`. **Fail:** `RUN_ERROR` naming the thread, or connection refused, means the LangGraph CLI isn't running or `LANGGRAPH_DEPLOYMENT_URL` is unset. A 401 means `OPENAI_API_KEY` is missing from `agent/.env`.

### Basics
**`/prebuilt-components`**, **`/custom-look-and-feel/headless-ui`**, **`/programmatic-control`**: chat against `sample_agent`: a streamed reply; Headless UI streams into bare rows; Programmatic Control's default sample adds a chat (harness, on request). **`/custom-look-and-feel/slots`**: nine samples; the **Disclaimer** sample shows no disclaimer (doc bug, §9.15).
**`/prebuilt-components/copilot-threads-drawer`**, **`/headless-threads`**: need `CPK_INTELLIGENCE_API_KEY`. `/api/copilotkit-threads/info` should report `mode: "intelligence"`. **Pass:** a thread row after the first run; selecting one replays it.
**`/frontend-tools`**: **Try:** `Show only critical incidents`. **Pass:** the agent calls `filter_incidents` and "Current filter" changes. **Fail:** a prose answer with the filter unchanged.

### Generative UI
**`/generative-ui/tool-based`**: **Try:** `Show me the weather in Tokyo`. **Pass:** a `WeatherCard` with the agent's arguments as props. **Fail:** prose only.
**`/generative-ui/tool-rendering`**: **Try:** `What is the weather in Tokyo?` **Pass:** zero-config shows a status card (`{ location: "Tokyo" }` → "The weather in Tokyo is sunny."); catch-all shows the `BrandedToolCard` stand-in. **Expected per-tool:** the `WeatherToolCard` renders with **no city**, because it reads `city` and the Quickstart tool takes `location` (§9.3).
**`/generative-ui/state-rendering`**: **Expected now:** "Idle" and an empty bar (§9.5).
**`/generative-ui/mcp-apps`**: start `npm run mcp:apps` first. **Try:** a prompt that needs the example server's tool. **Pass:** the server's UI renders in a sandboxed iframe. Not yet verified (§9.4).

### Interactivity
**`/shared-state`**: **Try:** **Prefer concise answers**, then `Write a two-line poem`. **Pass:** the `preferences.tone` write lands in state (Inspector › State) and the agent replies. **Expected:** the notes list stays empty and the tone has no effect (§9.6).
**`/shared-state/rendering-in-app`**: the Canvas shows "Project launch", but the agent can't edit it (§9.6).
**`/shared-state/streaming`**: **Expected now:** "Waiting for a draft…" and the text in the chat (§9.5).
**`/shared-state/agent-readonly`**: **Try:** `Which workspace am I in?` **Pass:** the agent names the workspace id from `useAgentContext`. **Fail:** it doesn't know.
**`/human-in-the-loop`**: **Try:** `Schedule a meeting about Q3 planning with Dana`. **Pass:** a time-picker card (flagged stand-in); picking a slot resumes the run.
**`/human-in-the-loop/governed-actions`**: **Try:** the prompts on the notes page (verdicts `require_approval` / `allow` / `deny`). **Pass:** the card asks on `require_approval` and auto-resolves the other two. The interrupt half can't fire (§9.7).
**`/human-in-the-loop/useInterrupt`**, **`/human-in-the-loop/headless`**: **Expected now:** no interrupt, ever (§9.7).
**`/webmcp`**: stand-in sample only (same choice as the other harnesses). In Chrome 149+ with WebMCP, **Run tool** `searchOrders` `{"status":"open"}` returns ORD-1001 and ORD-1004.

### Generative UI › Components and surfaces
Doc pages under `/deepagents/generative-ui/components` (React / Angular / React Native / Vue tabs); only the Vue tab is used. All run on `sample_agent`. Open Inspector › **Generative UI** to see the catalog, targets, surfaces and the prompt.
**`/generative-ui/components`**: **Try:** `Compare the Starter, Team, and Enterprise plans in a table`, then `Add a column for support`. **Pass:** a standard table component that fills in and is then changed in place. **Fail:** a markdown table and no surface.
**`/generative-ui/components/surfaces`**: the page's `Providers.vue` (error boundary + `RetryFallback`) around its `FeaturedProducts` and a chat (harness page). **Try:** `Show the featured products here as a grid`. **Pass:** the badged stand-in `ProductRow` is replaced by a `ProductGrid` of `ProductCard`s. Product values come from the flagged `get_products` stand-in tool (§9.17).
**`/generative-ui/components/catalogs`**: **Try:** `Show me three products in a grid`. **Pass:** a `get_products` call, then a `ProductGrid` of Trail Runner, City Sneaker and Court Classic (stand-in products, §9.17). **Fail:** a request for product listings means the agent was started without `--config langgraph.harness.json`.
**`/generative-ui/components/standard-catalog`**: two samples, **standard** (`Providers.vue` with a chat in its slot) and **override** (`Card` → `MyCard`, harness provider). **Try:** `Show a card with a title and two short paragraphs about Vue`. **Pass:** a standard `Card`; in the override sample the same card drawn by `MyCard` (border, shadow).
**`/generative-ui/components/state-and-actions`**: the *Run your code when users click* `shopUI` (an `addToCart` function, an `onAddToCart` event) and its `ProductCard`, with a harness provider. **Try:** `Show a ProductCard for product p-1 named Trail Runner`. **Pass:** a card with an **Add to cart** button. The handler sample needs `./cart-store`, never published, so it is shown, not mounted, and a click takes the card's own error path (§9.18).
**`/generative-ui/components/theming`**: **Try:** `Show a primary button and a card with a slider`. **Pass:** amber (`#d97706`) accent and 10px radii.
**`/generative-ui/components/transports`**: **Try:** the plans prompt in each sample. **Pass:** tool → a `render_ui` call; markdown → an `a2ui` block rendered in the reply, no tool call; agentIds → plain text (no `shop` agent exists, as published).
**`/generative-ui/components/markdown-mode`**: **Try:** `Give me a plan estimator with a seats slider`. **Pass:** an inline surface (slider + price) that paints line by line. The `sendContext: false` sample puts the guide only in forwarded props, which `sample_agent` does not read, so expect plain text there.
**`/generative-ui/components/from-a2ui`**: the *After* provider only. **Try:** `Show my flight from SFO to JFK`. **Pass:** `Airport` / `Arrow` stand-ins, badged. The *Before* line is shown on the notes page, not mounted (§9.19).

### Agent capabilities
**`/multi-agent/subagents`**: notes only (§9.8a).

---

## 8. Testing checklist / current status

"Working" means the wiring is verified (mount check + fake-key run) and nothing published is missing; **no route has been driven against a live model**.

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/vue/deepagents` | `/` | 📖 Reference | Landing page. |
| `/vue/deepagents` (Quickstart) | `/quickstart` | ✅ Working | Wiring verified with a fake key (OpenAI 401). |
| `prebuilt-components` | same | ✅ Working | Only `CopilotChat` has code. |
| `custom-look-and-feel/slots` | same | ⚠️ Partial | Imports added to fragments; 2 stand-ins; `labels` type error; disclaimer never renders (§9.10, §9.15). |
| `custom-look-and-feel/headless-ui` | same | ✅ Working | |
| `programmatic-control` | same | ✅ Working | Default sample adds a harness chat (on request). Interrupt-from-a-button section says "not available" (§9.7). |
| `prebuilt-components/copilot-threads-drawer` | same | ⚠️ Partial | Intelligence quickstart runtime, fixed local identity; needs a key (§9.8). |
| `headless-threads` | same | ⚠️ Partial | Same runtime (§9.8). |
| `frontend-tools` | same | ✅ Working | Tool forwarded by `sample_agent`'s `CopilotKitMiddleware`. |
| `generative-ui/tool-based` | same | ✅ Working | Same. |
| `generative-ui/tool-rendering` | same | ⚠️ Partial | Per-tool card reads `city`, the Quickstart tool takes `location` (§9.3). |
| `generative-ui/state-rendering` | same | ❌ Broken | No published backend writes the keys `ResearchProgress` reads (§9.5). |
| `generative-ui/mcp-apps` | same | ⚠️ Partial | Needs `npm run mcp:apps`; tool binding not yet verified live (§9.4). |
| `shared-state` | same | ⚠️ Partial | Client-side read/write works; nothing writes `notes` or reads `preferences` (§9.6). |
| `shared-state/rendering-in-app` | same | ⚠️ Partial | Canvas renders; agent can't write (§9.6). |
| `shared-state/streaming` | same | ❌ Broken | No published backend streams `document` (§9.5). |
| `shared-state/agent-readonly` | same | ✅ Working | Context forwarded by `CopilotKitMiddleware`. |
| `human-in-the-loop` | same | ⚠️ Partial | `TimePickerCard` stand-in; no published `App.vue` (§9.12). |
| `human-in-the-loop/useInterrupt` | same | ❌ Broken | Page: "not available on this framework"; `MeetingChat` stand-in (§9.7). |
| `human-in-the-loop/headless` | same | ❌ Broken | Same; `HeadlessInterruptPanel` stand-in (§9.7). |
| `human-in-the-loop/governed-actions` | same | ⚠️ Partial | Tool half wired; interrupt half can't fire (§9.7). |
| `webmcp` | same | ⚠️ Partial | Stand-in sample only; as published every call errors (§9.9). |
| `multi-agent/subagents` | same | ❌ Broken | Rendered page shows no code (§9.8a). |
| `/deepagents/generative-ui/components` | `/generative-ui/components` | ⚠️ Partial | Step 3 only, on `sample_agent`; the page's TanStack `server.ts` is shown, not run (§9.16). Not driven live. |
| `…/components/surfaces` | `/generative-ui/components/surfaces` | ⚠️ Partial | `ProductRow.vue` stand-in; `../product` left missing (one vue-tsc error); harness mount (§9.17). |
| `…/components/catalogs` | `/generative-ui/components/catalogs` | ⚠️ Partial | Verbatim catalog; provider fragment closed (§9.17). |
| `…/components/standard-catalog` | `/generative-ui/components/standard-catalog` | ⚠️ Partial | Slot samples get a chat (harness). |
| `…/components/state-and-actions` | `/generative-ui/components/state-and-actions` | ⚠️ Partial | Functions/events sample only; `shop-ui.ts` gets imports; handler needs unpublished `cart-store`, shown not mounted (§9.18). |
| `…/components/theming` | `/generative-ui/components/theming` | ⚠️ Partial | Slot sample gets a chat (harness). |
| `…/components/transports` | `/generative-ui/components/transports` | ⚠️ Partial | Provider fragments closed (harness). |
| `…/components/markdown-mode` | `/generative-ui/components/markdown-mode` | ⚠️ Partial | `App.vue` renders a slot; chat passed in (harness). |
| `…/components/from-a2ui` | `/generative-ui/components/from-a2ui` | ⚠️ Partial | *After* only; `Airport` / `Arrow` stand-ins; `z` import added (§9.19). |

**Legend:** ✅ Working · ⚠️ Partial · 📖 Reference · 🚧 Not started · ❌ Broken

---

## 9. Known issues / doc-vs-implementation discrepancies

All against `@copilotkit/vue` / `@copilotkit/runtime` 1.87.0 and the docs as of the 2026-11-13 baseline.

**1. The Quickstart is split across three pages, and its agent command is "experimental".** The root `.md` (`/vue/deepagents`) is the built-in Vue Quickstart (`BuiltInAgent`, whose blocks are rendered on `/vue`, not on the landing page). The landing page renders one code block, the `LangGraphAgent` runtime route, which appears in no `.md`. The `sample_agent` graph is on the non-Vue `/deepagents/quickstart` (Python tab). That page's only start command for the Deep Agent tab is `npx @langchain/langgraph-cli dev --port 8123 --no-browser`, the **JS** CLI, for both Python and TypeScript. It works for this Python project, but logs: *"Launching Python server from @langchain/langgraph-cli is experimental. Please use the `langgraph-cli` package from PyPi instead."* It also downloads its own uv and builds its own environment, ignoring `agent/.venv`. Used as published.

**2. No rendered Vue deepagents page publishes any backend.** On State Rendering, Shared State, State Streaming, Tool Rendering and Sub-agents, the `.md` export contains Python blocks (`shared_state_streaming.py`, `tool_rendering_agent.py`, `subagents.py`) that the **rendered** pages do not show. Their setup steps render as "*-setup is not bundled for deepagents*". Those blocks are also LangGraph `create_agent` code, not Deep Agents. The HITL Overview, Programmatic Control, useInterrupt and Headless setup steps (which publish `frontend_tools.py` for LangGraph) are skipped the same way. The harness treats the rendered page as what is published (`build-doc-catalog.py` checks every block against it), so none of these is served. Every agent id is `sample_agent`, and the `.md`-only blocks are shown on their routes, labelled "in the .md export only — NOT on the rendered page".

**3. Tool Rendering: argument name mismatch.** The page's per-tool `useRenderTool` declares `get_weather` with `parameters: z.object({ city })`, and `WeatherToolCard.vue` reads `parameters.city`. The tool that actually exists, the Deep Agents Quickstart's `get_weather(location: str)`, takes `location` and returns a string. So the per-tool card renders with no city. (The page's own `.md`-only `get_weather` also takes `location`.) Left as published.

**4. MCP Apps: not yet verified.** The runtime's MCP Apps middleware adds the server's tools to each run, and `sample_agent`'s `CopilotKitMiddleware` binds tools sent with the run, so this should work. It hasn't been driven against a live model and `npm run mcp:apps`. The published server URL `https://mcp.example.com/mcp` is a placeholder, replaced with the page's own `http://localhost:3101/mcp` example (flagged, `MCP_APPS_URL` overrides). `agent` is used but never defined; it is `sample_agent`.

**5. State Rendering and State Streaming: nothing writes their state.** `ResearchProgress.vue` reads `status`, `completed`, `total` and `draft`; `StreamingDocument.vue` reads `document`. `sample_agent` writes none of these. The `.md`-only `shared_state_streaming.py` would stream `document`, but it isn't on the rendered page (§9.2). Even it would not satisfy `ResearchProgress`.

**6. Shared State and Render-in-app: client-side only.** `SharedWorkspace.vue` lists `notes` and writes `preferences.tone`; the Canvas seeds `title` / `items`. `setState` works and the state reaches the run, but `sample_agent` has no tool that writes `notes`, `title` or `items`, and nothing reads `preferences`. The page prints `SharedWorkspace.vue` in two fragments, which are merged into one file, each verbatim.

**7. Interrupts: the pages say "not available", the runtime says otherwise.** [Pausing the Agent for Input](https://docs.copilotkit.ai/vue/deepagents/human-in-the-loop/useInterrupt) and [Headless Interrupts](https://docs.copilotkit.ai/vue/deepagents/human-in-the-loop/headless) both say "**Not available on this framework**". So does [Programmatic Control](https://docs.copilotkit.ai/vue/deepagents/programmatic-control)'s "Resolving a pause from a button". Yet Deep Agents runs on LangGraph, whose `interrupt()` is native, and this repo's runtime reports `humanInTheLoop: { interrupts: true }` for `sample_agent` (`/api/copilotkit/info`). Both pages still publish `App.vue` files that import components they never print: `MeetingChat.vue` and `HeadlessInterruptPanel.vue`, now flagged stand-ins (§9.12). The equivalent LangGraph pages publish both components. No interrupting graph is published, and `sample_agent` never interrupts, so nothing ever pauses. The same applies to Governed Actions' interrupt half (`GovernedActionApproval`).

**8. Threads: Intelligence quickstart runtime.** Wired per the [Vue Deep Agents Intelligence quickstart](https://docs.copilotkit.ai/vue/deepagents/intelligence/quickstart), identical to the LangGraph one. Its `authenticateApplicationUser` is never defined. Per that page's "a fixed identity is suitable only for a local, single-user demo", it returns `local-user` / "Local user" (flagged, **not authentication**). `CopilotKitIntelligence` throws on a blank key, so without `CPK_INTELLIGENCE_API_KEY` the path is plain SSE, and the runtime logs that `GET /threads` returns 403. The key is read at startup only: restart the backend after `project select`. Headless Threads' own `server.ts` (undefined `verifyAppSession`) is shown on that route but not mounted. The Threads `App.vue` files use `/api/copilotkit-threads` (published value kept as a comment).

**8a. Sub-agents: no code on the rendered page.** The setup step renders as "subagents-setup is not bundled for deepagents", and "Rendering a live delegation log" publishes no Vue code. The `.md`-only `subagents.py` is LangGraph `create_agent` code with no supervisor graph and an unpublished `src.agents._header_forwarding_middleware` import. Nothing to mount; notes only. (`create_deep_agent`'s built-in `task` sub-agent tool is present in `sample_agent`, but no page shows a UI for it.)

**9. Undefined functions left undefined.** `searchOrders` (WebMCP: as published every call throws; the demo shows only a flagged stand-in sample, the same choice as the other Vue harnesses) and `executeSideEffect` (Governed Actions).

**10. Type errors in published doc code** (`npm run type-check`, 8 errors). The `labels` prop is typed as literal default strings, so the Slots labels sample fails (×2). `useRenderTool`, `useDefaultRenderTool` and `useHumanInTheLoop` reject render components that declare only the props they use (`useComponent` accepts them) (×4). `searchOrders` (×2). `npm run build` is `vite build`, which doesn't typecheck.

**11. Fragments and how each was mounted.** Slots' seven fragments get imports only, and "Three levels" is nested in "Two levels". Headless UI's provider markup gets imports; `RenderedMessages.vue` is mounted with the minimal `HeadlessChat.vue` as its composer. Threads Drawer's `ControlledChat.vue` and the slot fragments go under HarnessProvider (Threads runtime). **Shown only:** `agent.subscribe`, the watch-sources line, Headless Threads' pagination, `toggleItem`, useInterrupt's multi-interrupt sample, and Governed Actions' types.

**12. Stand-ins (flagged, on screen and in the file).** `TimePickerCard.vue` (HITL), `CustomMessageView` and `CustomToolbarAction` (Slots), `BrandedToolCard` (Tool Rendering), `MeetingChat.vue` (useInterrupt), `HeadlessInterruptPanel.vue` (Headless Interrupts), `searchOrders` (WebMCP). HITL Overview publishes no `App.vue`; `HarnessApp.vue` mounts `MeetingApproval` beside a chat.

**13. Agent ids no page registers.** `default`, `my-agent`, `sales`, `support`, `researcher`, `workspace`, `writer` → `sample_agent` (§3).

**14. The harness itself.** `agent/main.py` and `agent/langgraph.json` are the published files, unchanged. `sample_agent` is served through `agent/harness_agent.py` (flagged; imports `main.py` unchanged and adds the `get_products` stand-in, §9.17), named in `agent/langgraph.harness.json`, which `write-doc-files.py` writes from the published `langgraph.json` with only the graph path changed. There's no root `CopilotKitProvider`: each demo mounts its page's own `App.vue`. Doc sync runs as Vite dev-server middleware and diffs only the Vue pages' `.md`, so changes to the landing page's runtime block or the Deep Agents Quickstart are invisible to it. `npm run doc-files` re-reads both live.

**15. Slots › Disclaimer never renders.** `CopilotChat`'s `#input` slot props don't include `showDisclaimer`, and `CopilotChatInput` only shows its disclaimer when `showDisclaimer ?? positioning === "absolute"` is true, so the sample's `#disclaimer` slot is never drawn. Left as published.

**16. Components and surfaces: Step 3 on the Deep Agent, not the page's runtime.** The [overview](https://docs.copilotkit.ai/deepagents/generative-ui/components)'s "Try it" publishes a `server.ts` whose agent is a TanStack `BuiltInAgent` (`@tanstack/ai`, `@tanstack/ai-openai`). The same page says: *already have CopilotKit running? Do step 3 only.* The runtime needs no change, the agent must pass the run's tools and context to its model, and *for a LangGraph Python agent, add `CopilotKitMiddleware`*. `sample_agent` already has it, so only step 3 (provider + catalog, the `main.ts` chart/map plugins, `npm install chart.js maplibre-gl`) is applied. The `server.ts` is shown, not run; running it would replace the Deep Agent. These pages are not under `/vue/deepagents`. They carry React / Angular / React Native / Vue tabs; `build-doc-catalog.py` records each block's tab and `write-genui-files.py` writes the Vue-tab files of all nine routes (every harness line it adds is labelled `[harness]`). Not yet driven against a live model.

**17. Surfaces and Catalogs: unpublished pieces and a product tool no page publishes.** `FeaturedProducts.vue` imports `type { Product } from "../product"` and `./ProductRow.vue`, neither published. `ProductRow` is needed to mount, so it is a minimal flagged stand-in; `../product` is a type-only import, so it is left missing (one vue-tsc error, no runtime effect). It imports `../shop-ui`, which the Catalogs page defines, so the Catalogs files are copied beside it. No `App.vue` is published: a harness page mounts the page's `Providers.vue` (error boundary) with `FeaturedProducts` (two sample products) and a chat. Several provider samples are a lone unclosed `<CopilotKitProvider …>` tag; they are closed around a `CopilotChat`, with nothing else added. The shop catalog describes `ProductCard` as copying every value "from a product of a tool result", but no doc page publishes a product tool. As published, `sample_agent` therefore refused (2026-11-17: *"Show me three products in a grid"* got a request for product listings instead of a grid). **Fix (flagged, at your request):** `agent/harness_agent.py` imports `main.py` unchanged and wraps `create_deep_agent` during that import so the Quickstart's call gets one extra tool, `get_products`: a stand-in returning three fixed sample products (id, name, price, an inline grey placeholder image). It is served through `langgraph.harness.json` (the published `langgraph.json` with only the graph path changed, regenerated by `npm run doc-files`). Verified with a fake key and a local stand-in model: the model is offered `get_products` next to `render_ui`. Not yet checked against a live model. **Doc gap:** the catalog assumes a product tool the docs never show.

**18. State and actions: an unpublished store.** The handler sample (`useGenerativeUIFunction`) and the state sample (`useGenerativeUIState`) both import `useCartStore` from `./cart-store`, never published, so both are shown, not mounted. The *Run your code when users click* `src/shop-ui.ts` is printed without imports; only the imports were added. It is mounted with its `ProductCard.vue` under a harness provider, so with no handler registered a click on **Add to cart** takes the card's own error path. The state section's `ProductCard`, the `CheckoutForm` entry and the agent-bound `onChoose` event are fragments; shown, not mounted.

**19. Adopt from A2UI: undefined components and missing imports.** The *After* catalog registers `Airport` and `Arrow` but never publishes or defines them (flagged stand-ins), and uses `z` without importing it; only those imports were added. Only the *After* provider is mounted. *Before* (`:a2ui="{ catalog: vueBasicCatalog }"`, also without an import) and the *Runtime, before* option are shown, not mounted.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `RUN_ERROR` "Failed to create thread", or connection refused | LangGraph CLI not running, or `LANGGRAPH_DEPLOYMENT_URL` unset | Start terminal 1; set `LANGGRAPH_DEPLOYMENT_URL=http://localhost:8123` in `backend/.env`; restart the backend. |
| `RUN_ERROR` "An internal error occurred" | Usually the model call failed; the agent's log names it (e.g. `AuthenticationError … 401`) | Set `OPENAI_API_KEY` in **`agent/.env`** (not `backend/.env`) and restart the agent. |
| Port 8123 already in use | Another LangGraph server | Per the Quickstart: change `--port` and update `LANGGRAPH_DEPLOYMENT_URL` to match. |
| First agent start is slow | The JS CLI downloads uv and the Python deps | Wait for `Application started up`; later starts reuse the cache. |
| `Agent … not found` | Backend isn't this repo's `server.ts` | Run `backend/server.ts`. |
| Threads stay on "Loading threads…" | Runtime started before the key existed (SSE mode → 403) | Restart the backend; the startup line must say `(intelligence)`. |
| CORS error on `/quickstart` only | That `App.vue` calls `:8200` directly | Keep `cors: true`. |
| `Port 5173 is in use` | Another harness's Vite | Stop it (only one harness on 5173/8200 at a time). |

---

## Doc drift detection

`/doc-sync` fetches the `.md` behind all 31 tracked pages, diffs each against `doc-snapshot/pages/`, replaces the snapshot, and ranks changes High/Medium/Low. Commit `pages/`, `manifest.json` and `CHANGELOG.md`; `reports/` is gitignored. **Regenerating the doc files:** `cd frontend && npm run doc-files` rebuilds the block catalog (snapshot pages, plus the Deep Agents Quickstart fetched live, every block checked against the rendered page). It then rewrites the verbatim doc files (`write-genui-files.py` writes the Components routes' files), `src/lib/published.json`, `agent/main.py` and `agent/langgraph.json`. It asserts that the `.md`-only Python blocks are still absent from the rendered pages, so a change there fails loudly.

---

## 11. Project structure

```
deepagents-py/
├── CLAUDE.md · PR_GUIDELINES.md · README.md · .env.example
├── doc-snapshot/                    # pages/*.md + manifest.json — doc-sync baseline
├── agent/                           # Deep Agents (Python 3.12, uv) — LangGraph CLI :8123
│   ├── main.py                      # ★ sample_agent — Deep Agents Quickstart, verbatim
│   ├── langgraph.json               # verbatim
│   ├── langgraph.harness.json       # [harness] langgraph.json with sample_agent → harness_agent.py (generated)
│   ├── harness_agent.py             # [harness, flagged] main.py unchanged + get_products stand-in (§9.17)
│   └── pyproject.toml · uv.lock     # `uv add deepagents copilotkit langchain-openai`
├── backend/                         # Copilot Runtime, Node :8200
│   ├── server.ts                    # ★ Vue Quickstart host + landing runtime
│   ├── agents.ts                    # LangGraphAgent per doc agent id (all sample_agent)
│   └── runtimes/ threads.ts · mcp-apps.ts
└── frontend/                        # Vite + Vue 3
    ├── scripts/ build-doc-catalog.py · write-doc-files.py · write-genui-files.py · write-demo-entries.py
    └── src/ lib/nav-config.ts (★ routes + statuses) · routes/<doc path>/{Notes.vue, demo-chat/} · …
        └── routes/generative-ui/components/    # Components and surfaces (9 pages, Vue tabs)
```

---

## 12. References

**Getting Started**: [Quickstart (landing)](https://docs.copilotkit.ai/vue/deepagents) · [Vue Quickstart (frontend steps)](https://docs.copilotkit.ai/vue) · [Deep Agents Quickstart (sample_agent)](https://docs.copilotkit.ai/deepagents/quickstart)

**Basics**: [Prebuilt Components](https://docs.copilotkit.ai/vue/deepagents/prebuilt-components) · [Slots](https://docs.copilotkit.ai/vue/deepagents/custom-look-and-feel/slots) · [Headless UI](https://docs.copilotkit.ai/vue/deepagents/custom-look-and-feel/headless-ui) · [Programmatic Control](https://docs.copilotkit.ai/vue/deepagents/programmatic-control) · [Threads Drawer](https://docs.copilotkit.ai/vue/deepagents/prebuilt-components/copilot-threads-drawer) · [Headless Threads](https://docs.copilotkit.ai/vue/deepagents/headless-threads) · [Frontend Tools](https://docs.copilotkit.ai/vue/deepagents/frontend-tools)

**Generative UI**: [Components as Tools](https://docs.copilotkit.ai/vue/deepagents/generative-ui/tool-based) · [Tool Call Rendering](https://docs.copilotkit.ai/vue/deepagents/generative-ui/tool-rendering) · [State Rendering](https://docs.copilotkit.ai/vue/deepagents/generative-ui/state-rendering) · [MCP Apps](https://docs.copilotkit.ai/vue/deepagents/generative-ui/mcp-apps)

**Interactivity**: [Shared State](https://docs.copilotkit.ai/vue/deepagents/shared-state) · [Render agent state in your app](https://docs.copilotkit.ai/vue/deepagents/shared-state/rendering-in-app) · [State Streaming](https://docs.copilotkit.ai/vue/deepagents/shared-state/streaming) · [Agent Read-Only Context](https://docs.copilotkit.ai/vue/deepagents/shared-state/agent-readonly) · [HITL Overview](https://docs.copilotkit.ai/vue/deepagents/human-in-the-loop) · [Pausing the Agent for Input](https://docs.copilotkit.ai/vue/deepagents/human-in-the-loop/useInterrupt) · [Headless Interrupts](https://docs.copilotkit.ai/vue/deepagents/human-in-the-loop/headless) · [Governed Action Approval UI](https://docs.copilotkit.ai/vue/deepagents/human-in-the-loop/governed-actions) · [WebMCP](https://docs.copilotkit.ai/vue/deepagents/webmcp)

**Agent capabilities**: [Sub-agents](https://docs.copilotkit.ai/vue/deepagents/multi-agent/subagents)

**Generative UI › Components and surfaces** (Vue tabs): [Components and surfaces](https://docs.copilotkit.ai/deepagents/generative-ui/components) · [Surfaces](https://docs.copilotkit.ai/deepagents/generative-ui/components/surfaces) · [Catalogs](https://docs.copilotkit.ai/deepagents/generative-ui/components/catalogs) · [Standard catalog](https://docs.copilotkit.ai/deepagents/generative-ui/components/standard-catalog) · [State and actions](https://docs.copilotkit.ai/deepagents/generative-ui/components/state-and-actions) · [Theming](https://docs.copilotkit.ai/deepagents/generative-ui/components/theming) · [Transports](https://docs.copilotkit.ai/deepagents/generative-ui/components/transports) · [Markdown mode](https://docs.copilotkit.ai/deepagents/generative-ui/components/markdown-mode) · [Adopt from A2UI](https://docs.copilotkit.ai/deepagents/generative-ui/components/from-a2ui)

**Intelligence (Threads routes)**: [Connect Intelligence in 5 minutes](https://docs.copilotkit.ai/vue/deepagents/intelligence/quickstart)
