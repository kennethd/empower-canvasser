# empower-canvasser

Welcome!

This is a simple proof-of-concept app for collecting notes while on the move,
canvassing door-to-door or in your community.

# quick start



# roadmap



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




