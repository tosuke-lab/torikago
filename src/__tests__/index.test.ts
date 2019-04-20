import { build } from '../index'
import { CyclicDependencyError } from '../errors'

class Database {
  getItems() {
    return ['hoge', 'piyo']
  }
}

class Service {
  private db: Database
  constructor({ db }: { db: Database }) {
    this.db = db
  }

  getItems() {
    return this.db.getItems()
  }
}

interface Container {
  db: Database
  service: Service
}

test('Container resolves dependencies', () => {
  const container = build<Container>({
    db: () => new Database(),
    service: ({ db }) => new Service({ db })
  })
  const service = container.service
  expect(service.getItems()).toEqual(['hoge', 'piyo'])
}) 

test('Each factory is called at most once', () => {
  let counter = 0
  type C = {
    base: number
    a: number
    b: number
  }
  const container = build<C>({
    base: () => counter++,
    a: ({ base }) => base,
    b: ({ base }) => base
  })
  const _a = container.a, _b = container.b
  expect(counter).toBe(1)
})

test('Container detects a cyclic dependency', () => {
  type C = {
    cyclic1: any
    cyclic2: any
  }
  const container = build<C>({
    cyclic1: ({ cyclic2 }) => cyclic2,
    cyclic2: ({ cyclic1 }) => cyclic1
  })

  expect(() => {
    const _ = container.cyclic1
  }).toThrowError(CyclicDependencyError)
})