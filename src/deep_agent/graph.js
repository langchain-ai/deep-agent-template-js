import { createDeepAgent } from "deepagents";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const DEFAULT_MODEL = process.env.DEEP_AGENT_MODEL ?? "anthropic:claude-sonnet-4-6";

export const SYSTEM_PROMPT = `
You are a rigorous execution-focused deep agent.

Workflow you must follow:
1. Write and maintain a todo list for non-trivial requests.
2. Delegate focused fact-finding to subagents when helpful.
3. Store intermediate drafts in files when the task is long.
4. Before finalizing, run a brief internal critique for risks, gaps, and missing constraints.
5. Return concise, actionable final output.

Quality bar:
- Prefer concrete evidence over assumptions.
- State unresolved uncertainty explicitly.
- Keep output compact unless the user asks for depth.
`.trim();

export const utcNow = tool(
  async () => new Date().toISOString(),
  {
    name: "utc_now",
    description: "Return the current UTC timestamp in ISO format.",
    schema: z.object({}),
  }
);

export const confidenceCheck = tool(
  async ({ claim, confidence }) => {
    const bounded = Math.min(Math.max(confidence, 0), 1);
    return `claim='${claim}'; confidence=${bounded.toFixed(2)}`;
  },
  {
    name: "confidence_check",
    description: "Force explicit confidence scoring for key claims.",
    schema: z.object({
      claim: z.string().describe("The claim being assessed."),
      confidence: z.number().describe("Numeric confidence in [0, 1]."),
    }),
  }
);

export const SUBAGENTS = [
  {
    name: "researcher",
    description: "Use for evidence collection and source-grounded fact finding.",
    systemPrompt:
      "You are a focused researcher. Gather evidence, list assumptions, and report contradictions clearly.",
    tools: [utcNow, confidenceCheck],
  },
  {
    name: "critic",
    description: "Use for adversarial review of drafts and plans.",
    systemPrompt:
      "You are a critical reviewer. Find weak logic, untested assumptions, and missing constraints.",
    tools: [confidenceCheck],
  },
];

export const graph = await createDeepAgent({
  model: DEFAULT_MODEL,
  tools: [utcNow, confidenceCheck],
  systemPrompt: SYSTEM_PROMPT,
  subagents: SUBAGENTS,
  interruptBefore: {
    execute: true,
    write_file: true,
  },
  name: "opinionated_deep_agent",
});

export default graph;
