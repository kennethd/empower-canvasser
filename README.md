# empower-canvasser

Welcome!

This is a simple proof-of-concept app for collecting notes while on the move,
canvassing door-to-door or in your community.

# quick start
You'll need a few dev tools to interact with the project, versions of things
I've used to build it are:

  * `node ---version`: v25.1.0
  * `pnpm --version`: 8.15.6
  * `turbo --version`: 2.6.0
  * `docker --version`: 20.10

Start the database (this will remain in foreground of terminal tab)
```sh
$ docker-compose up
```
Start the apps (again, this will take over terminal used to launch it)
```sh
$ turbo run dev
```
Apps should launch locally at:

  * Canvasser Next.js app: http://localhost:3002/
  * Express API server: http://localhost:5001

## lagniappe

In addition, the `turborepo` kickstarter recipe I used to create a monorepo
with multiple frontend & API server apps created a couple more I have done
nothing with...

  * Admin Vite app (sharing components/types w/Next.js): http://localhost:3001/
  * Blog Remix app: seems to bind only to `localhost` on port 5173

# product roadmap

  * Create a `Tag` system allowing quick identifying (& retrieval) of Party
    affiliation, passion topics, org assocoations, etc

# tech todos

  * add all services to `docker-compose.yaml`
  * examine security options: helmet, ...

# system acrchitecture
The app is comprised of a few components:

  * A [TypeScript](https://www.typescriptlang.org/docs/) [react](https://react.dev/learn) web app front-end
  * A [TypeScript](https://www.typescriptlang.org/docs/) [node.js](https://nodejs.org/docs/latest/api/) API server backend
  * A MySQL database

See the [Project Requirements](PROJECT.md) for more detail.

Additionally, my choices have been influenced by personal preferences for:

  * Support for container-based deployment (pref Docker)
  * Support for testing frameworks & testing-first dev style
  * Support for monorepo-based dev workflows

## tech choices part one: next.js
There was a bit of a long, circuituous process in landing on a set of tech to
use, for a few hours on the first day, I refreshed my memory a bit about react
frameworks & landed on [Next.js](https://nextjs.org/docs) as a promising candidate for first choice.

On the second day I put together a [simple-monorepo branch](https://github.com/kennethd/empower-canvasser/tree/simple-monorepo)
based on [Next.js](https://nextjs.org/docs) for the front-end and
[Express](https://expressjs.com/en/guide/) for the backend, got to the
point of being able to launch those components separately, and continued my
journey exploring tooling options for managing monorepos in the modern
javascript ecosystem.

## tech choices part two: turbo
At the very last stage of part one, a `pnpm run dev` command complained about
the lack of a turbo config, which led me to discover the [turborepo project](https://turborepo.com/docs)
which provides a sort of meta framework, almost platform development-style
scaffolding to create multiple apps in a monorepo environment, already
integrated with [jest](https://jestjs.io/) test runner, already enforcing 
[TypeScript](https://www.typescriptlang.org/docs/), and already including a
functional linter.

See the [installation log](INSTALL.md) if you're curious about that setup process.

## tech choices part three: express + mysql integration
We start with installing `node.js` bindings for `mysql2` (older `mysql` library does not have parameter binding):
```sh
$ pnpm add mysql2 --filter api
```

I am imposing a project requirement for [Docker](https://hub.docker.com/_/mysql/)
to run the [MySQL](https://dev.mysql.com/doc/refman/8.4/en/) database.  If you
have docker set up locally, you should be able to start the server with:
```sh
$ docker-compose up
```
The [MySQL Docker images](https://hub.docker.com/_/mysql/) provides a mechanism
for initializing a db upon startup.  For the moment, I am not going to tackle
persistent storage for this project, but it would probably take the shape of
mounted docker volumes.  For now, each restart will recreate the db from scratch.

To verify your container is working:
```sh
$ docker exec -it empower-canvasser_db_1 mysql -D canvas_app -u canvasapp -p -e "SELECT * FROM canvas_activity;"
Enter password:
+----+--------------+--------------+----------------------------------------------------------------------------------+---------------------+
| id | canvasser_id | canvassee_id | notes                                                                            | created             |
+----+--------------+--------------+----------------------------------------------------------------------------------+---------------------+
|  1 |            1 |            1 | Spoke to Kenneth about the NYC Mayoral election 2025; very excited about Mamdani | 2025-11-07 18:55:03 |
|  2 |            2 |            1 | Spoke to Kenneth about aspirations as an individual contributor                  | 2025-11-07 18:55:15 |
|  3 |            3 |            1 | Spoke to Kenneth about translating between product/tech requirements             | 2025-11-07 18:55:20 |
+----+--------------+--------------+----------------------------------------------------------------------------------+---------------------+
```


