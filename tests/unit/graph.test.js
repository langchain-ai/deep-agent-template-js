import { describe, expect, it } from "vitest";
import graph, { SUBAGENTS, SYSTEM_PROMPT } from "../../src/deep_agent/graph.js";

describe("graph configuration", () => {
  it("creates a runnable graph", () => {
    expect(graph).toBeDefined();
    expect(graph.invoke).toBeInstanceOf(Function);
  });

  it("configures researcher + critic subagents", () => {
    const names = new Set(SUBAGENTS.map((subagent) => subagent.name));
    expect(names).toEqual(new Set(["researcher", "critic"]));
  });

  it("keeps the workflow instructions in the system prompt", () => {
    expect(SYSTEM_PROMPT).toContain("Workflow");
  });
});
