import { test, describe } from "node:test";
import { deepEqual, equal } from "node:assert";

import {
  Builder,
  Sqlment,
  unwrapSubqueries,
  type Template,
  type Fragment,
} from "./index.ts";
import { tag } from "./shared.ts";

/**
 * Sample implementation of ClauseConfig.toTemplate().
 */
function toTemplate(frag: Fragment<Template>, prev: Fragment): Template {
  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);
  if (prev) {
    strings[0] = " " + strings[0];
  }
  return [strings, ...values];
}

/**
 * Sample implementation of placeholder().
 */
function placeholder() {
  return "?";
}

/**
 * Sample SqlmentConfig.
 */
const config = {
  placeholder,
  clauses: { sql: { precedence: 1, toTemplate } },
};

/**
 * Create a value that acts like a subquery.
 */
function subquery(...input: Template) {
  return {
    toTemplate(frag: Fragment<Template>, prev?: Fragment): Template {
      return input;
    },
  };
}

describe("Sqlment", () => {
  test("constructor", () => {
    const sqlment = new Sqlment(config);

    equal(sqlment instanceof Sqlment, true);
    equal(sqlment.config, config);
  });

  test("starters", () => {
    const sqlment = new Sqlment(config);
    const starters = sqlment.starters();

    equal(typeof starters, "object");
    deepEqual(Object.keys(starters), ["sql"]);
    equal(typeof starters.sql, "function");

    // Not calling clauses.sql here; Builder is tested separately.
  });
});

describe("Builder", () => {
  const sqlment = new Sqlment(config);

  test("constructor", () => {
    const builder = new Builder(sqlment);

    equal(builder instanceof Builder, true);
    equal(builder.sqlment, sqlment);
  });

  test("push", () => {
    const builder = new Builder(sqlment);

    builder.push({ clause: "sql", input: tag`select *` });
    builder.push({ clause: "sql", input: tag`from table` });

    deepEqual(builder.fragments, [
      { clause: "sql", input: [["select *"]] },
      { clause: "sql", input: [["from table"]] },
    ]);
  });

  test("merge", () => {
    const one = new Builder(sqlment);
    one.push({ clause: "sql", input: tag`select *` });

    const two = new Builder(sqlment);
    two.push({ clause: "sql", input: tag`from table` });

    one.merge(two);

    equal(one.fragments.length, 2);
    deepEqual(one.fragments, [
      { clause: "sql", input: [["select *"]] },
      { clause: "sql", input: [["from table"]] },
    ]);
  });

  test("toTemplate", () => {
    const builder = new Builder(sqlment);
    builder.push({
      clause: "sql",
      input: tag`select * from table where column = ${1}`,
    });
    const template = builder.toTemplate();

    deepEqual(template, [["select * from table where column = ", ""], 1]);
  });

  test("toQuery", () => {
    const builder = new Builder(sqlment);
    builder.push({
      clause: "sql",
      input: tag`select * from table where column = ${1}`,
    });
    const sql = builder.toQuery();

    equal(Array.isArray(sql), true);
    equal(sql.length, 2);
    equal(sql[0], "select * from table where column = ?");
    equal(sql[1], 1);
  });
});

describe("unwrapSubqueries", () => {
  test("template without values", () => {
    const template = tag`select * from table`;
    deepEqual(unwrapSubqueries(template), template);
  });

  test("template with non-query values", () => {
    const one = tag`select * from table where column = ${1}`;
    deepEqual(unwrapSubqueries(one), one);

    const two = tag`select * from table where column in (${1}, ${2}, ${3})`;
    deepEqual(unwrapSubqueries(one), one);
  });

  test("subquery without values", () => {
    const template = tag`select * from table where column in (${subquery`select column from table`})`;

    deepEqual(unwrapSubqueries(template), [
      ["select * from table where column in (select column from table)"],
    ]);
  });

  test("subquery with values alone", () => {
    const template = tag`select * from table where column in (${subquery`select column from table where column = ${1}`})`;
    deepEqual(unwrapSubqueries(template), [
      [
        "select * from table where column in (select column from table where column = ",
        ")",
      ],
      1,
    ]);
  });

  test("subquery with values along other values", () => {
    const query = subquery`select column from table where column = ${1}`;
    const template = tag`select * from table where column in (${query}) and column = ${1}`;

    deepEqual(unwrapSubqueries(template), [
      [
        "select * from table where column in (select column from table where column = ",
        ") and column = ",
        "",
      ],
      1,
      1,
    ]);
  });
});
