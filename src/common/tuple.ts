import type { Fragment, Template } from "../index.ts";

export const precedence = 0;

export function toTemplate(frag: Fragment<[unknown[]]>): Template {
  const values = frag.input[0];
  if (values.length === 0) throw new Error("tuple requires at least one value");
  return [["(", ...Array(values.length - 1).fill(", "), ")"], ...values];
}