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

The project uses `pnpm` for package management, so start with
```sh
$ pnpm install
```
Or, if it's been awhile
```sh
$ pnpm up --recursive
```

Start the database (this will remain in foreground of terminal tab)
```sh
$ docker-compose up
```
Start the apps (again, this will take over terminal used to launch it)

The API depends on some shell environment vars which will be exported to your
env when you source `dev.env` (this file is `bash` syntax, ymmv with other shells):
```sh
$ source dev.env
$ turbo run dev
```
Apps should launch locally at:

  * Canvasser Next.js app: http://localhost:3002/
  * Express API server: http://localhost:5001/status & http://localhost/message/world

Commands to run tests/linter are:
```sh
$ turbo run lint
$ turbo run test
```

## lagniappe

In addition, the `turborepo` "kitchen sink" recipe I used to create a monorepo
with multiple frontend & API server apps created a couple more I have done
nothing with...

  * Admin Vite app (sharing components/types w/Next.js): http://localhost:3001/
  * Blog Remix app: seems to bind only to `localhost` on port 5173

# product roadmap

  * Activity & Canvasee lists will need filtering & pagination pretty quick
  * Create a `Tag` system allowing quick identifying (& retrieval) of Party
    affiliation, passion topics, org assocoations, etc
  * Managing users in the `canvassers` table would be a good use for the Admin
    Vite app mentioned above
  * Instructions, thoughts, inspirational messages would be a good use for the
    integrated blog as well.

# tech todos

  * Implement "soft deletes" @ model level, never delete rows from db, but
    flip a boolean `hidden`/`deleted` boolean column value
  * make all ports configurable by env
  * add all services to `docker-compose.yaml` for deploy/CI envs [see here](https://github.com/vercel/turborepo/tree/main/examples/with-docker)
  * put app server running on 3002 behind HTTPS proxy with certbot
  * examine security options: helmet, https://expressjs.com/en/advanced/best-practice-security.html

# system architecture
The app is comprised of a few components:

  * A [TypeScript](https://www.typescriptlang.org/docs/) [react](https://react.dev/learn) web app front-end
  * A [TypeScript](https://www.typescriptlang.org/docs/) [node.js](https://nodejs.org/docs/latest/api/) API server backend
  * A MySQL database

See the [Project Requirements](PROJECT.md) for more detail.

Additionally, my choices have been influenced by personal preferences for:

  * Support for container-based deployment (pref Docker)
  * Support for testing frameworks & testing-first dev style
  * Support for monorepo-based dev workflows

## dev choices part one: next.js
There was a bit of a long, circuituous process in landing on a set of tech to
use, for a few hours on the first day, I refreshed my memory a bit about react
frameworks & landed on [Next.js](https://nextjs.org/docs) as a promising candidate for first choice.

On the second day I put together a [simple-monorepo branch](https://github.com/kennethd/empower-canvasser/tree/simple-monorepo)
based on [Next.js](https://nextjs.org/docs) for the front-end and
[Express](https://expressjs.com/en/guide/) for the backend, got to the
point of being able to launch those components separately, and continued my
journey exploring tooling options for managing monorepos in the modern
javascript ecosystem.

## dev choices part two: turbo
At the very last stage of part one, a `pnpm run dev` command complained about
the lack of a turbo config, which led me to discover the [turborepo project](https://turborepo.com/docs)
which provides a sort of meta framework, almost platform development-style
scaffolding to create multiple apps in a monorepo environment, already
integrated with [jest](https://jestjs.io/) test runner, already enforcing 
[TypeScript](https://www.typescriptlang.org/docs/), and already including a
functional linter.

See the [installation log](INSTALL.md) if you're curious about that setup process.

## dev choices part three: mysql container
I am imposing a project requirement for [Docker](https://hub.docker.com/_/mysql/)
to run the [MySQL](https://dev.mysql.com/doc/refman/8.4/en/) database.  If you
have docker set up locally, you should be able to start the server with:
```sh
$ docker-compose up
```
The [MySQL Docker images](https://hub.docker.com/_/mysql/) provide a mechanism
for initializing a db upon startup.  For the moment, I am not going to tackle
persistent storage for this project, but it would probably take the shape of
mounted docker volumes.  For now, each restart will recreate the db from scratch,
a few rows have been added during initialization.

To verify your container is working (password is `GoMamdani2026!`):
```sh
$ docker exec -it empower-canvasser_db_1 mysql -D canvas_app -u canvasapp -p -e "SELECT * FROM canvas_activity;"
Enter password:
+----+--------------+--------------+---------------------------------------------------------------------+---------------------+
| id | canvasser_id | canvassee_id | notes                                                               | created             |
+----+--------------+--------------+---------------------------------------------------------------------+---------------------+
|  1 |            1 |            1 | Spoke to Kenneth about NYC Mayoral election 2025                    | 2025-11-10 00:26:56 |
|  2 |            2 |            1 | Spoke to Kenneth about aspirations as an individual contributor     | 2025-11-10 00:26:56 |
|  3 |            3 |            1 | Spoke to Kenneth about navigating between product/tech requirements | 2025-11-10 00:26:56 |
+----+--------------+--------------+---------------------------------------------------------------------+---------------------+
```
The script used to initialize the db within the container can be found @
[001-create-db.sql](https://github.com/kennethd/empower-canvasser/blob/main/docker/mysql/docker-entrypoint-initdb.d/001-create-db.sql)

## dev choices part four: Sequelizer ORM
I don't always go the route of ORMs, but [Sequelize](https://sequelize.org/)
looks like a good promise-based, expert-created data access layer with
features like logging baked-in.  Also the approach is very familiar/similar to
[SQLAlchemy](https://www.sqlalchemy.org/) which I've had exposure to on a
number of full-stack Python projects.  It seems like [TypeScript
support](https://sequelize.org/docs/v6/other-topics/typescript/) is a
work-in-progress with major version 6, but [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript)
provides type defs for the interim.

The [Sequelize Project](https://github.com/sequelize) provides [sequelize-auto](https://github.com/sequelize/sequelize-auto)
to auto-generate models from an existing db, which we will use to create
models from the database itself:
```sh
$ pnpm add mysql2 --filter api
$ pnpm add sequelize --filter api
$ pnpm add sequelize-typescript --filter api
$ pnpm add sequelize-auto --filter api
```
Next, `Sequelize` models were created from the schema with:
```sh
$ mkdir -p ./apps/api/src/models/
$ ./apps/api/node_modules/.bin/sequelize-auto --dialect mysql -l ts \
    -o ./apps/api/src/models/ -h localhost -u canvasapp -d canvas_app -x
```

## dev choices part five: Express REST API
The API is defined in `./apps/api/src/server.ts`, essentially proxying
requests to the ORM with perhaps some type validation or coercion:
```ts
import { db } from "./models/index.ts";
// [...a bunch of other imports...]
import express, { type Express } from "express";

export const createServer = (): Express => {
  const app = express();
  app
    // [...a bunch of other initialization...]

    .get('/activities', function(req, res) {
      db.models.canvas_activity.findAll().then(activities => res.json(activities));
    })

    .get('/canvassees', function(req, res) {
      db.models.canvassee.findAll().then(canvassees => res.json(canvassees));
    })

    .get('/canvassers', function(req, res) {
      db.models.canvasser.findAll().then(canvassers => res.json(canvassers));
    })

  ;
  return app;
};
```

## dev choices part six: Next.js integration with Express API
Full circle back to dev choice part one, it is time to implement a front-end.

There are a lot of options for combining the strengths of Express & Next.js,
my decision to use both came down to:

  * having ***some*** personal experience with express
  * separation of concerns: *express* being the data access API for potentially
    multiple front-ends
  * opportunity to explore *Next.js* features, particularly learning about
    combining `ServerComponents` and `ClientComponents` to maximize perfomance
    and UX reactiveness

There are a lot of tutorials about leveraging the strengths of express & Next.js
by creating a single hybrid app, coming from experience with Angular.js front-ends
and usually Python, sometimes .NET or PHP, backends, my instinct is to use
something like [axios](https://axios-http.com/docs/intro) from Next.js to
integrate with the data access API, which seems to me a much more maintainable
separation of concerns in the long term.

Of the guides I found [this one](https://dev.to/joodi/fetching-data-with-axios-in-nextjs-15-a-complete-guide-hed)
seems closest to meeting my objectives ([this comment](https://dev.to/joodi/fetching-data-with-axios-in-nextjs-15-a-complete-guide-hed#comment-30k1e)
on that page is interesting -- it points out this approach loses some built-in
caching benefits when used in a *Next.js* `ServerComponent`).

Add `axios` to the `canvasser` app & `ui` package dependencies:
```sh
$ pnpm add axios --filter canvasser
$ pnpm add axios --filter ui
```

### create custom JSX components for Next.js
Custom components are created in the `ui` package; they look something like
this example from `packages/ui/src/activities-log/index.tsx`:
```ts
import axios from 'axios';

const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:5001";

async function fetchActivities(): Promise<Activity[]> {
  const response = await axios.get(API_SERVER_URL + '/activities');
  return response.data;
}

export async function ActivitiesLog() {
  const activities = await fetchActivities();

  return (

    <div id="activity-log-div">
      <ul>
        {activities.map((activity) => (
            <li key={activity.id}> {activity.notes} </li>
        ))}
      </ul>
    </div>

  );
}
```

### testing components with jest
Component tests go into a parallel file to the component itself, such as 
`packages/ui/src/activities-log/index.test.tsx`:
```ts
import { describe, it } from "@jest/globals";
import { createRoot } from "react-dom/client";
import { ActivityLog } from ".";
import * as responseBody from './activities.json';

describe("ActivityLog", () => {
  it("renders without crashing", () => {

    const mockAxios = jest.genMockFromModule('axios');
    mockAxios.get = jest.fn(() => Promise.resolve({ data: responseBody }));

    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<ActivityLog />);
    root.unmount();
  });
});
```
To test, the call to the API server is mocked at the underlying `axios` library
level, the contents of data fixture `./activities.json` has been copied from
postman response to actual endpoint.

This test only verifies `render()` doesn't blow up, a more complete test might
check for expected page elements, or if there are plans for e2e testing with a
prepared dataset, it's usually more appropriate to test UI elements there:

### don't forget! update package.json
Add your new component to the `ui` package's `package.json`:
```diff
diff --git a/packages/ui/package.json b/packages/ui/package.json
index 09ecb8a..2e60bb0 100644
--- a/packages/ui/package.json
+++ b/packages/ui/package.json
@@ -9,6 +9,16 @@
     "dist"
   ],
   "exports": {
+    "./activities-log": {
+      "import": {
+        "types": "./dist/es/activities-log.d.mts",
+        "default": "./dist/es/activities-log.mjs"
+      },
+      "require": {
+        "types": "./dist/cjs/activities-log.d.ts",
+        "default": "./dist/cjs/activities-log.js"
+      }
+    },
     "./counter-button": {
       "import": {
         "types": "./dist/es/counter-button.d.mts",
```

### stylin' jsx
I am admittedly kind of arbitrarily choosing front-end components with my
primary concern being TypeScript compatibility, this one seems popular...
```sh
$ pnpm add @mui/material @emotion/react @emotion/styled --filter ui --filter canvasser
$ pnpm add @mui/x-data-grid --filter ui --filter canvasser
$ pnpm install --workspace-root --save-dev identity-obj-proxy
```


## next steps: adding something like auth
I don't want to implemement an auth system for this, but to test the UI let's
add a link to the list of canvassers to impersonate/"log in" as one of those.


# postman collection
The `postman` directory contains exported environment & collection settings.

The `CANVASSER_API_URL` value from the environment will need a value, other
vars are not currently being used.  You can try `http://canvas.highball.org:5001`
which runs out of my apartment, it may or may not be up & running.

If it is up, the front-end should also be available @ http://canvas.highball.org:3002

(`highball.org` is an old domain I still have for a band I used to be in called
"U.S. Highball" -- not the same as the Scottish guys who use that name :smile:)

