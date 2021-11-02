import { expect, test } from "@jest/globals";
import {
  abs,
  compose,
  eq,
  halve,
  isNil,
  map,
  path,
  pathEq,
  prop,
  sumPairs,
} from "./lib";

test("abs converts number to positive", () => {
  expect(abs(-1)).toBe(1);
});

test("compse applies the provided functions from right to left to the supplied value", () => {
  const divideAndCompare = compose(eq(2))(halve);

  expect(divideAndCompare(4)).toBe(true);
  expect(divideAndCompare(5)).toBe(false);
});

test("eq checks type and value equality for primitive types", () => {
  expect(eq(1)(1)).toBe(true);
  expect(eq(1)("1")).toBe(false);
});

test("halve return a number divided by 2", () => {
  expect(halve(4)).toBe(2);
  expect(halve(3)).toBe(1.5);
});

test("isNil returns true when a value is null or undefined", () => {
  expect(isNil(null)).toBe(true);
  expect(isNil(undefined)).toBe(true);
  expect(isNil([])).toBe(false);
});

test("map applies the given function to ech element of the given array", () => {
  expect(map((x) => x * 2)([1, 2, 3])).toMatchObject([2, 4, 6]);
});

test("path returns a null safe value from a next object", () => {
  const o = {
    a: [{ b: 1 }],
    b: { c: null },
  };

  expect(path(["a", 0, "b"])(o)).toBe(1);
  expect(path(["b", "c"])(o)).toBe(null);
  expect(path(["b", "c", "d"])(o)).toBe(undefined);
});

test("pathEq compares a value to the value at a path and returns a boolean", () => {
  const o = {
    a: [{ b: 1 }],
    b: { c: null },
  };

  expect(pathEq(1)(["a", 0, "b"])(o)).toBe(true);
  expect(pathEq("a")(["b", "c", "d"])(o)).toBe(false);
});

test("prop returns the value of the provided object's property", () => {
  const o = {
    a: 1,
    b: "b",
  };

  expect(prop("a")(o)).toBe(1);
});

test("sumPairs sums 2 or more pairs into a single pair of numbers", () => {
  expect(sumPairs([1, 2], [3, 4])).toMatchObject([4, 6]);
  expect(sumPairs([1, 2], [3, 4], [5, 6])).toMatchObject([9, 12]);
});
