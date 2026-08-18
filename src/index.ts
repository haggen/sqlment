/**
 * An SQL statement and parameters.
 */
export type Query = [string, ...unknown[]];

/**
 * The strings and values of a template literal.
 */
export type Template = [TemplateStringsArray | string[], ...unknown[]];

/**
 * Input to build an SQL clause.
 */
export type Fragment<T extends unknown[] = unknown[]> = {
  clause: string;
  input: T;
};

/**
 * Defines how a SQL clause is turned into a template.
 */
export type ClauseConfig = {
  precedence: number;
  toTemplate(frag: Fragment, prev?: Fragment): Template;
};

/**
 * Sqlment configuration.
 */
export type SqlmentConfig = {
  placeholder: (index: number) => string;
  clauses: Record<string, ClauseConfig>;
};

/**
 * A nested query, detected by its toTemplate method.
 */
type Subquery = {
  toTemplate(): Template;
};

/**
 * Check whether a value looks like a nested query.
 */
function isSubquery(value: unknown): value is Subquery {
  return (
    typeof value === "object" &&
    value !== null &&
    "toTemplate" in value &&
    typeof value.toTemplate === "function"
  );
}

/**
 * Flatten nested subquery templates into the surrounding template.
 */
export function unwrapSubqueries(input: Template): Template {
  const query: [string[], ...unknown[]] = [[]];
  const values = input.slice(1);

  for (
    let stringIdx = 0, valueIdx = 0;
    stringIdx < input[0].length;
    stringIdx += 1, valueIdx += 1
  ) {
    const value = values[valueIdx];

    if (isSubquery(value)) {
      const subquery = value.toTemplate();

      // When a subquery is found, stitch its strings into the parent
      // strings and insert its values into the parent values.
      //
      // e.g. [["a", "d"], [["b", "c"], "-"]] => [["ab", "cd"], ["-"]]

      if (subquery[0].length === 0) {
        query[0].push(input[0][stringIdx] + input[0][stringIdx + 1]);
      } else if (subquery[0].length === 1) {
        query[0].push(
          input[0][stringIdx] + subquery[0][0] + input[0][stringIdx + 1],
        );
      } else {
        query[0].push(input[0][stringIdx] + subquery[0][0]);
        query[0].push(...subquery[0].slice(1, -1));
        query[0].push(
          subquery[0][subquery[0].length - 1] + input[0][stringIdx + 1],
        );
      }

      query.push(...subquery.slice(1));

      // When two sets of strings are stitched we skip
      // two gaps, so we have to compensate in the count.
      stringIdx += 1;
    } else {
      if (valueIdx < values.length) {
        query.push(value);
      }
      query[0].push(input[0][stringIdx]);
    }
  }

  return query;
}

/**
 * Extract the input type from a clause's config entry.
 */
type ClauseInput<
  Config extends SqlmentConfig,
  Clause extends keyof Config["clauses"],
> =
  Parameters<Config["clauses"][Clause]["toTemplate"]>[0] extends Fragment<
    infer I
  >
    ? I
    : never;

/**
 * The clause methods added to the builder.
 */
type BuilderExtension<Config extends SqlmentConfig> = {
  [Clause in keyof Config["clauses"]]: (
    ...input: ClauseInput<Config, Clause>
  ) => ExtendedBuilder<Config>;
};

/**
 * Builder extended with clauses.
 */
type ExtendedBuilder<Config extends SqlmentConfig> = Builder<Config> &
  BuilderExtension<Config>;

/**
 * SQL query builder.
 */
export class Builder<Config extends SqlmentConfig> {
  sqlment: Sqlment<Config>;
  #fragments: Fragment<ClauseInput<Config, keyof Config["clauses"]>>[] = [];

  constructor(sqlment: Sqlment<Config>) {
    this.sqlment = sqlment;
  }

  get fragments() {
    return this.#fragments;
  }

  /**
   * Add fragments to this query.
   */
  push(...fragments: Fragment<ClauseInput<Config, keyof Config["clauses"]>>[]) {
    this.#fragments.push(...fragments);
  }

  /**
   * Copy the fragments of another builder into this one.
   */
  merge(query: Builder<Config>) {
    this.push(...query.#fragments);
  }

  /**
   * Compile fragments into a final template.
   */
  toTemplate(): Template {
    const fragments = this.#fragments.toSorted(
      (a, b) =>
        this.sqlment.config.clauses[b.clause].precedence -
        this.sqlment.config.clauses[a.clause].precedence,
    );

    const template: [string[], ...unknown[]] = [[]];

    let prev: (typeof this.fragments)[number] | undefined = undefined;

    for (const frag of fragments) {
      const [strings, ...values] = this.sqlment.config.clauses[
        frag.clause
      ].toTemplate(frag, prev);

      // Join this fragment's strings with the ones collected so far.
      if (template[0].length > 0) {
        template[0][template[0].length - 1] += strings[0];
        template[0].push(...strings.slice(1));
      } else {
        template[0].push(...strings);
      }

      template.push(...values);

      prev = frag;
    }

    return unwrapSubqueries(template);
  }

  /**
   * Create the final SQL statement.
   */
  toQuery(): Query {
    const [strings, ...values] = this.toTemplate();

    let sql = "";

    for (let i = 0; i < strings.length; i++) {
      sql +=
        i === 0 ? strings[i] : this.sqlment.config.placeholder(i) + strings[i];
    }

    return [sql, ...values];
  }
}

/**
 * Holds the config and creates starter functions for the configured clauses.
 */
export class Sqlment<Config extends SqlmentConfig> {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Create the extended builder class and a starter function per clause.
   */
  starters() {
    const sqlment = this;

    const ExtendedBuilder = class extends Builder<Config> {
      constructor() {
        super(sqlment);
      }
    } as new () => ExtendedBuilder<Config>;

    const starters = {} as BuilderExtension<Config>;

    const clauses = Object.keys(
      this.config.clauses,
    ) as (keyof Config["clauses"])[];

    for (const clause of clauses) {
      Object.defineProperty(ExtendedBuilder.prototype, clause, {
        value(...input: ClauseInput<Config, typeof clause>) {
          this.push({ clause, input });
          return this;
        },
      });

      starters[clause] = (...input: ClauseInput<Config, typeof clause>) => {
        const query = new ExtendedBuilder();
        return query[clause](...input);
      };
    }

    return starters;
  }
}
