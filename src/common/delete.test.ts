import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./delete.ts";
import { createFragment, tag } from "../shared.ts";

describe("delete", () => {
  const frag = createFragment<typeof toTemplate>("delete", tag`table`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["delete from table"]]);
  });

  test("previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" delete from table"],
    ]);
  });
});
