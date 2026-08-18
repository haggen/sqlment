import type { Fragment, Template } from "../index.ts";

export const precedence = 1000;

export function toTemplate(
  frag: Fragment<Template>,
  prev?: Fragment,
): Template {
  const strings = Array.from(frag.input[0]);
  const values = frag.input.slice(1);

  if (prev?.clause === "from") {
    strings[0] = ", " + strings[0];
  } else if (prev) {
    strings[0] = " from " + strings[0];
  } else {
    strings[0] = "from " + strings[0];
  }

  return [strings, ...values];
}
