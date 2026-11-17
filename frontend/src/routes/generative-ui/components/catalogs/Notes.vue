<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/catalogs/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components/catalogs" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">A catalog of your own components (<code>ProductGrid</code> with a <code>children</code> slot, <code>ProductCard</code>) declared with zod props in <code>createGenerativeUI</code>, handed to the provider.</p>
    <div class="mt-4"><TryIt :prompts="['Show me three products in a grid']" expect="A get_products call, then a ProductGrid of Trail Runner, City Sneaker and Court Classic (harness stand-in products) in the chat." fail="A request for product listings: the agent was started without --config langgraph.harness.json, so get_products is missing. A prose answer with no component otherwise: the model did not call render_ui, or the run errored (check the Inspector)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/components/ProductGrid.vue`" />
      <SourceCode :file="`${D}/components/ProductCard.vue`" />
      <SourceCode :file="`${D}/shop-ui.ts`" />
    </div>
  </Panel>
  <Panel title="Harness wrapper">
    <div class="space-y-4">
      <SourceCode :file="`${D}/HarnessApp.vue`" note="The page prints only the opening provider line; imports, a CopilotChat and the closing tag added." />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="deepagents__generative-ui__components__catalogs" :index="13" note="Fragment that deliberately shows a type error (props.color); shopUI is not imported." />
      <PublishedCode page="deepagents__generative-ui__components__catalogs" :index="19" note="Fragment: cartUI, Hero and z are never defined or imported." />
      <PublishedCode page="deepagents__generative-ui__components__catalogs" :index="23" note="A Node script (fs is never imported) that exports the catalog as JSON." />
    </div>
  </Panel>
  <Callout tone="info" title="Agent: sample_agent (README §9.16)">
    <p>The samples keep <code>runtime-url="/api/copilotkit"</code> as published, so <code>default</code> is <code>sample_agent</code>, the Deep Agents Quickstart graph. For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context; the agent's <code>CopilotKitMiddleware</code> passes both to the model — what the overview asks of a LangGraph Python agent. Wiring checked with a fake key only; no surface has been rendered by a live model yet. The page's own runtime — a TanStack <code>BuiltInAgent</code>, on the overview page — is shown there and not served.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
