// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function mutableClone<T>(source: T): AnyRecord {
  return structuredClone(source) as AnyRecord;
}
