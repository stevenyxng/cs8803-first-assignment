# File Storage

A minimal file-storage webapp. Sign in with Google, upload files with a progress
bar, and list, download, and delete your own files. React + Vite + TypeScript on
the frontend; Firebase Auth and Cloud Storage as the backend. There is no custom
server.

## Requirements

- **Node 20.19+ or 22.12+** (`.nvmrc` pins 22; run `nvm use`)
- **JDK 21+** — only for the Firebase emulators. `brew install openjdk@21`;
  `scripts/with-java21.sh` finds it without changing your default `java`.

## Local development

Everything runs against the Firebase emulators, so you need no Firebase project
and no billing to work on the app.

```bash
nvm use
npm install
npm run emulators   # terminal 1 — auth + storage, UI at localhost:4000
npm run dev         # terminal 2 — app at localhost:5173
```

`src/lib/firebase.ts` points at the emulators automatically whenever
`import.meta.env.DEV` is true, so local work never touches a real bucket. The
`.env.local` committed defaults are placeholder values that only the emulators
need.

## Tests

```bash
npm test
```

Boots the emulators and runs `tests/storage.rules.test.js`, which is the security
proof for this app: it asserts that a user can read, write, and delete inside
their own prefix, and that another signed-in user, a signed-out visitor, an
oversized upload, and any path outside `users/{uid}/` are all rejected.

## Deploying to a real Firebase project

Cloud Storage requires the **Blaze** (pay-as-you-go) plan for any project created
after 30 Oct 2024, so a card is needed even for a class project. Create the
bucket in **us-central1**, **us-east1**, or **us-west1** to stay inside the
Always Free tier, and set a budget alert.

1. Create the project, upgrade to Blaze, enable **Authentication → Google**, and
   create a Storage bucket in one of the regions above.
2. Copy the web config from **Project settings → Your apps** into `.env.local`.
3. Put the real project id in `.firebaserc`.
4. `npm run deploy`

## How it works

```
src/
  lib/firebase.ts     initializes the SDK; wires emulators in dev
  hooks/useAuth.ts    onAuthStateChanged subscription + sign in/out
  hooks/useFiles.ts   owns every Storage call: list, upload, delete
  components/         SignIn, Uploader (drag-drop + progress), FileList
  App.tsx             auth gate — SignIn, or the file UI
storage.rules         the authorization layer
tests/                rules tests
```

Files are stored at `users/{uid}/{uuid}-{originalName}`. The uuid prefix stops a
re-upload of the same filename from silently overwriting the earlier one; the
real filename travels in `customMetadata.originalName` and is what the UI shows.

Uploads use `uploadBytesResumable` and report `bytesTransferred / totalBytes` on
each `state_changed` event, which is what drives the progress bars.

The listing is `listAll()` on the user's prefix plus a `getMetadata()` and
`getDownloadURL()` per object. That is N+1 requests, which is fine for tens of
files. Mirroring metadata into Firestore is the change to make if this ever needs
to scale or sort server-side.

### A note on the config values

The `VITE_*` values are compiled into the client bundle and are publicly visible.
That is expected: the Firebase web config identifies the project, it does not
grant access. All authorization lives in `storage.rules`, which is enforced by
Firebase and cannot be bypassed by editing the frontend.
