export function asValue<T>(value: T): () => T {
  return () => value
}

type Constructor<T, Opts, Rest extends any[]> = {
  new (opts: Opts, ...args: Rest): T
}

export function asClass<T, Opts, Rest extends any[]>(
  clas: Constructor<T, Opts, Rest>,
  ...args: Rest
): (opts: Opts) => T {
  return (opts: Opts) => new clas(opts, ...args)
}