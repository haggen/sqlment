import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./set.ts";
import { createFragment, tag } from "../shared.ts";

describe("set", () => {
  const frag = createFragment<typeof toTemplate>("set", tag`a = ${1}`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("template previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["set a = ", ""], 1]);
  });

  test("template previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[", a = ", ""], 1]);
  });

  test("template previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" set a = ", ""],
      1,
    ]);
  });

  test("object previous fragment is undefined", () => {
    const frag = createFragment<typeof toTemplate>("set", [{ a: 1, b: 2 }]);
    const sql = [["set a = ", ", b = ", ""], 1, 2];

    deepEqual(toTemplate(frag, undefined), sql);
  });

  test("object previous fragment is the same clause", () => {
    const frag = createFragment<typeof toTemplate>("set", [{ a: 1 }]);

    deepEqual(toTemplate(frag, frag), [[", a = ", ""], 1]);
  });

  test("object previous fragment is a different clause", () => {
    const frag = createFragment<typeof toTemplate>("set", [{ a: 1 }]);

    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" set a = ", ""],
      1,
    ]);
  });
});
