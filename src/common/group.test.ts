import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./group.ts";
import { createFragment, tag } from "../shared.ts";

describe("group", () => {
  const frag = createFragment<typeof toTemplate>("group", tag`a`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["group by a"]]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[", a"]]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" group by a"],
    ]);
  });
});
