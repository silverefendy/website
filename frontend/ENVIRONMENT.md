# Frontend Environment

`VITE_API_URL` is required at Vite build time and must point to the backend origin that browsers can reach.

For LAN deployments, set it to the backend machine URL, for example:

```env
VITE_API_URL=http://10.1.0.12:5000
```

After changing any Vite environment variable, rebuild the frontend so the new value is embedded into the production bundle:

```bash
npm run build
```

The production bundle must not contain loopback backend origins unless the app is intentionally being built for a browser running on the backend host itself.
