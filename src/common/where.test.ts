import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./where.ts";
import { createFragment, tag } from "../shared.ts";

describe("where", () => {
  const frag = createFragment<typeof toTemplate>("where", tag`a = ${1}`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["where a = ", ""], 1]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[" and a = ", ""], 1]);
  });

  test("previous fragment is or", () => {
    deepEqual(toTemplate(frag, { clause: "or", input: tag`` }), [
      [" and a = ", ""],
      1,
    ]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" where a = ", ""],
      1,
    ]);
  });
});
