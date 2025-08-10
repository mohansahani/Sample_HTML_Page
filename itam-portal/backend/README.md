# Backend for ITAM Portal

- Auth: JWT, roles (Admin/User)
- CRUD Assets, search/filter, pagination
- Bulk import CSV/XLSX
- Stats endpoints for charts

## Env
Copy `.env.example` to `.env` and set values.

## Run
```
npm install
npm run dev
```

Default admin is seeded from `.env` (ADMIN_EMAIL/ADMIN_PASSWORD).