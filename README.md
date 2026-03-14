Hello Turbo AI, Thanks for being here.

Here's how to run the project:

**Full stack (recommended)**

1. Open a terminal in the project root (`turboai/`).
2. Run:
   ```bash
   docker compose up
   ```
3. Wait until all services are up. You should see the backend ready.
4. **Backend API:** open [http://localhost:8000](http://localhost:8000) (and `/api/` for API routes).
5. To run the **frontend** (Next.js), open another terminal, go to `frontend/`, then run `npm run dev` (or `pnpm dev` / `yarn dev`). Use the URL it prints (usually [http://localhost:3000](http://localhost:3000)).

**Dependencies only** (run backend and frontend on your machine)

1. In the project root, run:
   ```bash
   docker compose up postgres redis
   ```
2. In one terminal: from `backend/`, run the Django server (e.g. `python manage.py runserver`).
3. In another terminal: from `frontend/`, run `npm run dev` (or your package manager’s dev command).

---

## Why this AI tooling setup

I use **Claude** and **Cursor** in parallel. I’m used to viewing code in an IDE, so Claude’s “chat and watch the result” flow isn’t really for me. With this setup I can:

- **Scope and plan** (usually with Claude) for both tools.
- **Execute in Cursor** and review every change. If something small can be improved on the go, I describe it to the Cursor agent and let it apply the change.
- **Stage as I review** and only approve after I’m happy, then test. For larger or foundational work, I wait until it’s done before testing—it depends on the scope.

**Rule of thumb:** I handle tiny, scoped changes myself; the AI does the heavier lifting, I specially like to focus my attention to:

- Migrations  
- CSS fixes and nits  
- Fixing schemas
- Database changes

All of that is tested; if a small nit fits, it gets included.

**Gemini** and **ChatGPT** join in the early stages—planning and choosing the right path. I usually have strong preferences and enough context for what I’m building, but when in doubt I clear it first. The goal is a plan that’s safe, sound, and the best approach I can take—without scratching into perfectionism hell.