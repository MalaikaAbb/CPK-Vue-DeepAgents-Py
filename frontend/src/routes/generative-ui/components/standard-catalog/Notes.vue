<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/standard-catalog/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components/standard-catalog" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">The standard catalog on the provider, then a catalog that extends it and replaces its <code>Card</code> with your own <code>MyCard</code>.</p>
    <div class="mt-4"><TryIt :prompts="['Show a card with a title and two buttons']" expect="Standard sample: a standard Card. Override sample: the bordered MyCard instead." fail="A prose answer and no component: the model did not call render_ui, or the run errored (check the Inspector)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/Providers.vue`" note="Untitled provider component with a slot." />
      <SourceCode :file="`${D}/override/components/MyCard.vue`" />
      <SourceCode :file="`${D}/override/app-ui.ts`" />
    </div>
  </Panel>
  <Panel title="Harness files">
    <div class="space-y-4">
      <SourceCode :file="`${D}/HarnessApp.vue`" note="Mounts Providers with a CopilotChat in its slot." />
      <SourceCode :file="`${D}/override/HarnessOverride.vue`" note="The page never prints the provider for appUI; written like its own." />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="deepagents__generative-ui__components__standard-catalog" :index="5" note="Fragment: ProductCard and productSchema are never defined." />
    </div>
  </Panel>
  <Callout tone="info" title="Agent: sample_agent (README §9.16)">
    <p>The samples keep <code>runtime-url="/api/copilotkit"</code> as published, so <code>default</code> is <code>sample_agent</code>, the Deep Agents Quickstart graph. For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context; the agent's <code>CopilotKitMiddleware</code> passes both to the model — what the overview asks of a LangGraph Python agent. Wiring checked with a fake key only; no surface has been rendered by a live model yet. The page's own runtime — a TanStack <code>BuiltInAgent</code>, on the overview page — is shown there and not served.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
