import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./limit.ts";
import { createFragment, tag } from "../shared.ts";

describe("limit", () => {
  const frag = createFragment<typeof toTemplate>("limit", tag`${1}`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("number previous fragment is undefined", () => {
    const frag = createFragment<typeof toTemplate>("limit", [10]);
    const sql = [["limit ", ""], 10];

    deepEqual(toTemplate(frag, undefined), sql);
  });

  test("number previous fragment is defined", () => {
    const frag = createFragment<typeof toTemplate>("limit", [10]);

    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" limit ", ""],
      10,
    ]);
  });

  test("template previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["limit ", ""], 1]);
  });

  test("template previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" limit ", ""],
      1,
    ]);
  });
});
