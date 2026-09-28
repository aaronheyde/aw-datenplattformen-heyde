# syntax=docker/dockerfile:1
#
# Zwei Stufen: bauen und ausliefern. Im Endimage liegen nur die
# Produktionsabhaengigkeiten, das gebaute dist/ und der Express-Server.
#
# Das Basis-Image ist ein Build-Argument, damit es an einer Stelle
# getauscht werden kann, falls der Tag im Ziel-Register anders heisst:
#   docker build --build-arg NODE_IMAGE=node:24-slim -t heyde-datenplattformen .

ARG NODE_IMAGE=node:24-alpine

# ---------- Stufe 1: bauen ----------
FROM ${NODE_IMAGE} AS build
WORKDIR /app

# Erst nur die Manifeste. Aendert sich nur der Quellcode, bleibt diese
# Schicht im Cache und npm ci laeuft nicht erneut.
COPY package.json package-lock.json ./
RUN npm ci

# Danach der Rest. scripts/build-content.mjs erzeugt aus
# content/vergleich-datenplattformen.md die Datei src/content/content.json,
# vite baut daraus dist/.
COPY . .
RUN npm run build

# Entwicklungsabhaengigkeiten entfernen — was in die Laufzeit kopiert wird,
# soll nur noch Express und React enthalten.
RUN npm prune --omit=dev

# ---------- Stufe 2: Laufzeit ----------
FROM ${NODE_IMAGE} AS runtime

ENV NODE_ENV=production \
    PORT=3001 \
    HOST=0.0.0.0

WORKDIR /app

# Das offizielle Node-Image bringt den unprivilegierten Benutzer "node" mit.
COPY --from=build --chown=node:node /app/node_modules             ./node_modules
COPY --from=build --chown=node:node /app/dist                     ./dist
COPY --from=build --chown=node:node /app/src/content/content.json ./src/content/content.json
COPY --from=build --chown=node:node /app/server.js                ./server.js
COPY --from=build --chown=node:node /app/package.json             ./package.json

USER node
EXPOSE 3001

# Prueft denselben Endpunkt wie npm run smoke. fetch ist ab Node 18 global
# vorhanden, deshalb braucht das Image weder curl noch wget.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Node laeuft als PID 1 und behandelt SIGTERM selbst (siehe server.js),
# deshalb ist kein init-Prozess noetig.
CMD ["node", "server.js"]
