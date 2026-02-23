# Intro Flow Example

This is a small standalone React + TypeScript example showing an intro flow that uses
localStorage to record whether the user has already seen the intro. It uses React Router v6
for navigation.

How it works:

- When a user visits `/`, the app checks localStorage `seenIntro`.
- If `seenIntro` is `true`, the user is redirected to `/main`.
- Otherwise the `IntroPage` is shown. Clicking the finish button sets `seenIntro` = `true`
  and navigates to `/main`.

Run locally (from this folder):

```bash
# install deps
npm install

# start dev server
npm run start
```

This project uses Vite; adjust versions in `package.json` as needed.
