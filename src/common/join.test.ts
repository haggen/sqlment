import { describe, test } from "node:test";
import { deepEqual, equal } from "node:assert";

import { precedence, toTemplate } from "./join.ts";
import { createFragment, tag } from "../shared.ts";

describe("join", () => {
  const frag = createFragment<typeof toTemplate>(
    "join",
    tag`table on predicate`,
  );

  test("precedence", () => {
    equal(typeof precedence, "number");
  });

  test("previous fragment is undefined", () => {
    deepEqual(toTemplate(frag), [["join table on predicate"]]);
  });

  test("preserves supported type prefixes", () => {
    const cases = [
      tag`left outer join table on predicate`,
      tag`right outer join table on predicate`,
      tag`full outer join table on predicate`,
      tag`left join table on predicate`,
      tag`right join table on predicate`,
      tag`full join table on predicate`,
      tag`inner join table on predicate`,
      tag`cross join table on predicate`,
      tag`natural join table on predicate`,
      tag`join table on predicate`,
    ];

    for (const input of cases) {
      const frag = createFragment<typeof toTemplate>("join", input);
      deepEqual(toTemplate(frag), [[input[0][0]]]);
    }
  });

  test("previous fragment is defined", () => {
    deepEqual(toTemplate(frag, { clause: "any", input: tag`` }), [
      [" join table on predicate"],
    ]);
  });

  test("parameters", () => {
    const frag = createFragment<typeof toTemplate>(
      "join",
      tag`table on column = ${1}`,
    );
    const sql = [["join table on column = ", ""], 1];

    deepEqual(toTemplate(frag, undefined), sql);
  });
});
