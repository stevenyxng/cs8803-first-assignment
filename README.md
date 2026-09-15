# File Storage

A minimal, mobile-first file-storage webapp. Sign in with Google, upload files with
a progress bar, search, download, and delete your own files. Nobody else can see
them. React + Vite + TypeScript on the frontend; Firebase Authentication, Cloud
Storage, and Hosting as the backend. There is no custom server.

**CS 8803 — Assignment 1 (Development Bootstrapping)**

> ✏️ **TODO:** Your name

| | |
|---|---|
| Live app | https://simple-file-storage-8803.web.app |
| Backend API (Cloud Storage REST) | `https://firebasestorage.googleapis.com/v0/b/simple-file-storage-8803.firebasestorage.app/o` |
| Repository | https://github.com/stevenyxng/cs8803-first-assignment (private; see [Access](#access)) |
| Partner | Zixin Zhou ([@zzhou456456](https://github.com/zzhou456456)) |

---

## What I built

A personal file locker that runs in the browser and is designed phone-first.

- **Google sign-in** through Firebase Authentication. The session survives reloads.
- **Upload** by tapping to pick files or dragging them in. Each file shows a live
  progress bar. Files over 25 MB are rejected in the UI *and* by the server.
- **List** your files with name, size, and upload date, newest first.
- **Search** by filename (added by my partner in PR #1).
- **Download** and **delete**, with a confirmation step before deleting.
- **Per-user privacy enforced on the server.** Every file lives under
  `users/{your-uid}/`, and Firebase Storage security rules reject any read, write,
  or delete outside your own folder, even from a hand-crafted API request. 11
  automated tests prove this.
- **Design:** a true-black, minimalist, mobile-first interface with 44 px touch
  targets and one responsive breakpoint.

> ✏️ **TODO:** Why you chose this and what you hoped to learn, in your own words.

## Assignment coverage

An honest status of each expected item, with the evidence for it.

| # | Requirement | Status | Evidence / what's missing |
|---|---|---|---|
| 1 | Install a development environment | ✅ | VS Code, Node 22 (nvm), Firebase CLI, Firebase Emulator Suite, JDK 21, GitHub CLI. This is a **web** stack rather than native mobile (Xcode/Android Studio). |
| 2 | Build a sample app and run it **on a device**, with user input | ⚠️ | Input: sign-in, file picker, drag-and-drop, search, delete. **TODO:** screenshots/video of the live app on a physical phone ([#5](https://github.com/stevenyxng/cs8803-first-assignment/issues/5)). Note that the app was scaffolded to match Vite's `react-ts` template and then built out, rather than starting from an existing sample app. |
| 3 | Git account, check in code, track tasks/bugs with repo features | ✅ | Git and GitHub, with feature branches and a pull request ([PR #1](https://github.com/stevenyxng/cs8803-first-assignment/pull/1)). Tasks and bugs are tracked, labeled, and assigned in [GitHub Issues](https://github.com/stevenyxng/cs8803-first-assignment/issues). |
| 4 | Partner changes your code and checks in; you fetch, build, deploy. Then the reverse. | ⚠️ | Partner built, changed, tested, and opened PR #1. I reviewed and merged it, then built, tested, and deployed it to production (2026-09-14; the live bundle was verified identical to the build). **TODO:** the reverse direction, my change to my partner's code ([#6](https://github.com/stevenyxng/cs8803-first-assignment/issues/6)). |
| 5 | Deploy a web service that stores/exchanges data, with its code in revision control | ✅ | Firebase Auth + Cloud Storage (REST API) + Hosting. `storage.rules`, `firebase.json`, and `.firebaserc` are in this repo. |
| ★ | Exceptional: authentication protecting user-specific content | ✅ | Google sign-in, per-user storage rules, and 11 rules tests. |
| ★ | Exceptional: UI changes / screen flows | ✅ (partial) | Mobile-first responsive layout that restructures between phone and desktop widths. |

## Screenshots

> ✏️ **TODO:** Add captioned screenshots or a short video of the app running on
> your phone (sign-in, uploading with progress, the file list, search), plus the
> Firebase console showing your files under `users/{uid}/`. This is also the
> evidence for requirement 2. Tracked in
> [#5](https://github.com/stevenyxng/cs8803-first-assignment/issues/5).

---

## References

In rough order of use. Tools and documentation first, then AI assistance.

### Platforms, tools, and documentation

| Resource | What I used it for / what I learned |
|---|---|
| [Vite](https://vite.dev) and its `react-ts` template | Build tool and dev server. The project structure mirrors the template. |
| [React](https://react.dev) | UI library. Learned custom hooks (`useAuth`, `useFiles`) as a way to keep all Firebase calls in one place. |
| [Firebase Authentication](https://firebase.google.com/docs/auth/web/google-signin) | Google sign-in via `signInWithPopup`, and restoring sessions with `onAuthStateChanged`. |
| [Cloud Storage for Firebase](https://firebase.google.com/docs/storage/web/start) | Resumable uploads with progress events, listing, download URLs, and deletes. |
| [Firebase Security Rules](https://firebase.google.com/docs/storage/security) | Learned that with no server, the rules *are* the authorization layer. |
| [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) | Local auth + storage for free, offline development and testing. |
| [`@firebase/rules-unit-testing`](https://firebase.google.com/docs/rules/unit-tests) | Automated tests that try to break the storage rules. |
| [Storage billing changes (Sept 2024)](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024) | New projects need the Blaze plan for Storage, and free quotas only apply in us-central1, us-east1, and us-west1. |
| [Firebase pricing](https://firebase.google.com/pricing) and [Hosting quotas](https://firebase.google.com/docs/hosting/usage-quotas-pricing) | Checked costs. Third-party pricing sites were out of date, so trust the official page. |
| [Cloud Storage pricing](https://cloud.google.com/storage/pricing) | Region pricing comparison (us-east1 vs us-central1). |
| [nvm](https://github.com/nvm-sh/nvm) | Managing Node versions. |
| [Homebrew `openjdk@21`](https://formulae.brew.sh/formula/openjdk@21) | JDK 21, which the emulators require. |
| [GitHub CLI](https://cli.github.com) | Authentication, pushing over HTTPS, and inspecting the PR and collaborators. |
| [Google Cloud API key restrictions](https://cloud.google.com/docs/authentication/api-keys#adding-application-restrictions) | Restricting the web API key to this app's domains. |

> ✏️ **TODO:** Add any tutorials, videos, or guides you watched or read yourself,
> with URLs and a note on each.

### AI assistance — disclosure

A substantial portion of this project was produced with **Claude Code**, an AI
coding agent (model: Claude Opus 5), running in the VS Code extension. Claude
wrote this disclosure section as part of the README; I reviewed and edited it.

**How I directed it.** I described the goal (a basic file-storage webapp on
Firebase) and worked through Claude Code's planning mode before any code was
written. I made the key decisions when it asked:

- **Stack:** React + Vite + TypeScript, chosen over plain HTML/JS and Next.js.
- **Access model:** Google sign-in with per-user files, chosen over anonymous or
  public access.
- **Scope:** upload, list, download, delete, and upload progress. I deliberately
  excluded a Firestore metadata mirror and share links.
- **Design:** true black background, white text, minimalist, mobile-first, and
  no animations for now.
- **Hosting:** Firebase Hosting, after asking what it would cost.
- **Security:** before pushing to GitHub, I had it audit the whole repository and
  git history for leaked secrets.

**What the AI did.**

- Diagnosed and fixed my local environment: wrong Node version, and installed JDK 21
  and the GitHub CLI.
- Wrote the application code, storage rules, rules tests, styling, build and
  deploy configuration, and most of this README.
- Created the Firebase web app and pulled its config using the CLI.
- Deployed the storage rules and hosting.
- Ran builds, tests, and verification checks, including headless-browser
  screenshots and probing the API-key restrictions from outside.
- Explained concepts on request, for example what a React "hook" is, with a
  plain-language project summary.

**What I did myself.**

- Created the Firebase project and upgraded it to Blaze.
- Enabled Google sign-in and created the Storage bucket in the console.
- Set the HTTP-referrer restrictions on the API key.
- Authenticated the Firebase and GitHub CLIs.
- Tested the app in a real browser.
- Invited my partner and reviewed and merged their pull request.

**Where the AI was wrong or needed correcting.** Recorded here because this is
where the learning happened:

- It first said no Node version manager was installed. nvm and Node 22 were
  already there; the problem was which Node was first on `PATH`.
- It "fixed" a horizontal-overflow bug that didn't exist. Its headless browser was
  silently rendering at 500 px and cropping the screenshot. Measuring the page
  showed no overflow.
- Two of its secret-scanning commands gave misleading results, because of a shell
  pipeline swallowing an exit code and macOS `grep -r` skipping dotfiles. It
  caught both and re-verified with git's own tools.
- Its first attempt at making local sign-in foolproof didn't cover the actual
  failure: a popup-based sign-in fails *inside the popup*, so the app never sees
  an error to explain. See the debugging log.

**What I learned from using it.**

> ✏️ **TODO:** Your reflection — what worked well directing an AI agent, what you
> had to verify yourself, and what you'd do differently.

My partner also used Claude Code for their change and disclosed it in PR #1.

---

## Debugging log

Problems hit along the way, what was tried, and how each was resolved.

| Date | Problem | Cause | Resolution |
|---|---|---|---|
| 2026-09-09 | Vite refused to run | Node 21.7.1 is below Vite's `^20.19 \|\| >=22.12` requirement. An old nodejs.org install was shadowing nvm's Node 22. | `nvm alias default 22` |
| 2026-09-09 | Planning the Storage bucket | Firebase projects created after Oct 2024 need the Blaze plan for Storage. | Chose Blaze with a bucket in a free-tier US region, plus a budget alert. |
| 2026-09-09 | Emulators wouldn't start: "no longer supports Java version before 21" | The machine had JDK 17. | Installed JDK 21 without replacing the default; `scripts/with-java21.sh` points only the emulators at it. |
| 2026-09-09 | `node --test tests/` failed with "Cannot find module" | Node treated the directory as a module. | Used a glob: `node --test "tests/*.test.js"`. |
| 2026-09-09 | Headless screenshots stuck on "Loading…" | Headless Chrome's storage support. Firebase Auth waits on IndexedDB. | Confirmed the auth wiring works with a Node script against the emulator, and screenshot the stylesheet with representative markup instead. |
| 2026-09-09 | Screenshot appeared to show content overflowing the screen | Headless Chrome ignored the 390 px window width, rendered at 500 px, and cropped. | Measured `scrollWidth`: no overflow. Lesson: measure before fixing. |
| 2026-09-09 | Conflicting hosting prices online | Third-party sites quoted an old 360 MB/day limit. | Official docs: 10 GB/month free. |
| 2026-09-10 | Deploy failed: "Firebase Storage has not been set up" | The bucket must be created in the console, after Blaze. | Completed the console setup, then redeployed. |
| 2026-09-10 | `git push` failed: "could not read Username" | No stored GitHub credentials. After `gh auth login` it still failed, because gh chose SSH while the remote uses HTTPS. | `gh auth setup-git` |
| 2026-09-10 | `npm test` failed: "port taken" | A leftover emulator process from an earlier run. | Found it with `lsof -iTCP:9099` and stopped it. |
| 2026-09-10 | After restricting the API key, sign-in could break | The allowlist had `web.app` but not `firebaseapp.com`, which is the auth domain the sign-in popup uses. | Added it, then verified 6 referrer cases (3 allowed, 3 blocked, including a look-alike domain). |
| 2026-09-14 | Partner: README said `.env.local` was committed ([#3](https://github.com/stevenyxng/cs8803-first-assignment/issues/3)) | It's gitignored, so a fresh clone doesn't have it. | Fixed in this README (see [Run it locally](#run-it-locally)). |
| 2026-09-14 | Local Google sign-in: `ERR_CONNECTION_REFUSED` at `127.0.0.1:9099` ([#2](https://github.com/stevenyxng/cs8803-first-assignment/issues/2)) | `npm run dev` was running without the auth emulator. | **Workaround:** start `npm run emulators` first. A one-command `dev:local` script and an in-app hint were tried, but the hint can't catch popup failures and the changes were discarded. Still open. |
| 2026-09-14 | Issues created by script, but labels silently missing | The script used `read -ra`, a bash option that zsh doesn't support. | Re-applied the labels with `gh issue edit`, then verified with `gh issue list`. |
| 2026-09-14 | Pre-deploy test run failed: "port taken" | The local emulators were already running in another terminal. | Left them running. `git diff` showed PR #1 didn't change `storage.rules`, `tests/`, or `firebase.json`, so the earlier 11/11 pass still applied. |
| 2026-09-14 | Post-deploy check reported the new feature missing | The check piped a large file through zsh's `echo`, which is unreliable. | Downloaded the live file instead: it's JavaScript, its sha256 matches the local build, and the feature is present. |

---

## Collaboration and git history

**Partner:** Zixin Zhou ([@zzhou456456](https://github.com/zzhou456456)), added as a
collaborator with write access.

**What happened, from the repository:**

1. **2026-09-09/10.** I built the prototype on a feature branch, merged it to
   `main`, and pushed it to GitHub.
2. **2026-09-14.** My partner cloned the repo, ran it against the emulators, and
   added a search-by-name filter on `feature/file-search`. They tested at desktop
   and 375 px widths, ran the build and all 11 rules tests, and opened
   [PR #1](https://github.com/stevenyxng/cs8803-first-assignment/pull/1). Its
   description included test notes, a setup problem they hit, and an AI-assistance
   disclosure.
3. **2026-09-14.** I reviewed and merged PR #1.
4. **2026-09-14.** I pulled the merged `main`, built it, confirmed the storage
   rules and tests were unchanged, and deployed it. The search feature is live. I
   also opened [GitHub Issues](https://github.com/stevenyxng/cs8803-first-assignment/issues)
   for the remaining tasks and known bugs, including the README bug my partner
   reported.

```
*   12ac896  Merge pull request #1 from stevenyxng/feature/file-search
|\
| * 50dce75  Add search-by-name filter to the file list        (Zixin Zhou)
|/
* ba0c713  Point .firebaserc at the live Firebase project
* 15de3eb  Add Firebase file storage prototype
* 33aa273  Initial commit
```

> ✏️ **TODO:**
> - How you planned, communicated, and coordinated (where, how often, what you agreed on).
> - The reverse direction: the change you made to your partner's code, with links
>   ([#6](https://github.com/stevenyxng/cs8803-first-assignment/issues/6)).
> - What you learned about working with others, and what you'd do differently next time.

---

## Run it locally

### Requirements

- **Node 20.19+ or 22.12+.** `.nvmrc` pins 22; run `nvm use`.
- **JDK 21+**, only for the Firebase emulators. `brew install openjdk@21`;
  `scripts/with-java21.sh` finds it without changing your default `java`.

### Steps

```bash
git clone https://github.com/stevenyxng/cs8803-first-assignment.git
cd cs8803-first-assignment
nvm use
npm install
cp .env.example .env.local   # .env.local is gitignored, so create it
```

For local development, `.env.local` only needs placeholder values, because dev
mode talks to the emulators rather than a real project. For example:

```
VITE_FIREBASE_API_KEY=demo-key
VITE_FIREBASE_AUTH_DOMAIN=demo-cs8803.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-cs8803
VITE_FIREBASE_STORAGE_BUCKET=demo-cs8803.firebasestorage.app
VITE_FIREBASE_APP_ID=demo-app-id
```

Then, **in this order**:

```bash
npm run emulators   # terminal 1 — wait for "All emulators ready" (UI at localhost:4000)
npm run dev         # terminal 2 — app at localhost:5173
```

If the emulators aren't running, Google sign-in fails with `ERR_CONNECTION_REFUSED`
in the popup.

**Signing in locally** doesn't need a real Google account. The emulator shows a
fake account picker: choose **Add new account → Auto-generate user information →
Sign in**. Create a second account to confirm that users can't see each other's
files.

`src/lib/firebase.ts` routes Auth and Storage to the emulators whenever
`import.meta.env.DEV` is true, so local work never touches the real project.

To test against the **real** backend with a real Google account, fill
`.env.local` with the real config (see [Deploying](#deploying)), then run
`npm run build && npm run preview` (localhost:4173).

### Tests

```bash
npm test
```

This boots the emulators and runs `tests/storage.rules.test.js`. It asserts that a
user can read, write, and delete inside their own folder, and that another
signed-in user, a signed-out visitor, an oversized upload, and any path outside
`users/{uid}/` are all rejected.

## The backend API

The app has no custom server. The frontend calls Firebase's REST APIs through the
Firebase JS SDK:

- **Cloud Storage:**
  `https://firebasestorage.googleapis.com/v0/b/simple-file-storage-8803.firebasestorage.app/o`.
  This handles upload, list, metadata, download, and delete.
- **Authentication:** `https://identitytoolkit.googleapis.com/v1/…`. Firebase
  Auth exchanges the Google sign-in for a Firebase ID token, which is sent with
  every Storage request.

The rules in `storage.rules` are enforced on every request. For example, an
unauthenticated request to list files is refused:

```bash
curl "https://firebasestorage.googleapis.com/v0/b/simple-file-storage-8803.firebasestorage.app/o?prefix=users/"
# {"error": {"code": 403, "message": "Permission denied."}}
```

## Deploying

Cloud Storage requires the **Blaze** (pay-as-you-go) plan for any project created
after 30 Oct 2024, so a card is needed even for a class project. Create the bucket
in **us-central1**, **us-east1**, or **us-west1** to stay inside the free tier, and
set a budget alert.

1. Create the project, upgrade to Blaze, enable **Authentication → Google**, and
   create a Storage bucket in one of the regions above.
2. Copy the web config from **Project settings → Your apps** into `.env.local`.
3. Put the project id in `.firebaserc`.
4. Run `npm run deploy`.

Deploying requires access to the Firebase project.

## Access

The repository is private. To grade or review it, ask to be added as a
collaborator.

## How it works

```
src/
  lib/firebase.ts     initializes the SDK; wires emulators in dev
  hooks/useAuth.ts    onAuthStateChanged subscription + sign in/out
  hooks/useFiles.ts   owns every Storage call: list, upload, delete
  components/         SignIn, Uploader (drag-drop + progress), FileList (+ search)
  App.tsx             auth gate — SignIn, or the file UI
storage.rules         the authorization layer
tests/                rules tests
```

Files are stored at `users/{uid}/{uuid}-{originalName}`. The uuid prefix stops a
re-upload of the same filename from silently overwriting the earlier one. The
real filename travels in `customMetadata.originalName`, and that is what the UI
shows.

Uploads use `uploadBytesResumable` and report `bytesTransferred / totalBytes` on
each `state_changed` event, which drives the progress bars.

The listing is `listAll()` on the user's folder plus a `getMetadata()` and
`getDownloadURL()` per file. That is N+1 requests, which is fine for tens of
files. If this ever needed to scale or sort on the server, the change would be to
mirror file metadata into Firestore.

### A note on the config values

The `VITE_*` values are compiled into the client bundle and are publicly visible.
That is expected: the Firebase web config identifies the project, it doesn't grant
access. All authorization lives in `storage.rules`, which Firebase enforces and
which can't be bypassed by editing the frontend. As defense in depth, the API key
is also restricted to this app's domains.
