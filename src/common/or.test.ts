import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./or.ts";
import { createFragment, tag } from "../shared.ts";

describe("or", () => {
  const frag = createFragment<typeof toTemplate>("or", tag`a = ${1}`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["where a = ", ""], 1]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[" or a = ", ""], 1]);
  });

  test("previous fragment is where", () => {
    deepEqual(toTemplate(frag, { clause: "where", input: tag`` }), [
      [" or a = ", ""],
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
