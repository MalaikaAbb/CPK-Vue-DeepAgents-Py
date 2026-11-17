<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
</script>

<template>
  <RouteHeader path="/shared-state" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Agent <code>workspace</code>'s state read through <code>useAgent</code> and rendered as a notes list, and written back with
      <code>agent.setState</code> from the “Prefer concise answers” button. <code>workspace</code> is <code>sample_agent</code>: the rendered page publishes no backend.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Click “Prefer concise answers”, then ask: Write a two-line poem']" expect="The button's setState lands in the agent's state (Inspector › State), and the run reaches sample_agent and replies." fail="What does not happen here: the notes list never fills, and the agent does not act on the tone — no published deepagents backend writes `notes` or reads `preferences` (see below)." />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode file="frontend/src/routes/shared-state/demo-chat/components/SharedWorkspace.vue" />
      <SourceCode file="frontend/src/routes/shared-state/demo-chat/App.vue" />
    </div>
  </Panel>
  <Panel title="The two fragments, as published">
    <div class="space-y-4">
      <PublishedCode page="shared-state" :index="0" />
      <PublishedCode page="shared-state" :index="1" />
    </div>
  </Panel>
  <Panel title="Backend block in the .md export, not served"><PublishedCode page="shared-state" :index="3" note="Only in the page's .md export; the rendered Deep Agents page shows no backend code (its setup step reads “not bundled for deepagents”). It is LangGraph create_agent code, not Deep Agents, so it is not served." /></Panel>
  <Callout tone="harness" title="What the harness changed">
    <p>· The page prints <code>SharedWorkspace.vue</code> twice (reading, then writing; the second has no imports and uses <code>agent</code> from the first). Merged into one file, each verbatim.</p>
    <p>· <code>workspace</code> → <code>sample_agent</code> (<code>backend/agents.ts</code>).</p>
  </Callout>
  <Callout tone="warn" title="Doc note (README §9)">
    <p>The page's component lists <code>notes</code> and writes <code>preferences.tone</code>. The rendered page publishes no backend; <code>sample_agent</code> writes no <code>notes</code> and ignores <code>preferences</code>, so the list stays empty and the tone has no effect on replies.</p>
  </Callout>
</template>
