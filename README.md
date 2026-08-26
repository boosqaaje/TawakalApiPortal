# Tawakal Portal

React (Vite) frontend for the Tawakal money-transfer portal. Sign in with a portal user JWT, then use Admin or Partner views based on role.

## Scripts

```bash
npm install
npm run dev
```

The Vite dev server proxies `/portal`, `/partner`, and `/transaction` to the Tawakal API at `http://localhost:5278`.
