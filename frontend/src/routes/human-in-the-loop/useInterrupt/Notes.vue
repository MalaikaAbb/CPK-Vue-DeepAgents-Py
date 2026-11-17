<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/human-in-the-loop/useInterrupt/demo-chat";
</script>

<template>
  <RouteHeader path="/human-in-the-loop/useInterrupt" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <code>ApprovalPanel.vue</code> renders a pending interrupt outside the transcript with <code>useInterrupt({ renderInChat: false })</code>,
      with Approve / Cancel that <code>resolve</code> / <code>cancel</code> it. The page's <code>App.vue</code> mounts a <code>MeetingChat.vue</code> it never publishes.
    </p>
    <div class="mt-4">
      <TryIt :prompts="['Schedule a meeting about Q3 planning']" expect="If the agent interrupted: “Approve this action?” with Approve / Cancel above the chat; resolving resumes the run." fail="What actually happens here: a normal reply and no panel (see below)." />
    </div>
  </Panel>
  <Panel title="Published files, mounted verbatim">
    <div class="space-y-4">
      <SourceCode :file="`${D}/components/ApprovalPanel.vue`" />
      <SourceCode :file="`${D}/App.vue`" />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <PublishedCode page="human-in-the-loop__useInterrupt" :index="2" note="Fragment: reads slotProps from a call it does not print." />
  </Panel>
  <Callout tone="harness" title="Stand-in: MeetingChat.vue">
    <p>App.vue imports <code>./components/MeetingChat.vue</code>, which the Deep Agents page never publishes, so App.vue cannot compile without it. Minimal flagged stand-in: the page's own <code>ApprovalPanel.vue</code> above a <code>CopilotChat</code> that starts runs.</p>
  </Callout>
  <Panel title="Stand-in file"><SourceCode :file="`${D}/components/MeetingChat.vue`" /></Panel>
  <Callout tone="warn" title="Why no interrupt can fire (README §9)">
    <p>The page says <code>useInterrupt</code> is not available on this framework and publishes no backend. <code>default</code> is <code>sample_agent</code> (the Deep Agents Quickstart graph), which never calls <code>interrupt()</code>; per your rules no interrupting graph was written.</p>
  </Callout>
  <Callout tone="warn" title="Doc discrepancy (README §9)">
    <p>Deep Agents runs on LangGraph, which has a native <code>interrupt()</code>, and this repo's runtime reports <code>humanInTheLoop.interrupts: true</code> for <code>sample_agent</code> (<code>/api/copilotkit/info</code>). The page nevertheless says the feature is not available on this framework, and its setup step reads “not bundled for deepagents”.</p>
  </Callout>
</template>
