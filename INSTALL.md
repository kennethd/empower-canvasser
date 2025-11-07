# turborepo - first experience
I was unable to run `create-turbo` on a branch of an existing repo, even after
removing all files except the `.git` directory, which I want to keep as it
includes history of other branches, so 

> kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ cd /tmp/
> kenneth@fado /tmp $ npx create-turbo@latest  -e kitchen-sink -p pnpm --no-git
> ? Where would you like to create your Turborepo? ./empower-canvasser
> ? Which package manager do you want to use? pnpm
> 
> >>> Creating a new Turborepo with:
> 
> Application packages
>  - apps/admin
>  - apps/api
>  - apps/blog
>  - apps/storefront
> Library packages
>  - packages/config-eslint
>  - packages/config-typescript
>  - packages/jest-presets
>  - packages/logger
>  - packages/ui
> 
> >>> Success! Created your Turborepo at empower-canvasser
> 
> To get started:
> - Change to the directory: cd empower-canvasser
> - Enable Remote Caching (recommended): pnpm dlx turbo login
>    - Learn more: https://turborepo.com/remote-cache
> 
> - Run commands with Turborepo:
>    - pnpm run build: Build all apps and packages
>    - pnpm run dev: Develop all apps and packages
>    - pnpm run lint: Lint all apps and packages
>    - pnpm run test: Test all apps and packages
> - Run a command twice to hit cache

The `--no-git` and `-p pnpm` options seem to have been ignored, so

> kenneth@fado /tmp $ rm -rf ./empower-canvasser/.git
> kenneth@fado /tmp $ cd ~/git/empower-canvasser
> kenneth@fado ~/git/empower-canvasser (turbo-kitchen-sink) $ rsync -rv /tmp/empower-canvasser/ .

