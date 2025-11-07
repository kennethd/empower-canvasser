# turborepo - first experience
I was unable to run `create-turbo` on a branch of an existing repo, even after
removing all files except the `.git` directory, which I want to keep as it
includes history of other branches, so 

```sh
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ cd /tmp/
kenneth@fado /tmp $ npx create-turbo@latest  -e kitchen-sink -p pnpm --no-git
? Where would you like to create your Turborepo? ./empower-canvasser
? Which package manager do you want to use? pnpm

>>> Creating a new Turborepo with:

Application packages
 - apps/admin
 - apps/api
 - apps/blog
 - apps/canvasser
Library packages
 - packages/config-eslint
 - packages/config-typescript
 - packages/jest-presets
 - packages/logger
 - packages/ui

>>> Success! Created your Turborepo at empower-canvasser

To get started:
- Change to the directory: cd empower-canvasser
- Enable Remote Caching (recommended): pnpm dlx turbo login
   - Learn more: https://turborepo.com/remote-cache

- Run commands with Turborepo:
   - pnpm run build: Build all apps and packages
   - pnpm run dev: Develop all apps and packages
   - pnpm run lint: Lint all apps and packages
   - pnpm run test: Test all apps and packages
- Run a command twice to hit cache
```
The `--no-git` and `-p pnpm` options seem to have been ignored, so
```sh
kenneth@fado /tmp $ rm -rf ./empower-canvasser/.git
kenneth@fado /tmp $ cd ~/git/empower-canvasser
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ rsync -rv --links /tmp/empower-canvasser/ .
```
Rename `storefront` to `canvasser`:
```
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ grep -irI storefront .
./pnpm-lock.yaml:  apps/storefront:
./INSTALL.md:>  - apps/storefront
./apps/storefront/package.json:  "name": "storefront",
./README.md:- `storefront`: a [Next.js](https://nextjs.org/) app
./node_modules/.pnpm/lock.yaml:  apps/storefront:
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ for FILE in ./pnpm-lock.yaml ./INSTALL.md ./apps/storefront/package.json ./README.md ./node_modules/.pnpm/lock.yaml ; do sed -i 's/storefront/canvasser/' $FILE; done
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ git status
On branch turbo-kitchen-sink
Your branch is up to date with 'github/turbo-kitchen-sink'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   INSTALL.md
        modified:   README.md
        modified:   apps/storefront/package.json
        modified:   pnpm-lock.yaml

no changes added to commit (use "git add" and/or "git commit -a")
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ grep -irI storefront .                                                                           kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $
kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ git mv apps/storefront/ apps/canvasser
```
Ultimately I had to blow away & recreate `node_modules` by running `pnpm
update` due to linting errors that weren't happening in the `/tmp` directory,
but finally `pnpm run lint`, `pnpm run test` & `pnpm run dev` all worked,
though each of them seriously messed up my terminal.

~~Perhaps correcting these warnings will improve that:~~
```
 WARNING  no output files found for task @repo/logger#test. Please check your `outputs` key in `turbo.json`
 WARNING  no output files found for task @repo/ui#test. Please check your `outputs` key in `turbo.json`
 WARNING  no output files found for task api#test. Please check your `outputs` key in `turbo.json`
```
It seems like "not using putty" is the solution for the terminal problem.

Using OpenSSH from windows terminal to run `turbo run dev` provides a nice
`ncurses?` interface, allowing switching between outputs from the various
kitchen sink components, and determin which is running on what port:

  * Canvasser Next.js app: http://192.168.1.9:3002/
  * Express API server: http://192.168.1.9:5001
  * Admin Vite app (sharing components/types w/Next.js): http://192.168.1.9:3001/
  * Blog Remix app: seems to bind only to `localhost` on port 5173



