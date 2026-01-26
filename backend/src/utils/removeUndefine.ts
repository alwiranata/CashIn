export function removeUndefined<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as {
    [K in keyof T]?: Exclude<T[K], undefined>;
  };
}
