import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./values.ts";
import { createFragment, tag } from "../shared.ts";

describe("values", () => {
  const frag = createFragment<typeof toTemplate>("values", tag`(${1})`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("template previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["(", ")"], 1]);
  });

  test("template previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" (", ")"],
      1,
    ]);
  });

  test("object previous fragment is undefined", () => {
    const frag = createFragment<typeof toTemplate>("values", [{ a: 1, b: 2 }]);
    const sql = [["(a, b) values (", ", ", ")"], 1, 2];

    deepEqual(toTemplate(frag, undefined), sql);
  });

  test("object previous fragment is the same clause", () => {
    const frag = createFragment<typeof toTemplate>("values", [{ a: 1 }]);

    deepEqual(toTemplate(frag, frag), [[", (", ")"], 1]);
  });

  test("object previous fragment is a different clause", () => {
    const frag = createFragment<typeof toTemplate>("values", [{ a: 1 }]);

    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" (a) values (", ")"],
      1,
    ]);
  });
});
