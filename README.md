# Sqlment

Sqlment is a lightweight query builder for TypeScript. It tries to capture some of the power of more complex builders while sticking closer to hand-written SQL.

- 🪶 Zero dependencies.
- 👨‍✈️ Bring your own driver.
- 🧱 Compose queries by combining clauses.
- 🔗 Mutate queries with chained calls.
- 🪆 Support for nested clauses and subqueries.
- 🗣️ Configurable for almost any SQL dialect.

## Usage

Create a new factory, passing a configuration object:

```js
import { Sqlment } from "sqlment";
import { sqlite } from "sqlment/sqlite";

const sqlment = new Sqlment(sqlite);
```

You create queries via starter functions, and compile with `toQuery()` method:

```js
const { sql, select, ... } = sqlment.starters();

sql`select * from posts`
  .toQuery() //=> ["select * from posts"];
```

Queries are mutable and methods are chainable:

```js
select`*`.from`posts`.where`author_id = ${1}`
  .toQuery(); //=> ["select * from posts where author_id = ?", 1];
```

Queries can be merged:

```js
const withAuthor = select`authors.name as author`
  .join`authors on posts.author_id = authors.id`;

select`posts.*`.from`posts`.merge(withAuthor)
  .toQuery(); //=> ["select posts.*, authors.name as author from posts join authors on posts.author_id = authors.id"];
```

Doesn't matter which order calls are made:

```js
from`posts`.limit(10).select`*`
  .toQuery(); //=> ["select * from posts limit ?", 10]
```

Except for clauses that lack precedence information, like `sql`:

```js
// Bad idea, it won't work:
from`posts`.sql`select *`
  .toQuery(); //=> ["from posts select *"]
```

Nested queries are flattened into the root query:

```js
const langs = ["en", "es", "jp"];
const authors = from`authors`.select`id`.where`language in ${tuple(langs)}`;

from`posts`.select`*`.where`author_id in (${authors})`
  .toQuery(); //=> ["select * from posts where author_id in (select id from authors where language in (?, ?, ?))", "en", "es", "jp"]
```

## Legal

Apache-2.0 © Arthur Corenzan 2026
