import type { Fragment, Template } from "../index.ts";

export const precedence = 400;

export function toTemplate(
  frag: Fragment<[TemplateStringsArray, ...unknown[]] | [number]>,
  prev?: Fragment,
): Template {
  if (typeof frag.input[0] === "number") {
    const strings = ["limit ", ""];

    if (prev) {
      strings[0] = " " + strings[0];
    }

    return [strings, frag.input[0]];
  }

  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);

  strings[0] = "limit " + strings[0];

  if (prev) {
    strings[0] = " " + strings[0];
  }

  return [strings, ...values];
}
