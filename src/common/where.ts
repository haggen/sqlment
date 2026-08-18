import type { Fragment, Template } from "../index.ts";

export const precedence = 800;

export function toTemplate(
  frag: Fragment<Template>,
  prev?: Fragment,
): Template {
  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);
  const prefix = "where ";
  if (prev?.clause === "where" || prev?.clause === "or") {
    strings[0] = " and " + strings[0];
  } else if (prev) {
    strings[0] = " " + prefix + strings[0];
  } else {
    strings[0] = prefix + strings[0];
  }
  return [strings, ...values];
}
