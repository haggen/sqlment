import type { Fragment, Template } from "../index.ts";

export const precedence = 1300;

export function toTemplate(
  frag: Fragment<Template>,
  prev?: Fragment,
): Template {
  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);
  strings[0] = "delete from " + strings[0];

  if (prev) {
    strings[0] = " " + strings[0];
  }

  return [strings, ...values];
}
