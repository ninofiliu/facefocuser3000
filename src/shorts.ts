export const x = <T>(value: T | null | undefined): T => {
  if (value == null) throw new Error("should not be nullish");
  return value;
};
