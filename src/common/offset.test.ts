import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./offset.ts";
import { createFragment, tag } from "../shared.ts";

describe("offset", () => {
  const frag = createFragment<typeof toTemplate>("offset", tag`${1}`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("number previous fragment is undefined", () => {
    const frag = createFragment<typeof toTemplate>("offset", [10]);
    const sql = [["offset ", ""], 10];

    deepEqual(toTemplate(frag, undefined), sql);
  });

  test("number previous fragment is defined", () => {
    const frag = createFragment<typeof toTemplate>("offset", [10]);

    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" offset ", ""],
      10,
    ]);
  });

  test("template previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["offset ", ""], 1]);
  });

  test("template previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" offset ", ""],
      1,
    ]);
  });
});
