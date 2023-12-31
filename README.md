# Tauri kit

A browser and desktop starter kit for [Tauri](https://tauri.studio) apps with [SvelteKit](https://kit.svelte.dev) and [TypeScript](https://www.typescriptlang.org).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

### Tauri

```bash
npm run tauri dev
```

### SvelteKit

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

### Tauri

```bash
npm run tauri build
```

### SvelteKit

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
