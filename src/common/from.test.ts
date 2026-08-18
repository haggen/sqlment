import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./from.ts";
import { createFragment, tag } from "../shared.ts";

describe("from", () => {
  const frag = createFragment<typeof toTemplate>("from", tag`t`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["from t"]]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[", t"]]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [[" from t"]]);
  });
});
