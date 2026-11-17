<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/human-in-the-loop/headless/demo-chat";
</script>

<template>
  <RouteHeader path="/human-in-the-loop/headless" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Interrupts with no chat mounted: <code>useInterrupt({ renderInChat: false })</code> rendered in a panel of your own. The Deep Agents page
      publishes only the <code>App.vue</code> that mounts <code>HeadlessInterruptPanel.vue</code>; the panel itself is never shown.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['(no input — the stand-in has no way to start a run)']" expect="If an interrupt were pending on `default`: its message with Resolve / Cancel." fail="What actually happens here: “no interrupt pending”, permanently (see below)." />
    </div>
  </Panel>
  <Panel title="Published file, mounted verbatim"><SourceCode :file="`${D}/App.vue`" /></Panel>
  <Callout tone="harness" title="Stand-in: HeadlessInterruptPanel.vue">
    <p>App.vue imports <code>./components/HeadlessInterruptPanel.vue</code>, which the page never publishes, so App.vue cannot compile without it. Minimal flagged stand-in: the pending interrupt's message with resolve / cancel, and a visible empty state.</p>
  </Callout>
  <Panel title="Stand-in file"><SourceCode :file="`${D}/components/HeadlessInterruptPanel.vue`" /></Panel>
  <Callout tone="warn" title="Why no interrupt can fire (README §9)">
    <p>The page says headless interrupts are not available on this framework and publishes no backend. <code>default</code> is <code>sample_agent</code> (the Deep Agents Quickstart graph), which never calls <code>interrupt()</code>; per your rules no interrupting graph was written.</p>
  </Callout>
  <Callout tone="warn" title="Doc discrepancy (README §9)">
    <p>Deep Agents runs on LangGraph, which has a native <code>interrupt()</code>, and this repo's runtime reports <code>humanInTheLoop.interrupts: true</code> for <code>sample_agent</code> (<code>/api/copilotkit/info</code>). The page nevertheless says the feature is not available on this framework, and its setup step reads “not bundled for deepagents”.</p>
  </Callout>
</template>
