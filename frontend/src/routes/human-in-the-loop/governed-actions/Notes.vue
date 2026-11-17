<script setup lang="ts">
import Callout from "@/components/harness/Callout.vue";
import Panel from "@/components/harness/Panel.vue";
import PublishedCode from "@/components/harness/PublishedCode.vue";
import RouteHeader from "@/components/harness/RouteHeader.vue";
import SourceCode from "@/components/harness/SourceCode.vue";
import TryIt from "@/components/harness/TryIt.vue";
const D = "frontend/src/routes/human-in-the-loop/governed-actions/demo-chat";
</script>

<template>
  <RouteHeader path="/human-in-the-loop/governed-actions" />
  <Panel title="What it demonstrates">
    <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      Both halves mounted together, as the page's App.vue does: an interrupt-driven <code>GovernedActionApproval</code> and a
      <code>useHumanInTheLoop</code> tool <code>approve_governed_action</code> whose card auto-approves <code>allow</code>, auto-rejects
      <code>deny</code>, and asks on <code>require_approval</code>.
    </p>
    <div class="mt-4">
      <TryIt
        :prompts="['Refund $40 to customer 1182. Call approve_governed_action first with id a-1, tool send_refund, reference POL-7, verdict require_approval.', 'Same with verdict allow', 'Same with verdict deny']"
        expect="require_approval: the card shows the summary and Approve and run / Reject; the agent is told the decision. allow / deny: resolved without asking, labelled “Allowed by policy” / “Blocked by policy”."
        fail="No card — the agent never called approve_governed_action (check the backend logs). allow / deny / require_approval all go through the tool path; the interrupt path below cannot fire."
      />
    </div>
  </Panel>
  <Panel title="The demo">
    <div class="space-y-4">
      <SourceCode :file="`${D}/components/GovernedActionTool.vue`" />
      <SourceCode :file="`${D}/components/GovernedActionCard.vue`" />
      <SourceCode :file="`${D}/components/GovernedActionApproval.vue`" />
      <SourceCode :file="`${D}/App.vue`" />
    </div>
  </Panel>
  <Panel title="Published, not mounted">
    <div class="space-y-4">
      <PublishedCode page="human-in-the-loop__governed-actions" :index="0" />
      <PublishedCode page="human-in-the-loop__governed-actions" :index="2" note="Server-side resume handler; executeSideEffect is never defined on the page." />
    </div>
  </Panel>
  <Callout tone="warn" title="Why the interrupt path cannot fire (README §9)"><p><code>useInterrupt</code> reacts to a run that finishes with <code>outcome.type === "interrupt"</code> (or a legacy <code>on_interrupt</code> custom event). <code>sample_agent</code> (the Deep Agents Quickstart graph) never calls <code>interrupt()</code>, and no Vue deepagents page publishes a backend that does; the useInterrupt page says interrupts are not available on this framework.</p></Callout>
  <Callout tone="warn" title="Doc notes">
    <p>· The tool half never executes a side effect — it only reports the decision back to the model; the page's <code>handleApproval</code> (with undefined <code>executeSideEffect</code>) is backend code for the interrupt half.</p>
    <p>· The card's <code>args</code> type omits <code>tool</code> and <code>arguments</code>, so it never shows them, although the page's guardrails say to “show the exact action arguments before the user approves”.</p>
  </Callout>
  <Callout tone="info" title="How the tool reaches the model">
    <p>This route's agent is <code>sample_agent</code>, the Deep Agents Quickstart's <code>create_deep_agent</code> graph (<code>agent/main.py</code>). Its <code>CopilotKitMiddleware</code> (“for frontend tools and context”) forwards the tools registered in the browser to the model. Wiring verified with a fake key only; not yet driven against a live model.</p>
  </Callout>
</template>
