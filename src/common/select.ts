import type { Fragment, Template } from "../index.ts";

export const precedence = 1200;

export function toTemplate(
  frag: Fragment<Template>,
  prev?: Fragment,
): Template {
  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);
  const prefix = "select ";
  if (prev?.clause === "select") {
    strings[0] = ", " + strings[0];
  } else if (prev) {
    strings[0] = " " + prefix + strings[0];
  } else {
    strings[0] = prefix + strings[0];
  }
  return [strings, ...values];
}
