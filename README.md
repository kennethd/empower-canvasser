# empower-canvasser
Simple canvassing app for [Empower Project](https://empowerproject.us/)

This app is comprised of three components:

  * React frontend
  * Node.js API service
  * MySQL database

Deployment will be containerized with Docker

Development will be done locally via a monorepo including both front & back end



# project setup
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
<div class="warn">
The "workspaces" field in package.json is not supported by pnpm. Create a "pnpm-workspace.yaml" file instead.
</div>
Which brings me to the [Lerna Project](https://lerna.js.org/docs/recipes/using-pnpm-with-lerna), billed as *"The Original Tool for JavaScript Monorepos"*

That page links to this intro to [pnpm workspaces](https://pnpm.io/workspaces), which seems to just mean "monorepo"

Which in turn links to [Painless monorepo management with bit](https://bit.dev/blog/painless-monorepo-dependency-management-with-bit-l4f9fzyw/)

`bit` seems to be a project by the same developer that created `pnpm`, and
looks promising, very superficial googling suggests `lerna` is still more
widely adopted.  I'll defer that decision for now until build-&-deploy-time

Back to the [tutorial promising to result in a functioning monorepo project](https://medium.com/@serdar.ulutas/a-simple-monorepo-setup-with-next-js-and-express-js-4bbe0e99b259)
```sh
$ mkdir -p apps/frontend apps/backend/src packages/shared/src
$ pnpm create next-app apps/frontend --app --ts --eslint --tailwind --src-dir
```
Not sure why that guide avoids `Turbopack`, revisit later.
<div class="output">
 WARN  The "workspaces" field in package.json is not supported by pnpm. Create a "pnpm-workspace.yaml" file instead.
✔ Would you like to use React Compiler? … No / Yes
✔ Would you like to use Turbopack? (recommended) … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
Creating a new Next.js app in /tmp/mono-react/apps/frontend.

Using pnpm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next
</div>



