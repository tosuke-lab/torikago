const factoriesSym = Symbol()
const uninitialized = Symbol()

export type Factoralize<Container> = { [K in keyof Container]: (c: Container) => Container[K] }

export function build<Container>(factories: Factoralize<Container>): Container {
  let obj: any = {
    [factoriesSym]: factories,
  }
  for (const key of Object.keys(factories)) {
    obj[key] = uninitialized
  }

  const wrapped = new Proxy(obj, {
    get(target, prop, recv) {
      const val = Reflect.get(target, prop)
      if (val !== uninitialized) {
        return val
      } else {
        const a = target[factoriesSym][prop](recv)
        Reflect.set(target, prop, a)
        return a
      }
    }
  })
  return wrapped as Container
}

export function asValue<T>(value: T): () => T {
  return () => value
}


