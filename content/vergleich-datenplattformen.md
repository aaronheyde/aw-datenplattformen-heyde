# Vergleich von Datenplattformen

**Untertitel:** Hyperscaler und Datenplattformen im Schweizer Kontext — herstellerneutrale Entscheidungsgrundlage
**Stand:** 20. August 2026 · **Autor:** Aaron Weise, Heyde (Schweiz) AG · **Typ:** Reusable Asset

---

## 0. Wie dieser Vergleich zu lesen ist

### 0.1 Kein Gewinner — und warum das kein Ausweichen ist

Dieser Vergleich vergibt bewusst **keine Gesamtnote und keinen Sieger**. Der Grund ist nicht Diplomatie, sondern Methodik: Die sechs betrachteten Angebote spielen nicht in derselben Liga.

- **AWS, Microsoft Azure und Google Cloud** sind **Cloud-Substrate**. Sie liefern Speicher, Rechenleistung, Netz, Identität — und darauf aufsetzend jeweils einen eigenen Analytics-Baukasten.
- **Databricks, Microsoft Fabric und Snowflake** sind **Datenplattformen**. Sie laufen *auf* diesen Substraten. Snowflake und Databricks werden auf allen drei Hyperscalern betrieben, Fabric ausschliesslich auf Azure.

Eine Zeile «Snowflake gegen AWS» wäre deshalb sachlich falsch — Snowflake läuft auf AWS. Der Vergleich arbeitet daher mit **zwei Ebenen und einer Kombinationssicht**: Welche Plattform lässt sich auf welchem Substrat betreiben, und was folgt daraus für Kosten, KI, Analytik, Portabilität und Betrieb.

### 0.2 Bewertungsskala

Jede Unterdimension wird auf einer vierstufigen, **beschreibenden** Skala eingeordnet. Es gibt keine Punkte und keine Summe.

| Stufe | Bedeutung |
|---|---|
| **Ausgeprägt** | Kernstärke der Plattform; funktional führend oder alleinstellend |
| **Solide** | Marktüblich abgedeckt, keine relevante Lücke |
| **Bedingt** | Nutzbar, aber mit Einschränkung, Zusatzprodukt oder Zusatzaufwand |
| **Lücke** | Nicht vorhanden oder nur über Drittanbieter abbildbar |

### 0.3 Umgang mit Preisen

- Alle Preisangaben sind **Listenpreise in USD, ohne MWST, ohne Rabatt**, Stand 20.08.2026.
- Wo eine Region angegeben ist, gilt der Preis **für diese Region**. Cloud-Preise sind regional gestaffelt; Schweizer Regionen liegen durchgehend über westeuropäischen und deutlich über US-Referenzregionen.
- Reale Kundenpreise entstehen aus Verbrauch × Einheitenpreis, minus verhandelter Rabatte (Capacity-Verträge, Reservierungen, EA/MCA-Konditionen). Listenpreise sind der **Startpunkt einer Verhandlung**, nicht das Ergebnis.
- Wo eine Zahl nicht aus einer offiziellen Quelle verifizierbar war, steht das explizit. Es wurde **keine Zahl geschätzt**.

### 0.4 Was dieser Vergleich nicht ist

- Keine Rechtsberatung. Die regulatorischen Abschnitte fassen öffentlich zugängliche Quellen zusammen und ersetzen keine anwaltliche Prüfung.
- Keine Performance-Benchmark. Es wurde kein TPC-DS oder vergleichbarer Lauf durchgeführt; Performance-Aussagen der Anbieter sind als solche gekennzeichnet.
- Keine Momentaufnahme mit langer Halbwertszeit. Preise, Regionsverfügbarkeit und insbesondere KI-Features ändern sich monatlich. Das Stand-Datum gehört auf jede Folie, die weiterverwendet wird.

---

## 1. Layer-Modell: was auf was läuft

### 1.1 Die zwei Ebenen

```
Konsumptionsschicht     Power BI · Tableau · Qlik · Looker · QuickSight · Genie / Cortex Analyst
------------------------------------------------------------------------------------------------
Datenplattform          Databricks        Microsoft Fabric        Snowflake
                        (AWS/Azure/GCP)   (nur Azure)             (AWS/Azure/GCP)
------------------------------------------------------------------------------------------------
Hyperscaler-Stack       Redshift/Athena/  Synapse/ADF/ADLS/       BigQuery/Dataflow/
                        Glue/EMR/S3       Azure Databricks        Dataproc/GCS/Looker
------------------------------------------------------------------------------------------------
Substrat                AWS               Microsoft Azure         Google Cloud
```

Die Hyperscaler treten also **doppelt** auf: als Infrastruktur unter den Datenplattformen und als eigener Analytics-Anbieter. Das ist keine Inkonsistenz des Vergleichs, sondern die Marktrealität.

### 1.2 Kombinationsmatrix Schweiz — welche Konstellation ist im Land betreibbar?

| Datenplattform | AWS Zürich (eu-central-2) | Azure Switzerland North | Google Cloud Zürich (europe-west6) |
|---|---|---|---|
| **Snowflake** | **Ja** | **Ja** | **Nein** — keine GCP-Region der Schweiz im Snowflake-Regionskatalog |
| **Databricks** | **Nein** — nächste Region Frankfurt | **Ja**, voller Funktionsumfang (Switzerland West nur Basis) | **Nein** — nächste Region Frankfurt |
| **Microsoft Fabric** | Nicht anwendbar | **Ja**, voller Funktionsumfang (auch Switzerland West, ausser «Fabric App» Preview) | Nicht anwendbar |
| **Nativer Hyperscaler-Stack** | Ja: S3, Athena, Redshift (Serverless + Provisioned), Glue, EMR, Lake Formation, MSK, QuickSight, SageMaker, S3 Tables | Ja (Analytics-Dienste im Portal zu bestätigen; Region seit 2019, 3 Availability Zones) | Ja: BigQuery, Dataflow, Dataproc, Pub/Sub, Looker |

**Der wichtigste Satz dieser Matrix:** Ein Databricks-Workspace physisch in der Schweiz ist aktuell **nur über Azure** möglich. Wer AWS oder Google Cloud als Substrat setzt und gleichzeitig Schweizer Datenresidenz fordert, kann Databricks in dieser Konstellation nicht regionskonform betreiben. Dieser Punkt fehlt in den meisten Vergleichsunterlagen.

*Quellen: Snowflake Docs «Supported Cloud Regions»; Databricks Docs «Supported Regions» AWS/GCP/Azure; Microsoft Learn «Fabric region availability»; AWS/Google Regions-Dokumentation. Alle abgerufen 20.08.2026.*

### 1.3 Was auf welcher Ebene entschieden wird

| Entscheidung | Wird bestimmt durch |
|---|---|
| Datenresidenz «at rest» | Substrat + gewählte Region |
| Ort der KI-Inferenz | Plattform-Konfiguration, **nicht** durch die Region allein (siehe Kapitel 4.4) |
| Abrechnungslogik und Kostensteuerung | Datenplattform (Credits / DBU / CU) bzw. Hyperscaler-SKU |
| Governance und Zugriffsmodell | Datenplattform (Unity Catalog / Horizon / OneLake-Security) + Identity Provider |
| Identitäts-Lock-in | Substrat (Entra ID, IAM, Cloud Identity) |
| Exit-Fähigkeit | Tabellenformat (Delta / Iceberg / proprietär) + Katalogstandard |

---

## 2. Die fünf Prüfkriterien

| Kriterium | Unterdimensionen |
|---|---|
| **1. Cost / TCO** | Abrechnungseinheit und Granularität · Einstiegskosten und Skalierungsverhalten · Preistransparenz · Rabattmechanik · typische Kostenfallen · Schweizer Regionsaufschlag |
| **2. AI Readiness** | GenAI in SQL und Notebooks · Agenten und semantische Schicht · Modellauswahl und Hosting · MLOps und Fine-Tuning · KI-Governance · **Ort der Inferenz / Schweizer Residenz** |
| **3. Analyseservices** | Ingestion und ELT · Speicher und Tabellenformat · SQL-Engine · Spark und Data Science · Streaming und Real-Time · BI-Schicht · Semantic Layer · Orchestrierung und CI/CD · Katalog und Data Sharing |
| **4. Multi-Plattform** | Cloud-Portabilität · offene Tabellenformate · Katalog-Interoperabilität · Exit-Pfad und Egress · Hybrid und On-Premises · Identitätsbindung |
| **5. Enterprise-Readiness** | Zertifizierungen · Schweizer Datenresidenz · Souveränitätsangebote · Netzwerk, Schlüsselhoheit, Verschlüsselung · Governance und Lineage · SLA und Support · Release- und Change-Management · Skills-Verfügbarkeit Schweiz |

Die Kriterien sind **nicht gewichtet**. Die Gewichtung ist die Aufgabe des jeweiligen Kunden — genau deshalb ist dieser Vergleich ein Asset und keine Empfehlung.

---

## 3. Kriterium 1 — Cost / TCO

### 3.1 Abrechnungsmodelle im direkten Vergleich

| Plattform | Abrechnungseinheit | Granularität | Mindestabrechnung | Rabattmechanik | Was **nicht** enthalten ist |
|---|---|---|---|---|---|
| **Snowflake** | Credit (Compute) + USD/TB Storage | pro Sekunde | 60 Sekunden pro Warehouse-Start | Capacity-Verträge, gestaffelt nach Jahresvolumen (bis ca. 40 %) | Cross-Region-/Cross-Cloud-Transfer; BI-Werkzeug |
| **Databricks** | DBU je Workload-SKU | pro Sekunde | keine (Cluster-Startzeit zählt) | Committed Use (DBCU), 1/3 Jahre, «bis 37 %» | **Cloud-VM- und Storage-Kosten bei Classic Compute** — separate Rechnung |
| **Microsoft Fabric** | Capacity Unit (CU) je F-SKU | CU-Sekunden, geglättet über 24 h | F-SKU läuft, bis er pausiert wird | Reservierung 1 Jahr, ca. 41 % | Power-BI-Nutzerlizenzen unter F64; OneLake-Storage bei pausierter Kapazität |
| **AWS** | pro Service-SKU (TB gescannt, RPU-h, DPU-h, GB-Monat, Anfragen …) | sekunden- bis anfragegenau | je SKU unterschiedlich | Savings Plans (Compute bis 66 %, EC2-Instance bis 72 %), Reserved Instances | Zusammenbau; Cross-AZ-Traffic; Support-Prozentsatz |
| **Microsoft Azure** | pro Service-SKU (DWU-h, DBU, GB-Monat, DIU-h …) | stunden- bis sekundengenau | je SKU unterschiedlich | Reservierungen, Savings Plan, EA/MCA-Verhandlung | Log-Analytics-Ingestion; Databricks-VM-Anteil |
| **Google Cloud** | TiB gescannt (On-Demand) oder Slot-Stunde (Editions) | sekundengenau, 1 Minute Minimum | 10 MB pro Query / 50 Slots pro Commitment | Slot-Commitments 1/3 Jahre, Resource-CUDs | Looker-Lizenz (kein Listenpreis) |

**Strukturelle Beobachtung:** Snowflake, Databricks und Fabric verkaufen je *eine* abstrakte Recheneinheit — einfach zu erklären, schwer zu attribuieren. AWS, Azure und Google verkaufen Dutzende SKU — schwer zu erklären, präzise zu attribuieren. Fabric ist der einzige Anbieter mit einem **gemeinsamen Kapazitätstopf über alle Workloads inklusive BI**; das vereinfacht die Beschaffung und erschwert die verursachergerechte Zuordnung.

### 3.2 Verifizierte Listenpreise (Auszug)

#### Snowflake — Credits und Storage

| Position | Preis | Region / Basis |
|---|---|---|
| Credit, Standard Edition | 2.00 USD | US-Referenzregion |
| Credit, Enterprise Edition | 3.00 USD | US-Referenzregion |
| Credit, Business Critical Edition | 4.00 USD | US-Referenzregion |
| Virtual Private Snowflake | kein Listenpreis publiziert | — |
| Warehouse X-Small … 6X-Large | 1 … 512 Credits/Stunde | Verdoppelung je Grössenschritt |
| Gen2-Warehouse X-Small | 1.25 (Azure) / 1.35 (AWS, GCP) Credits/Stunde | — |
| Storage On-Demand | 20.00 – 40.50 USD/TB/Monat | region- und cloudabhängig |
| Hybrid-Tables-Storage | 0.34 – 0.60 USD/GB/Monat | — |
| AI Credit, Global Routing | 2.00 USD | — |
| AI Credit, Regional Routing | 2.20 USD | — |
| Cloud-Services-Schicht | kostenlos bis 10 % des täglichen Compute-Verbrauchs | «10-Prozent-Regel» |

**Nicht öffentlich verifizierbar:** Credit- und Storage-Preise spezifisch für AWS eu-central-2, Azure Switzerland North und Google europe-west6 — der offizielle Preisrechner rendert diese erst nach Regionsauswahl. Ebenso die Modell-Tabelle für Cortex-AI-Tokenpreise. Für eine belastbare Offerte ist der Rechner live mit Regionsauswahl zu bedienen.

#### Databricks — DBU-Preise, Azure Switzerland North, Premium-Tier

| Workload-SKU | USD/DBU |
|---|---|
| Jobs Compute (mit und ohne Photon) | 0.30 |
| Jobs Light Compute | 0.22 |
| All-Purpose Compute (mit und ohne Photon) | 0.55 |
| SQL Classic | 0.22 |
| SQL Compute Pro | 0.85 |
| Serverless SQL | 1.09 |
| Interactive Serverless Compute (Notebooks) | 1.05 |
| Automated Serverless Compute (Jobs) | 0.56 |
| Lakeflow Declarative Pipelines Core / Pro / Advanced | 0.30 / 0.38 / 0.54 |
| Model Training | 0.78 |
| Model Serving (Serverless Realtime Inferencing) | 0.092 |
| Enhanced Security and Compliance Add-on | 0.10 (Mission Critical: 0.15) |
| Clean Rooms Collaborator | 50.00 USD/Tag |
| Disaster-Recovery-Replikation | 0.0312 USD/GB |

*Quelle: Azure Retail Prices API, `serviceName eq 'Azure Databricks'`, `armRegionName eq 'switzerlandnorth'`, abgerufen 20.08.2026.*

Zwei Punkte, die im Vergleich häufig untergehen:

1. **Die DBU-Rechnung ist nicht die Gesamtrechnung.** Bei klassischem Compute kommen die Azure-VM- und Storage-Kosten separat dazu. Als Praxis-Faustregel (keine offizielle Zahl) liegt der Databricks-Anteil bei grob 30–50 % der Gesamtkosten. Bei Serverless-SKU ist die Infrastruktur im DBU-Preis enthalten — dafür liegt der DBU-Satz 1.5- bis 3-fach höher (Serverless SQL 1.09 gegen SQL Classic 0.22).
2. **Der Standard-Tier von Azure Databricks wird per 1. Oktober 2026 abgekündigt.** Neuprojekte kalkulieren faktisch mit Premium-Preisen.

Regionsvergleich: Switzerland West liegt bei SQL Compute Pro höher als Zürich (0.96 gegen 0.85) und führt bei Serverless SQL keinen aktiven Preis — die Region ist funktional stark eingeschränkt. West Europe ist bei den Serverless-Metern günstiger (Serverless SQL 0.91), bei klassischem Compute identisch.

**Nicht öffentlich verifizierbar:** DBU-Listenpreise für AWS und Google Cloud — Databricks publiziert diese nur über einen clientseitigen Rechner. Ebenso Vector-Search-Preise auf Azure.

#### Microsoft Fabric — Kapazität und Speicher

CU-Preis Switzerland North: **0.23 USD/CU/Stunde** (West Europe 0.22, US East 0.18). Über alle 56 Azure-Regionen bewegt sich der CU-Preis zwischen 0.18 und 0.31 USD — Fabric-Preise sind regional gestaffelt, was in generischen Vergleichen meist ignoriert wird.

| F-SKU | CU | Switzerland North, USD/Monat (730 h) | West Europe, USD/Monat |
|---|---|---|---|
| F2 | 2 | 335.80 | 321.20 |
| F4 | 4 | 671.60 | 642.40 |
| F8 | 8 | 1'343.20 | 1'284.80 |
| F16 | 16 | 2'686.40 | 2'569.60 |
| F32 | 32 | 5'372.80 | 5'139.20 |
| F64 | 64 | 10'745.60 | 10'278.40 |
| F128 | 128 | 21'491.20 | 20'556.80 |
| F256 | 256 | 42'982.40 | 41'113.60 |
| F512 | 512 | 85'964.80 | 82'227.20 |
| F1024 | 1'024 | 171'929.60 | 164'454.40 |
| F2048 | 2'048 | 343'859.20 | 328'908.80 |

*Monatsbeträge sind eigene Berechnung aus dem verifizierten CU-Stundenpreis × 730 Stunden, nicht eine Microsoft-Originaltabelle.*

**Reservierung:** Switzerland North 1'198.00 USD/CU/Jahr, entspricht rund **41 % Rabatt** gegenüber Pay-as-you-go. Bemerkenswert: Der 3-Jahres-Preis ist exakt das Dreifache des 1-Jahres-Preises — **kein zusätzlicher Rabatt für die längere Bindung**. Das ist untypisch für Azure-Reservierungen und ein konkreter Verhandlungspunkt.

| Speicher-Meter, Switzerland North | Preis |
|---|---|
| OneLake Storage Hot | 0.0264 USD/GB/Monat |
| OneLake Storage Cool | 0.01441 USD/GB/Monat |
| OneLake Storage Cold | 0.00571 USD/GB/Monat |
| OneLake BCDR Storage Hot (georedundant) | 0.0616 USD/GB/Monat |
| OneLake Cache (Eventhouse/KQL) | 0.298 USD/GB/Monat |
| SQL-Storage (Fabric SQL-Datenbank / Warehouse) | 0.25385 USD/GB/Monat |

**Power BI on top:** Power BI Pro 9.99 USD/Nutzer/Monat (offiziell bestätigt). Premium Per User nicht programmatisch aus der Preisseite auslesbar; ein seit Jahren stabiler Sekundärquellenwert von 24.99 USD ist gängig, muss aber vor einer Offerte gegen die aktuelle CSP-Preisliste geprüft werden. **Ab F64** dürfen Nutzer mit Free-Lizenz Inhalte konsumieren — unter F64 braucht jeder Viewer eine Pro- oder PPU-Lizenz. Das macht den Sprung F32 → F64 zur wichtigsten Kostenschwelle des Modells. Copilot und AI-Funktionen benötigen seit 31. März 2025 nur noch F2 oder höher (Trial-Kapazitäten ausgeschlossen).

#### Google Cloud — BigQuery und Umfeld

| Position | Preis | Region |
|---|---|---|
| BigQuery On-Demand | 6.25 USD/TiB gescannt, erstes TiB/Monat frei | weltweit einheitlich, auch europe-west6 |
| Editions Slot-Stunde Standard / Enterprise / Enterprise Plus | 0.04 / 0.06 / 0.10 USD | identisch für europe-west3/4/6 — **kein Zürich-Aufschlag** |
| dieselben mit 1-Jahres-Commitment | 0.036 / 0.054 / 0.09 USD | — |
| dieselben mit 3-Jahres-Commitment | 0.032 / 0.048 / 0.08 USD | — |
| Storage aktiv logisch | ca. 23.55 USD/TiB/Monat | — |
| Storage long-term logisch (ab 90 Tagen unverändert) | ca. 16.40 USD/TiB/Monat | — |
| Storage aktiv physisch | ca. 41.03 USD/TiB/Monat | komprimiert, inkl. Time Travel |
| Cloud Storage Standard | 0.020 USD/GiB/Monat | Single-Region europe-west6 |
| Storage Write API | 0.025 USD/GiB, erste 2 TiB/Monat frei | — |
| Egress Europa → Internet | 0.12 USD/GiB (1–1'024 GiB), 0.085 ab 10 TiB | Premium Tier |
| Intra-EU-Transfer Region zu Region | 0.02 USD/GiB | — |
| BigQuery SLA | 99.9 % (Standard) / 99.99 % (Enterprise, Enterprise Plus) | — |
| Support Standard / Enhanced / Premium | ab 29 / 100 / 15'000 USD/Monat oder Prozentsatz vom Verbrauch | jeweils der höhere Wert |

Mindest-Commitment 50 Slots in 50er-Schritten, organisationsweit geteilt aber **regional gebunden**. BigQuery kennt keine automatischen Sustained-Use-Discounts.

**Nicht öffentlich verifizierbar:** Looker-Plattformpreise (ausschliesslich «Contact Sales»), Looker-Studio-Pro-Preis pro Nutzer, Agent-Engine-SKU-Preise.

#### AWS — Analytics-Bausteine

| Position | Preis | Region / Basis |
|---|---|---|
| Athena | 5.00 USD/TB gescannt | generisch ausgewiesen |
| Athena Capacity Reservation | 0.30 USD/DPU-Stunde | — |
| Redshift Serverless | 0.375 USD/RPU-Stunde, Minimum 128 RPU-Sekunden pro Query | Basiskapazität ab 4 RPU, also ab 1.50 USD/Stunde |
| Redshift RA3 (ra3.xlplus) | ab 1.086 USD/Stunde | us-east-1, Sekundärquelle |
| Redshift Managed Storage | 0.024 USD/GB/Monat | us-east-1 |
| Glue ETL und Crawler | 0.44 USD/DPU-Stunde, sekundengenau | generisch |
| Glue Data Catalog | frei bis 1 Mio. Objekte und 1 Mio. Requests, danach 1.00 USD/100'000 Objekte/Monat | generisch |
| S3 Standard | 0.023 USD/GB/Monat (erste 50 TB) | us-east-1; AWS nennt 10–30 % Aufschlag ausserhalb |
| S3 Tables (Iceberg) | ab 0.0265 USD/GB/Monat plus Compaction/Monitoring | US West (Oregon) als Beispiel |
| QuickSight Author / Reader | 24 / 3 USD/Nutzer/Monat | — |
| QuickSight Author Pro / Reader Pro | 40 / 20 USD/Nutzer/Monat | inkl. generative BI |
| QuickSight Infrastruktur-Gebühr | 250 USD/Monat/Account bei aktiven Pro-Nutzern oder Q&A | — |
| Clean Rooms | 2.00 USD/CRPU-Stunde | **in eu-central-2 nicht verfügbar** |
| KMS | 1 USD/Schlüssel/Monat, 0.03 USD/10'000 Requests | global |
| CloudHSM | 1.60 USD/HSM-Stunde | global |
| Bedrock Guardrails | 0.15 USD/1'000 Text-Units | — |
| Bedrock Knowledge Bases | 5.00 USD/GB/Monat Index plus 1.00 USD/1'000 Retrieval-Calls | — |
| Redshift SLA | 99.99 % Multi-AZ / 99.9 % Serverless und Single-AZ-Multi-Node / 99.5 % Single-Node | — |

**Support-Umstellung 2026:** AWS stellt Developer, Business und Enterprise On-Ramp per **1. Januar 2027** ein. Nachfolger sind Business Support+ (ab 29 USD/Monat, gestaffelt 9/7/5/3 % der Rechnung) und Enterprise Support (Minimum von 15'000 auf **5'000 USD/Monat gesenkt**, gestaffelt 10/7/5/3 %). Für kleinere Kunden senkt das die Eintrittsschwelle in den Enterprise-Support deutlich.

**Schweizer Regionsaufschlag:** Sekundäranalysen nennen für eu-central-2 rund **9–13 % über eu-central-1 (Frankfurt)** im Servicedurchschnitt. Das ist keine offizielle AWS-Zahl.

**Nicht öffentlich verifizierbar:** S3- und Data-Transfer-Tarife spezifisch für eu-central-2, Redshift-RA3-Stundenpreise für Zürich, vollständige EMR-Serverless-Tabelle, Tokenpreise für Claude Opus 5 / Sonnet 5 und Amazon Nova, Bedrock-Provisioned-Throughput-Preise, Redshift-Reserved-Instance-Rabattsätze.

#### Microsoft Azure — Analytics-Bausteine

| Position | Preis | Region |
|---|---|---|
| Synapse dedizierter SQL-Pool DW100c | 1.661 USD/Stunde | Switzerland North |
| … DW1000c | 16.61 USD/Stunde | Switzerland North |
| … DW10000c | 166.10 USD/Stunde | Switzerland North |
| … DW30000c | 498.30 USD/Stunde | Switzerland North |
| Synapse Serverless SQL | 5.50 USD/TB gescannt | Switzerland North |
| Azure Databricks | siehe DBU-Tabelle oben | Switzerland North |

*Quelle: Azure Retail Prices API, abgerufen 20.08.2026. Die Werte liegen rund 10 % über den US-East-Referenzwerten aus Sekundärquellen — ein plausibler Schweizer Regionsaufschlag.*

**Nicht öffentlich verifizierbar:** ADLS-Gen2-Preise pro Tier für Switzerland North, Azure-Data-Factory-Preise, Event-Hubs- und Stream-Analytics-Preise, Purview-Beträge pro Capacity Unit und DGPU, Log-Analytics-Ingestion pro GB, Azure-OpenAI-Tokenpreise, PTU-Preis und Batch-Rabatt, AI-Search-Tierpreise. Grund: Die offiziellen Preisseiten rendern Beträge ausschliesslich clientseitig. **Konsequenz für die Praxis: Azure ist unter den sechs Anbietern derjenige mit der geringsten öffentlichen Preistransparenz für Analytics-Dienste** — Kalkulationen sind zwingend live im Preisrechner oder über das Account-Team zu erstellen.

### 3.3 Typische Kostenfallen je Plattform

| Plattform | Die drei häufigsten Überraschungen |
|---|---|
| **Snowflake** | Warehouses ohne wirksames Auto-Suspend · Serverless-Multiplikatoren (Search Optimization und Automatic Clustering je 2× Compute) · Überschreiten der 10-Prozent-Regel bei metadatenintensiven Workloads mit vielen Kleinabfragen |
| **Databricks** | Interaktive All-Purpose-Cluster, die über Nacht laufen (0.55 gegen 0.30 USD/DBU) · produktive Jobs versehentlich auf All-Purpose statt Jobs Compute · Serverless bei Dauerlast, wo Classic plus Reservierung günstiger wäre |
| **Fabric** | Über 100 einzelne OneLake-Operationsmeter, praktisch nur über die Capacity Metrics App nachvollziehbar · Storage läuft bei pausierter Kapazität weiter · CU-Sekunden-Modelle von Dataflows Gen2 (mehrere Engines, gestaffelte Sekundenpreise) |
| **AWS** | Athena-Vollscans ohne Partitionierung · Cross-AZ- und Cross-Region-Transfer innerhalb derselben Pipeline · PrivateLink-Endpoint-Stunden in Multi-Account-Landing-Zones |
| **Azure** | Log-Analytics-Ingestion durch unbemerkt aktivierte Diagnose-Logs auf Analytics-Tier · Databricks-Doppelrechnung (DBU plus VM) · Provisioned Throughput Units, die auch ungenutzt weiterlaufen |
| **Google Cloud** | `SELECT *` auf grossen unpartitionierten Tabellen (6.25 USD/TiB skaliert mit Scan-, nicht Ergebnisgrösse) · Storage-Duplikation durch falsch gewähltes logisches gegen physisches Billing plus Time Travel · Cross-Cloud-Egress bei BigQuery Omni |

### 3.4 Einordnung Cost / TCO

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| Verständlichkeit des Modells | Ausgeprägt | Solide | Ausgeprägt | Bedingt | Bedingt | Solide |
| Öffentliche Preistransparenz | Bedingt (CH-Preise nicht publiziert) | Bedingt (AWS/GCP nur im Rechner) | Solide (über Retail-API belegbar) | Solide | **Lücke** (Beträge nur clientseitig) | Ausgeprägt |
| Kostenattribution je Verursacher | Solide (Warehouse-Tags) | Solide (Cluster-Tags, Budget Policies) | Bedingt (gemeinsamer CU-Topf) | Ausgeprägt | Ausgeprägt | Ausgeprägt |
| Skalierung nach unten (kleine Umgebung) | Solide (Sekundenabrechnung) | Bedingt (Serverless teuer, Classic mit Idle-Risiko) | Ausgeprägt (F2 ab ca. 336 USD/Monat) | Ausgeprägt (Athena rein verbrauchsbasiert) | Solide | Ausgeprägt (On-Demand plus Freikontingent) |
| Rabatthebel | Ausgeprägt (bis ca. 40 %) | Solide (bis 37 %) | Solide (ca. 41 %, kein 3-Jahres-Bonus) | Ausgeprägt (bis 66–72 %) | Ausgeprägt (EA/MCA) | Solide (bis 20 %) |
| Schweizer Regionsaufschlag | nicht bezifferbar | Serverless-Meter über West Europe | CU 0.23 gegen 0.22 (West Europe) | ca. 9–13 % über Frankfurt | ca. 10 % über US-Referenz | **kein Aufschlag bei BigQuery** |
---

## 4. Kriterium 2 — AI Readiness

### 4.1 Was «AI Readiness» hier bedeutet

Nicht: «Hat der Anbieter Copilot im Namen?» Sondern: Lässt sich ein produktiver, governierter KI-Anwendungsfall auf der Plattform bauen — mit nachvollziehbarem Zugriffsmodell, kontrollierbaren Kosten und einer belastbaren Aussage darüber, **wo die Daten während der Inferenz liegen**.

### 4.2 GenAI-Funktionen im Vergleich

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| **GenAI direkt in SQL** | Cortex AISQL: `AI_COMPLETE`, `AI_CLASSIFY`, `AI_EXTRACT`, `AI_EMBED` — Kernfunktionen GA | `ai_query`, `ai_classify`, `ai_extract` — GA, regional eingeschränkt | AI Functions in Notebook/SQL/Warehouse — **Preview**, an Azure-OpenAI-Regionen gekoppelt | Bedrock-Aufruf aus Redshift/Athena über UDF, nicht als natives SQL-Konstrukt | über Azure-Dienste, nicht als natives SQL-Konstrukt | `AI.GENERATE`, `ML.GENERATE_TEXT` in BigQuery ML — GA |
| **Konversationelle Analytik** | Cortex Analyst, Snowflake CoWork (GA seit 04.11.2025, am Summit 2026 erweitert) | AI/BI Genie | Copilot (Power BI In-Report GA, Standalone Preview), Fabric Data Agents GA | Amazon Q in QuickSight (Author Pro 40 USD, Reader Pro 20 USD) | Copilot-Familie, Foundry Agent Service | Conversational Analytics in Looker; BigQuery Data Canvas |
| **Agenten-Framework** | Cortex Agents, MCP-Server **GA**; Natoma-Akquisition für MCP-Governance | Agent Bricks; **Supervisor Agent GA seit 10.02.2026**; MCP als Client und Tool-Quelle | Fabric Data Agents GA, integrierbar in Copilot Studio, AI Foundry, Teams | Bedrock AgentCore GA seit Oktober 2025; stateful MCP seit März 2026 | Foundry Agent Service, Copilot Studio; MCP teils GA teils Preview | Agent Engine, Gemini Enterprise (vormals Agentspace) — Zürich seit 16.12.2025 unterstützt |
| **Semantische Schicht als Grounding** | Semantic Views nativ; Semantic View Autopilot Public Preview; Open Semantic Interchange mit 54 Anbietern | Unity Catalog Metrics (Public Preview → GA angekündigt) | Power-BI-Semantic-Model — reifste semantische Schicht im Feld, erfordert aber aktive Pflege (Beschreibungen, Custom Instructions) | keine plattformweite semantische Schicht | via Power BI | LookML in Looker — sehr reif, aber lizenzseitig intransparent |
| **Modellauswahl** | Anthropic Claude (erweiterte Partnerschaft), OpenAI, Mistral, Meta Llama, Google Gemini, xAI Grok | sehr breiter Katalog: GPT-5-Serie, Claude-Serie, Gemini 3.x, Llama 4, Qwen, DeepSeek, GLM, Kimi | ausschliesslich über Azure OpenAI | Bedrock: Anthropic, Meta, Mistral, AI21, Cohere, xAI, Amazon Nova | Azure AI Foundry: OpenAI plus Modellkatalog | Vertex AI / Gemini Enterprise Agent Platform: Gemini 3 Pro GA, 3.1 Pro Preview, Model Garden |
| **Eigenes Modell des Anbieters** | keines | **DBRX vollständig abgekündigt** (Pay-per-Token 30.04.2025, Provisioned Throughput 19.12.2025) | keines | Amazon Nova | keines eigenes (OpenAI-Partnerschaft) | Gemini — einziger Anbieter im Feld mit eigenem Frontier-Modell |
| **Fine-Tuning** | Cortex Fine-tuning; Cortex Training (GPU) Preview | Foundation Model Fine-tuning — **in beiden Schweizer Azure-Regionen nicht verfügbar** | kein plattformnatives LLM-Fine-Tuning | SageMaker / Bedrock Custom Models | Azure AI Foundry | Supervised Fine-Tuning für Gemini 2.5 Flash-Lite und Pro |
| **Vektorsuche / RAG** | Cortex Search (Serving pro GB Index plus Embedding-Tokens) | Mosaic AI Vector Search GA (Preis auf Azure nicht separat auslesbar) | SQL-Datenbank und Cosmos DB in Fabric mit nativem Vektor-/RAG-Support, GA seit 18.11.2025 | Bedrock Knowledge Bases (5 USD/GB/Monat plus 1 USD/1'000 Retrievals), OpenSearch | Azure AI Search (Vektor ab Basic-Tier) | Vertex Vector Search, RAG Engine (komponentenweise abgerechnet) |
| **MLOps** | Snowpark ML, Model Registry, Feature Store | **MLflow 3** nativ, Model Serving, Evaluation — Referenzimplementierung im Markt | MLflow 3 integriert | SageMaker AI (Training, Hosting, JumpStart) | Azure Machine Learning | Vertex AI Training/Prediction, BigQuery ML |
| **KI-Governance** | Cortex AI Guardrails GA seit 14.05.2026; Budgets für AI-Features GA seit 10.04.2026 | Unity AI Gateway (Rate Limiting, Logging); in Switzerland West nicht verfügbar | Purview DSPM for AI; Sensitivity Labels greifen auf Copilot | Bedrock Guardrails; ISO/IEC 42001 im Portfolio | Purview for AI, Foundry Evaluations | Model Armor, ISO/IEC 42001 |

### 4.3 Einordnung AI Readiness

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| GenAI in SQL / Data-Engineering-Nähe | Ausgeprägt | Ausgeprägt | Bedingt (Preview) | Bedingt | Bedingt | Ausgeprägt |
| Agenten und Orchestrierung | Ausgeprägt | Ausgeprägt | Solide | Solide | Solide | Solide |
| Breite des Modellkatalogs | Solide | Ausgeprägt | Bedingt (nur Azure OpenAI) | Ausgeprägt | Ausgeprägt | Ausgeprägt |
| MLOps-Reife | Solide | Ausgeprägt | Solide | Ausgeprägt | Solide | Ausgeprägt |
| Nutzbarkeit für Fachanwender | Ausgeprägt (CoWork) | Solide (Genie) | Ausgeprägt (Copilot im Power-BI-Kontext) | Bedingt | Solide | Solide |
| **KI-Inferenz in der Schweiz** | **Lücke** | **Bedingt** | **Bedingt** | **Lücke** | **Bedingt** | **Bedingt** |

### 4.4 Der zentrale Befund: Daten bleiben in der Schweiz, die Inferenz nicht

Dies ist die wichtigste Einzelaussage des gesamten Vergleichs, weil sie bei jedem der sechs Anbieter zutrifft und in Marketingunterlagen nirgends steht.

**Die Ausgangslage:** Bei allen sechs Plattformen lässt sich der Speicherort der Kundendaten («data at rest») technisch und vertraglich in der Schweiz halten. Sobald aber ein Sprachmodell aufgerufen wird, verlässt der Prompt inklusive mitgesendetem Kontext in der Standardkonfiguration mehrfach das Land.

| Plattform | Verhalten der KI-Inferenz bei Schweizer Datenhaltung |
|---|---|
| **Azure / Microsoft Foundry** | Drei Deployment-Typen (alle GA): **Global** (Verarbeitung weltweit), **Data Zone EU** (Verarbeitung innerhalb der EU Data Boundary — diese **schliesst die Schweiz als EFTA-Staat ausdrücklich ein**), **Regional/Single Region** (Verarbeitung exakt in der gewählten Region). Nur der dritte Typ garantiert Verarbeitung in der Schweiz. **Aber:** In Switzerland North sind laut Microsoft-Support-Quelle (Stand ca. Juni/August 2026) aktuell **keine GPT-Sprachmodelle als Standard-/Regional-Deployment verfügbar** — nur Embeddings und Whisper. Ein aktuelles Flaggschiffmodell mit garantierter Verarbeitung in der Schweiz ist damit derzeit nicht verfügbar; realistische Option ist Data Zone EU. Dieser Zustand ist volatil und vor Projektstart tagesaktuell zu prüfen. |
| **AWS Bedrock** | Für **kein einziges** geprüftes Foundation-Modell ist eu-central-2 (Zürich) als «In-Region» gelistet. Zürich hat einen Bedrock-**Control-Plane**-Endpunkt, ist aber nicht in der **Runtime**-Endpunkttabelle geführt. Inferenz läuft über Geo- (EU) oder Global-Cross-Region-Profile; die tatsächliche Verarbeitungsregion wird in CloudTrail als `inferenceRegion` protokolliert. «Bedrock in Zürich» bedeutet Verwaltung in der Schweiz, nicht Verarbeitung in der Schweiz. |
| **Snowflake Cortex** | Azure Switzerland North und AWS eu-central-2 sind **nicht** in der Liste nativer Cortex-AI-Regionen. Ohne native Region greift Cross-Region Inference. Für neu erstellte Accounts in neuen Organisationen gilt **seit 9. März 2026 `ANY_REGION` als Default** — also globales Routing ohne explizite Konfiguration. Restriktivere Optionen: `AWS_EU` / `AZURE_EU` oder `DISABLED`; bei `DISABLED` sind Cortex-Funktionen in der Schweizer Region schlicht nicht nutzbar. Gespeicherte Daten und Ergebnisse bleiben in der Home-Region. |
| **Databricks** | Serverless-Compute verarbeitet laut Doku «Databricks Geos» Daten **nicht ausserhalb der gewählten Region**, sofern Cross-Geo nicht aktiv aktiviert wird — die stärkste Zusicherung im Feld. **Ausnahme:** Mehrere Gemini-3.x-Modelle in den Foundation Model APIs sind ausdrücklich als «hosted on a global endpoint, requires cross geography routing» markiert. Zusätzlich ist Foundation-Model-Fine-Tuning in beiden Schweizer Azure-Regionen nicht verfügbar. |
| **Microsoft Fabric** | Copilot ist ausserhalb der Regionen «US» und «France» standardmässig **deaktiviert**; ein Tenant-Admin muss Cross-Geo-Verarbeitung explizit freigeben. Die allgemeine EU-Data-Boundary-Definition schliesst die Schweiz ein, die Copilot-spezifische Admin-Dokumentation nennt jedoch nur US und France namentlich. Dieser Widerspruch liess sich nicht auflösen und ist vor einem Copilot-Rollout in Switzerland North mit Microsoft zu verifizieren. Konversationsverläufe werden 28 Tage im selben Sicherheitsperimeter gespeichert. Fabric Data Agents scheitern zudem, wenn Datenquelle und Agent-Arbeitsbereich in unterschiedlichen Regionen liegen. |
| **Google Cloud** | Regionale (nicht-globale) Endpunkte garantieren Verarbeitung in der gewählten Region; für Provisioned Throughput gilt seit 1. Juli 2026 ein **Aufschlag von 10 %** auf nicht-globale Endpunkte. Das Assured-Workloads-Control-Package **«Switzerland Data Boundary»** beschränkt Ressourcen strikt auf europe-west6 und deckt über 130 Produkte inklusive Vertex AI und Looker ab — schliesst aber **Gemini-Funktionen in BigQuery ausdrücklich aus**. Wer maximale Residenzstrenge wählt, verliert also genau die KI-Integration ins Data Warehouse. TPU-Kapazität existiert in Europa nur in europe-west4, nicht in Zürich. |

**Was daraus für die Beratung folgt:**

1. Die Frage «läuft das in der Schweiz?» muss **getrennt für Datenhaltung und Inferenz** gestellt werden. Eine Schweizer Region beantwortet nur die erste Hälfte.
2. Es existiert derzeit **keine Konstellation im Feld**, die ein aktuelles Frontier-Modell mit garantierter Verarbeitung ausschliesslich in der Schweiz kombiniert. Wer das fordert, muss entweder auf kleinere/ältere Modelle, auf selbst betriebene Open-Weight-Modelle oder auf «EU inklusive Schweiz» als Zielzustand ausweichen.
3. Der realistische Zielzustand für die meisten Schweizer Kunden ist **EU-Datenraum inklusive Schweiz** (Azure Data Zone EU, AWS Geo-EU, Snowflake `AZURE_EU`/`AWS_EU`, Databricks Europe-Geo). Das ist dokumentierbar, prüfbar und regulatorisch in der Regel tragfähig — aber es ist eine bewusste Entscheidung, nicht der Default.
4. Die Default-Einstellungen ändern sich. Snowflake hat den Cross-Region-Default im März 2026 für neue Accounts auf global umgestellt. Change-Monitoring der Anbieter-Release-Notes ist damit Teil der Betriebspflicht, nicht Kür.

---

## 5. Kriterium 3 — Analyseservices

### 5.1 Funktionsabdeckung im Vergleich

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| **Ingestion / ELT** | Snowpipe, Snowpipe Streaming, Openflow (NiFi-basiert, GA), Datastream (Kafka-kompatibel, Preview) | Lakeflow Connect (verwaltete Konnektoren), Lakeflow Declarative Pipelines, Zerobus Ingest | Data Factory Pipelines, Dataflows Gen2, **Mirroring** aus 13+ Quellen, Open Mirroring per API, Shortcuts | Glue ETL, Glue Crawler, Kinesis, MSK, Zero-ETL aus Aurora/DynamoDB | Data Factory, Event Hubs, Stream Analytics | Data Transfer Service, Datastream (CDC), Dataflow, Pub/Sub |
| **Speicherformat** | proprietäres Format als Default; Iceberg optional, Snowflake Storage für Iceberg Tables GA; Iceberg v3 | **Delta Lake** als Default (offen); UniForm und Managed Iceberg | **Delta Lake** in OneLake als Default; Iceberg-kompatible Metadaten automatisch, XTable als Übersetzer | S3 plus Iceberg/S3 Tables (in eu-central-2 verfügbar) | ADLS Gen2 plus Delta/Parquet/Iceberg | BigQuery-natives Capacitor-Format; «Lakehouse for Apache Iceberg» (Iceberg v2 GA, v3 Preview) |
| **SQL-Engine** | Multi-Cluster Shared Data; Gen2- und Interactive-Warehouses; Adaptive Compute in Einführung | Databricks SQL (Classic, Pro, Serverless) mit Photon | Warehouse plus SQL Analytics Endpoint (T-SQL) | Athena (serverless) plus Redshift (MPP) | Synapse SQL (Bestand), Azure SQL | BigQuery — serverless, keine Kapazitätsverwaltung nötig im On-Demand-Modus |
| **Spark / Data Science** | Snowpark (Python/Java/Scala), Snowpark Container Services inkl. GPU-Pools | **Kernkompetenz**: Spark plus Photon, Notebooks, kollaborativ | Spark-Notebooks, Data Science mit MLflow | EMR, EMR Serverless, Glue Spark, SageMaker | Azure Databricks, Synapse Spark (Bestand) | Dataproc, Spark in BigQuery, Colab Enterprise |
| **Streaming / Real-Time** | Snowpipe Streaming, Dynamic Tables, Streams und Tasks | Structured Streaming, Lakeflow Declarative Pipelines | **Real-Time Intelligence**: Eventhouse (KQL), Eventstream, Activator — im Feld die stärkste integrierte Real-Time-Story | Kinesis, MSK, Managed Flink | Event Hubs, Stream Analytics, Azure Data Explorer | Pub/Sub, Dataflow, Continuous Queries (stateful in Preview) |
| **BI-Schicht** | **keine eigene** — abhängig von Power BI, Tableau, Looker, Qlik; Streamlit-Apps und CoWork decken Teile ab | AI/BI Dashboards und Genie; für pixelgenaues Enterprise-Reporting in der Praxis weiter Partner-BI | **Power BI mit Direct Lake** — reifste BI-Schicht im Feld, im Preis der Kapazität enthalten | QuickSight (funktional schlanker als Power BI) | Power BI | Looker plus Looker Studio; Conversational Analytics |
| **Semantic Layer** | Semantic Views, Semantic Studio (Private Preview), Horizon Context (Private Preview) | Unity Catalog Metrics (Preview) | Power-BI-Semantic-Model — de-facto-Standard im Microsoft-Umfeld | keiner plattformweit | via Power BI | LookML |
| **Orchestrierung / CI-CD** | Tasks, Streams, **dbt Projects on Snowflake GA seit 10.11.2025** (nativ, ohne externen Orchestrator) | Lakeflow Jobs, Databricks Asset Bundles, Repos, Terraform | Deployment Pipelines, Git-Integration, Fabric CLI GA seit 30.04.2026 — aber **vier parallele CI/CD-Ansätze** | Step Functions, MWAA, CodePipeline | Data Factory, Azure DevOps | Composer (Airflow), Dataform, Cloud Build |
| **Katalog / Governance** | Horizon Catalog (Discovery, Lineage, Klassifizierung, Access History) | **Unity Catalog** — Apache-2.0-Open-Source, Lineage bis Spaltenebene; ABAC, Tag Policies, Klassifizierung in Beta | OneLake Catalog plus Purview (Labels, DLP, Lineage); Purview Live View Preview; manuelles Scanning nur mit Purview-Enterprise | Glue Data Catalog plus Lake Formation; SageMaker Catalog (DataZone im Auslaufpfad) | Purview | Dataplex Universal Catalog (Katalog frei, Qualität/Lineage kostenpflichtig) |
| **Data Sharing / Marktplatz** | **Ausgeprägt**: Secure Data Sharing, Snowgrid, Marketplace, Clean Rooms | Delta Sharing (offenes Protokoll), Marketplace, Clean Rooms (Preview, 50 USD/Tag/Collaborator auf Azure) | Shortcuts und Mirroring intern; kein externer Datenmarktplatz vergleichbarer Reife | Data Exchange, Clean Rooms (**nicht in Zürich**) | via Fabric/Purview | Analytics Hub (GA seit 2022) |
| **Operative Datenbank auf der Plattform** | Unistore / Hybrid Tables (GA) | **Lakebase** (verwaltetes Postgres), GA auf Azure seit 03.03.2026 — Autoscaling in Switzerland North nicht verfügbar | **SQL-Datenbank und Cosmos DB in Fabric**, GA seit 18.11.2025 | Aurora, DynamoDB (ausserhalb der Analytics-Plattform) | Azure SQL, Cosmos DB | AlloyDB, Cloud SQL, Spanner |

### 5.2 Einordnung Analyseservices

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| Breite der Abdeckung «aus einer Hand» | Solide | Ausgeprägt | Ausgeprägt | Bedingt (Zusammenbau nötig) | Bedingt | Solide |
| SQL-/Warehouse-Reife | Ausgeprägt | Solide | Solide | Solide | Solide | Ausgeprägt |
| Data Engineering und ML | Solide | Ausgeprägt | Solide | Ausgeprägt | Solide | Solide |
| Real-Time / Streaming | Solide | Solide | Ausgeprägt | Ausgeprägt | Solide | Ausgeprägt |
| Integrierte BI-Schicht | **Lücke** | Bedingt | Ausgeprägt | Bedingt | Ausgeprägt (Power BI) | Solide |
| Data Sharing und Ökosystem | Ausgeprägt | Solide | Bedingt | Solide | Bedingt | Solide |
| CI/CD- und Betriebsreife | Solide | Ausgeprägt | Bedingt (vier parallele Ansätze) | Solide | Solide | Solide |
| Governance und Lineage | Solide | Ausgeprägt | Solide | Bedingt (Umbau DataZone → SageMaker Catalog) | Solide | Solide |

### 5.3 Strategische Bewegungen, die man kennen muss

| Thema | Sachstand 20.08.2026 |
|---|---|
| **Azure Synapse Analytics** | Kein Voll-Retirement — Microsoft erklärt ausdrücklich, Synapse nicht abzukündigen. Aber: Synapse Data Explorer per 07.10.2025 abgekündigt, Synapse Link für Cosmos DB für Neuprojekte gesperrt, die Synapse-basierte «Cloud-Scale Analytics»-Referenzarchitektur ab April 2026 gelöscht, «trusted services access» per 01.08.2026 entfernt. **Einordnung: Bestand ist sicher, Neuinvestition gehört nach Fabric.** |
| **Amazon DataZone** | Nicht abgekündigt, aber in «SageMaker Unified Domain» überführt. Für Neuprojekte ist SageMaker Unified Studio / Catalog der strategisch richtige Einstiegspunkt. |
| **Fabric ↔ Databricks** | Mirroring des Unity-Catalog-Metastores nach OneLake ist GA (rein metadatenbasiert, via Shortcuts; materialisierte Views, Streaming-Tabellen und Nicht-Delta-External-Tables ausgeschlossen). 2026 kam die Möglichkeit hinzu, Unity-Catalog-verwaltete Tabellen direkt in OneLake abzulegen. Die zwei Plattformen konvergieren auf Storage-Ebene. |
| **Iceberg-Konvergenz** | Alle sechs Anbieter unterstützen Apache Iceberg in irgendeiner Form. Damit verschiebt sich der Wettbewerb vom Speicherformat auf Engine, Governance und Semantik. Für Kunden ist das die wichtigste architektonische gute Nachricht der letzten Jahre. |
| **Postgres-Rennen** | Databricks kauft Neon (Mai 2025, ca. 1 Mrd. USD), Snowflake kauft Crunchy Data (Juni 2025, ca. 250 Mio. USD), Fabric bringt SQL-Datenbank und Cosmos DB in die Plattform. Alle drei Datenplattformen wollen die operative Datenbank mit ins Boot holen. |
| **dbt und Fivetran** | dbt Projects on Snowflake GA seit 10.11.2025 (native Ausführung ohne externen Orchestrator). Im Sommer 2026 wurde ein Zusammenschluss von dbt Labs und Fivetran angekündigt — relevant für die Werkzeugstrategie im Ingestion-/Transformationslayer. |

---

## 6. Kriterium 4 — Multi-Plattform und Portabilität

### 6.1 Vergleich

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| **Betreibbar auf** | AWS, Azure, GCP — 45+ Regionen, davon ca. 18 in EMEA | AWS, Azure, GCP | **nur Azure** | — | — | — |
| **Cross-Cloud-Betrieb** | Snowgrid: Replikation, Failover/Failback, Sharing über Cloud- und Regionsgrenzen (Failover ab Business Critical) | eigenständige Instanz je Hyperscaler; einheitliche Governance über Unity Catalog und Delta Sharing, kein Cross-Cloud-Compute in einem Workspace | keiner | BigQuery-Omni-Pendant fehlt; Interop über offene Formate | Fabric Mirroring, Purview über Clouds | BigQuery Omni (Abfragen auf S3/Blob) — **in europe-west6 nicht verfügbar** |
| **Offenes Tabellenformat** | Iceberg optional, proprietär als Default | Delta Lake und Iceberg — beides offen, Kundendaten im eigenen Storage-Konto | Delta Lake mit Iceberg-Metadaten | Iceberg via S3 Tables | Delta/Parquet/Iceberg auf ADLS | Iceberg via «Lakehouse for Apache Iceberg» |
| **Katalog-Interoperabilität** | Horizon Catalog; Open Catalog (Polaris) — keine Neuregistrierungen mehr, Bestandskunden weiterhin | **Unity Catalog OSS (Apache 2.0)**, Iceberg REST lesend GA / schreibend Preview | OneLake-Shortcuts, XTable, Unity-Catalog-Mirroring | Glue Data Catalog, Iceberg REST | Purview | Lakehouse runtime catalog (BigLake Metastore als Legacy) |
| **Exit-Pfad** | Iceberg-Tabellen als Ausweg; Migration vom proprietären Format ist Aufwand, nicht Knopfdruck | am offensten: Daten im Kunden-Storage, offenes Format, offener Katalog, offenes Sharing-Protokoll | Storage offen (Delta/Parquet, ADLS-Gen2-kompatibel); **Semantic Models, Berichte, Pipelines, Copilot-Konfiguration sind proprietär** | offene Formate; Egress-Waiver bei Vollexit | Switching-Egress-Gebühren abgeschafft (EU Data Act) | Egress-Waiver bei Vollexit seit 11.01.2024, aber **kein Teil-Exit** und formeller Exit-Notice nötig |
| **Hybrid / On-Premises** | keine On-Prem-Variante; VPS als isolierte Managed-Instanz | keine On-Prem-Variante | keine On-Prem-Variante | Outposts, Local Zones | Arc, Azure Local | Google Distributed Cloud (connected und air-gapped) |
| **Identitätsbindung** | eigenes RBAC plus External OAuth (Okta, Entra ID) | Unity Catalog plus Identity Provider des Substrats | **zwingend Entra ID** | IAM / IAM Identity Center | **Entra ID** | Cloud Identity |

### 6.2 Einordnung Multi-Plattform

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| Cloud-Portabilität | Ausgeprägt | Ausgeprägt | **Lücke** | n. a. | n. a. | n. a. |
| Offenheit des Datenformats | Bedingt (offen nur bei bewusster Iceberg-Wahl) | Ausgeprägt | Solide | Solide | Solide | Bedingt (nativ proprietär, Iceberg als Wahl) |
| Katalog-Offenheit | Solide | Ausgeprägt | Bedingt | Solide | Solide | Solide |
| Exit-Aufwand (niedriger = besser) | mittel | niedrig | hoch auf Semantik-/Artefaktebene | mittel | mittel | mittel |
| Hybrid-/On-Prem-Option | Lücke | Lücke | Lücke | Solide | Ausgeprägt | Solide |

### 6.3 Wo Lock-in 2026 wirklich sitzt

Die Egress-Gebühr als Wechselbarriere ist weitgehend Geschichte: Google (seit 11.01.2024), Microsoft (seit März 2024) und AWS haben Switching-Egress für vollständige Migrationen erlassen, getrieben durch den EU Data Act. **Für Schweizer Verträge ist allerdings zu prüfen, ob diese EU-getriebene Zusage identisch gilt** — die Schweiz ist nicht EU-Mitglied, und die Zusagen sind kommerziell, nicht regulatorisch erzwungen.

Der reale Lock-in hat sich verschoben auf:

1. **Semantische Schicht und Berichtsartefakte.** Ein Power-BI-Semantic-Model, ein LookML-Projekt oder eine Sammlung Cortex-Semantic-Views lässt sich nicht exportieren. Das ist heute die teuerste Wechselbarriere.
2. **Identität.** Entra ID, IAM und Cloud Identity überleben jeden Analytics-Stack-Wechsel. Wer Fabric ablöst, löst selten Entra ab.
3. **Mehrjährige Kapazitätszusagen.** Slot-Commitments, Capacity-Verträge und DBCU-Vorauskäufe binden 1–3 Jahre.
4. **Know-how und Betriebsmodell.** SQL-Dialekte, Pipeline-Frameworks und das eingespielte Betriebsteam sind schwerer zu migrieren als Daten.
5. **Agenten- und Copilot-Konfiguration.** Neu und unterschätzt: Data Agents, Semantic Views mit Custom Instructions, Guardrail-Regeln sind proprietäre Artefakte ohne Exportpfad.

---

## 7. Kriterium 5 — Enterprise-Readiness

### 7.1 Zertifizierungen und Compliance-Nachweise

| Plattform | Wesentliche Nachweise | Schweiz-spezifisch |
|---|---|---|
| **Snowflake** | ISO 9001, 27001, 27017, 27018; SOC 1/2 Type II; CSA STAR L1; HITRUST CSF; PCI DSS; FedRAMP Moderate/High, GovRAMP, DoD IL5; **C5 und TISAX AL3**; IRAP; Cyber Essentials Plus | **keine Schweiz-spezifische Zertifizierung** in der offiziellen Compliance-Liste gefunden. PCI DSS, HITRUST, FedRAMP an Business Critical Edition oder höher gebunden |
| **Databricks** | ISO 27001, 27018, 27036 als Einzelzertifikate öffentlich; SOC 2 Type II erwähnt. Vollständige Liste nur über das Due-Diligence-Package. **Compliance Security Profile** (CIS-Level-1-Härtung, automatische Patches, TLS 1.2+) ist Pflicht für C5, PCI-DSS, TISAX, K-FSI, Cyber Essentials Plus, CCCS, ISMAP — **ab 01.09.2026 zusätzlich für HIPAA, HITRUST, IRAP**; kostenpflichtig (0.10 bzw. 0.15 USD/DBU) | keine Databricks-spezifische FINMA-/revDSG-Zusicherung gefunden |
| **Microsoft Fabric** | ISO 27001, 27017, 27018, 27701; HIPAA BAA. Vollständige SOC-Liste nur über Service Trust Portal (Login) | Microsofts FINMA-Compliance-Seite deckt Azure, Dynamics 365 und Microsoft 365 ab — **Fabric wird dort nicht namentlich genannt** |
| **AWS** | ISO 9001, 14001, 20000, 22301, 27001, 27017, 27018, 27701, **42001 (KI-Management)**, 45001, 50001; SOC 1/2/3; PCI DSS; C5; HDS | **FINMA-ISAE-3000-Type-2-Bericht** veröffentlicht, adressiert RS 2023/01 und RS 2018/03 sowie SVV-Business-Continuity-Standards. AWS betont ausdrücklich die Complementary User Entity Controls — AWS allein deckt FINMA nicht ab |
| **Microsoft Azure** | ISO 27001, 27017, 27018, 27701; SOC 1/2/3; PCI DSS; C5; EU Cloud Code of Conduct | FINMA zertifiziert keine Cloud-Anbieter; relevant sind Financial Services Amendment und Data Protection Addendum als Vertragsbausteine |
| **Google Cloud** | ISO 9001, 20000-1, 22301, 27001, 27017, 27018, 27701, **42001**, 50001; SOC 1/2/3; PCI DSS, PCI 3DS, PCI PIN; BSI C5; CSA; SWIFT | **ISAE 3000 Type 2 Report (FINMA)** plus separates «FINMA Circular 2018/3 compliance mapping»-Dokument; EU Cloud Code of Conduct; HDS; TISAX |

### 7.2 Schweizer Datenresidenz und Souveränität

| Anbieter | Schweizer Region | Souveränitätsangebot 2026 | Bewertung für Schweizer Kunden |
|---|---|---|---|
| **Microsoft Azure / Fabric** | Switzerland North (Zürich) und Switzerland West (Genf), beide seit 2019, 3 Availability Zones | **Sovereign Public Cloud** (zusätzliche Kontrollen auf bestehendem Footprint, kein Migrationszwang), **Data Guardian** (nur in Europa ansässiges Microsoft-Personal gibt Fernzugriffe frei, manipulationssichere Protokollierung), EU Data Boundary inkl. Schweiz. **Schweiz-spezifische Kommunikation vom 25.02.2026**, USD 400 Mio. Investitionszusage vom 02.06.2025, «Digital Resilience Commitment» | Das umfassendste Souveränitätspaket mit explizitem Schweiz-Bezug. Fabric selbst ist in beiden Schweizer Regionen voll verfügbar |
| **AWS** | Europe (Zurich) eu-central-2 seit 08.11.2022, 3 Availability Zones | **AWS European Sovereign Cloud** GA seit 15.01.2026, erste Region Brandenburg (DE); eigenständige deutsche GmbH-Struktur, ausschliesslich EU-Personal, Advisory Board, über 90 Services, EUR 7.8 Mrd. Investition | **Die Schweiz wird in der Ankündigung nicht erwähnt.** Ob Schweizer Kunden zugelassen sind und ob das regulatorisch besser dasteht als eu-central-2, ist offen und beim Anbieter zu klären |
| **Google Cloud** | europe-west6 (Zürich) seit 12.03.2019, 3 Zonen | Partnerbetriebenes Modell mit **Thales** (Deutschland, Ziel Ende 2026) und **S3NS** (Frankreich); Sovereign Cloud Hub München seit 12.11.2025; Assured-Workloads-Package **«Switzerland Data Boundary»** (strikt europe-west6, 130+ Produkte, im Free Tier enthalten) | **Kein Schweizer Sovereign-Partner** analog S3NS. **Kein Schweizer External-Key-Management-Partner** (Fortanix, Futurex, Thales — alle nicht schweizerisch). Achtung: Die EU-Multiregion «EU» schliesst Zürich ausdrücklich aus |
| **Snowflake** | Azure Switzerland North und AWS eu-central-2 | Tri-Secret Secure (BYOK) ab Business Critical; Virtual Private Snowflake als isolierte Umgebung | Datenhaltung in der Schweiz möglich, KI-Funktionen mit Einschränkung (siehe 4.4) |
| **Databricks** | nur Azure Switzerland North (voll) und West (Basis) | Compliance Security Profile; Customer-managed VPC/VNet; PrivateLink; Serverless-Netzwerk-Policies; Europe-Geo umfasst EWR, Schweiz und UK | Auf AWS und GCP **keine** Schweizer Region — der entscheidende Einschränkungspunkt |

### 7.3 Betriebsseitige Reife

| Dimension | Snowflake | Databricks | Fabric | AWS | Azure | Google Cloud |
|---|---|---|---|---|---|---|
| **SLA** | duales Commitment: <1 % Fehlerrate in 99.9 % der Zeit **oder** <10 % Fehlerrate in 99.99 % — die für den Kunden günstigere Schwelle gilt | **keine öffentliche Uptime-SLA** auf der Support-Seite; nur Reaktionszeiten | **kein öffentlich verifizierbarer Fabric-spezifischer SLA-Prozentsatz** | Redshift 99.99 % Multi-AZ / 99.9 % Serverless; SLA je Service unterschiedlich | je Service | BigQuery 99.9 % / 99.99 %; Gemini Inferenz 99.5 % |
| **Support-Stufen** | Standard; ab Enterprise «Premier Support» 24/7 mit 1 h Reaktion bei Sev 1 | Business / Production / Mission Critical (15 min bei Mission Critical) | Microsoft-Standardmodell | Business Support+ ab 29 USD; Enterprise ab 5'000 USD (neu 2026) | Microsoft-Standardmodell | Standard 29 / Enhanced 100 / Premium 15'000 USD Minimum |
| **Verschlüsselung / Schlüsselhoheit** | Tri-Secret Secure (BYOK) ab Business Critical | Customer-managed Keys je Ebene, Detailumfang cloudabhängig | **CMK auf Workspace-Ebene GA**, mit klar dokumentierten Ausnahmen (Tabellennamen, Spark-Temp-Daten, Job-Logs, Query-Caches; Mirrored Dataverse und Mirrored Databricks Catalog nicht CMK-fähig; Trial-Kapazitäten nicht) | KMS (1 USD/Key/Monat), CloudHSM (1.60 USD/h) | Managed HSM, CMK | CMEK, CSEK, **Cloud EKM** (Fortanix, Futurex, Thales) |
| **Private Konnektivität** | PrivateLink (AWS), Private Service Connect (GCP), ab Business Critical | Customer-managed VPC/VNet, PrivateLink für Control Plane und Serverless, Egress-Netzwerkpolicies | Private Links, Trusted Workspace Access, Managed Private Endpoints — **GA** | PrivateLink (0.01 USD/GB) | Private Link, VNet | VPC Service Controls, Private Service Connect |
| **Feingranulare Sicherheit** | RBAC in allen Editionen; Row-/Column-Level-Security und Masking **ab Enterprise** | Unity Catalog bis Spaltenebene; ABAC und Tag Policies in **Beta** | RLS, CLS und OLS für SQL-Endpoint, Warehouse, Direct Lake, KQL — GA | Lake Formation | Purview plus Dienst-RBAC | IAM plus IAM Conditions, VPC-SC |
| **Release- / Change-Management** | wöchentliche Releases; **Behaviour Change Releases in monatlichen Bundles**, vorab testbar/verzögerbar — vorbildlich transparent, verlangt aber aktives Monitoring | monatliche Release Notes; dokumentierte Modell-Wartungsrichtlinie (Update → Deprecation ≥3 Monate → Retirement) | monatliche Feature-Summary plus strukturierter Release Plan; **sehr hohe Änderungsfrequenz**, Features wechseln quasi monatlich zwischen Preview und GA | What's-New-Feed, Service-Announcements | Azure Updates | Release Notes je Produkt; laufende Umbenennungen (Vertex AI → Gemini Enterprise Agent Platform, BigLake → Lakehouse for Apache Iceberg) |
| **Skills-Verfügbarkeit Schweiz** | User Groups in der Deutschschweiz, Snowflake Forum Zürich 2026; SnowPro-Zertifizierung | wachsend, aber kleiner als das Microsoft-Ökosystem; Glassdoor zeigte am 20.08.2026 rund 27 offene «Databricks»-Stellen in der Schweiz (Momentaufnahme, keine Studie) | breitestes Partner- und Skills-Ökosystem in der Schweiz durch die Power-BI-Basis; aber junger, noch nicht tief ausgereifter Fabric-Beratermarkt | grösste Partner- und Zertifizierungsbasis in Europa | sehr breit in der Schweiz | kleineres lokales Ökosystem als Microsoft |

**Wichtig zur Skills-Frage:** Es existiert **keine belastbare, plattformspezifische Studie zur Fachkräfteverfügbarkeit in der Schweiz**. Alle Aussagen dazu sind Markteinschätzung, nicht Statistik, und sind auch so zu kommunizieren.

### 7.4 Bekannte Lücken für grosse Organisationen

| Plattform | Was in Grossorganisationen aufschlägt |
|---|---|
| **Snowflake** | Kein eigenes BI-Frontend — die Konsumptionsschicht ist immer ein Fremdprodukt. Row-/Column-Level-Security erst ab Enterprise. Wöchentliche Behaviour-Change-Bundles verlangen ein eigenes Change-Monitoring |
| **Databricks** | Keine öffentliche Uptime-SLA. Zentrale Governance-Features (ABAC, Tag Policies, Klassifizierung, Data-Quality-Monitoring) noch in Beta. Enhanced Security als kostenpflichtiges Add-on. Standard-Tier-Abschaltung 01.10.2026 |
| **Fabric** | Kapazitätsmanagement (Smoothing, Bursting, Surge Protection, dreistufiges Throttling) ist mächtig und komplex; Fehlkonfiguration trifft Endanwender direkt. Vier parallele CI/CD-Ansätze erschweren Standardisierung. Kostenvorhersage über Dutzende Meter schwierig. Kein öffentlicher SLA-Wert |
| **AWS** | Feature-Parität innerhalb Europas ist fragmentiert (Bedrock ohne In-Region-Inferenz in Zürich, Clean Rooms fehlt, Zero-ETL nur teilweise). Zusammenbau-Aufwand verlangt ein reifes Cloud-Engineering-Team |
| **Azure** | Geringste öffentliche Preistransparenz im Feld. Service-Überlappung und die Frage «Fabric oder Azure-Dienst?» erzeugt Beratungsbedarf. Region-Gaps bei Analytics- und KI-Diensten in Switzerland North sind ein häufiger Stolperstein und im Portal zu verifizieren |
| **Google Cloud** | Looker ohne Listenpreis erschwert TCO-Vergleiche. Kein Schweizer Sovereign-Partner, kein Schweizer EKM-Partner. Zürich ohne TPU und ohne BigQuery Omni. Unter «Switzerland Data Boundary» sind Gemini-Funktionen in BigQuery ausgeschlossen. Häufige Produktumbenennungen |
---

## 8. Steckbriefe

### 8.1 Snowflake

**Charakter:** Reines SaaS-Data-Warehouse, das sich zur Datenplattform ausgeweitet hat. Verkauft Einfachheit im Betrieb und Stärke im Datenaustausch.

- **Abrechnung:** Credits (Standard 2 / Enterprise 3 / Business Critical 4 USD, US-Referenz), pro Sekunde mit 60-Sekunden-Minimum, Storage 20.00–40.50 USD/TB/Monat; AI Credits separat (2.00 global / 2.20 regional)
- **Substrate:** AWS, Azure, GCP — Schweiz auf AWS eu-central-2 und Azure Switzerland North, **nicht** auf GCP
- **Stärken:** Betriebseinfachheit; Secure Data Sharing, Snowgrid und Marketplace als reifste Sharing-Story im Feld; Cross-Cloud-Failover ab Business Critical; Semantic Views plus Cortex Analyst; dbt nativ in der Plattform; sehr transparentes Behaviour-Change-Management
- **Grenzen:** kein eigenes BI-Frontend; proprietäres Speicherformat als Default (Iceberg nur bei bewusster Wahl); Row-/Column-Level-Security erst ab Enterprise; Cortex AI in Schweizer Regionen nicht nativ verfügbar; CH-Preise nicht öffentlich
- **Schweizer Besonderheit:** Cross-Region Inference ist für neue Accounts seit 09.03.2026 standardmässig global (`ANY_REGION`). Wer Cortex nutzen und in Europa bleiben will, muss `AZURE_EU` bzw. `AWS_EU` aktiv setzen
- **Passt, wenn:** Datenaustausch mit Partnern, Kunden oder Konzerngesellschaften ein Kernanwendungsfall ist; ein kleines Plattformteam eine grosse Nutzerbasis bedienen soll; Multi-Cloud-Freiheit ein explizites Ziel ist

### 8.2 Databricks

**Charakter:** Lakehouse mit Data-Engineering- und ML-DNA. Die offenste Architektur im Feld — und die anspruchsvollste im Betrieb.

- **Abrechnung:** DBU je Workload-SKU (Azure CH North, Premium: Jobs 0.30, All-Purpose 0.55, SQL Classic 0.22, Serverless SQL 1.09 USD/DBU) **plus separate Cloud-VM- und Storage-Kosten bei Classic Compute**
- **Substrate:** AWS, Azure, GCP — **Schweiz nur über Azure** (Switzerland North voll, Switzerland West nur Basis)
- **Stärken:** Spark und Photon als stärkste Verarbeitungs-Engine; Unity Catalog als Apache-2.0-Open-Source-Governance mit Lineage bis Spaltenebene; Delta Lake und Iceberg offen; Delta Sharing; MLflow 3 und Mosaic AI als reifste MLOps-Kette; Agent Bricks Supervisor Agent GA; sehr breiter Modellkatalog; Serverless bleibt laut Doku regional
- **Grenzen:** keine öffentliche Uptime-SLA; zentrale Governance-Features noch in Beta; BI-Schicht für Enterprise-Reporting meist Partnerprodukt; Fine-Tuning in Schweizer Regionen nicht verfügbar; Standard-Tier endet 01.10.2026; DBRX abgekündigt
- **Schweizer Besonderheit:** Auf AWS und Google Cloud existiert **keine** Schweizer Databricks-Region. Wer dort Substrat setzt und Schweizer Residenz braucht, kann Databricks nicht regionskonform betreiben
- **Passt, wenn:** Data Engineering und ML den Schwerpunkt bilden; ein offener, exit-fähiger Stack gefordert ist; ein kompetentes Plattform- und FinOps-Team vorhanden ist oder aufgebaut wird

### 8.3 Microsoft Fabric

**Charakter:** SaaS-Plattform, die Power BI, Data Engineering, Warehouse, Real-Time und Data Science in einen Kapazitätstopf legt. Die niedrigste Einstiegshürde im Feld — und die stärkste Bindung.

- **Abrechnung:** Capacity Units, Switzerland North 0.23 USD/CU/Stunde. F2 ab ca. 336 USD/Monat, F64 ca. 10'746 USD/Monat; Reservierung 1 Jahr ca. 41 % Rabatt, **3 Jahre ohne Zusatzrabatt**; OneLake Hot 0.0264 USD/GB/Monat; Power BI Pro 9.99 USD/Nutzer/Monat zusätzlich unter F64
- **Substrat:** ausschliesslich Azure — Switzerland North und West beide voll unterstützt
- **Stärken:** Power BI mit Direct Lake als reifste BI-Schicht; Real-Time Intelligence als stärkste integrierte Streaming-Story; Mirroring aus 13+ Quellen einschliesslich Snowflake, Databricks Unity Catalog, Oracle, SAP Datasphere und BigQuery; Fabric Databases (SQL und Cosmos DB, GA seit 18.11.2025); Purview-Integration; F2 als sehr niedrige Einstiegsstufe; sehr hohe Innovationskadenz
- **Grenzen:** an Azure und Entra ID gebunden; Semantic Models, Berichte, Pipelines und Copilot-Konfiguration sind proprietäre Artefakte; vier parallele CI/CD-Ansätze; Kapazitätsmanagement mit Throttling ist betrieblich anspruchsvoll; kein öffentlicher SLA-Wert; AI Functions noch Preview
- **Schweizer Besonderheit:** Beide Schweizer Regionen sind voll unterstützt — das ist die beste Regionslage im Feld. Gleichzeitig ist Copilot ausserhalb US und France standardmässig deaktiviert; ob Switzerland North über die EU Data Boundary automatisch freigegeben ist, war nicht abschliessend zu klären
- **Passt, wenn:** Microsoft 365 und Power BI ohnehin gesetzt sind; ein kleines Team eine breite Toolabdeckung braucht; Schweizer Datenresidenz für Datenhaltung zentral ist; Beschaffungseinfachheit zählt

### 8.4 Amazon Web Services

**Charakter:** Der granularste Baukasten. Maximale Kontrolle, maximaler Zusammenbau.

- **Abrechnung:** je SKU (Athena 5.00 USD/TB, Redshift Serverless 0.375 USD/RPU-h ab 4 RPU, Glue 0.44 USD/DPU-h, S3 ab 0.023 USD/GB/Monat); Savings Plans bis 66–72 %
- **Schweizer Region:** eu-central-2 seit 08.11.2022, 3 Availability Zones. Verfügbar: S3, S3 Tables, Athena, Redshift (alle Varianten), Glue, EMR, Lake Formation, MSK, DataZone, QuickSight, SageMaker
- **Stärken:** grösste Servicebreite und Partnerbasis; sehr feine Kostenattribution und starkes FinOps-Tooling; IAM als granularstes Berechtigungsmodell; S3 Tables auf Iceberg als formatoffene Strategie; FINMA-ISAE-3000-Type-2-Bericht; Support-Eintrittsschwelle 2026 deutlich gesenkt (Enterprise ab 5'000 statt 15'000 USD)
- **Grenzen:** Zusammenbau-Aufwand; Feature-Fragmentierung innerhalb Europas; **kein Foundation-Modell mit In-Region-Inferenz in Zürich**; Clean Rooms in Zürich nicht verfügbar; Zero-ETL nur teilweise; QuickSight funktional schlanker als Power BI; Regionsaufschlag Zürich ca. 9–13 % über Frankfurt
- **Schweizer Besonderheit:** Die AWS European Sovereign Cloud (GA 15.01.2026, Brandenburg) erwähnt die Schweiz nicht. Anwendbarkeit für Schweizer Kunden ist beim Anbieter zu klären
- **Passt, wenn:** AWS als Konzernstandard gesetzt ist; ein reifes Cloud-Engineering-Team existiert; Kostenattribution je Produkt oder Team ein Muss ist

### 8.5 Microsoft Azure (Hyperscaler-Ebene)

**Charakter:** Substrat mit der stärksten Enterprise-Verankerung in der Schweiz — und mit einem Portfolio im Umbau Richtung Fabric.

- **Abrechnung:** je SKU (Synapse dedizierter Pool DW100c 1.661 USD/h, Serverless SQL 5.50 USD/TB, Azure Databricks siehe DBU-Tabelle, alle Switzerland North)
- **Schweizer Regionen:** Switzerland North und West seit 2019, 3 Availability Zones in North
- **Stärken:** Entra ID und Microsoft-365-Integration als faktischer Enterprise-Standard in der Schweiz; Purview als Governance-Klammer über Azure und Fabric; Azure Databricks als First-Party-Dienst; Power BI als BI-Schicht; umfassendstes Souveränitätsangebot mit explizitem Schweiz-Bezug (Sovereign Public Cloud, Data Guardian, EU Data Boundary inkl. Schweiz)
- **Grenzen:** **geringste öffentliche Preistransparenz im Feld** — Analytics-Preise sind auf den offiziellen Seiten nur clientseitig sichtbar; Service-Überlappung mit Fabric erzeugt Beratungsbedarf; Synapse-Bausteine werden abgekündigt (Data Explorer, Cosmos-DB-Link, Referenzarchitektur); Region-Gaps bei KI-Diensten in Switzerland North
- **Schweizer Besonderheit:** In Switzerland North sind aktuell **keine GPT-Sprachmodelle als Standard-Deployment** verfügbar. Data Zone EU (inkl. Schweiz) ist die praktikable Option
- **Passt, wenn:** Microsoft im Haus gesetzt ist; Souveränitätsanforderungen hoch sind; bestehende Synapse- oder ADF-Landschaften weiterentwickelt werden

### 8.6 Google Cloud

**Charakter:** Die technisch reifste serverlose Analytics-Engine im Feld, mit dem kleinsten Ökosystem in der Schweiz.

- **Abrechnung:** BigQuery On-Demand 6.25 USD/TiB (erstes TiB/Monat frei) oder Editions-Slots (0.04 / 0.06 / 0.10 USD/Slot-Stunde); Storage ab ca. 16.40 USD/TiB/Monat; **kein Zürich-Aufschlag bei BigQuery**
- **Schweizer Region:** europe-west6 seit 12.03.2019, 3 Zonen. Verfügbar: BigQuery, Dataflow, Dataproc, Pub/Sub, Looker, Vertex AI Agent Engine (seit 16.12.2025)
- **Stärken:** BigQuery als betriebsfreie serverlose Engine mit dem einfachsten Einstieg; einziger Anbieter mit eigenem Frontier-Modell (Gemini 3 Pro GA); Gemini nativ in BigQuery ML; Dataplex Universal Catalog; Analytics Hub; Connected Sheets als niederschwelliger Self-Service; Assured-Workloads-Package «Switzerland Data Boundary» kostenfrei; ISO 42001 und FINMA-ISAE-3000-Bericht
- **Grenzen:** Looker ohne Listenpreis; kleineres Schweizer Partner- und Skills-Ökosystem; kein Schweizer Sovereign-Partner und kein Schweizer EKM-Partner; Zürich ohne TPU und ohne BigQuery Omni; unter «Switzerland Data Boundary» sind Gemini-Funktionen in BigQuery ausgeschlossen; häufige Produktumbenennungen
- **Schweizer Besonderheit:** Die EU-Multiregion «EU» **schliesst europe-west6 ausdrücklich aus**. Wer «EU» statt «europe-west6» wählt, landet nicht in der Schweiz — ein häufiger und teurer Konfigurationsfehler
- **Passt, wenn:** BigQuery-Einfachheit und Skalierung im Vordergrund stehen; Marketing- und Web-Analytics-Daten (GA4, Ads, YouTube) eine Rolle spielen; Gemini als Modell strategisch gesetzt ist

---

## 9. Typische Konstellationen statt Gewinner

Diese Tabelle ersetzt das Ranking. Sie ordnet Ausgangslagen Konstellationen zu — mit dem jeweiligen Preis, der dafür zu zahlen ist.

| Ausgangslage | Naheliegende Konstellation | Der Haken |
|---|---|---|
| Microsoft-365-Haus, Power BI etabliert, kleines Datenteam, Schweizer Residenz gefordert | **Azure + Fabric** (Switzerland North), Einstieg F8–F64 | Bindung an Azure und Entra ID; Semantik- und Artefakt-Lock-in; Kapazitätsmanagement muss gelernt werden; Copilot-Freigabe klären |
| Data Engineering und ML im Zentrum, offener Stack gefordert, Schweizer Residenz gefordert | **Azure + Databricks** (Switzerland North), Unity Catalog als Governance, Power BI als BI-Schicht | Auf AWS/GCP nicht regionskonform möglich; Doppelrechnung DBU plus VM; Governance-Features teils Beta; keine öffentliche Uptime-SLA |
| Konzern mit mehreren Clouds, Datenaustausch über Gesellschaftsgrenzen | **Snowflake** auf dem jeweils vorhandenen Substrat, Snowgrid für Replikation | Kein eigenes BI-Frontend; Cortex-KI in Schweizer Regionen nicht nativ; CH-Preise nur über Account-Team |
| AWS als Konzernstandard, reifes Engineering-Team, granulare Kostenattribution gefordert | **AWS-nativ**: S3 + S3 Tables + Athena + Redshift Serverless + Glue, QuickSight oder Power BI als BI | Zusammenbau-Aufwand; keine In-Region-KI-Inferenz in Zürich; Clean Rooms fehlt in Zürich |
| Schneller Einstieg, wenig Plattformbetrieb gewünscht, keine strikte CH-Residenz | **Google Cloud + BigQuery** (europe-west6), Looker Studio bzw. Power BI | Kleineres Schweizer Ökosystem; Looker-Preise intransparent; kein CH-Sovereign-Partner |
| Bestehende Synapse-Landschaft | Bestand halten, **Neuentwicklung nach Fabric**; Migrationsassistent nutzen | Kein Zeitdruck durch Retirement, aber Data Explorer und Cosmos-DB-Link sind abgekündigt; Referenzarchitektur-Doku entfällt |
| Regulierter Finanzsektor (FINMA-Perimeter) | Substrat mit FINMA-ISAE-3000-Bericht (AWS, Google) bzw. Microsoft-Vertragsbausteine; Schweizer Region; Exit-Strategie und Auditrechte vertraglich verankern | FINMA verlangt keinen Schweizer Speicherort, aber Zugriff aus der Schweiz, uneingeschränkte Prüfrechte für Institut, Prüfgesellschaft **und FINMA** sowie eine belegte Exit-Strategie. Kein Anbieter deckt FINMA allein ab — Complementary User Entity Controls sind Kundenpflicht |
| Gesundheitswesen, öffentlich-rechtliche Trägerschaft (Spital, Heim, Spitex) | Schweizer Region; Verschlüsselung mit Schlüsselhoheit; KI-Inferenz auf EU-Datenraum oder regional begrenzen; kantonales Datenschutzrecht vorab klären | Art. 321 StGB stellt nicht auf den Standort ab, sondern auf Einwilligung und Zugriffskontrolle; kantonales Recht kann strenger sein als das nDSG; EPDG-Anforderungen im Original prüfen |
| Anforderung «KI ausschliesslich in der Schweiz» | **existiert derzeit nicht mit einem aktuellen Frontier-Modell.** Realistische Alternativen: kleineres Modell mit Single-Region-Deployment, selbst betriebenes Open-Weight-Modell, oder Zielzustand «EU-Datenraum inklusive Schweiz» | Diese Anforderung sollte im Workshop früh geprüft und wenn nötig bewusst auf EU-Datenraum umformuliert werden — sonst blockiert sie das ganze Vorhaben |

---

## 10. Regulatorischer Rahmen Schweiz — was tatsächlich gilt

*Keine Rechtsberatung. Zusammenfassung öffentlich zugänglicher Quellen, Stand 20.08.2026.*

### 10.1 Datenschutzgesetz (nDSG / revDSG, in Kraft seit 01.09.2023)

- **Es gibt keine gesetzliche Pflicht zu einem Schweizer Rechenzentrumsstandort.** Das nDSG ist technologieneutral. Schweizer Datenresidenz ist eine Risikomanagement-, Reputations- und teils sektorielle Compliance-Frage — keine allgemeine nDSG-Pflicht.
- Massgebend sind vier Dinge: ein gültiger Übermittlungsmechanismus, eine Auftragsbearbeitungsregelung inklusive Sub-Prozessoren, technisch-organisatorische Massnahmen inklusive Schlüsselhoheit, und Transparenz gegenüber betroffenen Personen.
- **Bekanntgabe ins Ausland (Art. 16/17):** zulässig bei Angemessenheitsentscheid (Anhang 1 DSV, rund 40 Staaten inkl. EU/EWR und UK), über von der EDÖB anerkannte Standardvertragsklauseln (anerkannt am 27.08.2021), über Binding Corporate Rules oder in engen Ausnahmefällen.
- **USA:** kein pauschaler Angemessenheitsentscheid. Seit 15.09.2024 gilt das **Swiss-U.S. Data Privacy Framework**: Übermittlungen an beim US-Handelsministerium zertifizierte Unternehmen gelten als angemessen, ohne Zusatzgarantien. Für nicht zertifizierte Empfänger bleiben Standardvertragsklauseln plus ergänzende Massnahmen nötig. Der **CLOUD Act** bleibt unabhängig davon relevant — US-Behörden können unter Voraussetzungen Zugriff auf Daten von US-Unternehmen verlangen, unabhängig vom Speicherort.
- **DSFA (Art. 22):** Cloud-Sourcing ist kein eigener Auslöser im Gesetzestext. In der Praxis regelmässig nötig, wenn besonders schützenswerte Daten in grossem Umfang über eine neue Cloud- oder KI-Plattform bearbeitet werden, insbesondere kombiniert mit einer Auslandbekanntgabe.

### 10.2 Finanzsektor

- **FINMA-Rundschreiben 2018/3 «Outsourcing»** (in Kraft seit 01.01.2018, Teilrevision seit 01.01.2020): Wesentlichkeitsbeurteilung, aktuelles Inventar ausgelagerter Funktionen inklusive Sub-Unternehmer, uneingeschränkte Prüfrechte für Institut, Prüfgesellschaft und FINMA, gesicherte Exit-Strategie. **Kein Schweizer Speicherort vorgeschrieben**, aber der Zugriff auf aufsichtsrelevante Informationen muss jederzeit aus der Schweiz möglich sein. Cloud Computing wird im Text nicht explizit genannt — das Rundschreiben gilt technologieneutral.
- **FINMA-Rundschreiben 2023/1 «Operationelle Risiken und Resilienz»** (seit 01.01.2024): erweitert die ICT-Risikosteuerung, führt Anforderungen zum Management kritischer Daten über den gesamten Lebenszyklus ein, verlangt Governance-Verantwortung auf Verwaltungsrats- und Geschäftsleitungsebene. Ergänzt RS 2018/3, ersetzt es nicht.
- **SBA Cloud Guidelines 2025** (aktualisiert 04.11.2025, dritte Fassung): präzisiert «foreign lawful access» und den risikobasierten Ansatz; vier Themenfelder Governance, Datenbearbeitung, Behörden/Verfahren, Prüfung/Audit.
- **Bankkundengeheimnis (Art. 47 BankG):** verbietet Cloud-Sourcing nicht per se. Rechtsgutachten im Auftrag der SBVg (2019) bestätigen die Zulässigkeit auch für Clouds im Ausland bei angemessenen technischen und organisatorischen Massnahmen.
- **DORA** (EU, anwendbar seit 17.01.2025) gilt nicht direkt für Schweizer Institute ohne EU-Marktzugang, kann aber mittelbar über EU-Einheiten wirken.

### 10.3 Gesundheitswesen

- **Art. 321 StGB (Berufsgeheimnis):** Nach dem vielzitierten Gutachten Wohlers kann die Weitergabe an Hilfspersonen — einschliesslich Cloud-Anbieter — auch ohne Zweckentfremdung eine Verletzung darstellen. Erforderlich ist eine vorgängige, hinreichend bestimmte Einwilligung, oder die Weitergabe muss für die Aufgabenerfüllung unerlässlich und für die geheimnisberechtigte Person vorhersehbar sein. **Der Standort ist nach dieser Auffassung nicht das entscheidende Kriterium** — entscheidend sind Zugriffskontrolle und Einwilligungsbasis. Ein späteres Urteil des Bezirksgerichts Zürich soll weniger restriktiv ausgelegt haben; die Rechtslage ist nicht abschliessend gefestigt.
- **EPDG / EPDV-EDI:** eine explizite gesetzliche Pflicht zu ausschliesslich schweizerischem Hosting liess sich in den frei zugänglichen Materialien nicht verifizieren; in der Praxis der zertifizierten Stammgemeinschaften ist Schweizer Hosting faktischer Standard. Die Verordnung ist im Original zu konsultieren.
- **Kantonales Recht:** Öffentlich-rechtlich organisierte Spitäler, Heime und Spitex-Organisationen können kantonalem statt Bundesdatenschutzrecht unterstehen, mit abweichenden Anforderungen an Auftragsbearbeitung und Auslandbekanntgabe. Im Einzelfall zu prüfen.

### 10.4 Öffentlicher Sektor

- **Beschaffung:** BöB (Bund, revidiert 2021) und IVöB (Kantone, 2019) verlangen wettbewerbliche, diskriminierungsfreie Verfahren mit anbieterneutralen technischen Spezifikationen. Datenschutz- und Informationssicherheitsrisiken sind als Eignungs- und Zuschlagskriterien zulässig.
- **Rechtsrahmen der Bundeskanzlei (31.08.2022):** Cloud-Dienste schweizerischer oder ausländischer Herkunft sind zulässig; bei ausländischem Standort gelten die nDSG-Regeln, für die USA zusätzlich vertragliche Absicherung und Verschlüsselung. Bevorzugt werden Modelle, bei denen der Anbieter keinen Klartextzugriff hat (BYOK / Hold-Your-Own-Key), vertragliche Bindung an Schweizer Recht und Gerichtsstand sowie Audit- und Meldepflichten.
- **Swiss Government Cloud:** Bundesprogramm 2025–2032, Verpflichtungskredit CHF 246.9 Mio., Gesamtkosten bis 2032 CHF 319.4 Mio.; dreistufiges Modell aus Hyperscaler-Diensten, Schweizer Public-Cloud-Angeboten und einer BIT-Private-Cloud. Produktive Fähigkeiten werden **ab 2027** erwartet; die Eidgenössische Finanzkontrolle prüfte das Programm im Dezember 2025.

### 10.5 Schweizer Alternativanbieter — realistische Einordnung

Swisscom, Exoscale, Infomaniak, Green, Safe Swiss Cloud, VSHN und Nine sind im IaaS-, Hosting- und Managed-Kubernetes-Segment positioniert. Für die hier verglichenen Datenplattformen existiert **keine funktionale 1:1-Alternative** unter diesen Anbietern. Swisscom hat 2024 eine «Swiss AI Platform» lanciert und gemeinsam mit NVIDIA eine «Trusted AI Factory» angekündigt (ein kolportiertes Investitionsvolumen von CHF 100 Mio. war nicht über eine Primärquelle verifizierbar). Ob ein Schweizer Anbieter ein souveränes Sprachmodell in Enterprise-Reife anbietet, liess sich nicht verifizieren.

---

## 11. Marktkontext (datiert)

| Kennzahl | Wert | Stand / Quelle |
|---|---|---|
| Microsoft Azure, «Azure and other cloud services» | +43 % gegenüber Vorjahr | Q4 FY2026 (per 30.06.2026), gemeldet 29.07.2026 |
| AWS | 42.2 Mrd. USD Umsatz, +37 % | Q2 2026, gemeldet 30.07.2026 |
| Google Cloud | 24.8 Mrd. USD Umsatz, +82 % | Q2 2026, gemeldet 22.07.2026 |
| Snowflake | 1.39 Mrd. USD Gesamtumsatz, Produktumsatz +34 %, Net Revenue Retention 126 % | Q1 FY2027 (per 30.04.2026), gemeldet 27.05.2026 |
| Databricks | über 7 Mrd. USD Umsatz-Run-Rate, über 80 % Wachstum; Bewertung 188 Mrd. USD | Eigenangaben, 13.08.2026 bzw. 16.07.2026 — nicht testiert |
| Gartner Magic Quadrant Analytics and BI Platforms 2025 | Leader: Microsoft, Salesforce (Tableau), Google, Qlik, Oracle, ThoughtSpot | publiziert 25.06.2025 |
| Gartner Magic Quadrant Cloud DBMS 2025 | Databricks zum fünften Mal in Folge Leader (Eigenaussage). **Vollständige Leader-Liste nicht frei verifizierbar** | publiziert 21.11.2025 |

Wichtige Bewegungen 2025/2026: Databricks kauft Neon (ca. 1 Mrd. USD, Mai 2025), Snowflake kauft Crunchy Data (ca. 250 Mio. USD, Juni 2025), Snowflake kauft Natoma (MCP-Governance, Mai 2026), Microsoft und Databricks bauen die OneLake-Interoperabilität aus, dbt Labs und Fivetran kündigen einen Zusammenschluss an.

---

## 12. Prüfaufträge vor jeder Kundenentscheidung

Diese Liste ist der operative Teil des Assets. Sie gehört in jeden Workshop.

1. **Preise live gegenprüfen.** Alle Zahlen in diesem Dokument sind Listenpreise vom 20.08.2026. Vor jeder Offerte im Preisrechner der Zielregion nachrechnen — insbesondere bei Azure und Snowflake, wo CH-Preise nicht öffentlich sind.
2. **Regionsverfügbarkeit im Portal verifizieren.** Analytics- und KI-Dienste in Switzerland North / eu-central-2 / europe-west6 einzeln bestätigen. Für Azure existiert keine statisch auslesbare Produkt-Region-Matrix.
3. **Ort der KI-Inferenz explizit festlegen und dokumentieren.** Deployment-Typ (Azure), Inference-Profil (AWS), `CORTEX_ENABLED_CROSS_REGION` (Snowflake), Cross-Geo-Toggle (Fabric, Databricks) — jeweils bewusst setzen, nicht dem Default überlassen.
4. **Anforderung «nur Schweiz» auf Belastbarkeit prüfen.** Ist sie regulatorisch begründet oder Gewohnheit? Wenn begründet: für welche Datenkategorie genau, und gilt sie auch für transiente Inferenz-Payloads?
5. **Gesamtkosten inklusive Substrat rechnen.** Bei Databricks DBU plus VM plus Storage. Bei Fabric Kapazität plus Power-BI-Lizenzen unter F64 plus OneLake. Bei Snowflake Credits plus Storage plus BI-Werkzeug.
6. **Exit-Szenario konkret durchspielen.** Welches Tabellenformat, welcher Katalog, welche Semantikschicht, welche Vertragslaufzeit? Für FINMA-Perimeter ist eine belegte Exit-Strategie Pflicht.
7. **Skills und Betriebsmodell realistisch bewerten.** Wer betreibt Kapazitäts- oder Cluster-Management, Governance-Modell, FinOps und Change-Monitoring? Bei allen sechs Anbietern ändern sich Features monatlich.
8. **Change-Monitoring einrichten.** Snowflake Behaviour Change Bundles, Fabric Release Plan, Databricks Release Notes, Azure Updates, AWS What's New, Google Release Notes — mit benannter Verantwortung.
9. **Vertragliche Punkte klären:** Gilt die Egress-Waiver-Zusage für Schweizer Verträge? Sind Auditrechte für Prüfgesellschaft und FINMA vereinbart? Ist Sub-Prozessor-Transparenz geregelt? Ist Schweizer Recht und Gerichtsstand vereinbart?

---

## 13. Transparenz: was nicht verifizierbar war

Diese Liste gehört zum Asset. Sie schützt vor Zahlen, die in einer Kundenpräsentation nicht haltbar sind.

| Thema | Status |
|---|---|
| Snowflake Credit- und Storage-Preise für AWS eu-central-2, Azure Switzerland North, GCP europe-west6 | nicht öffentlich verifizierbar — Preisrechner rendert erst nach Regionsauswahl |
| Snowflake Cortex Tokenpreise je Modell | nicht öffentlich verifizierbar — nur im Consumption-Table-PDF |
| Databricks DBU-Listenpreise für AWS und Google Cloud | nicht öffentlich verifizierbar — nur clientseitiger Rechner |
| Databricks Vector-Search-Preis auf Azure | kein separater Meter in der Retail Prices API auffindbar |
| Databricks Plattform-Uptime-SLA | nicht öffentlich publiziert |
| Microsoft Fabric SLA-Prozentsatz | nicht öffentlich verifizierbar |
| Power BI Premium Per User Listenpreis | nicht programmatisch aus der offiziellen Seite auslesbar |
| Azure: ADLS-Tier-Preise, ADF, Event Hubs, Stream Analytics, Purview-Beträge, Log-Analytics-Ingestion, Azure-OpenAI-Tokenpreise, PTU-Preis, AI-Search-Tiers | nicht öffentlich verifizierbar — Beträge nur clientseitig gerendert |
| Azure: Verfügbarkeitsmatrix Analytics-/KI-Dienste in Switzerland North | nicht statisch verifizierbar — nur interaktives Portal |
| AWS: S3- und Transferpreise für eu-central-2, Redshift-RA3-Preise Zürich, EMR-Serverless-Tabelle, Tokenpreise Claude Opus 5 / Sonnet 5 / Nova, Bedrock-PTU, Redshift-RI-Rabatte | nicht öffentlich verifizierbar |
| Google: Looker-Plattformpreise, Looker Studio Pro pro Nutzer, Agent-Engine-SKU, vollständige Gemini-Modellliste für europe-west6 | nicht öffentlich verifizierbar |
| Gartner Cloud DBMS 2025 vollständige Leader-Liste; Forrester-Wave-Platzierungen | kostenpflichtig, nicht frei verifizierbar |
| Skills-Verfügbarkeit je Plattform in der Schweiz | keine belastbare Studie gefunden — alle Aussagen sind Markteinschätzung |
| Gültigkeit der Egress-Waiver-Zusagen für rein schweizerische Verträge | vertraglich zu prüfen |
| Anwendbarkeit der AWS European Sovereign Cloud auf Schweizer Kunden | in der Ankündigung nicht adressiert |
| Fabric Copilot: automatische Freigabe für Switzerland North über die EU Data Boundary | Widerspruch zwischen allgemeiner EUDB-Definition und Copilot-Admin-Doku nicht auflösbar |
| EPDG/EPDV-EDI Hosting-Anforderungen im Original; kantonales Gesundheitsdatenrecht | nicht systematisch verifizierbar |

---

## 14. Quellen

Alle Quellen abgerufen am 20. August 2026.

**Snowflake:** snowflake.com/pricing · «The Simple Guide to Snowflake Pricing» (PDF) · Snowflake Service Consumption Table (PDF) · docs.snowflake.com (Cortex Pricing, AISQL Regional Availability, Cross-Region Inference, Cortex Agents MCP, intro-regions, intro-editions, intro-compliance, Behavior Change Policy, BCR 2026_06) · snowflake.com Blog (Cross-Region AI Inference and Data Sovereignty, Adaptive Compute, SLA Commitment)

**Databricks:** azure.microsoft.com/pricing/details/databricks · Azure Retail Prices API (switzerlandnorth, switzerlandwest, westeurope) · docs.databricks.com (Supported Regions AWS/GCP/Azure, Feature Region Support, Databricks Geos, Foundation Model APIs Supported Models, Serverless Network Security, PrivateLink, MCP) · learn.microsoft.com/azure/databricks (Security Profile, Retired Models Policy, Supported Regions) · databricks.com (Trust & Compliance, Support, Blog zu Agent Bricks Supervisor Agent GA und Lakebase GA, Unity Catalog OSS)

**Microsoft Fabric:** learn.microsoft.com/fabric (licenses, region availability, find-fabric-home-region, pause-resume, throttling, surge protection, burstable capacity, autoscale billing for Spark, copilot-fabric-overview, copilot-faq-fabric, service-admin-portal-copilot, concept-data-agent, ai-functions, mirroring overview, mirroring azure-databricks, governance-compliance-overview, standards-compliance, workspace-customer-managed-keys, security-private-links-overview, cicd/manage-deployment, release-plan) · Azure Retail Prices API (Microsoft Fabric, switzerlandnorth) · powerbi.microsoft.com/pricing · community.fabric.microsoft.com (Copilot for all paid SKUs, Fabric Databases GA, Mirroring GA, Fabric CLI GA, OneLake Iceberg support, Workspace monitoring billing) · learn.microsoft.com/privacy/eudb

**AWS:** aws.amazon.com/pricing (s3, athena, redshift, glue, emr, kinesis, msk, lake-formation, sagemaker, quicksight, clean-rooms, kms, privatelink, bedrock, q, premiumsupport, savingsplans) · docs.aws.amazon.com (bedrock models-region-compatibility, general/latest/gr endpoint tables, redshift zero-etl regions, datazone upgrade-domain, awssupport support-plans-eos) · aws.amazon.com/compliance (programs, finma) · aws.amazon.com/redshift/sla · AWS News Blog «A New AWS Region Opens in Switzerland» · press.aboutamazon.com (European Sovereign Cloud, 15.01.2026) · aws.amazon.com/blogs/alps (Cross-Region Inference Switzerland, 21.10.2025)

**Microsoft Azure:** Azure Retail Prices API (switzerlandnorth: Azure Databricks, Synapse Dedicated und Serverless SQL Pool) · azure.microsoft.com/pricing (storage/data-lake, data-factory, purview, monitor) · learn.microsoft.com (foundry deployment-types, azure/compliance, azure-sovereign-clouds, privacy/eudb, search sku-tier, synapse lifecycle, Q&A zu GPT-Deployments in Switzerland North) · news.microsoft.com/source/emea (Digital sovereignty in Switzerland, 25.02.2026) · blogs.microsoft.com (Sovereign Solutions, 16.06.2025)

**Google Cloud:** cloud.google.com/bigquery/pricing · cloud.google.com/storage/pricing · cloud.google.com/vpc/network-pricing · cloud.google.com/looker/pricing · cloud.google.com/vertex-ai/generative-ai/pricing · cloud.google.com/generative-ai-app-builder/pricing · cloud.google.com/products/gemini/pricing · cloud.google.com/products/agentspace · docs.cloud.google.com (bigquery locations, lakehouse catalogs, vertex-ai release notes, tpu regions-zones, assured-workloads switzerland-data-boundary, rag-engine-billing) · cloud.google.com/compliance · cloud.google.com/security/compliance/finma-switzerland · cloud.google.com/bigquery/sla · cloud.google.com/support · cloud.google.com/exit-cloud · cloud.google.com/sovereign-cloud · Google Cloud Blog (Managed GDC Provider Initiative, Eliminating data transfer fees)

**Schweizer Rechtsrahmen:** Fedlex SR 235.1 (DSG), SR 235.11 (DSV Anhang 1) · edoeb.admin.ch (Bekanntgabe ins Ausland, SCC-Anerkennung 27.08.2021, DSFA) · admin.ch Medienmitteilung Bundesrat 14.08.2024 (Swiss-U.S. DPF) · finma.ch (RS 2018/3 Medienmitteilung 05.12.2017) · KPMG FINMA Circular 2018-03 (PDF) · swissbanking.ch (Cloud Guidelines 2025, Gutachten Bankkundengeheimnis) · datenrecht.ch (Gutachten Wohlers zu Art. 321 StGB) · e-health-suisse.ch (Rechtliche Grundlagen EPD) · bk.admin.ch (Rechtlicher Rahmen Public Cloud Bundesverwaltung, 31.08.2022) · bit.admin.ch (Swiss Government Cloud) · efk.admin.ch (SGC-Prüfung)

**Markt und Finanzen:** microsoft.com/investor (FY26 Q4) · aboutamazon.com (Q2 2026) · abc.xyz Alphabet Q2 2026 Earnings Release · businesswire.com (Snowflake Q1 FY2027) · databricks.com/company/newsroom (Run-Rate 13.08.2026, Bewertung 16.07.2026) · TechCrunch (Databricks/Neon) · CNBC (Snowflake/Crunchy Data)

Sekundärquellen, ausdrücklich als solche verwendet: CloudZero, Flexera, DoiT, Mammoth, Finout (Kostenfallen und Richtwerte) · tecRacer und Holori (AWS-Regionsaufschlag) · Vantage instances.sh (Redshift-RA3-Preise) · Atlan (Snowflake Summit 2026 Recap) · Glassdoor und Adecco (Skills, Momentaufnahme)
