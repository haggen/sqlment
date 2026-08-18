import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./update.ts";
import { createFragment, tag } from "../shared.ts";

describe("update", () => {
  const frag = createFragment<typeof toTemplate>("update", tag`t`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["update t"]]);
  });

  test("previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" update t"],
    ]);
  });
});
