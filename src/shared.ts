import type { Fragment, Template } from "./index.ts";

/**
 * Create a fragment for a clause, with a typed input.
 */
export function createFragment<T>(
  clause: string,
  input: T extends (frag: Fragment<infer I>, prev: Fragment | undefined) => any
    ? I
    : never,
) {
  return { clause, input };
}

/**
 * Type a template literal as a Template.
 */
export function tag(...input: Template) {
  return input;
}
