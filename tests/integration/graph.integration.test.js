import { describe, expect, it } from "vitest";
import graph from "../../src/deep_agent/graph.js";

const { ANTHROPIC_API_KEY } = process.env;

(ANTHROPIC_API_KEY ? describe : describe.skip)("deep agent integration", () => {
  it("responds to a simple prompt", async () => {
    const result = await graph.invoke({
      messages: [
        {
          role: "user",
          content: "Say hello in one sentence.",
        },
      ],
    });

    expect(result).toBeTruthy();
    expect(result.messages?.length ?? 0).toBeGreaterThan(0);
  });
});
