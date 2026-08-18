import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./select.ts";
import { createFragment, tag } from "../shared.ts";

describe("select", () => {
  const frag = createFragment<typeof toTemplate>("select", tag`a`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["select a"]]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[", a"]]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" select a"],
    ]);
  });

  test("parameters", () => {
    const frag = createFragment<typeof toTemplate>("select", tag`a, ${1}`);
    const sql = [["select a, ", ""], 1];

    deepEqual(toTemplate(frag, undefined), sql);
  });
});
