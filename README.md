# Deep Agent Template (Opinionated, TypeScript)

Opinionated deployment template for a Deep Agent built with [`createDeepAgent(...)`](https://github.com/langchain-ai/deepagentsjs).

## What this template gives you

- A deployable Deep Agent graph at `src/agent.ts`.
- Explicit workflow prompt (plan, delegate, critique, finalize).
- Two predefined subagents (`researcher`, `critic`).
- Human-in-the-loop interrupts on `execute` and `write_file`.
- A Node.js workflow managed by `pnpm` with Vitest unit + integration suites.

## Quickstart

1. Install dependencies:

```bash
corepack enable
pnpm install
```

Use the pinned pnpm version so the security overrides and patches in
`pnpm-workspace.yaml` are applied. The `extract-zip@2.0.1` patch prevents writes
through destination symlinks ([GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3));
remove it once an upstream fixed release is available. Version-based scanners
will still report this dependency until then.

2. Configure environment:

```bash
cp .env.example .env
```

3. Run locally:

```bash
pnpm run dev
```

## Scripts

```bash
pnpm test            # unit tests (src/**/*.test.ts, excludes .int.test.ts)
pnpm run test:int    # integration tests (requires ANTHROPIC_API_KEY)
pnpm run test:eval   # evaluation tests with LangSmith reporter
pnpm run lint        # prettier --check
pnpm run format      # prettier --write
pnpm run build       # langgraphjs build
```

Integration tests are skipped unless `ANTHROPIC_API_KEY` is set.

## Deploy to LangSmith

1. Push this template to a Git repository.
2. In LangSmith, create a new Deployment from that repo.
3. Set environment variables for your selected model provider and optional tracing key.
4. Deploy using the provided `langgraph.json`.

## Reference docs

- Deep Agents (JS): https://github.com/langchain-ai/deepagentsjs
- LangGraph deployment in LangSmith: https://docs.langchain.com/oss/javascript/langchain/deploy
