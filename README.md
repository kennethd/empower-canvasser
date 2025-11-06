# empower-canvasser
Simple canvassing app for [Empower Project](https://empowerproject.us/)

This app is comprised of three components:

  * React frontend
  * Node.js API service
  * MySQL database

Deployment will be containerized with Docker

Development will be done locally via a monorepo including both front & back end


## monorepo setup
Dev env/test deployment server is the same machine running:
```sh
$ node --version ; npm --version
v22.18.0
10.9.3
```
I believe `pnpm` works a litle more intuitively with monorepos:
```sh
$ npm install -g pnpm
$ pnpm init
```
Update `package.json` per commit `0ad80e8`
```sh
$ pnpm install
```
Throws a warning:

> [!WARNING]
> The "workspaces" field in package.json is not supported by pnpm. Create a "pnpm-workspace.yaml" file instead.

Which brings me to the [Lerna Project](https://lerna.js.org/docs/recipes/using-pnpm-with-lerna), billed as *"The Original Tool for JavaScript Monorepos"*

That page links to this intro to [pnpm workspaces](https://pnpm.io/workspaces), which seems to just mean "monorepo"

Which in turn links to [Painless monorepo management with bit](https://bit.dev/blog/painless-monorepo-dependency-management-with-bit-l4f9fzyw/)

`bit` seems to be a project by the same developer that created `pnpm`, and
looks promising, very superficial googling suggests `lerna` is still more
widely adopted.  I'll defer that decision for now until build-&-deploy-time

For now, silence the warning by creating `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  # all packages in direct subdirs of packages/
  - 'packages/*'
  # exclude packages that are inside test directories
  - '!**/test/**'
```

### create directory structure for separate frontend & backend apps
Back to the [tutorial promising to result in a functioning monorepo project](https://medium.com/@serdar.ulutas/a-simple-monorepo-setup-with-next-js-and-express-js-4bbe0e99b259)
```sh
$ mkdir -p apps/frontend apps/backend/src packages/shared/src
$ pnpm create next-app apps/frontend --app --ts --eslint --tailwind --src-dir --react-compiler --no-turbopack --no-import-alias
```
Not sure why that guide avoids `Turbopack`, revisit later.  We do get more warnings:

> [!WARNING]
> Ignored build scripts: sharp, unrs-resolver.
> Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.

Running `pnpm approve-builds` as suggested 

### install tailwindcss @ frontend app
```sh
$ cd apps/frontend
$ pnpm install -D tailwindcss @tailwindcss/postcss postcss
```
Run the app from within the `apps/frontend` directory with: `pnpm run dev` & visit the dev site (for me it is http://192.168.1.9:3000)

Upon launch, another warning:

> [!WARNING]
>  ⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
>  We detected multiple lockfiles and selected the directory of /home/kenneth/git/empower-canvasser/pnpm-lock.yaml as the root directory.
>  To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
>    See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
>  Detected additional lockfiles:
>    * /home/kenneth/git/empower-canvasser/apps/frontend/pnpm-lock.yaml

### tsconfig.json
Continuing to follow https://medium.com/@serdar.ulutas/a-simple-monorepo-setup-with-next-js-and-express-js-4bbe0e99b259

Create a `tsconfig.json` @ root of monorepo:
```json
{
 "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["packages/shared/src/*"]
    }
  },
  "files": [],
  "references": [
    { "path": "packages/shared" },
    { "path": "apps/frontend" },
    { "path": "apps/backend" }
  ]
}
```
And `packages/shared/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["src"]
}
```

### first shared type def
Create your first shared type in `packages/shared/src/types.ts`:
```ts
export interface User {
  name: string;
  email: string;
}
```

### init backend express app
```sh
$ cd apps/backend
$ pnpm init
$ git add package.json && git commit -m "backend app: pnpm init: creates package.json"
$ pnpm add express mongoose cors
$ echo /apps/backend/node_modules >> ../../.gitignore
$ git add  ../../.gitignore  package.json  ../../pnpm-lock.yaml
$ git commit -m "pnpm add express mongoose cors"
$ pnpm add -D typescript ts-node-dev @types/node @types/express @types/cors
$ git commit -am "pnpm add -D typescript ts-node-dev @types/node @types/express @types/cors"
```
Add `apps/backend/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```
And update the `scripts` for backend app `package.json` to add `dev` command:
```json
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

### update frontend app to use shared type def
Edit `apps/frontend/tsconfig.json`:
```diff
index cf9c65d..853069d 100644
--- a/apps/frontend/tsconfig.json
+++ b/apps/frontend/tsconfig.json
@@ -1,4 +1,5 @@
 {
+  "extends": "../../tsconfig.json",
   "compilerOptions": {
     "target": "ES2017",
     "lib": ["dom", "dom.iterable", "esnext"],
@@ -30,5 +31,10 @@
     ".next/dev/types/**/*.ts",
     "**/*.mts"
   ],
-  "exclude": ["node_modules"]
+  "exclude": ["node_modules"],
+  "references": [
+    {
+      "path": "../../packages/shared"
+    }
+  ]
 }
```
And add `apps/frontend/src/page.tsx` as seen in our [guide](https://medium.com/@serdar.ulutas/a-simple-monorepo-setup-with-next-js-and-express-js-4bbe0e99b259)

