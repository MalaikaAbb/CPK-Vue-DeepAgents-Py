<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/tool-rendering/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/tool-rendering" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Three ways to draw a tool call — the built-in <code>*</code> renderer, a custom catch-all, and a per-tool <code>useRenderTool</code> for
      <code>get_weather</code> — against <code>sample_agent</code>, whose Deep Agents Quickstart graph defines a <code>get_weather(location)</code> tool (and Deep Agents' built-in tools, which the wildcard renders).
    </p>
    <div class="mt-4">
      <TryIt :prompts="['What is the weather in Tokyo?']" expect="Zero-config: a status card with arguments ({ location: Tokyo }) and result (“The weather in Tokyo is sunny.”). Catch-all: the BrandedToolCard stand-in. Per-tool: the WeatherToolCard, but with no city — it reads parameters.city and the Quickstart tool's argument is location (see below)." fail="A prose answer with no card — the model did not call get_weather, or the LangGraph CLI is not running." />
    </div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/default/components/AgentExperience.vue`" />
      <SourceCode :file="`${D}/per-tool/components/WeatherToolCard.vue`" />
      <SourceCode :file="`${D}/per-tool/components/AgentExperience.vue`" />
      <SourceCode :file="`${D}/per-tool/App.vue`" note="The same published App.vue, verbatim, is copied into each variant directory." />
    </div>
  </Panel>
  <Panel title="The backend">
    <div class="space-y-4">
      <SourceCode file="agent/main.py" note="sample_agent — the Deep Agents Quickstart's graph, which serves every route. Its get_weather takes `location` and returns a string." />
      <PublishedCode page="generative-ui__tool-rendering" :index="6" note="Only in the page's .md export, not on the rendered page. A LangGraph create_agent fragment (get_weather and SYSTEM_PROMPT, the agent never built), so it is not served." />
    </div>
  </Panel>
  <Panel title="Custom catch-all" description="The page prints only one line for this file.">
    <div class="space-y-4">
      <PublishedCode page="generative-ui__tool-rendering" :index="1" />
      <SourceCode :file="`${D}/catch-all/components/AgentExperience.vue`" />
      <SourceCode :file="`${D}/catch-all/components/BrandedToolCard.vue`" />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <PublishedCode page="generative-ui__tool-rendering" :index="4" note="Fragment: `parameters` and `locale` are never declared." />
  </Panel>
  <Callout tone="harness" title="What the harness added">
    <p>· No graph and no runtime path were added: <code>default</code> is <code>sample_agent</code>, which already has a <code>get_weather</code> tool.</p>
    <p>· The catch-all <code>AgentExperience.vue</code> wraps the published line; <code>BrandedToolCard</code> is a stand-in — never published.</p>
  </Callout>
  <Callout tone="warn" title="Doc note (README §9)">
    <p>The page's per-tool <code>useRenderTool</code> declares <code>get_weather</code> with a <code>city</code> argument; the Deep Agents Quickstart's <code>get_weather</code> takes <code>location</code>. The per-tool card therefore renders, but with no city. The page's own <code>get_weather</code> (which also takes <code>location</code>, and returns a dict) is not on the rendered page.</p>
  </Callout>
</template>
