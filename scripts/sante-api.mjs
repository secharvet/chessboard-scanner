// Sonde de santé du conteneur API : code 0 si /health répond, 1 sinon (Podman redémarre le conteneur après plusieurs échecs).
fetch('http://127.0.0.1:8000/health', { signal: AbortSignal.timeout(4000) }).then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1));
