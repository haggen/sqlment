import type { Fragment, Template } from "../index.ts";

export const precedence = 900;

const prefixes = [
  "left outer join",
  "right outer join",
  "full outer join",
  "left join",
  "right join",
  "full join",
  "inner join",
  "cross join",
  "natural join",
  "join",
];

export function toTemplate(
  frag: Fragment<Template>,
  prev?: Fragment,
): Template {
  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);

  const prefixed = prefixes.some((prefix) =>
    strings[0].toLowerCase().startsWith(prefix + " "),
  );

  if (!prefixed) {
    strings[0] = "join " + strings[0];
  }

  if (prev) {
    strings[0] = " " + strings[0];
  }

  return [strings, ...values];
}
