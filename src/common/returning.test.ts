import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./returning.ts";
import { createFragment, tag } from "../shared.ts";

describe("returning", () => {
  const frag = createFragment<typeof toTemplate>("returning", tag`a`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["returning a"]]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[", a"]]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" returning a"],
    ]);
  });

  test("parameters", () => {
    const frag = createFragment<typeof toTemplate>("returning", tag`a, ${1}`);
    const sql = [["returning a, ", ""], 1];

    deepEqual(toTemplate(frag, undefined), sql);
  });
});
