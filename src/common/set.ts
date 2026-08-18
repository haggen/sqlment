import type { Fragment, Template } from "../index.ts";

export const precedence = 1100;

type Input = [TemplateStringsArray, ...unknown[]] | [Record<string, unknown>];

export function toTemplate(
  frag: Fragment<Input>,
  prev?: Fragment,
): Template {
  let strings: string[];
  let values: unknown[];

  if (Array.isArray(frag.input[0])) {
    strings = Array.from(frag.input[0]);
    values = frag.input.slice(1);
  } else {
    values = Object.values(frag.input[0]);
    strings = Object.keys(frag.input[0]).map((column, i) =>
      i === 0 ? `${column} = ` : `, ${column} = `,
    );
    strings.push("");
  }

  const prefix = "set ";

  if (prev?.clause === "set") {
    strings[0] = ", " + strings[0];
  } else if (prev) {
    strings[0] = " " + prefix + strings[0];
  } else {
    strings[0] = prefix + strings[0];
  }

  return [strings, ...values];
}
