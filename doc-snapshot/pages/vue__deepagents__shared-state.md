# Shared State

> Create a two-way connection between your UI and agent state.

## What is shared state?

Agentic Copilots maintain a shared state that seamlessly connects your UI with the agent's execution. This shared state system allows you to:

- Display the agent's current progress and intermediate results
- Update the agent's state through UI interactions
- React to state changes in real-time across your application

<ImageZoom
  src="https://cdn.copilotkit.ai/docs/copilotkit/images/coagents/SharedStateCoAgents.gif"
  alt="Shared State Demo"
  width={1000}
  height={1000}
  className="rounded-lg shadow-lg border mt-0"
/>

## When should I use this?

Use shared state when you want the agent and the user to collaborate through the same application state. The agent's outputs are reflected in the UI, and user updates in the UI are reflected in the agent's execution.

<OpsPlatformCTA
  variant="inline"
  title="Building stateful agents?"
  body="Persistent threads ship with CopilotKit Intelligence on the free Developer tier."
  surface="docs_shared_state"
/>

## Reading agent state

<!-- setup skipped: shared-state-setup is not bundled for deepagents -->

Subscribe a component to the agent's state with `useAgent`. Any time the agent mutates its state, for example via a tool call, the composable updates its reactive `agent` ref and your UI re-renders with the new values.

```vue title="src/components/SharedWorkspace.vue"
<script setup lang="ts">
import { computed } from "vue";
import { useAgent, UseAgentUpdate } from "@copilotkit/vue/v2";

type WorkspaceState = {
  notes?: string[];
  preferences?: { tone?: string };
};

const { agent } = useAgent({
  agentId: "workspace",
  updates: [UseAgentUpdate.OnStateChanged],
});
const state = computed(
  () => (agent.value?.state ?? {}) as WorkspaceState,
);
</script>

<template>
  <ul>
    <li v-for="note in state.notes ?? []" :key="note">{{ note }}</li>
  </ul>
</template>
```

The returned `agent.value.state` is a plain object. Read it like any other reactive application data and render the parts you care about: agent-written notes, structured outputs, progress indicators, or anything else the agent has put there.

## Writing agent state

The same agent object exposes `setState`. Calling it from a UI event handler pushes the new value into shared state, and the agent reads it back on its next turn. The UI's writes visibly steer the model.

```vue title="src/components/SharedWorkspace.vue"
<script setup lang="ts">
function setTone(tone: string) {
  const current = agent.value;
  if (!current) return;

  const previous = (current.state ?? {}) as WorkspaceState;
  current.setState({
    ...previous,
    preferences: { ...previous.preferences, tone },
  });
}
</script>

<template>
  <button @click="setTone('concise')">Prefer concise answers</button>
</template>
```

This is what makes the channel two-way: the UI doesn't just observe the agent, it can hand the agent fresh inputs — preferences, selections, or partial work — without going through the chat thread.

## Rendering shared state in the UI

Because `agent.state` is plain data exposed through a Vue ref, the UI layer is ordinary Vue. The example above wires the agent's outputs into a list and feeds user edits back through `setState`.

Nothing about this is chat-specific: `useAgent` works in any component under `CopilotKitProvider`, so you can render agent state in your main view or canvas, not just inside the chat panel. See **[Render agent state in your app](/vue/deepagents/vue/shared-state/rendering-in-app)** for the full main-view pattern.

```vue title="src/App.vue"
<script setup lang="ts">
import { CopilotChat, CopilotKitProvider } from "@copilotkit/vue/v2";
import SharedWorkspace from "./components/SharedWorkspace.vue";
</script>

<template>
  <CopilotKitProvider runtime-url="/api/copilotkit">
    <SharedWorkspace />
    <CopilotChat agent-id="workspace" />
  </CopilotKitProvider>
</template>
```

## Streaming partial state updates

By default, agent state only updates *between* backend checkpoints, so a long-running tool call appears as one big burst at the end. State streaming forwards a specific tool argument straight into a state key *as it's being generated*, so the UI can watch the answer assemble token-by-token.

```python
# src/agents/shared_state_streaming.py
import uuid

from langchain.agents import AgentState as BaseAgentState, create_agent
from langchain.tools import ToolRuntime, tool
from langchain_core.messages import ToolMessage
from langchain_openai import ChatOpenAI
from langgraph.types import Command

from copilotkit import (
    CopilotKitMiddleware,
    StateItem,
    StateStreamingMiddleware,
)


class AgentState(BaseAgentState):
    """Shared state. `document` is streamed token-by-token."""

    document: str


@tool
def write_document(document: str, runtime: ToolRuntime) -> Command:
    """Write a document for the user.

    Always call this tool when the user asks you to write or draft
    something of any length (an essay, poem, email, summary, etc.).
    The `document` argument is streamed *per token* into shared agent
    state under the `document` key, so the UI can render it as it is
    generated.
    """
    return Command(
        update={
            "document": document,
            "messages": [
                ToolMessage(
                    content="Document written to shared state.",
                    name="write_document",
                    id=str(uuid.uuid4()),
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )


graph = create_agent(
    model=ChatOpenAI(reasoning_effort="none", model="gpt-6-luna"),
    tools=[write_document],
    middleware=[
        CopilotKitMiddleware(),
        # Forward every token of write_document's `document` argument
        # straight into state["document"] while the tool call is still
        # streaming. Without this, `document` would only update once
        # the tool call completes.
        #
        # NOTE: the frontend `usePredictStateSubscription` hook indexes
        # the (partial-JSON-parsed) tool args by `state_key`, so the
        # tool's argument name MUST match `state_key` ("document") for
        # per-token deltas to land in `state.document`.
        StateStreamingMiddleware(
            StateItem(
                state_key="document",
                tool="write_document",
                tool_argument="document",
            )
        ),
    ],
    state_schema=AgentState,
    system_prompt=(
        "You are a collaborative writing assistant. Whenever the user asks "
        "you to write, draft, or revise any piece of text, ALWAYS call the "
        "`write_document` tool with the full content as a single string in "
        "the `document` argument. Never paste the document into a chat "
        "message directly — the document belongs in shared state and the "
        "UI renders it live as you type."
    ),
)
```

See **[State streaming](/vue/deepagents/vue/shared-state/streaming)** for the full walkthrough, including the corresponding `useAgent` subscription on the frontend.

## Read-only context

When a value is **UI-owned** and the agent should read it but never write it back, such as current user, selected record, or scroll position, reach for `useAgentContext` instead of full shared state. It publishes values as a one-way UI-to-agent channel that auto-unregisters on unmount.

`useAgentContext` is a separate read-only capability; it does not replace the bidirectional `agent.state` / `agent.setState(...)` contract above.

See **[Agent read-only context](/vue/deepagents/vue/shared-state/agent-readonly)** for the full pattern.

<IntegrationGrid path="shared-state" exclude={["agno", "agent-spec", "spring-ai", "langroid"]} />
