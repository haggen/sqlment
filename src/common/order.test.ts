import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./order.ts";
import { createFragment, tag } from "../shared.ts";

describe("order", () => {
  const frag = createFragment<typeof toTemplate>("order", tag`a asc`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["order by a asc"]]);
  });

  test("previous fragment is the same clause", () => {
    const frag = createFragment<typeof toTemplate>("order", tag`b desc`);

    deepEqual(toTemplate(frag, frag), [[", b desc"]]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" order by a asc"],
    ]);
  });
});
