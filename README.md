# Torikago

Extremely simple **Inversion of Control(IoC)** Container for JS.

## Usage

```typescript
import { build, asValue, asClass } from 'torikago'

interface Config {
  connectionURL: string
  timeout: number
}

class Database {
  private conn: Connection

  constructor(connectionURL: string, timeout: number) {
    this.conn = connectoToDB(connectionURL, timeout)
  }

  query(sql: string): Promise<any> {
    return this.conn.rawSql(sql)
  }
}

class UserService {
  private db: Database

  constructor({ database }: { database: Database }) {
    this.db = database
  }

  async getUserById(id: string): Promise<User | null> {
    return await db.query(`select * from users where id=${id}`)
  }
}

class UserController {
  private userService: UserService

  constructor({ userService }: { userService: UserService }) {
    this.userService = userService
  }

  async getUser(ctx: Context): Promise<User | null> {
    return await this.userService.getUserById(ctx.params.id)
  }
}

interface Container {
  config: Config
  database: Database
  userService: UserService
  userController: UserController
}

const config: Config = {
  connectionURL: '...',
  timeout: 3000
}

const container = build<Container>({
  config: asValue(config),
  database: ({ config }) => new Database(config.connectionURL, config.timeout),
  userService: asClass(UserService),
  userController: asClass(UserController)
})

router.get('/api/users/:id', container.userController.getUser)
```