<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/shared-state/agent-readonly" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useAgentContext({ description: "Active workspace", value: workspaceId })</code> publishes the ref to the agent on every turn,
      with no setter.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Which workspace am I in?', 'Switch my workspace to “orion”']" expect="“northstar”, with no tool call. The second request cannot change “Workspace: northstar” on the page." fail="The agent does not know the workspace — the context did not reach the model." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/shared-state/agent-readonly/demo-chat/components/WorkspaceContext.vue" />
      <SourceCode file="frontend/src/routes/shared-state/agent-readonly/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="info" title="How the context reaches the agent">
    <p>The page says context reaches the agent “through the backend's CopilotKit middleware”. This route's agent is <code>sample_agent</code>, the Deep Agents Quickstart graph (<code>agent/main.py</code>), which carries <code>CopilotKitMiddleware</code> (“for frontend tools and context”). Wiring verified with a fake key only; not yet driven against a live model.</p>
  </Callout>
</template>
