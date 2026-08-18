import type { SqlmentConfig } from "../index.ts";
import * as conflict from "./conflict.ts";
import * as del from "./delete.ts";
import * as from from "./from.ts";
import * as group from "./group.ts";
import * as having from "./having.ts";
import * as insert from "./insert.ts";
import * as join from "./join.ts";
import * as limit from "./limit.ts";
import * as offset from "./offset.ts";
import * as or from "./or.ts";
import * as order from "./order.ts";
import * as returning from "./returning.ts";
import * as select from "./select.ts";
import * as set from "./set.ts";
import * as sql from "./sql.ts";
import * as update from "./update.ts";
import * as values from "./values.ts";
import * as where from "./where.ts";

/**
 * Sqlment config shared by the dialect presets.
 */
export const common = {
  placeholder: (index: number) => `$${index}`,
  clauses: {
    conflict,
    delete: del,
    from,
    group,
    having,
    insert,
    join,
    limit,
    offset,
    or,
    order,
    returning,
    select,
    set,
    sql,
    update,
    values,
    where,
  },
} satisfies SqlmentConfig;
