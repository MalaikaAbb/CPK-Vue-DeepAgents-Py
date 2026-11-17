<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/shared-state/streaming" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      The page's backend maps <code>write_document</code>'s <code>document</code> argument to the <code>document</code> state key while the
      tool call streams (<code>StateStreamingMiddleware</code>); <code>StreamingDocument</code> renders <code>state.document</code> with a
      LIVE badge.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Write a short poem about autumn']" expect="If a backend streamed `document`: LIVE, then the poem growing token by token in the article." fail="What actually happens here: “Waiting for a draft…” throughout and the poem in the chat — sample_agent has no write_document tool and no `document` state (see below)." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/shared-state/streaming/demo-chat/components/StreamingDocument.vue" />
      <SourceCode file="frontend/src/routes/shared-state/streaming/demo-chat/App.vue" />
    </div>
  </Panel>
  <Panel title="Backend block in the .md export, not served"><PublishedCode page="shared-state__streaming" :index="0" note="Only in the page's .md export; the rendered Deep Agents page shows no backend code (its setup step reads “not bundled for deepagents”). It is LangGraph create_agent code, not Deep Agents, so it is not served." /></Panel>
  <Callout tone="warn" title="Why this route is broken (README §9)"><p>The rendered page publishes no backend, so nothing writes <code>document</code>. The streaming wiring (<code>write_document</code> + <code>StateStreamingMiddleware</code>) exists only in the .md export, as LangGraph <code>create_agent</code> code; per your rules it is not served.</p></Callout>
  <Callout tone="harness" title="Agent id"><p><code>writer</code> → <code>sample_agent</code> (<code>backend/agents.ts</code>).</p></Callout>
</template>
