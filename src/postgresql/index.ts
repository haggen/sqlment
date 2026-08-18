import type { SqlmentConfig } from "../index.ts";
import * as conflict from "../common/conflict.ts";
import * as del from "../common/delete.ts";
import * as from from "../common/from.ts";
import * as group from "../common/group.ts";
import * as having from "../common/having.ts";
import * as insert from "../common/insert.ts";
import * as join from "../common/join.ts";
import * as limit from "../common/limit.ts";
import * as offset from "../common/offset.ts";
import * as or from "../common/or.ts";
import * as order from "../common/order.ts";
import * as returning from "../common/returning.ts";
import * as select from "../common/select.ts";
import * as set from "../common/set.ts";
import * as sql from "../common/sql.ts";
import * as tuple from "../common/tuple.ts";
import * as update from "../common/update.ts";
import * as values from "../common/values.ts";
import * as where from "../common/where.ts";

/**
 * Sqlment config preset for PostgreSQL dialect.
 */
export const postgresql = {
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
    tuple,
    update,
    values,
    where,
  },
} satisfies SqlmentConfig;
