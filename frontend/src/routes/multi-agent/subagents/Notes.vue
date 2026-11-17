<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
</script>

<template>
  <RouteHeader path="/multi-agent/subagents" />
  <Callout tone="warn" title="Gap: no code on the rendered page (README §9)">
    <p>· The rendered Deep Agents page shows no code at all: its setup step reads “subagents-setup is not bundled for deepagents”, and the “Rendering a live delegation log” section is empty.</p>
    <p>· The page's .md export carries two copies of a <code>subagents.py</code> (below). It is LangGraph <code>create_agent</code> code, not Deep Agents; it never builds the supervisor graph that would call its <code>research_agent</code> / <code>writing_agent</code> / <code>critique_agent</code> tools, and it imports <code>src.agents._header_forwarding_middleware</code>, which no page publishes.</p>
    <p>· With no frontend and no runnable graph there is nothing to mount, so this route has no demo. (Deep Agents' own sub-agent mechanism — the built-in <code>task</code> tool — is present in <code>sample_agent</code>, but no page shows a UI for it.)</p>
  </Callout>
  <Panel title="Backend block in the .md export, not served"><PublishedCode page="multi-agent__subagents" :index="1" note="The second, longer copy; the first copy is its opening half." /></Panel>
</template>
