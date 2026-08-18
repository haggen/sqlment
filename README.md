# Sqlment

Sqlment (siːkwəl.mənt) is a simpler but surprisingly powerful query builder for TypeScript.

At a glance:

```js
import { Sqlment } from "sqlment";
import { postgresql } from "sqlment/postgresql";

// Create a new factory, passing a configuration object.
const sqlment = new Sqlment(postgresql);

// Build the starter functions.
const { sql, from, limit } = sqlment.starters();

// Start a query.
const posts = from`posts`.select`posts.*`;

// Merge with another query.
posts.merge(
  join`pageviews on posts.id = pageviews.post_id`
    .select`count(pageviews.*) as pageviews`.group`posts`.order`pageviews desc`,
);

// Mutate the query.
posts.where`posts.published_at = ${Date.now()}`;

// Use a subquery.
(posts.where`posts.author_id in (${sql`select id from authors where is_active`})`,
  // Get the final query.
  posts.toQuery()); //=> ["select posts.*, count(pageviews.*) as pageviews from posts join pageviews on posts.id = pageviews.post_id where posts.published_at = ? and posts.author_id in (select id from authors where is_active) group by posts order by pageviews desc", Date.now()]
```

Some of the highlights:

- Zero dependencies.
- Bring your own driver.
- Build queries from composable clauses.
- Mutate queries use chained calls.
- Support subqueries.
- Configurable for different SQL dialects.

## Usage

Install the package:

```sh
npm install sqlment
```

Create a module to export starter functions:

```ts
// lib/sql.ts

import { Sqlment } from "sqlment";
import { postgresql } from "sqlment/postgresql";

const sqlment = new Sqlment(postgresql);
export const { sql, from, insert, update, delete: del } = sqlment.starters();
```

Import from the module to create queries:

```ts
// app.ts

import { db } from "./lib/database";
import { sql } from "./lib/sql";

const query = sql`select * from table`;
const results = await db.exec(query.toQuery());
```

## Legal

Apache-2.0 © Arthur Corenzan 2026
