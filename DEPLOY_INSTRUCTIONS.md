# Deploy Instructions

This is a manual deploy for the `landing` server for the `lpbm` project.

## Server Values To Confirm Once

- Deploy user: `deploy`
- Suggested app directory: `/var/www/lpbm`
- Suggested PM2 process name: `lpbm`
- Git remote should preferably use SSH on the server

If the production server uses different names or paths, update the commands below once and keep the same flow.

## Step-by-step

```bash
ssh landing
su - deploy

APP_DIR=/var/www/lpbm
PM2_NAME=lpbm

cd "$APP_DIR"
git status
git pull origin main

for v in DATABASE_URL SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS EMAIL_FROM EMAIL_TO; do
  test -n "$(printenv "$v")" && echo "$v is set" || (echo "$v is missing" && exit 1)
done

# Optional but recommended for canonical URLs and metadata
for v in SITE_URL NEXT_PUBLIC_SITE_URL; do
  if test -n "$(printenv "$v")"; then
    echo "$v is set"
  fi
done

npm ci
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
npm run build

pm2 restart "$PM2_NAME" --update-env || pm2 start npm --name "$PM2_NAME" -- start
```

## Database and Prisma

- This project uses Prisma actively in production.
- The production database is required through `DATABASE_URL`.
- The current migrations in this repo are non-destructive for live data:
  - no `DROP TABLE`
  - no `DROP COLUMN`
  - no `DELETE FROM`
  - no `TRUNCATE`
  - existing migrations only add tables/columns or adjust indexes, constraints, and defaults when needed
- Safe production Prisma commands for this project:

```bash
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
```

- `npx prisma migrate deploy` only applies pending checked-in migrations. It does not reset the database and must be the only schema-changing command used during production deploy.

- Never run destructive Prisma commands on production:

```bash
npx prisma migrate reset
npx prisma db push --force-reset
npx prisma migrate dev
```

## Post-deploy Smoke Checks

Open the live site and admin after deploy:

```bash
https://lp.bmturkiye.com/hollywood-smile/en
https://lp.bmturkiye.com/dental-implant/en
https://lp.bmturkiye.com/admin90
```

Check these flows manually:

- Public landing pages for both sites load correctly
- Admin dashboard opens
- Forms submit successfully
- WhatsApp popup opens before redirecting to WhatsApp
- Thank-you page loads correctly

Then review the logs:

```bash
pm2 logs lpbm --lines 100
```

## Notes

- Run the deploy as the `deploy` user, not `root`.
- This repo contains Prisma migrations and they must be applied with `npx prisma migrate deploy` during production deploys.
- Deployment for this project must not delete live content or form/spin/admin data. Only apply pending schema updates if they exist.
- Runtime media uploads under `public/uploads` may exist only on the production server. Do not delete them when cleaning the worktree.
- Do not run destructive git cleanup commands on the server such as:

```bash
git clean -fd
git reset --hard
rm -rf public/uploads
```

- If `git pull` fails, inspect server-side local changes first with `git status`.
- If PM2 is already running with a different process name, use that name instead of `lpbm`.
- If canonical URLs or metadata look wrong after deploy, verify `SITE_URL` or `NEXT_PUBLIC_SITE_URL`.
