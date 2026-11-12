# Signal Forms Workshop

Hands-on app for the workshop "Angular Signal Forms" at Agentic Web Summit. A call for papers: submit a talk with speakers and tags, list the submitted talks, answer a speaker survey built from question definitions, edit your speaker profile. Angular 22 with Signal Forms, Angular Material and the NgRx Signal Store.

## Setup

```bash
npm install
npm start
```

Open <http://localhost:4200>. There is no backend to start: an HTTP interceptor in `src/app/api/fake-api.ts` answers all `/api` requests in memory, with a delay to show pending states. Reloading the page resets the data.

## Labs

Each exercise folder has a `README.md` with the task and a `solution/`; the files to change sit in the app.

| Lab       | Folder                               | Task                                                                 |
| --------- | ------------------------------------ | -------------------------------------------------------------------- |
| 1         | `exercises/01-talk-form`             | Turn the talk submission page into a Signal Form with a schema       |
| 2         | `exercises/02-validation-and-submit` | Cross-field and async validation, a custom tag control, submit       |
| Take-home | `exercises/03-migrate-profile`       | Migrate the reactive speaker profile form, with a draft from a store |

`exercises/cheatsheet.md` is a quick reference for the Signal Forms APIs in the order of the slides.

The `solution` branch has all labs wired in:

```bash
git diff main solution -- src/app/submit-talk   # the lab 1 and 2 changes
git switch solution                             # the finished app
```

## Scripts

```bash
npm start        # dev server
npm run build    # production build
npm run lint     # ESLint
npm run format   # Prettier
```
