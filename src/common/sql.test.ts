import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./sql.ts";
import { createFragment, tag } from "../shared.ts";

describe("sql", () => {
  const frag = createFragment<typeof toTemplate>("sql", tag`select *`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["select *"]]);
  });

  test("previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" select *"],
    ]);
  });

  test("parameters", () => {
    const frag = createFragment<typeof toTemplate>("sql", tag`where x = ${1}`);
    const sql = [["where x = ", ""], 1];

    deepEqual(toTemplate(frag, undefined), sql);
  });
});
