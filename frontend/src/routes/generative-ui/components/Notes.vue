<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">The overview's Vue setup: a provider given the standard catalog (<code>:generativeUI=&quot;{ ui: standardUI }&quot;</code>) and a plain <code>CopilotChat</code>; the agent answers visual questions by rendering standard components.</p>
    <div class="mt-4"><TryIt :prompts="['Compare the Starter, Team, and Enterprise plans in a table']" expect="A table component fills in inside the chat; a follow-up such as “add a column for support” changes it in place." fail="A prose answer and no component: the model did not call render_ui, or the run errored (check the Inspector)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/App.vue`" note="Vue tab, verbatim (runtime-url http://localhost:8200/api/copilotkit)." />
    </div>
  </Panel>
  <Panel title="Published for Vue, not mounted">
    <div class="space-y-4">
      <PublishedCode page="deepagents__generative-ui__components" :index="26" note="The plugin entry. Applied in the harness's own src/main.ts (labelled), since the harness has one entry for every route." />
      <PublishedCode page="deepagents__generative-ui__components" :index="11" note="The page's runtime for Vue: a TanStack BuiltInAgent with convertInputToTanStackAI. Not served: the overview's step-3-only path for an agent already behind CopilotKit, so the samples run on sample_agent (README §9.16)." />
      <PublishedCode page="deepagents__generative-ui__components" :index="6" note="The Vue tab's install line. @tanstack/* is not installed (its runtime is not served); chart.js and maplibre-gl are (next block)." />
      <PublishedCode page="deepagents__generative-ui__components" :index="25" note="Installed in frontend/." />
    </div>
  </Panel>
  <Callout tone="harness" title="What the harness added">
    <p>· <code>src/main.ts</code> applies <code>GenerativeUIChart</code> and <code>GenerativeUIMap</code> (the page's plugin entry); <code>chart.js</code> and <code>maplibre-gl</code> are installed as the page says.</p>
  </Callout>
  <Callout tone="info" title="Agent: sample_agent (README §9.16)">
    <p>The samples keep <code>runtime-url="/api/copilotkit"</code> as published, so <code>default</code> is <code>sample_agent</code>, the Deep Agents Quickstart graph. For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context; the agent's <code>CopilotKitMiddleware</code> passes both to the model — what the overview asks of a LangGraph Python agent. Wiring checked with a fake key only; no surface has been rendered by a live model yet. The page's own runtime — a TanStack <code>BuiltInAgent</code>, on the overview page — is shown there and not served.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
