<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/generative-ui/tool-based" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>useComponent</code> turns <code>WeatherCard.vue</code> into a frontend tool named <code>show_weather</code>. When the agent calls
      it, the arguments are passed straight through as the card's props — no handler, no backend.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Show me the weather in Paris']" expect="An inline card: “Paris” and “<number>° · <condition>”. The values are invented by the model — the page has no weather source." fail="A prose answer with no card — the model did not call show_weather." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/generative-ui/tool-based/demo-chat/components/WeatherCard.vue" />
      <SourceCode file="frontend/src/routes/generative-ui/tool-based/demo-chat/components/AgentExperience.vue" />
      <SourceCode file="frontend/src/routes/generative-ui/tool-based/demo-chat/App.vue" />
    </div>
  </Panel>
  <Callout tone="info" title="How the tool reaches the model">
    <p>This route's agent is <code>sample_agent</code>, the Deep Agents Quickstart's <code>create_deep_agent</code> graph (<code>agent/main.py</code>). Its <code>CopilotKitMiddleware</code> (“for frontend tools and context”) forwards the tools registered in the browser to the model. Wiring verified with a fake key only; not yet driven against a live model.</p>
  </Callout>
</template>
