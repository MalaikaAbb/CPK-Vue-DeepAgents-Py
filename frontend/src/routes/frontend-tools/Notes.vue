<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/frontend-tools" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useFrontendTool</code> registers <code>filter_incidents</code> with a zod enum. The handler runs in the browser, writes the
      <code>severity</code> ref, and returns <code>{ applied, severity }</code> to the agent as the tool result.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Only show sev1 incidents', 'Show everything again']" expect="“Current filter:” changes to sev1, then back to all; the agent confirms each change." fail="A prose answer and “Current filter: all” unchanged — the model did not call filter_incidents." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/frontend-tools/demo-chat/components/DashboardAgent.vue" />
      <SourceCode file="frontend/src/routes/frontend-tools/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="info" title="zod">
    <p>The page imports <code>zod</code> without naming a version. This repo installs zod 3 (^3.25), the version <code>@copilotkit/vue</code> 1.87 itself depends on, so there is one copy.</p>
  </Callout>
  <Callout tone="info" title="How the tool reaches the model">
    <p>This route's agent is <code>sample_agent</code>, the Deep Agents Quickstart's <code>create_deep_agent</code> graph (<code>agent/main.py</code>). Its <code>CopilotKitMiddleware</code> (“for frontend tools and context”) forwards the tools registered in the browser to the model. Wiring verified with a fake key only; not yet driven against a live model.</p>
  </Callout>
</template>
