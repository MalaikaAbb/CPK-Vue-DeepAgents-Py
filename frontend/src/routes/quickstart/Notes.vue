<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/quickstart" />

  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      The whole stack, assembled from the three places the docs put it: the Vue app from the Vue Quickstart (<code>App.vue</code> with
      <code>CopilotChat</code>), the runtime from the Deep Agents landing page (<code>LangGraphAgent</code> → <code>sample_agent</code>),
      hosted in the Vue Quickstart's Node <code>server.ts</code>, and the <code>sample_agent</code> graph from the Deep Agents Quickstart
      (<code>create_deep_agent</code> with <code>get_weather</code> and <code>CopilotKitMiddleware</code>), served by
      <code>npx @langchain/langgraph-cli dev</code>. Three processes: the agent on :8123, the runtime on :8200, Vite on :5173.
    </p>
    <div class="mt-4">
      <TryIt
        :prompts="['Hello! What can you do?', 'What is the weather in Paris?']"
        expect="A streamed reply from the Deep Agent; for the weather prompt a get_weather call (“The weather in Paris is sunny.”). The Inspector's AG-UI Events show RUN_STARTED → STEP_STARTED → TEXT_MESSAGE_* → RUN_FINISHED."
        fail="RUN_ERROR “Failed to create thread” or connection refused — the LangGraph CLI is not running on :8123 or LANGGRAPH_DEPLOYMENT_URL is unset; a 401 from OpenAI — OPENAI_API_KEY missing in agent/.env."
      />
    </div>
  </Panel>

  <Panel title="The demo" description="Verbatim src/App.vue from the Vue Quickstart, which the Deep Agents Vue Quickstart's .md is.">
    <SourceCode file="frontend/src/routes/quickstart/demo-chat/App.vue" />
  </Panel>

  <Panel title="The runtime, as published on the Deep Agents landing page" description="Its only code block — a Next.js route.">
    <PublishedCode page="index" :index="9" />
  </Panel>

  <Panel title="This repo's runtime" description="The Vue Quickstart's Node host with the landing page's agent registration; additions marked [harness].">
    <div class="space-y-4">
      <SourceCode file="backend/server.ts" />
      <SourceCode file="backend/agents.ts" />
    </div>
  </Panel>

  <Panel title="The agent — Deep Agents Quickstart, Python tab" description="main.py and langgraph.json exactly as published; no graphs added.">
    <div class="space-y-4">
      <SourceCode file="agent/main.py" />
      <SourceCode file="agent/langgraph.json" />
    </div>
  </Panel>

  <Panel title="The Vue Quickstart's server.ts and main.ts, as published">
    <div class="space-y-4">
      <PublishedCode page="index" :index="4" note="Host only — its BuiltInAgent registration is replaced by the landing page's LangGraphAgent, as the Vue Quickstart itself instructs for an existing agent." />
      <PublishedCode page="index" :index="5" />
    </div>
  </Panel>

  <Callout tone="harness" title="How the three sources fit (README §3, §9.1)">
    <p>· <strong>The Vue Deep Agents Quickstart is the built-in Vue Quickstart.</strong> Its .md registers <code>BuiltInAgent</code> and says: if you already have an agent, keep its Vue frontend steps and take the runtime wiring from your framework's quickstart.</p>
    <p>· <strong>The landing page</strong> publishes only the runtime route (<code>LangGraphAgent</code>, <code>graphId: "sample_agent"</code>), as a Next.js route; a Vue app has no Next route, so it is hosted in the Vue Quickstart's Node listener.</p>
    <p>· <strong>The graph</strong> is from the Deep Agents Quickstart the landing page links as its guide: Python tab — <code>main.py</code> + <code>langgraph.json</code>, run with the page's <code>npx @langchain/langgraph-cli dev --port 8123 --no-browser</code>. The CLI warns that launching a Python server from the JS CLI is experimental (README §9).</p>
    <p>· The runtime also registers the doc agent ids (<code>backend/agents.ts</code>); every one is <code>sample_agent</code>, because no rendered Vue deepagents page publishes a backend of its own.</p>
  </Callout>

  <Callout tone="info" title="What sample_agent can and cannot do">
    <p>It carries <code>CopilotKitMiddleware</code>, so frontend tools, human-in-the-loop tools and app context reach the model. Its only backend tool is <code>get_weather</code> (plus Deep Agents' built-in planning, file and sub-agent tools). It writes no custom state and never calls <code>interrupt()</code>, so the state-rendering, state-streaming and interrupt pages are gaps (README §9).</p>
  </Callout>
</template>
