<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/generative-ui/components/surfaces/demo-chat";
</script>

<template>
  <RouteHeader path="/generative-ui/components/surfaces" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">A named page target: <code>FeaturedProducts</code> wraps a <code>GenerativeUISurface</code> (id <code>featured</code>, limited to ProductGrid/ProductCard) whose default content the agent can replace from the chat; the provider adds an error boundary with a retry fallback.</p>
    <div class="mt-4"><TryIt :prompts="['Show the featured products here as a grid']" expect="A get_products call, then the surface's row is replaced by a ProductGrid of the stand-in products, above the chat." fail="The stand-in ProductRow stays: no render_ui call targeted the surface (see the agent note)." /></div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/components/FeaturedProducts.vue`" note="Imports ../product (a type module no page publishes — left missing, one vue-tsc error) and ../shop-ui." />
      <SourceCode :file="`${D}/components/RetryFallback.vue`" />
      <SourceCode :file="`${D}/Providers.vue`" note="Printed untitled under “When a component fails”; it imports ./components/RetryFallback.vue and ./shop-ui." />
    </div>
  </Panel>
  <Panel title="Harness files">
    <div class="space-y-4">
      <SourceCode :file="`${D}/shop-ui.ts`" note="Not printed on this page: Catalogs' shop-ui.ts, copied with its two components (FeaturedProducts imports it)." />
      <SourceCode :file="`${D}/components/ProductRow.vue`" note="STAND-IN: FeaturedProducts renders it; never published." />
      <SourceCode :file="`${D}/HarnessApp.vue`" note="Puts the page's Providers, FeaturedProducts (two sample products) and a CopilotChat together." />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="deepagents__generative-ui__components__surfaces" :index="8" note="Fragment: a surface tag limited to two components." />
      <PublishedCode page="deepagents__generative-ui__components__surfaces" :index="12" note="Fragment: a surface without auto-scroll." />
      <PublishedCode page="deepagents__generative-ui__components__surfaces" :index="17" note="Recommendations under a product: Product is never published." />
    </div>
  </Panel>
  <Callout tone="info" title="Agent: sample_agent (README §9.16)">
    <p>The samples keep <code>runtime-url="/api/copilotkit"</code> as published, so <code>default</code> is <code>sample_agent</code>, the Deep Agents Quickstart graph. For a run that carries a catalog, the Copilot Runtime adds the <code>render_ui</code> tool to the run's tools and its guide (the components, their props, how to call the tool) to the run's context; the agent's <code>CopilotKitMiddleware</code> passes both to the model — what the overview asks of a LangGraph Python agent. Wiring checked with a fake key only; no surface has been rendered by a live model yet. The page's own runtime — a TanStack <code>BuiltInAgent</code>, on the overview page — is shown there and not served.</p>
  </Callout>
  <Callout tone="info" title="Framework tabs"><p>This page is not under <code>/vue</code>: it prints each sample for React, Angular, React Native and Vue. Only the Vue tab (and code outside the tabs) is used.</p></Callout>
</template>
