---
title: Datenplattformen-Vergleich Deployment
datum: 2026-09-23
typ: anleitung
thema: deployment
status: ki-entwurf
tags:
  - wissen
  - typ/anleitung
  - thema/deployment
  - thema/nodejs
  - thema/docker
  - thema/traefik
  - thema/ci-cd
  - thema/datenplattformen
  - status/ki-entwurf
---

# Datenplattformen-Vergleich Deployment

Der abgenommene Datenplattform-Vergleich als React-Webapp (Vite-Build, Entscheidungs-Quiz,
Word-Export, **kein Login, keine Datenhaltung**) auf einem eigenen Debian-Server deployt,
erreichbar unter **https://dp.heyde.famweise.ch** — Platzhalter, vor dem Ausrollen durch die
tatsächliche Domain ersetzen. Repo: `aaronheyde/aw-datenplattformen-heyde` (privat, Vorschlag in
Analogie zur Zeiterfassung).

## Architektur

- **App**: React, gebaut mit Vite, ausgeliefert von einem minimalen Express-Server; läuft auf
  `3001` — **Port 3000 ist durch die Zeiterfassung belegt**, daher 3001
- **Betriebsvarianten**: entweder als systemd-Dienst auf dem Host hinter nginx (**Variante A**,
  wie die Zeiterfassung) oder als Container hinter Traefik (**Variante B**, für den Docker-Manager
  bei Hostinger). In Variante B veröffentlicht die App keinen Port; Traefik erreicht sie über das
  gemeinsame Netz `traefik-proxy`.
- **Reverse Proxy**: in Variante A nginx, in Variante B Traefik. Beide terminieren HTTPS und
  leiten an den Express-Server weiter.
- **TLS**: Let's Encrypt — in Variante A über certbot wie bei der Zeiterfassung, in Variante B
  holt Traefik die Zertifikate selbst.
- **Daten**: keine. Kein Login, keine Benutzerverwaltung, kein DB-Server, keine JSON-Datei. Der
  Server liefert nur `dist/` aus; Quiz-Antworten und Ergebnis leben ausschliesslich im
  React-State des Browsers und sind nach einem Neuladen weg. Es wird bewusst keine Storage-API
  benutzt (kein `localStorage`, kein `sessionStorage`, kein IndexedDB), damit auf dem Gerät des
  Beraters keine Kundendaten liegen bleiben.
- **Inhalt**: `content/vergleich-datenplattformen.md` ist die einzige Inhaltsquelle.
  `scripts/build-content.mjs` erzeugt daraus zur Bauzeit `src/content/content.json`. Zur
  Laufzeit wird die Markdown-Datei nicht gelesen, der Server braucht kein Python.
- **Word-Export**: ohne Bibliothek — `src/docx/zip.js` schreibt das ZIP, `src/docx/docx.js` das
  OOXML. Läuft vollständig im Browser.

`trust proxy` ist im Express bewusst **nicht** gesetzt: der Dienst wertet weder Client-IP noch
Protokoll noch Host aus, also gibt es nichts, was ein falscher Wert verfälschen könnte. Wird
später Rate-Limiting oder IP-Protokollierung ergänzt, gehört `app.set('trust proxy', 1)` dazu —
nginx setzt `X-Forwarded-For` und `X-Forwarded-Proto` bereits.

## Voraussetzungen

- Node.js **24** (aktuelle LTS seit Oktober 2025), npm **12**+
- Debian-Server mit root/sudo-Zugriff, öffentliche IP — hier derselbe Server wie die
  Zeiterfassung
- Domain mit A-Record auf die Server-IP
- Systembenutzer `heyde` besteht bereits aus dem Zeiterfassungs-Deployment und wird
  weiterverwendet

## Schritt für Schritt (Variante A: systemd und nginx)

### 1. Node.js installieren

Ist vom Zeiterfassungs-Deployment her schon vorhanden — kurz kontrollieren:

```bash
node -v     # v24.x erwartet
npm -v      # 12.x oder neuer erwartet
```

Falls nicht:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt-get install -y nodejs git
```

### 2. Eigener Benutzer + SSH-Key fürs (private) Repo

Der Benutzer `heyde` existiert bereits (Home: `/opt/heyde-zeiterfassung`) und wird nicht neu
angelegt. Neu ist das Verzeichnis und ein **zweiter** Deploy Key, weil jeder Deploy Key nur für
genau ein Repo gilt:

```bash
sudo install -d -o heyde -g heyde -m 0755 /opt/heyde-datenplattformen

sudo -u heyde ssh-keygen -t ed25519 \
  -f /opt/heyde-zeiterfassung/.ssh/id_ed25519_datenplattformen -N ""
sudo -u heyde cat /opt/heyde-zeiterfassung/.ssh/id_ed25519_datenplattformen.pub
```

Den ausgegebenen Public Key als **read-only Deploy Key** hinterlegen: GitHub → Repo
`aw-datenplattformen-heyde` → Settings → Deploy keys → Add deploy key (Haken bei "Allow write
access" **nicht** setzen).

Damit git den richtigen der beiden Schlüssel nimmt, in
`/opt/heyde-zeiterfassung/.ssh/config` ein Host-Alias eintragen:

```
Host github.com-datenplattformen
    HostName github.com
    User git
    IdentityFile /opt/heyde-zeiterfassung/.ssh/id_ed25519_datenplattformen
    IdentitiesOnly yes
```

```bash
sudo -u heyde git clone \
  git@github.com-datenplattformen:aaronheyde/aw-datenplattformen-heyde.git \
  /opt/heyde-datenplattformen/app
```

### 3. Abhängigkeiten + Konfiguration

Anders als bei der Zeiterfassung **nicht** `npm install --omit=dev` — der Vite-Build braucht die
Entwicklungsabhängigkeiten (siehe Stolpersteine und Update-Workflow):

```bash
cd /opt/heyde-datenplattformen/app
sudo -u heyde npm ci
sudo -u heyde npm run build
sudo -u heyde cp .env.example .env
```

`.env` ist optional — die systemd-Unit setzt dieselben Werte direkt. Es sind nur drei, und keiner
davon ist ein Geheimnis:

| Feld | Wert | Warum |
| --- | --- | --- |
| `PORT` | `3001` | 3000 ist durch die Zeiterfassung belegt |
| `HOST` | `127.0.0.1` | nur lokal erreichbar, nginx davor |
| `NODE_ENV` | `production` | schaltet Express in den Produktivmodus |

Kurzprobe vor systemd:

```bash
sudo -u heyde env PORT=3001 HOST=127.0.0.1 NODE_ENV=production node server.js &
curl -s http://127.0.0.1:3001/healthz
# {"status":"ok","version":"1.0.0","stand":"Stand: 20. August 2026"}
kill %1
```

Gebündelt geht das auch mit `npm run smoke` (prüft `/healthz`, Startseite, Bundle und
SPA-Fallback gegen einen laufenden Server) und `npm test` (vitest für die Quiz-Engine).

### 4. systemd-Dienst

Die fertige Unit liegt im Repo unter `deploy/heyde-datenplattformen.service`:

```bash
sudo cp deploy/heyde-datenplattformen.service /etc/systemd/system/
```

Kern der Datei:

```ini
[Unit]
Description=Heyde Vergleich von Datenplattformen (Node/Express)
After=network-online.target

[Service]
Type=simple
User=heyde
WorkingDirectory=/opt/heyde-datenplattformen/app
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=HOST=127.0.0.1
# alternativ statt der drei Environment-Zeilen:
# EnvironmentFile=/opt/heyde-datenplattformen/app/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now heyde-datenplattformen
sudo systemctl status heyde-datenplattformen    # sollte "active (running)" zeigen
journalctl -u heyde-datenplattformen -n 50 --no-pager
```

Die mitgelieferte Unit enthält zusätzlich die üblichen Absicherungen
(`ProtectSystem=strict`, `ReadOnlyPaths`, `NoNewPrivileges`) — der Dienst braucht nur
Lesezugriff auf sein eigenes Verzeichnis.

### 5. nginx als Reverse Proxy

Die fertige Konfiguration liegt im Repo unter
`deploy/nginx-heyde-datenplattformen.conf`. Sie enthält den Domain-Platzhalter
`dp.heyde.famweise.ch` an vier Stellen (zweimal `server_name`, zweimal Zertifikatspfad) —
**alle ersetzen**:

```bash
sudo cp deploy/nginx-heyde-datenplattformen.conf \
  /etc/nginx/sites-available/heyde-datenplattformen
sudo sed -i 's/dp\.heyde\.famweise\.ch/DIE-ECHTE-DOMAIN/g' \
  /etc/nginx/sites-available/heyde-datenplattformen
```

Kern der Datei:

```nginx
server {
    listen 80;
    server_name dp.heyde.famweise.ch;   # ANPASSEN

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/heyde-datenplattformen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Die mitgelieferte Datei bringt schon den fertigen HTTPS-Block mit, samt HSTS, Gzip und einer
Content-Security-Policy. Beim **ersten** `nginx -t` zeigen die Zertifikatspfade darin auf
Dateien, die es noch nicht gibt, und der Test schlägt fehl. Zwei Wege: den 443er-Block bis nach
dem certbot-Lauf auskommentieren, oder gleich certbot arbeiten lassen (nächster Schritt) — er
legt die Zeilen selbst korrekt an.

### 6. HTTPS (certbot)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d DIE-ECHTE-DOMAIN
```

Passt die nginx-Config automatisch für HTTPS an, richtet automatische Verlängerung ein.
Kontrolle: `sudo certbot renew --dry-run`.

### 7. Firewall (ufw)

Auf diesem Server ist ufw vom Zeiterfassungs-Deployment her schon aktiv und `Nginx Full` bereits
freigegeben — dann ist hier **nichts zu tun**, weil die neue App keinen weiteren Port nach
aussen braucht. `sudo ufw status verbose` bestätigt das.

Auf einem frischen Server gilt dieselbe Reihenfolge wie damals, **Reihenfolge wichtig** — die
SSH-Regel muss vor `enable` gesetzt sein, sonst Aussperrgefahr:

```bash
sudo apt-get install -y ufw
sudo ufw allow OpenSSH      # zuerst!
sudo ufw show added         # kontrollieren, dass die Regel drin ist
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Bei SSH auf einem Nicht-Standard-Port stattdessen `sudo ufw allow <port>/tcp` verwenden.

Port 3001 wird **nicht** freigegeben — der Dienst hört nur auf `127.0.0.1`. Wenn
`sudo ufw status` ihn auflistet, ist etwas falsch konfiguriert.

## Variante B: Docker mit Traefik (Hostinger)

Im Docker-Manager von Hostinger laeuft Traefik als eigenes Projekt, haelt die Ports 80 und 443
und erreicht alle uebrigen Projekte ueber ein gemeinsames Netz. Die App bringt deshalb **keine
Portfreigabe** mehr mit und keinen eigenen nginx. Der Konflikt mit Port 3000 der Zeiterfassung
ist damit gegenstandslos: 3001 existiert nur noch innerhalb des Containers.

Die Namen folgen Hostingers eigener Anleitung: das externe Netz heisst `traefik-proxy`, der
Zertifikatsanbieter `letsencrypt`, der Entrypoint `websecure`.

### Die drei Dateien

| Datei | Wofuer |
| --- | --- |
| `docker-compose.yml` | Die App mit Traefik-Labels. Das ist die Datei fuer den Docker-Manager. |
| `deploy/traefik/docker-compose.yml` | Ein eigenstaendiges Traefik-Projekt. Nur noetig, wenn noch keines laeuft. |
| `deploy/compose.local.yml` | Lokaler Test ohne Traefik, mit Portfreigabe auf 3001. |
| `deploy/hostinger/docker-compose.yml` | Fuer das Panel: zieht ein fertiges Image, baut nichts. Siehe Variante C. |
| `deploy/hostinger/traefik-compose.yml` | Traefik fuer das Panel, mit festen Werten. Siehe Variante C. |
| `.github/workflows/publish-image.yml` | Baut das Image und legt es in der Registry ab. Siehe Variante C. |

### 1. DNS

A-Record fuer die Domain auf die IP des VPS. Ohne das schlaegt die Zertifikatsausstellung fehl,
weil Let's Encrypt die Domain ueber genau diese Adresse prueft.

### 2. Traefik — nur falls noch keines laeuft

Zuerst nachsehen:

```bash
docker network ls | grep traefik-proxy
```

Ist das Netz da, laeuft bereits ein Traefik-Projekt. Dann diesen Schritt **ueberspringen** —
zwei Traefik-Instanzen streiten sich um 80 und 443, die zweite scheitert mit
`address already in use`.

Fehlt es:

```bash
cd deploy/traefik
cp .env.example .env      # ACME_EMAIL eintragen
docker compose up -d
```

### 3. Die App

```bash
cp .env.example .env      # APP_DOMAIN setzen, der Rest passt meist
docker compose up -d --build
docker compose ps         # Status sollte nach kurzer Zeit "healthy" sein
docker compose logs -f
```

Das Zertifikat holt Traefik selbst, meist innerhalb weniger Sekunden nach dem ersten Aufruf
der Domain.

### 4. Kontrolle

```bash
curl -sI https://DIE-ECHTE-DOMAIN | head -1
docker exec heyde-datenplattformen \
  node -e "fetch('http://127.0.0.1:3001/healthz').then(r=>r.text()).then(console.log)"
```

### Im Hostinger-Panel

Docker-Manager, neues Projekt, `docker-compose.yml` einfuegen oder das Repo verknuepfen. Die
Werte aus `.env.example` im Panel als Umgebungsvariablen hinterlegen, mindestens `APP_DOMAIN`.
In der Firewall muessen 80 und 443 offen sein, 3001 ausdruecklich **nicht**.

### Update

```bash
git pull
docker compose up -d --build
docker image prune -f
```

### Lokal testen, ohne Traefik

```bash
docker compose -f deploy/compose.local.yml up -d --build
curl -s http://127.0.0.1:3001/healthz
docker compose -f deploy/compose.local.yml down
```

## Variante C: über die Weboberfläche, ohne Shell

Im Hostinger-Panel gibt es keine Kommandozeile. Damit fällt `build:` in der Compose-Datei aus:
Der Docker-Manager hat keinen Quellcode, aus dem er bauen könnte, und die öffentliche
Dokumentation sagt auch nirgends zu, dass er das täte. Der Weg, der ohne diese Annahme auskommt:
**Das Image entsteht in GitHub Actions, landet in der GitHub Container Registry, und das Panel
zieht es nur noch.**

Zwei Dateien im Ordner `deploy/hostinger/` sind für diesen Weg gemacht. Sie enthalten
ausschliesslich feste Werte, keine `${VARIABLEN}`, damit sie sich auch dann korrekt auflösen,
wenn im Panel keine Umgebungsvariablen gesetzt sind. Die Stellen zum Anpassen sind mit
`# ANPASSEN` markiert.

Aufwand beim ersten Mal rund 30 Minuten, danach ist jedes Update ein Commit und ein Klick.

### Schritt 1 — GitHub-Repo anlegen

1. Auf github.com oben rechts auf **New repository**.
2. Name `aw-datenplattformen-heyde`, Sichtbarkeit **Private**, **kein** README und **kein**
   .gitignore ankreuzen. Das Repo muss leer bleiben.
3. **Create repository**.

### Schritt 2 — Dateien hochladen

1. Das Tarball lokal entpacken. Es entsteht ein Ordner `heyde-datenplattformen`.
2. Im leeren Repo auf **uploading an existing file**.
3. Den **Inhalt** des Ordners hineinziehen, nicht den Ordner selbst. Zieht man den Ordner,
   liegt alles eine Ebene zu tief und der Build findet die `Dockerfile` nicht.
4. **Commit changes**.

### Schritt 3 — Die Punkt-Dateien nachtragen

Der Browser-Upload lässt alles weg, was mit einem Punkt beginnt, weil Windows es ausblendet.
Vier Dateien fehlen jetzt. Jede einzeln über **Add file → Create new file** anlegen und den
Pfad oben ins Namensfeld tippen. Sobald man `.github/` tippt, legt GitHub den Ordner mit an.

| Pfad | Wichtigkeit |
| --- | --- |
| `.github/workflows/publish-image.yml` | **Kritisch.** Ohne sie läuft nie ein Build und es entsteht nie ein Image. |
| `.dockerignore` | Wichtig. Sonst wandern `node_modules` und `dist` in den Build-Kontext. |
| `.gitignore` | Empfohlen. |
| `.env.example` | Optional, reine Dokumentation. |

Den Inhalt jeweils aus dem entpackten Ordner kopieren.

### Schritt 4 — Image bauen lassen

1. Reiter **Actions**. Der Lauf „Image bauen und veröffentlichen" startet von selbst.
2. Warten, bis er grün ist. Der erste Lauf dauert einige Minuten, spätere sind durch den Cache
   deutlich kürzer.
3. Läuft gar nichts, liegt die Workflow-Datei am falschen Ort. Pfad prüfen: er muss exakt
   `.github/workflows/publish-image.yml` lauten.

### Schritt 5 — Sichtbarkeit des Images

Auf der Repo-Startseite rechts unter **Packages** erscheint das Paket.

- **Öffentlich** ist der einfachere Weg: Package anklicken → **Package settings** →
  **Change visibility** → **Public**. Das Panel braucht dann keine Zugangsdaten. Inhaltlich
  vertretbar, weil derselbe Inhalt gleich als öffentliche Website läuft.
- **Privat** geht auch. Dann in Schritt 8 im Panel unter „Private registry" ein GitHub-Token
  mit dem Recht `read:packages` hinterlegen.

Den vollständigen Image-Namen notieren, er lautet `ghcr.io/<konto>/<repo>`, alles klein.

### Schritt 6 — DNS setzen

Beim Domain-Anbieter einen **A-Record** anlegen, der die gewünschte Subdomain auf die IP des
VPS zeigt. Ohne das stellt Let's Encrypt kein Zertifikat aus.

### Schritt 7 — Traefik prüfen oder anlegen

Im hPanel unter **VPS → Docker Manager** nachsehen, ob bereits ein Traefik-Projekt läuft.

- **Läuft eines**: weiter zu Schritt 8.
- **Läuft keines**: neues Projekt anlegen, den Inhalt von
  `deploy/hostinger/traefik-compose.yml` einfügen, die E-Mail-Adresse anpassen, deployen.
  Diese Datei legt das Netz `traefik-proxy` an, in das sich die App danach einhängt.

### Schritt 8 — Die App deployen

1. Docker Manager, neues Projekt.
2. Inhalt von `deploy/hostinger/docker-compose.yml` einfügen.
3. Zwei Zeilen anpassen, beide mit `# ANPASSEN` markiert:
   - `image:` auf den Namen aus Schritt 5
   - die Domain zwischen den Backticks in `Host(...)`
4. Ist das Paket privat: Zugangsdaten für die Registry hinterlegen.
5. **Deploy**.

### Schritt 9 — Kontrolle

Der Projektstatus sollte nach kurzer Zeit **healthy** zeigen. Die Domain im Browser aufrufen —
beim ersten Aufruf holt Traefik das Zertifikat, das kann ein paar Sekunden dauern.

### Später: Update

Datei im GitHub-Browser ändern, committen, unter **Actions** grün werden lassen, im Panel auf
**Redeploy**. `pull_policy: always` sorgt dafür, dass wirklich das neue Image geholt wird und
nicht das zwischengespeicherte.

### Wenn etwas nicht ankommt

| Symptom | Wahrscheinliche Ursache |
| --- | --- |
| Unter „Actions" läuft nichts | `.github/workflows/publish-image.yml` fehlt oder liegt falsch |
| Build bricht ab mit `Dockerfile not found` | Beim Upload den Ordner statt seines Inhalts gezogen |
| `denied` oder `unauthorized` beim Pull | Paket ist privat und im Panel fehlen die Registry-Zugangsdaten |
| `Bad Gateway` von Traefik | `HOST` steht nicht auf `0.0.0.0` |
| Kein Zertifikat | A-Record fehlt oder zeigt woandershin, oder Port 80 ist zu |
| `network traefik-proxy ... not found` | Das Traefik-Projekt läuft noch nicht (Schritt 7) |
| Zweites Traefik startet nicht | Es läuft bereits eines; Schritt 7 überspringen |
| Alte Fassung bleibt sichtbar | Redeploy vergessen, oder `pull_policy` wurde entfernt |

## Update-Workflow (Variante A)

**Der Workflow der Zeiterfassung funktioniert hier nicht unverändert.**
`npm install --omit=dev` lässt Vite und das React-Plugin weg; `npm run build` bricht dann mit
`sh: 1: vite: not found` ab. Die Zeiterfassung liefert ihren Code direkt aus, diese App muss
vor dem Neustart gebaut werden.

```bash
cd /opt/heyde-datenplattformen/app
sudo -u heyde git pull
sudo -u heyde npm ci                      # vollständig, mit Entwicklungsabhängigkeiten
sudo -u heyde npm run build               # erzeugt content.json und dist/
sudo -u heyde npm prune --omit=dev        # optional: Bauwerkzeuge danach entfernen
sudo systemctl restart heyde-datenplattformen
curl -s http://127.0.0.1:3001/healthz
```

`npm prune --omit=dev` räumt nach dem Bau auf und lässt nur Express stehen. Beim nächsten Update
ist dafür wieder ein volles `npm ci` fällig — das löscht `node_modules` ohnehin und baut es neu
auf, der Schritt kostet also nur Laufzeit.

Wer auf dem Server gar nicht bauen will, committet `dist/` mit ins Repo (dazu `dist` aus
`.gitignore` entfernen); dann genügen `git pull`, `npm install --omit=dev` und
`systemctl restart` genau wie bei der Zeiterfassung — um den Preis, dass jeder Änderung ein
Bauergebnis im Git beiliegt.

Rückfall auf den vorherigen Stand:

```bash
cd /opt/heyde-datenplattformen/app
sudo -u heyde git log --oneline -5
sudo -u heyde git checkout <commit>
sudo -u heyde npm ci && sudo -u heyde npm run build
sudo systemctl restart heyde-datenplattformen
```

## Backups

**Nichts zu sichern.** Es gibt keine Datenbank, keine JSON-Datei, keine Benutzerkonten und
keinen Zustand auf dem Server — anders als bei der Zeiterfassung. Der gesamte
wiederherstellbare Inhalt liegt im Git-Repo; ein Totalverlust des Servers wird durch ein
erneutes Durchlaufen dieser Anleitung behoben.

Sicherungswürdig ist einzig das Repo selbst, insbesondere
`content/vergleich-datenplattformen.md` als geprüfte Inhaltsquelle. Die vom Quiz erzeugten
Word-Dokumente entstehen im Browser und werden nie auf dem Server abgelegt.

## Stolpersteine

Aus dem Zeiterfassungs-Deployment, gilt hier genauso:

- **Repo ist privat**: `git clone` per SSH scheitert ohne Deploy Key — siehe Schritt 2. Hier
  zusätzlich: ein Deploy Key gilt nur für ein Repo, der Schlüssel der Zeiterfassung
  funktioniert für dieses Repo also **nicht**. Darum der zweite Schlüssel plus Host-Alias in
  `.ssh/config`.
- **Dateien per GitHub-Web-Upload hochgeladen** (statt `git push`): Dateien, die mit einem Punkt
  beginnen (`.gitignore`, `.env.example`), werden von vielen Datei-Dialogen beim Drag & Drop
  unterschlagen, weil das Betriebssystem versteckte Dateien ausblendet. Am einfachsten
  nachträglich über GitHubs "Add file → Create new file" ergänzen.
- **`npm warn EBADENGINE`**: nur eine Warnung, kein Fehler — `package.json` verlangt
  `node >=22`, npm selbst kann eine ältere Minor-Version haben und die Installation läuft
  trotzdem sauber durch.
- **Domain-Wechsel später**: unproblematisch — Domain steckt nur in DNS-A-Record und
  `server_name` (hier zusätzlich in den certbot-Zertifikatspfaden). Der Node-Server selbst kennt
  die Domain gar nicht.

Neu und projektspezifisch:

- **Der Build braucht die Dev-Abhängigkeiten.** `npm install --omit=dev` allein genügt nicht;
  Symptom `sh: 1: vite: not found`. Abhilfe: `npm ci`, dann `npm run build`, optional
  `npm prune --omit=dev`. Der wichtigste Unterschied zur Zeiterfassung.
- **`dist/` fehlt.** Der Server antwortet dann mit 503 und dem Hinweis, `npm ci && npm run build`
  auszuführen — `/healthz` bleibt aber `ok`. Das ist gewollt: die Bereitschaftsprobe soll nicht
  verschweigen, dass der Prozess läuft.
- **Port 3000 ist belegt**, die Zeiterfassung hört dort. Diese App nutzt 3001. Wird der Port
  über `.env` oder die Unit geändert, muss `proxy_pass` in der nginx-Config mitwandern — an
  zwei Stellen, im `/healthz`- und im `/`-Block.
- **FS Joey ist keine Google-Schrift.** `index.html` lädt DM Sans und Inter von
  `fonts.googleapis.com`; FS Joey steht bewusst als erste Familie im Stack, greift aber nur,
  wenn sie auf dem Gerät des Betrachters installiert ist. Ohne ausgehenden Internetzugang
  rendert die Seite in der Fallback-Kette (Segoe UI, system-ui, Helvetica, Arial) — lesbar, aber
  nicht im Hauslook. Selbst hosten in drei Schritten: Schriftdateien nach `public/fonts/` legen,
  in `src/styles/app.css` je Schnitt einen `@font-face`-Block mit `src: url('/fonts/…')` und
  `font-display: swap` ergänzen, und den `<link>` samt den beiden `preconnect`-Zeilen aus
  `index.html` entfernen. Danach in der nginx-Config `fonts.googleapis.com` und
  `fonts.gstatic.com` aus der Content-Security-Policy streichen.
- **`src/content/content.json` wird bei jedem Bau überschrieben.** Inhaltsänderungen immer in
  `content/vergleich-datenplattformen.md` machen, nie im JSON.
  `scripts/build-content.mjs` bricht ab, wenn eine erwartete Überschrift fehlt oder mehrdeutig
  wird, wenn es nicht genau neun Prüfaufträge, sechs Steckbriefe und vier Skalenstufen findet,
  oder wenn ein scharfes s auftaucht. Ein fehlgeschlagener Bau ist hier ein Hinweis, kein
  Ärgernis.
- **Stand-Datum.** `/healthz` gibt den Inhaltsstand mit aus. Bei jeder inhaltlichen
  Aktualisierung das Datum in der Markdown-Datei **und** in `scripts/build-content.mjs`
  (Konstante `STAND`) nachziehen — sonst behauptet die Seite einen Stand, den sie nicht hat.
- **Word-Export nur im echten Browser-Tab.** Der Download läuft über einen Blob und
  `a.download`. Eingebettete Viewer, die von der Seite ausgelöste Downloads unterdrücken, lassen
  keine Datei durch; für diesen Fall gibt es im Ergebnis den Knopf «Ergebnis als Text kopieren».
  Dateiname laut Spezifikation:
  `Entscheidungsvorlage-Datenplattform_<Kunde>_<JJJJ-MM-TT>.docx`.
- **Quiz-Änderungen immer mit `npm test` prüfen.** Die Spezifikation ist verbindlich: alle zehn
  Ausschlussregeln und mehrere vollständige Anforderungsprofile sind als Testfälle hinterlegt.
  Eine abweichende Empfehlung ist ein Fehler, keine Geschmacksfrage.

### Stolpersteine speziell bei Docker und Traefik

- **`HOST=127.0.0.1` im Container**: der haeufigste Fehler. Der Container startet und gilt als
  „running", aber Traefik erreicht ihn nicht, weil der Server nur auf das Loopback des
  Containers hoert. Muss `0.0.0.0` sein. Erkennbar daran, dass die Logs sauber aussehen und
  Traefik trotzdem `Bad Gateway` liefert.
- **`network traefik-proxy declared as external, but could not be found`**: das Traefik-Projekt
  laeuft noch nicht oder sein Netz heisst anders. Netz pruefen mit `docker network ls`, Name
  notfalls ueber `TRAEFIK_NETWORK` in der `.env` anpassen.
- **Traefik ignoriert den Container**: der Docker-Provider laeuft mit
  `exposedbydefault=false`. Ohne das Label `traefik.enable=true` passiert schlicht nichts, ohne
  Fehlermeldung.
- **Container in mehreren Netzen**: dann muss `traefik.docker.network` gesetzt sein, sonst waehlt
  Traefik unter Umstaenden die falsche Adresse. Das Label ist bereits drin.
- **Router- und Servicenamen**: sie werden aus `COMPOSE_PROJECT_NAME` gebildet und muessen auf
  dem Host eindeutig sein. Zwei Projekte mit demselben Namen ueberschreiben sich gegenseitig die
  Traefik-Konfiguration.
- **Kein Zertifikat**: fast immer DNS (A-Record fehlt oder zeigt woandershin) oder Port 80 ist
  zu — die TLS-Challenge braucht ihn. Let's Encrypt hat ausserdem Ratenbegrenzungen; beim
  Ausprobieren lohnt der Staging-Server
  (`--certificatesresolvers.letsencrypt.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory`).
- **Zwei Traefik-Instanzen**: bringt das Panel-Template bereits eines mit, darf
  `deploy/traefik/` nicht zusaetzlich gestartet werden.
- **Basis-Image-Tag**: `node:24-alpine` ist als Standardname angenommen, aber nicht gegen das
  Register geprueft. Passt er nicht: `NODE_IMAGE=node:24-slim` in der `.env`.
- **`read_only: true`**: das Dateisystem ist schreibgeschuetzt, `/tmp` liegt als tmpfs daneben.
  Schreibt die App spaeter doch etwas, scheitert das mit `EROFS`.
- **Variante A und B gleichzeitig**: laeuft der systemd-Dienst noch, belegt er 3001 auf dem Host.
  Fuer Variante B stoert das nicht mehr (die App veroeffentlicht keinen Port), aber sauber ist
  `sudo systemctl disable --now heyde-datenplattformen` vor dem Umstieg.

## Verwandte Notizen

- [[Zeiterfassung Deployment]]
- [[Tags]]
