# Torikago

Extremely simple **Inversion of Control(IoC)** Container for JS.

## How to Install
`$ npm install torikago`

## Usage

```typescript
import { build } from 'torikago'

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
  constructor(private db: Database) {}

  async getUserById(id: string): Promise<User | null> {
    return await db.query(`select * from users where id=${id}`)
  }
}

class UserController {
  constructor(private userService: UserService) {}

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
  config: () => config,
  database: ({ config }) => new Database(config.connectionURL, config.timeout),
  userService: ({ database }) => new UserService(database),
  userController: ({ userService }) => new UserController(userService)
})

router.get('/api/users/:id', container.userController.getUser)
```