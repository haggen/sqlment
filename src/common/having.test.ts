import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./having.ts";
import { createFragment, tag } from "../shared.ts";

describe("having", () => {
  const frag = createFragment<typeof toTemplate>(
    "having",
    tag`count(a) > ${1}`,
  );

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["having count(a) > ", ""], 1]);
  });

  test("previous fragment is the same clause", () => {
    const frag = createFragment<typeof toTemplate>(
      "having",
      tag`count(a) < ${1}`,
    );

    deepEqual(toTemplate(frag, frag), [[" and count(a) < ", ""], 1]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" having count(a) > ", ""],
      1,
    ]);
  });
});
