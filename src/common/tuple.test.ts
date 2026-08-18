import { describe, test } from "node:test";
import { deepEqual, equal, throws } from "node:assert";

import * as tuple from "./tuple.ts";
import { Sqlment, unwrapSubqueries } from "../index.ts";
import { createFragment, tag } from "../shared.ts";

describe("tuple", () => {
  const frag = createFragment<typeof tuple.toTemplate>("tuple", [[1, 2, 3]]);

  test("precedence", () => {
    equal(typeof tuple.precedence, "number");
  });

  test("multiple values", () => {
    deepEqual(tuple.toTemplate(frag, undefined), [
      ["(", ", ", ", ", ")"],
      1,
      2,
      3,
    ]);
  });

  test("single value", () => {
    const frag = createFragment<typeof tuple.toTemplate>("tuple", [[1]]);
    deepEqual(tuple.toTemplate(frag, undefined), [["(", ")"], 1]);
  });

  test("no values", () => {
    const frag = createFragment<typeof tuple.toTemplate>("tuple", [[]]);
    throws(() => tuple.toTemplate(frag, undefined));
  });

  test("composes inside in ( ... )", () => {
    const sqlment = new Sqlment({
      placeholder: () => "?",
      clauses: { tuple },
    });
    const { tuple: starter } = sqlment.starters();

    deepEqual(unwrapSubqueries(tag`col in ${starter([1, 2, 3])}`), [
      ["col in (", ", ", ", ", ")"],
      1,
      2,
      3,
    ]);
  });
});