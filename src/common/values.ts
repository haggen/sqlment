import type { Fragment, Template } from "../index.ts";

export const precedence = 1100;

export function toTemplate(
  frag: Fragment<
    [TemplateStringsArray, ...unknown[]] | [Record<string, unknown>]
  >,
  prev?: Fragment,
): Template {
  if (Array.isArray(frag.input[0])) {
    const strings = Array.from(frag.input[0]);
    const values = frag.input.slice(1);

    if (prev) {
      strings[0] = " " + strings[0];
    }

    return [strings, ...values];
  }

  const columns = Object.keys(frag.input[0]);
  const prefix = `(${columns.join(", ")}) values `;
  const values = Object.values(frag.input[0]);
  const strings = ["(", ...Array(values.length - 1).fill(", "), ")"];

  if (prev?.clause === "values") {
    strings[0] = ", " + strings[0];
  } else if (prev) {
    strings[0] = " " + prefix + strings[0];
  } else {
    strings[0] = prefix + strings[0];
  }

  return [strings, ...values];
}
