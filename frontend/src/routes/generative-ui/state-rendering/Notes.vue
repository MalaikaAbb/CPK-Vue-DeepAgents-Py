<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/generative-ui/state-rendering" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useAgent</code> with <code>OnStateChanged</code> + <code>OnRunStatusChanged</code> on agent <code>researcher</code>;
      <code>ResearchProgress</code> renders <code>status</code>, a progress bar from <code>completed</code>/<code>total</code>, and <code>draft</code>.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Write a short note about bicycles']" expect="If the backend wrote these keys: status text, a moving bar and a draft." fail="What actually happens here: “Idle” and an empty bar — sample_agent writes none of these keys (see below)." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/generative-ui/state-rendering/demo-chat/components/ResearchProgress.vue" />
      <SourceCode file="frontend/src/routes/generative-ui/state-rendering/demo-chat/App.vue" />
    </div>
  </Panel>
  <Panel title="Backend block in the .md export, not served"><PublishedCode page="generative-ui__state-rendering" :index="2" note="Only in the page's .md export; the rendered Deep Agents page shows no backend code (its setup step reads “not bundled for deepagents”). It is LangGraph create_agent code, not Deep Agents, so it is not served." /></Panel>
  <Callout tone="warn" title="Why this route is broken (README §9)">
    <p>The rendered page publishes no backend, so <code>researcher</code> is <code>sample_agent</code>, the Deep Agents Quickstart graph, which writes no custom state. <code>ResearchProgress</code> reads <code>status</code>, <code>completed</code>, <code>total</code> and <code>draft</code>. Even the <code>shared_state_streaming.py</code> in the page's .md export would not help: it streams only <code>document</code>. Frontend and backend on this page describe different state.</p>
  </Callout>
  <Callout tone="harness" title="Agent id"><p><code>researcher</code> → <code>sample_agent</code> (<code>backend/agents.ts</code>).</p></Callout>
</template>
