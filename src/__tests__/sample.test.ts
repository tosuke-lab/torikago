import { build } from '../index'

class Database {
  constructor() {

  }

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

test('container resolves dependencies', () => {
  const container = build<Container>({
    db: () => new Database(),
    service: c => new Service(c)
  })
  const service = container.service
  expect(service.getItems()).toEqual(['hoge', 'piyo'])
}) 