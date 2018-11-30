import { CyclicDependencyError } from './errors'

const factoriesSym = Symbol()
const resolutionStack = Symbol()
const uninitialized = Symbol()

export type Factoralize<Container> = { [K in keyof Container]: (c: Container) => Container[K] }

export function build<Container>(factories: Factoralize<Container>): Container {
  let obj: any = {
    [factoriesSym]: factories,
    [resolutionStack]: []
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
        const a = resolve(target, prop, recv)
        Reflect.set(target, prop, a)
        return a
      }
    },
  })
  return wrapped as Container
}

function resolve<T>(target: any, prop: string | number | symbol, value: T): any {
  const stack = target[resolutionStack] as (string | number | symbol)[]
  const factories = target[factoriesSym]
  if(stack.includes(prop)) {
    throw new CyclicDependencyError(prop, stack)
  }
  stack.push(prop)
  const val = factories[prop](value)
  stack.pop()
  return val
}