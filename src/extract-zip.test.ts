import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const cliRequire = createRequire(
  require.resolve("@langchain/langgraph-cli/package.json")
);
const extract: (zip: string, options: { dir: string }) => Promise<void> =
  cliRequire("extract-zip");
const symlinkArchive =
  "UEsDBBQAAAAAAAAAIQBMpD31CQAAAAkAAAAEAAAAZmlsZS4uL2NhbmFyeVBLAwQUAAAAAADztipdtXqZJAgAAAAIAAAABAAAAGZpbGV0YW1wZXJlZFBLAQIUAxQAAAAAAAAAIQBMpD31CQAAAAkAAAAEAAAAAAAAAAAAAAD/oQAAAABmaWxlUEsBAhQDFAAAAAAA87YqXbV6mSQIAAAACAAAAAQAAAAAAAAAAAAAAIABKwAAAGZpbGVQSwUGAAAAAAIAAgBkAAAAVQAAAAAA";
const regularArchive =
  "UEsDBBQAAAAAAPO2Kl1X7nGSBQAAAAUAAAAEAAAAZmlsZWZpcnN0UEsDBBQAAAAAAPO2Kl2PKKQfBAAAAAQAAAAEAAAAZmlsZXNhZmVQSwECFAMUAAAAAADztipdV+5xkgUAAAAFAAAABAAAAAAAAAAAAAAAgAEAAAAAZmlsZVBLAQIUAxQAAAAAAPO2Kl2PKKQfBAAAAAQAAAAEAAAAAAAAAAAAAACAAScAAABmaWxlUEsFBgAAAAACAAIAZAAAAE0AAAAAAA==";
const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true }))
  );
});

async function setup(archive: string) {
  const root = await mkdtemp(join(tmpdir(), "extract-zip-test-"));
  roots.push(root);
  const zip = join(root, "archive.zip");
  const dir = join(root, "output");
  const canary = join(root, "canary");
  await mkdir(dir);
  await writeFile(zip, Buffer.from(archive, "base64"));
  return { zip, dir, canary };
}

it.each([false, true])(
  "rejects archive-planted symlinks (existing target: %s)",
  async (existing) => {
    const { zip, dir, canary } = await setup(symlinkArchive);
    if (existing) await writeFile(canary, "original");
    await expect(extract(zip, { dir })).rejects.toThrow(/symlink/);
    if (existing) {
      expect(await readFile(canary, "utf8")).toBe("original");
    } else {
      await expect(readFile(canary)).rejects.toMatchObject({ code: "ENOENT" });
    }
  }
);

it("rejects pre-existing destination symlinks", async () => {
  const { zip, dir, canary } = await setup(regularArchive);
  await writeFile(canary, "original");
  await symlink(canary, join(dir, "file"));
  await expect(extract(zip, { dir })).rejects.toThrow(/symlink/);
  expect(await readFile(canary, "utf8")).toBe("original");
});

it("preserves regular-file overwrites and patches both CLI dependency paths", async () => {
  const { zip, dir } = await setup(regularArchive);
  await writeFile(join(dir, "file"), "existing");
  await extract(zip, { dir });
  expect(await readFile(join(dir, "file"), "utf8")).toBe("safe");
  const createRequireFromCli = createRequire(
    cliRequire.resolve("create-langgraph")
  );
  expect(createRequireFromCli.resolve("extract-zip")).toBe(
    cliRequire.resolve("extract-zip")
  );
});
