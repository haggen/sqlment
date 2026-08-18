import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./conflict.ts";
import { createFragment, tag } from "../shared.ts";

describe("conflict", () => {
  const frag = createFragment<typeof toTemplate>(
    "conflict",
    tag`(column) do nothing`,
  );

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag, undefined), [
      ["on conflict (column) do nothing"],
    ]);
  });

  test("previous fragment is the same clause", () => {
    deepEqual(toTemplate(frag, frag), [[", (column) do nothing"]]);
  });

  test("previous fragment is a different clause", () => {
    deepEqual(
      toTemplate(frag, {
        clause: "insert",
        input: tag`t`,
      }),
      [[" on conflict (column) do nothing"]],
    );
  });

  test("parameters", () => {
    const frag = createFragment<typeof toTemplate>(
      "conflict",
      tag`(column) do update set column = ${1}, column = ${2}`,
    );

    const sql = [
      ["on conflict (column) do update set column = ", ", column = ", ""],
      1,
      2,
    ];

    deepEqual(toTemplate(frag, undefined), sql);
  });
});
