import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./insert.ts";
import { createFragment, tag } from "../shared.ts";

describe("insert", () => {
  const frag = createFragment<typeof toTemplate>("insert", tag`t (a)`);

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [["insert into t (a)"]]);
  });

  test("previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" insert into t (a)"],
    ]);
  });

  test("parameters", () => {
    const frag = createFragment<typeof toTemplate>(
      "insert",
      tag`t (a) values (${1})`,
    );
    const sql = [["insert into t (a) values (", ")"], 1];

    deepEqual(toTemplate(frag, undefined), sql);
  });
});
