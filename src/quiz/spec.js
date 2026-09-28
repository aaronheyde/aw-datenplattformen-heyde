/**
 * Verbindliche Quiz-Spezifikation — 1:1 aus content/quiz-spec.md, Kostenzeilen aus
 * Kapitel 3.2 des Vergleichs. Portiert aus work/quiz.py; Texte sind wortgleich.
 * Diese Datei wird nicht generiert, sie ist Quelle.
 */

export const STAND = "Stand: 20. August 2026";

export const STAND_TAG = "Listenpreis, Stand 20.08.2026";

export const FRAMING = "Diese Empfehlung gilt für das oben protokollierte Anforderungsprofil, nicht als generelle Rangfolge der Plattformen. Der Vergleich selbst vergibt bewusst keinen Sieger.";

export const PRICE_CLOSING = "Reale Kundenpreise entstehen aus Verbrauch mal Einheitenpreis, minus verhandelter Rabatte. Listenpreise sind der Startpunkt einer Verhandlung, nicht das Ergebnis.";

/** Die acht Konstellationen (Spezifikation Abschnitt 2). */
export const CONSTELLATIONS = [
  {
    "id": "K1",
    "name": "Azure + Microsoft Fabric",
    "desc": "Fabric-Kapazität in Switzerland North, Power BI als BI-Schicht, OneLake als Speicher",
    "risk": "Bindung an Azure und Entra ID; Semantik- und Artefakt-Lock-in; Kapazitätsmanagement mit Throttling muss gelernt werden; Copilot-Freigabe für Switzerland North klären"
  },
  {
    "id": "K2",
    "name": "Azure + Databricks",
    "desc": "Databricks-Workspace in Switzerland North, Unity Catalog als Governance, Power BI als BI-Schicht",
    "risk": "Doppelrechnung DBU plus VM; zentrale Governance-Features teils Beta; keine öffentliche Uptime-SLA; Standard-Tier endet 01.10.2026"
  },
  {
    "id": "K3",
    "name": "Azure + Databricks + Fabric",
    "desc": "Databricks für Engineering und ML, Fabric für BI und Self-Service, verbunden über Unity-Catalog-Mirroring nach OneLake",
    "risk": "Zwei Plattformen, zwei Kostenmodelle, zwei Betriebsmodelle; Mirroring ist rein metadatenbasiert und schliesst materialisierte Views, Streaming-Tabellen und Nicht-Delta-External-Tables aus"
  },
  {
    "id": "K4",
    "name": "Azure + Snowflake",
    "desc": "Snowflake-Account in Azure Switzerland North, Power BI als BI-Schicht",
    "risk": "Kein eigenes BI-Frontend; Cortex-KI in Schweizer Regionen nicht nativ; CH-Preise nur über das Account-Team"
  },
  {
    "id": "K5",
    "name": "AWS + Snowflake",
    "desc": "Snowflake-Account in AWS eu-central-2, Power BI oder Tableau als BI-Schicht",
    "risk": "Wie K4, zusätzlich Regionsaufschlag Zürich von rund 9 bis 13 Prozent gegenüber Frankfurt"
  },
  {
    "id": "K6",
    "name": "AWS-nativ",
    "desc": "S3 und S3 Tables als Lake, Athena und Redshift Serverless als Engines, Glue für ETL, QuickSight oder Power BI als BI-Schicht",
    "risk": "Zusammenbau-Aufwand; keine In-Region-KI-Inferenz in Zürich; Clean Rooms in eu-central-2 nicht verfügbar; verlangt ein reifes Cloud-Engineering-Team"
  },
  {
    "id": "K7",
    "name": "Google Cloud nativ",
    "desc": "BigQuery in europe-west6, Dataplex als Katalog, Looker oder Power BI als BI-Schicht",
    "risk": "Kleineres Schweizer Partner- und Skills-Ökosystem; Looker ohne Listenpreis; kein Schweizer Sovereign- und kein Schweizer EKM-Partner; Zürich ohne TPU und ohne BigQuery Omni"
  },
  {
    "id": "K8",
    "name": "AWS oder Google Cloud + Databricks in EU-Region",
    "desc": "Databricks-Workspace in Frankfurt statt in der Schweiz, weil auf diesen Substraten keine Schweizer Region existiert",
    "risk": "Datenverarbeitung liegt in der EU, nicht in der Schweiz — für nDSG in der Regel tragfähig, für strenge FINMA- oder Berufsgeheimnis-Anforderungen gesondert zu prüfen"
  }
];

/** Vier Fragebloecke (Spezifikation Abschnitt 3). */
export const BLOCKS = [
  {
    "letter": "A",
    "title": "Rahmenbedingungen",
    "qs": [
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6"
    ]
  },
  {
    "letter": "B",
    "title": "Workload und Fachlichkeit",
    "qs": [
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
      "F13",
      "F14"
    ]
  },
  {
    "letter": "C",
    "title": "Organisation",
    "qs": [
      "F15",
      "F16",
      "F17",
      "F18"
    ]
  },
  {
    "letter": "D",
    "title": "Kommerz und Portabilität",
    "qs": [
      "F19",
      "F20"
    ]
  }
];

/** Die 20 Fragen mit Antwortoptionen. */
export const QUESTIONS = [
  {
    "id": "F1",
    "text": "Ist ein Cloud-Substrat im Unternehmen bereits gesetzt?",
    "opts": [
      {
        "k": "a",
        "t": "Microsoft Azure"
      },
      {
        "k": "b",
        "t": "Amazon Web Services"
      },
      {
        "k": "c",
        "t": "Google Cloud"
      },
      {
        "k": "d",
        "t": "Noch offen"
      }
    ]
  },
  {
    "id": "F2",
    "text": "Müssen die Daten physisch in der Schweiz liegen?",
    "opts": [
      {
        "k": "a",
        "t": "Ja, zwingend"
      },
      {
        "k": "b",
        "t": "EU-Datenraum inklusive Schweiz genügt"
      },
      {
        "k": "c",
        "t": "Keine besondere Anforderung"
      }
    ]
  },
  {
    "id": "F3",
    "text": "Muss die KI-Inferenz, also die Verarbeitung von Prompts und Kontextdaten, demselben Residenzanspruch genügen?",
    "opts": [
      {
        "k": "a",
        "t": "Ja, gleich streng wie die Datenhaltung"
      },
      {
        "k": "b",
        "t": "EU-Datenraum genügt"
      },
      {
        "k": "c",
        "t": "Kein KI-Einsatz geplant"
      }
    ]
  },
  {
    "id": "F4",
    "text": "Ist Multi-Cloud-Fähigkeit gefordert?",
    "opts": [
      {
        "k": "a",
        "t": "Ja, mehrere Clouds parallel im Betrieb"
      },
      {
        "k": "b",
        "t": "Nicht heute, soll aber möglich bleiben"
      },
      {
        "k": "c",
        "t": "Nein"
      }
    ]
  },
  {
    "id": "F5",
    "text": "In welchem regulatorischen Perimeter bewegt sich der Kunde?",
    "opts": [
      {
        "k": "a",
        "t": "FINMA, also Bank, Versicherung oder Wertpapierhaus"
      },
      {
        "k": "b",
        "t": "Gesundheitswesen oder öffentlich-rechtliche Trägerschaft"
      },
      {
        "k": "c",
        "t": "Öffentliche Verwaltung"
      },
      {
        "k": "d",
        "t": "Keiner der genannten"
      }
    ]
  },
  {
    "id": "F6",
    "text": "Ist Microsoft 365 mit Entra ID der Identitäts- und Arbeitsplatzstandard?",
    "opts": [
      {
        "k": "a",
        "t": "Ja, durchgängig"
      },
      {
        "k": "b",
        "t": "Teilweise"
      },
      {
        "k": "c",
        "t": "Nein"
      }
    ]
  },
  {
    "id": "F7",
    "text": "Wo liegt der Schwerpunkt der Workloads?",
    "opts": [
      {
        "k": "a",
        "t": "BI und Reporting"
      },
      {
        "k": "b",
        "t": "Data Engineering und ETL"
      },
      {
        "k": "c",
        "t": "Machine Learning und Data Science"
      },
      {
        "k": "d",
        "t": "Gemischt, ohne klaren Schwerpunkt"
      }
    ]
  },
  {
    "id": "F8",
    "text": "Welche Rolle spielt Streaming beziehungsweise Real-Time?",
    "opts": [
      {
        "k": "a",
        "t": "Kernanforderung"
      },
      {
        "k": "b",
        "t": "Punktuell"
      },
      {
        "k": "c",
        "t": "Nicht relevant"
      }
    ]
  },
  {
    "id": "F9",
    "text": "Ist Datenaustausch mit Dritten — Partnern, Kunden, Konzerngesellschaften — ein Kernanwendungsfall?",
    "opts": [
      {
        "k": "a",
        "t": "Ja, zentral"
      },
      {
        "k": "b",
        "t": "Gelegentlich"
      },
      {
        "k": "c",
        "t": "Nein"
      }
    ]
  },
  {
    "id": "F10",
    "text": "Welche BI-Schicht ist gesetzt?",
    "opts": [
      {
        "k": "a",
        "t": "Power BI"
      },
      {
        "k": "b",
        "t": "Tableau oder Qlik"
      },
      {
        "k": "c",
        "t": "Looker"
      },
      {
        "k": "d",
        "t": "Noch offen"
      }
    ]
  },
  {
    "id": "F11",
    "text": "Gibt es eine bestehende Plattform, die abgelöst oder weitergeführt wird?",
    "opts": [
      {
        "k": "a",
        "t": "Azure Synapse Analytics"
      },
      {
        "k": "b",
        "t": "Ein SQL-Server-Data-Warehouse on premises"
      },
      {
        "k": "c",
        "t": "Qlik"
      },
      {
        "k": "d",
        "t": "Keine relevante Vorgeschichte"
      }
    ]
  },
  {
    "id": "F12",
    "text": "Wie viele Datenquellen sind anzubinden?",
    "opts": [
      {
        "k": "a",
        "t": "Bis 10"
      },
      {
        "k": "b",
        "t": "10 bis 50"
      },
      {
        "k": "c",
        "t": "Über 50"
      }
    ]
  },
  {
    "id": "F13",
    "text": "Werden operative Datenbanken, also OLTP-Workloads, auf derselben Plattform erwartet?",
    "opts": [
      {
        "k": "a",
        "t": "Ja"
      },
      {
        "k": "b",
        "t": "Nein"
      }
    ]
  },
  {
    "id": "F14",
    "text": "Wie relevant sind Notebooks und Python-Entwicklung für das Team?",
    "opts": [
      {
        "k": "a",
        "t": "Zentral"
      },
      {
        "k": "b",
        "t": "Gelegentlich"
      },
      {
        "k": "c",
        "t": "Nicht relevant"
      }
    ]
  },
  {
    "id": "F15",
    "text": "Wie gross wird das künftige Plattform- und Datenteam?",
    "opts": [
      {
        "k": "a",
        "t": "Unter 3 Personen"
      },
      {
        "k": "b",
        "t": "3 bis 10 Personen"
      },
      {
        "k": "c",
        "t": "Über 10 Personen"
      }
    ]
  },
  {
    "id": "F16",
    "text": "Welche Betriebstiefe ist gewünscht?",
    "opts": [
      {
        "k": "a",
        "t": "Möglichst SaaS, so wenig Plattformbetrieb wie möglich"
      },
      {
        "k": "b",
        "t": "Bewusst eigene Kontrolle über Infrastruktur und Konfiguration"
      }
    ]
  },
  {
    "id": "F17",
    "text": "Wie viel Vorerfahrung mit Spark, Python und Data Engineering ist im Team vorhanden?",
    "opts": [
      {
        "k": "a",
        "t": "Belastbar vorhanden"
      },
      {
        "k": "b",
        "t": "Im Aufbau"
      },
      {
        "k": "c",
        "t": "Keine"
      }
    ]
  },
  {
    "id": "F18",
    "text": "Bis wann soll produktiv geliefert werden?",
    "opts": [
      {
        "k": "a",
        "t": "Unter 3 Monaten"
      },
      {
        "k": "b",
        "t": "3 bis 9 Monate"
      },
      {
        "k": "c",
        "t": "Über 9 Monate"
      }
    ]
  },
  {
    "id": "F19",
    "text": "Was ist wichtiger: planbare Fixkosten oder verbrauchsgenaue Abrechnung?",
    "opts": [
      {
        "k": "a",
        "t": "Planbare Fixkosten"
      },
      {
        "k": "b",
        "t": "Verbrauchsgenaue Abrechnung"
      },
      {
        "k": "c",
        "t": "Verursachergerechte Zuordnung je Team oder Produkt ist zwingend"
      }
    ]
  },
  {
    "id": "F20",
    "text": "Wie hoch ist der Anspruch an Exit-Fähigkeit und offene Formate?",
    "opts": [
      {
        "k": "a",
        "t": "Hoch, vertraglich relevant"
      },
      {
        "k": "b",
        "t": "Mittel"
      },
      {
        "k": "c",
        "t": "Gering"
      }
    ]
  }
];

/** Harte Ausschlussregeln E1 bis E10 (Abschnitt 4). */
export const EXCLUSIONS = [
  {
    "id": "E1",
    "cond": [
      [
        "F1",
        "b"
      ]
    ],
    "kill": [
      "K1",
      "K3"
    ],
    "reason": "Microsoft Fabric läuft ausschliesslich auf Azure."
  },
  {
    "id": "E2",
    "cond": [
      [
        "F1",
        "c"
      ]
    ],
    "kill": [
      "K1",
      "K3"
    ],
    "reason": "Microsoft Fabric läuft ausschliesslich auf Azure."
  },
  {
    "id": "E3",
    "cond": [
      [
        "F1",
        "c"
      ]
    ],
    "kill": [
      "K4",
      "K5"
    ],
    "reason": "Snowflake hat keine Schweizer Region auf Google Cloud; auf GCP-Substrat wäre nur eine EU-Region möglich."
  },
  {
    "id": "E4",
    "cond": [
      [
        "F4",
        "a"
      ]
    ],
    "kill": [
      "K1",
      "K3"
    ],
    "reason": "Fabric ist nicht cloud-portabel und kann eine Multi-Cloud-Anforderung nicht erfüllen."
  },
  {
    "id": "E5",
    "cond": [
      [
        "F1",
        "b"
      ],
      [
        "F2",
        "a"
      ]
    ],
    "kill": [
      "K2",
      "K3",
      "K8"
    ],
    "reason": "Databricks hat keine Region in AWS eu-central-2; eine Verarbeitung in der Schweiz ist auf AWS-Substrat nicht möglich."
  },
  {
    "id": "E6",
    "cond": [
      [
        "F1",
        "c"
      ],
      [
        "F2",
        "a"
      ]
    ],
    "kill": [
      "K2",
      "K3",
      "K8"
    ],
    "reason": "Databricks hat keine Region in Google Cloud europe-west6; eine Verarbeitung in der Schweiz ist auf GCP-Substrat nicht möglich."
  },
  {
    "id": "E7",
    "cond": [
      [
        "F1",
        "a"
      ]
    ],
    "kill": [
      "K5",
      "K6",
      "K7",
      "K8"
    ],
    "reason": "Das gesetzte Substrat ist Azure; Konstellationen auf AWS- oder Google-Cloud-Substrat sind damit ausgeschlossen."
  },
  {
    "id": "E8",
    "cond": [
      [
        "F1",
        "b"
      ]
    ],
    "kill": [
      "K1",
      "K2",
      "K3",
      "K4",
      "K7"
    ],
    "reason": "Das gesetzte Substrat ist AWS; Konstellationen auf Azure- oder Google-Cloud-Substrat sind damit ausgeschlossen."
  },
  {
    "id": "E9",
    "cond": [
      [
        "F1",
        "c"
      ]
    ],
    "kill": [
      "K1",
      "K2",
      "K3",
      "K4",
      "K5",
      "K6"
    ],
    "reason": "Das gesetzte Substrat ist Google Cloud; Konstellationen auf Azure- oder AWS-Substrat sind damit ausgeschlossen."
  },
  {
    "id": "E10",
    "cond": [
      [
        "F2",
        "a"
      ]
    ],
    "kill": [
      "K8"
    ],
    "reason": "K8 verarbeitet bewusst in einer EU-Region und erfüllt eine zwingende Schweizer Datenresidenz nicht."
  }
];

/** Warnhinweise W1 bis W5 (Abschnitt 4). */
export const WARNINGS = [
  {
    "id": "W1",
    "cond": [
      [
        "F2",
        "a"
      ],
      [
        "F3",
        "a"
      ]
    ],
    "strong": true,
    "head": "Diese Anforderungskombination ist mit einem aktuellen Frontier-Modell derzeit von keiner der sechs Plattformen erfüllbar.",
    "body": "In Switzerland North stehen aktuell keine GPT-Sprachmodelle als Regional-Deployment bereit, für kein Bedrock-Modell ist eu-central-2 als «In-Region» gelistet, und Snowflake Cortex ist in den Schweizer Regionen nicht nativ verfügbar. Realistische Wege: ein kleineres Modell mit Single-Region-Deployment, ein selbst betriebenes Open-Weight-Modell, oder der bewusste Zielzustand «EU-Datenraum inklusive Schweiz». Diese Anforderung sollte im Workshop früh geprüft und wenn nötig umformuliert werden."
  },
  {
    "id": "W2",
    "cond": [
      [
        "F5",
        "a"
      ]
    ],
    "strong": false,
    "head": "",
    "body": "FINMA verlangt keinen Schweizer Speicherort, aber Zugriff auf aufsichtsrelevante Informationen jederzeit aus der Schweiz, uneingeschränkte Prüfrechte für Institut, Prüfgesellschaft und FINMA sowie eine belegte Exit-Strategie. Kein Anbieter deckt FINMA allein ab; die Complementary User Entity Controls sind Kundenpflicht."
  },
  {
    "id": "W3",
    "cond": [
      [
        "F5",
        "b"
      ]
    ],
    "strong": false,
    "head": "",
    "body": "Art. 321 StGB stellt nicht auf den Standort ab, sondern auf Einwilligung und Zugriffskontrolle. Bei öffentlich-rechtlicher Trägerschaft kann kantonales Datenschutzrecht statt des nDSG gelten, mit abweichenden Anforderungen. Vorab klären."
  },
  {
    "id": "W4",
    "cond": [
      [
        "F5",
        "c"
      ]
    ],
    "strong": false,
    "head": "",
    "body": "Beschaffung nach BöB beziehungsweise IVöB verlangt ein wettbewerbliches Verfahren mit anbieterneutralen Spezifikationen. Der Rechtsrahmen der Bundeskanzlei bevorzugt Modelle ohne Klartextzugriff des Anbieters sowie Schweizer Recht und Gerichtsstand. Die Swiss Government Cloud wird produktiv erst ab 2027 erwartet."
  },
  {
    "id": "W5",
    "cond": [
      [
        "F1",
        "d"
      ]
    ],
    "strong": false,
    "head": "",
    "body": "Das Substrat ist noch nicht gesetzt. Die Empfehlung ist damit weniger belastbar als bei gesetztem Substrat — die Substratwahl sollte vor der Plattformwahl entschieden werden, weil sie über Regionsverfügbarkeit und Identitätsbindung mitentscheidet."
  }
];

/** Punkte-Regeln P01 bis P37 (Abschnitt 5). */
export const POINTS = [
  {
    "id": "P01",
    "cond": [
      [
        "F6",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K3": 2,
      "K2": 1,
      "K4": 1
    },
    "reason": "Microsoft 365 und Entra ID sind durchgängig gesetzt, was die Microsoft-nahen Konstellationen organisatorisch begünstigt."
  },
  {
    "id": "P02",
    "cond": [
      [
        "F10",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K3": 2,
      "K2": 1,
      "K4": 1
    },
    "reason": "Power BI ist als BI-Schicht gesetzt; Fabric liefert sie mit Direct Lake nativ, die übrigen Konstellationen binden sie als Fremdprodukt an."
  },
  {
    "id": "P03",
    "cond": [
      [
        "F10",
        "c"
      ]
    ],
    "pts": {
      "K7": 3
    },
    "reason": "Looker ist gesetzt, was für das Google-Cloud-Substrat spricht."
  },
  {
    "id": "P04",
    "cond": [
      [
        "F10",
        "b"
      ]
    ],
    "pts": {
      "K2": 1,
      "K4": 1,
      "K5": 1,
      "K6": 1
    },
    "reason": "Tableau oder Qlik als BI-Schicht ist plattformneutral und schwächt den Vorteil einer integrierten BI-Schicht ab."
  },
  {
    "id": "P05",
    "cond": [
      [
        "F7",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K7": 2,
      "K4": 1
    },
    "reason": "Der Schwerpunkt liegt auf BI und Reporting, wo eine integrierte oder betriebsarme Analyse-Engine den grössten Hebel hat."
  },
  {
    "id": "P06",
    "cond": [
      [
        "F7",
        "b"
      ]
    ],
    "pts": {
      "K2": 3,
      "K3": 2,
      "K6": 1,
      "K8": 2
    },
    "reason": "Der Schwerpunkt liegt auf Data Engineering und ETL, wo Spark und Photon die stärkste Verarbeitungsbasis bieten."
  },
  {
    "id": "P07",
    "cond": [
      [
        "F7",
        "c"
      ]
    ],
    "pts": {
      "K2": 3,
      "K3": 2,
      "K8": 2,
      "K7": 1
    },
    "reason": "Der Schwerpunkt liegt auf Machine Learning und Data Science, wo MLflow und Mosaic AI die reifste Kette bilden."
  },
  {
    "id": "P08",
    "cond": [
      [
        "F7",
        "d"
      ]
    ],
    "pts": {
      "K1": 2,
      "K3": 2,
      "K4": 1
    },
    "reason": "Ohne klaren Schwerpunkt hat eine breit abdeckende Plattform den Vorteil."
  },
  {
    "id": "P09",
    "cond": [
      [
        "F8",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K3": 2,
      "K7": 1,
      "K6": 1
    },
    "reason": "Streaming ist Kernanforderung; Real-Time Intelligence in Fabric ist im Feld die stärkste integrierte Streaming-Story."
  },
  {
    "id": "P10",
    "cond": [
      [
        "F9",
        "a"
      ]
    ],
    "pts": {
      "K4": 3,
      "K5": 3
    },
    "reason": "Datenaustausch mit Dritten ist ein Kernanwendungsfall, wo Secure Data Sharing und Marketplace die reifste Lösung sind."
  },
  {
    "id": "P11",
    "cond": [
      [
        "F9",
        "b"
      ]
    ],
    "pts": {
      "K4": 1,
      "K5": 1,
      "K2": 1,
      "K3": 1
    },
    "reason": "Gelegentlicher Datenaustausch ist über Delta Sharing oder Secure Data Sharing abbildbar."
  },
  {
    "id": "P12",
    "cond": [
      [
        "F11",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K3": 1
    },
    "reason": "Eine bestehende Synapse-Landschaft führt Microsoft ausdrücklich Richtung Fabric; der Migrationspfad ist dokumentiert und mit Werkzeugen unterstützt."
  },
  {
    "id": "P13",
    "cond": [
      [
        "F11",
        "b"
      ]
    ],
    "pts": {
      "K1": 2,
      "K4": 2,
      "K2": 1
    },
    "reason": "Ein SQL-Server-Data-Warehouse on premises lässt sich über T-SQL-Nähe beziehungsweise klassische Warehouse-Semantik am direktesten überführen."
  },
  {
    "id": "P14",
    "cond": [
      [
        "F11",
        "c"
      ]
    ],
    "pts": {
      "K4": 1,
      "K5": 1,
      "K1": 1
    },
    "reason": "Eine Qlik-Vorgeschichte bindet die BI-Schicht nicht an einen Plattformanbieter und lässt die Plattformwahl offen."
  },
  {
    "id": "P15",
    "cond": [
      [
        "F12",
        "c"
      ]
    ],
    "pts": {
      "K1": 2,
      "K3": 1,
      "K2": 1
    },
    "reason": "Über 50 Datenquellen erhöhen den Wert verwalteter Konnektoren und von Mirroring gegenüber selbst gebauter Ingestion."
  },
  {
    "id": "P16",
    "cond": [
      [
        "F13",
        "a"
      ]
    ],
    "pts": {
      "K1": 2,
      "K2": 2,
      "K4": 2
    },
    "reason": "Operative Datenbanken auf derselben Plattform sind über Fabric Databases, Lakebase beziehungsweise Hybrid Tables abbildbar."
  },
  {
    "id": "P17",
    "cond": [
      [
        "F14",
        "a"
      ]
    ],
    "pts": {
      "K2": 3,
      "K3": 2,
      "K8": 2,
      "K7": 1
    },
    "reason": "Notebooks und Python-Entwicklung sind zentral, was für eine Plattform mit Data-Engineering-DNA spricht."
  },
  {
    "id": "P18",
    "cond": [
      [
        "F14",
        "c"
      ]
    ],
    "pts": {
      "K1": 2,
      "K4": 1,
      "K7": 1
    },
    "reason": "Ohne Python-Bedarf zählt die Stärke in SQL und BI mehr als die Offenheit der Entwicklungsumgebung."
  },
  {
    "id": "P19",
    "cond": [
      [
        "F15",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K7": 2,
      "K4": 1
    },
    "reason": "Ein Team unter drei Personen braucht eine Plattform mit möglichst wenig Betriebsaufwand."
  },
  {
    "id": "P20",
    "cond": [
      [
        "F15",
        "c"
      ]
    ],
    "pts": {
      "K2": 2,
      "K6": 2,
      "K3": 1
    },
    "reason": "Ein Team über zehn Personen kann Zusammenbau und Plattformbetrieb tragen und gewinnt dafür Kontrolle."
  },
  {
    "id": "P21",
    "cond": [
      [
        "F16",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K4": 2,
      "K7": 2
    },
    "reason": "Der Wunsch nach möglichst wenig Plattformbetrieb spricht für ein SaaS-nahes Modell."
  },
  {
    "id": "P22",
    "cond": [
      [
        "F16",
        "b"
      ]
    ],
    "pts": {
      "K2": 2,
      "K6": 3,
      "K8": 1
    },
    "reason": "Bewusste eigene Kontrolle über Infrastruktur und Konfiguration spricht für einen granularen Stack."
  },
  {
    "id": "P23",
    "cond": [
      [
        "F17",
        "a"
      ]
    ],
    "pts": {
      "K2": 2,
      "K6": 2,
      "K8": 1
    },
    "reason": "Belastbare Spark- und Python-Erfahrung im Team senkt das Umsetzungsrisiko der anspruchsvolleren Konstellationen."
  },
  {
    "id": "P24",
    "cond": [
      [
        "F17",
        "c"
      ]
    ],
    "pts": {
      "K1": 3,
      "K4": 1,
      "K7": 1
    },
    "reason": "Ohne Spark- und Data-Engineering-Erfahrung ist eine Plattform mit flacher Lernkurve die risikoärmere Wahl."
  },
  {
    "id": "P25",
    "cond": [
      [
        "F18",
        "a"
      ]
    ],
    "pts": {
      "K1": 3,
      "K7": 2,
      "K4": 1
    },
    "reason": "Ein Zieltermin unter drei Monaten begünstigt die Konstellation mit der niedrigsten Einstiegshürde."
  },
  {
    "id": "P26",
    "cond": [
      [
        "F18",
        "c"
      ]
    ],
    "pts": {
      "K2": 1,
      "K3": 2,
      "K6": 1
    },
    "reason": "Ein Zeithorizont über neun Monaten lässt Raum für eine aufwendigere, dafür tiefer passende Architektur."
  },
  {
    "id": "P27",
    "cond": [
      [
        "F19",
        "a"
      ]
    ],
    "pts": {
      "K1": 3
    },
    "reason": "Planbare Fixkosten sprechen für ein Kapazitätsmodell mit reservierbarer, im Voraus bekannter Monatsrate."
  },
  {
    "id": "P28",
    "cond": [
      [
        "F19",
        "b"
      ]
    ],
    "pts": {
      "K4": 2,
      "K5": 2,
      "K6": 2,
      "K7": 2
    },
    "reason": "Verbrauchsgenaue Abrechnung spricht für sekunden- beziehungsweise scanbasierte Modelle."
  },
  {
    "id": "P29",
    "cond": [
      [
        "F19",
        "c"
      ]
    ],
    "pts": {
      "K6": 3,
      "K7": 2,
      "K2": 2,
      "K5": 1
    },
    "reason": "Verursachergerechte Kostenzuordnung ist zwingend; granulare SKU beziehungsweise Cluster- und Budget-Tags leisten das am besten. Der gemeinsame Kapazitätstopf von Fabric leistet es am schlechtesten."
  },
  {
    "id": "P30",
    "cond": [
      [
        "F19",
        "c"
      ]
    ],
    "pts": {
      "K1": -3
    },
    "reason": null
  },
  {
    "id": "P31",
    "cond": [
      [
        "F20",
        "a"
      ]
    ],
    "pts": {
      "K2": 3,
      "K3": 1,
      "K6": 2,
      "K8": 2
    },
    "reason": "Ein hoher, vertraglich relevanter Exit-Anspruch spricht für offene Tabellenformate und einen offenen Katalog."
  },
  {
    "id": "P32",
    "cond": [
      [
        "F20",
        "a"
      ]
    ],
    "pts": {
      "K1": -2
    },
    "reason": null
  },
  {
    "id": "P33",
    "cond": [
      [
        "F2",
        "a"
      ]
    ],
    "pts": {
      "K1": 2,
      "K2": 2,
      "K4": 2,
      "K5": 2,
      "K6": 1,
      "K7": 1
    },
    "reason": "Zwingende Schweizer Datenresidenz ist in dieser Konstellation mit einer Schweizer Region erfüllbar."
  },
  {
    "id": "P34",
    "cond": [
      [
        "F3",
        "c"
      ]
    ],
    "pts": {
      "K1": 1,
      "K2": 1,
      "K4": 1,
      "K5": 1,
      "K6": 1,
      "K7": 1
    },
    "reason": "Ohne geplanten KI-Einsatz entfällt die Residenzfrage für die Inferenz."
  },
  {
    "id": "P35",
    "cond": [
      [
        "F5",
        "a"
      ]
    ],
    "pts": {
      "K5": 2,
      "K7": 2,
      "K6": 1
    },
    "reason": "Im FINMA-Perimeter helfen die vorliegenden ISAE-3000-Type-2-Berichte der Substratanbieter bei der Nachweisführung."
  },
  {
    "id": "P36",
    "cond": [
      [
        "F4",
        "b"
      ]
    ],
    "pts": {
      "K2": 2,
      "K4": 2,
      "K5": 2
    },
    "reason": "Multi-Cloud soll später möglich bleiben, was für eine cloud-portable Datenplattform spricht."
  },
  {
    "id": "P37",
    "cond": [
      [
        "F1",
        "d"
      ],
      [
        "F6",
        "a"
      ]
    ],
    "pts": {
      "K1": 2
    },
    "reason": "Bei noch offenem Substrat und durchgängigem Microsoft-Arbeitsplatz ist Azure das naheliegende Substrat."
  }
];

/** Relevanzregeln der neun Prüfaufträge (Abschnitt 6, Punkt 6). */
export const PRUEF_RELEVANCE = {
  "2": [
    [
      "F3",
      [
        "a",
        "b"
      ]
    ]
  ],
  "3": [
    [
      "F3",
      [
        "a",
        "b"
      ]
    ]
  ],
  "4": [
    [
      "F2",
      [
        "a"
      ]
    ]
  ],
  "5": "always",
  "6": [
    [
      "F20",
      [
        "a"
      ]
    ],
    [
      "F5",
      [
        "a"
      ]
    ]
  ],
  "7": [
    [
      "F15",
      [
        "a"
      ]
    ],
    [
      "F17",
      [
        "c"
      ]
    ]
  ],
  "9": [
    [
      "F5",
      [
        "a",
        "b",
        "c"
      ]
    ]
  ]
};

/** Kostenzeilen je Konstellation, aus Kapitel 3.2 des Vergleichs. */
export const COSTS = {
  "K1": [
    {
      "title": "Microsoft Fabric — Kapazität und Speicher",
      "rows": [
        [
          "CU-Preis",
          "0.23 USD/CU/Stunde",
          "Switzerland North"
        ],
        [
          "F2 (2 CU)",
          "335.80 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F8 (8 CU)",
          "1'343.20 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F16 (16 CU)",
          "2'686.40 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F32 (32 CU)",
          "5'372.80 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F64 (64 CU)",
          "10'745.60 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F256 (256 CU)",
          "42'982.40 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "Reservierung",
          "1'198.00 USD/CU/Jahr, rund 41 % Rabatt gegenüber Pay-as-you-go",
          "Switzerland North"
        ],
        [
          "OneLake Storage Hot",
          "0.0264 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "OneLake Storage Cool",
          "0.01441 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "OneLake Storage Cold",
          "0.00571 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "OneLake Cache (Eventhouse/KQL)",
          "0.298 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "SQL-Storage (Fabric SQL-Datenbank / Warehouse)",
          "0.25385 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "Power BI Pro",
          "9.99 USD/Nutzer/Monat",
          "offiziell bestätigt"
        ]
      ],
      "notes": [
        "Monatsbeträge sind eigene Berechnung aus dem verifizierten CU-Stundenpreis × 730 Stunden, nicht eine Microsoft-Originaltabelle.",
        "Der 3-Jahres-Preis ist exakt das Dreifache des 1-Jahres-Preises — kein zusätzlicher Rabatt für die längere Bindung. Das ist untypisch für Azure-Reservierungen und ein konkreter Verhandlungspunkt.",
        "Ab F64 dürfen Nutzer mit Free-Lizenz Inhalte konsumieren — unter F64 braucht jeder Viewer eine Pro- oder PPU-Lizenz. Das macht den Sprung F32 → F64 zur wichtigsten Kostenschwelle des Modells.",
        "Premium Per User ist nicht programmatisch aus der Preisseite auslesbar; ein seit Jahren stabiler Sekundärquellenwert von 24.99 USD ist gängig, muss aber vor einer Offerte gegen die aktuelle CSP-Preisliste geprüft werden."
      ]
    }
  ],
  "K2": [
    {
      "title": "Databricks — DBU-Preise",
      "rows": [
        [
          "Jobs Compute (mit und ohne Photon)",
          "0.30 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Jobs Light Compute",
          "0.22 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "All-Purpose Compute (mit und ohne Photon)",
          "0.55 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "SQL Classic",
          "0.22 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "SQL Compute Pro",
          "0.85 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Serverless SQL",
          "1.09 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Interactive Serverless Compute (Notebooks)",
          "1.05 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Automated Serverless Compute (Jobs)",
          "0.56 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Lakeflow Declarative Pipelines Core / Pro / Advanced",
          "0.30 / 0.38 / 0.54 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Model Training",
          "0.78 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Model Serving (Serverless Realtime Inferencing)",
          "0.092 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Enhanced Security and Compliance Add-on",
          "0.10 USD/DBU (Mission Critical: 0.15)",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Clean Rooms Collaborator",
          "50.00 USD/Tag",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Disaster-Recovery-Replikation",
          "0.0312 USD/GB",
          "Azure Switzerland North, Premium-Tier"
        ]
      ],
      "notes": [
        "Quelle: Azure Retail Prices API, serviceName eq 'Azure Databricks', armRegionName eq 'switzerlandnorth', abgerufen 20.08.2026.",
        "Die DBU-Rechnung ist nicht die Gesamtrechnung. Bei klassischem Compute kommen die Azure-VM- und Storage-Kosten separat dazu. Als Praxis-Faustregel (keine offizielle Zahl) liegt der Databricks-Anteil bei grob 30–50 % der Gesamtkosten. Bei Serverless-SKU ist die Infrastruktur im DBU-Preis enthalten — dafür liegt der DBU-Satz 1.5- bis 3-fach höher (Serverless SQL 1.09 gegen SQL Classic 0.22).",
        "Der Standard-Tier von Azure Databricks wird per 1. Oktober 2026 abgekündigt. Neuprojekte kalkulieren faktisch mit Premium-Preisen.",
        "Nicht öffentlich verifizierbar: DBU-Listenpreise für AWS und Google Cloud — Databricks publiziert diese nur über einen clientseitigen Rechner. Ebenso Vector-Search-Preise auf Azure."
      ]
    },
    {
      "title": "Microsoft Azure — Analytics-Bausteine",
      "rows": [
        [
          "Synapse dedizierter SQL-Pool DW100c",
          "1.661 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse dedizierter SQL-Pool DW1000c",
          "16.61 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse dedizierter SQL-Pool DW10000c",
          "166.10 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse dedizierter SQL-Pool DW30000c",
          "498.30 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse Serverless SQL",
          "5.50 USD/TB gescannt",
          "Switzerland North"
        ]
      ],
      "notes": [
        "Nicht öffentlich verifizierbar: ADLS-Gen2-Preise pro Tier für Switzerland North, Azure-Data-Factory-Preise, Event-Hubs- und Stream-Analytics-Preise, Purview-Beträge pro Capacity Unit und DGPU, Log-Analytics-Ingestion pro GB, Azure-OpenAI-Tokenpreise, PTU-Preis und Batch-Rabatt, AI-Search-Tierpreise. Grund: Die offiziellen Preisseiten rendern Beträge ausschliesslich clientseitig. Konsequenz für die Praxis: Azure ist unter den sechs Anbietern derjenige mit der geringsten öffentlichen Preistransparenz für Analytics-Dienste — Kalkulationen sind zwingend live im Preisrechner oder über das Account-Team zu erstellen."
      ]
    }
  ],
  "K3": [
    {
      "title": "Microsoft Fabric — Kapazität und Speicher (Auszug)",
      "rows": [
        [
          "CU-Preis",
          "0.23 USD/CU/Stunde",
          "Switzerland North"
        ],
        [
          "F8 (8 CU)",
          "1'343.20 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F64 (64 CU)",
          "10'745.60 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "F256 (256 CU)",
          "42'982.40 USD/Monat (730 h)",
          "Switzerland North"
        ],
        [
          "Reservierung",
          "1'198.00 USD/CU/Jahr, rund 41 % Rabatt gegenüber Pay-as-you-go",
          "Switzerland North"
        ],
        [
          "OneLake Storage Hot",
          "0.0264 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "SQL-Storage (Fabric SQL-Datenbank / Warehouse)",
          "0.25385 USD/GB/Monat",
          "Switzerland North"
        ],
        [
          "Power BI Pro",
          "9.99 USD/Nutzer/Monat",
          "offiziell bestätigt"
        ]
      ],
      "notes": [
        "Monatsbeträge sind eigene Berechnung aus dem verifizierten CU-Stundenpreis × 730 Stunden, nicht eine Microsoft-Originaltabelle.",
        "Ab F64 dürfen Nutzer mit Free-Lizenz Inhalte konsumieren — unter F64 braucht jeder Viewer eine Pro- oder PPU-Lizenz. Das macht den Sprung F32 → F64 zur wichtigsten Kostenschwelle des Modells."
      ]
    },
    {
      "title": "Databricks — DBU-Preise (Auszug)",
      "rows": [
        [
          "Jobs Compute (mit und ohne Photon)",
          "0.30 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "All-Purpose Compute (mit und ohne Photon)",
          "0.55 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "SQL Classic",
          "0.22 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "SQL Compute Pro",
          "0.85 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Serverless SQL",
          "1.09 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Interactive Serverless Compute (Notebooks)",
          "1.05 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Automated Serverless Compute (Jobs)",
          "0.56 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Model Serving (Serverless Realtime Inferencing)",
          "0.092 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ]
      ],
      "notes": [
        "Quelle: Azure Retail Prices API, serviceName eq 'Azure Databricks', armRegionName eq 'switzerlandnorth', abgerufen 20.08.2026.",
        "Die DBU-Rechnung ist nicht die Gesamtrechnung. Bei klassischem Compute kommen die Azure-VM- und Storage-Kosten separat dazu. Als Praxis-Faustregel (keine offizielle Zahl) liegt der Databricks-Anteil bei grob 30–50 % der Gesamtkosten. Bei Serverless-SKU ist die Infrastruktur im DBU-Preis enthalten — dafür liegt der DBU-Satz 1.5- bis 3-fach höher (Serverless SQL 1.09 gegen SQL Classic 0.22).",
        "Der Standard-Tier von Azure Databricks wird per 1. Oktober 2026 abgekündigt. Neuprojekte kalkulieren faktisch mit Premium-Preisen."
      ]
    }
  ],
  "K4": [
    {
      "title": "Snowflake — Credits und Storage",
      "rows": [
        [
          "Credit, Standard Edition",
          "2.00 USD",
          "US-Referenzregion"
        ],
        [
          "Credit, Enterprise Edition",
          "3.00 USD",
          "US-Referenzregion"
        ],
        [
          "Credit, Business Critical Edition",
          "4.00 USD",
          "US-Referenzregion"
        ],
        [
          "Virtual Private Snowflake",
          "kein Listenpreis publiziert",
          "—"
        ],
        [
          "Warehouse X-Small … 6X-Large",
          "1 … 512 Credits/Stunde",
          "Verdoppelung je Grössenschritt"
        ],
        [
          "Gen2-Warehouse X-Small",
          "1.25 (Azure) / 1.35 (AWS, GCP) Credits/Stunde",
          "—"
        ],
        [
          "Storage On-Demand",
          "20.00 – 40.50 USD/TB/Monat",
          "region- und cloudabhängig"
        ],
        [
          "Hybrid-Tables-Storage",
          "0.34 – 0.60 USD/GB/Monat",
          "—"
        ],
        [
          "AI Credit, Global Routing",
          "2.00 USD",
          "—"
        ],
        [
          "AI Credit, Regional Routing",
          "2.20 USD",
          "—"
        ],
        [
          "Cloud-Services-Schicht",
          "kostenlos bis 10 % des täglichen Compute-Verbrauchs",
          "«10-Prozent-Regel»"
        ]
      ],
      "notes": [
        "Nicht öffentlich verifizierbar: Credit- und Storage-Preise spezifisch für AWS eu-central-2, Azure Switzerland North und Google europe-west6 — der offizielle Preisrechner rendert diese erst nach Regionsauswahl. Ebenso die Modell-Tabelle für Cortex-AI-Tokenpreise. Für eine belastbare Offerte ist der Rechner live mit Regionsauswahl zu bedienen."
      ]
    },
    {
      "title": "Microsoft Azure — Analytics-Bausteine",
      "rows": [
        [
          "Synapse dedizierter SQL-Pool DW100c",
          "1.661 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse dedizierter SQL-Pool DW1000c",
          "16.61 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse dedizierter SQL-Pool DW10000c",
          "166.10 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse dedizierter SQL-Pool DW30000c",
          "498.30 USD/Stunde",
          "Switzerland North"
        ],
        [
          "Synapse Serverless SQL",
          "5.50 USD/TB gescannt",
          "Switzerland North"
        ]
      ],
      "notes": [
        "Nicht öffentlich verifizierbar: ADLS-Gen2-Preise pro Tier für Switzerland North, Azure-Data-Factory-Preise, Event-Hubs- und Stream-Analytics-Preise, Purview-Beträge pro Capacity Unit und DGPU, Log-Analytics-Ingestion pro GB, Azure-OpenAI-Tokenpreise, PTU-Preis und Batch-Rabatt, AI-Search-Tierpreise. Grund: Die offiziellen Preisseiten rendern Beträge ausschliesslich clientseitig. Konsequenz für die Praxis: Azure ist unter den sechs Anbietern derjenige mit der geringsten öffentlichen Preistransparenz für Analytics-Dienste — Kalkulationen sind zwingend live im Preisrechner oder über das Account-Team zu erstellen."
      ]
    }
  ],
  "K5": [
    {
      "title": "Snowflake — Credits und Storage",
      "rows": [
        [
          "Credit, Standard Edition",
          "2.00 USD",
          "US-Referenzregion"
        ],
        [
          "Credit, Enterprise Edition",
          "3.00 USD",
          "US-Referenzregion"
        ],
        [
          "Credit, Business Critical Edition",
          "4.00 USD",
          "US-Referenzregion"
        ],
        [
          "Virtual Private Snowflake",
          "kein Listenpreis publiziert",
          "—"
        ],
        [
          "Warehouse X-Small … 6X-Large",
          "1 … 512 Credits/Stunde",
          "Verdoppelung je Grössenschritt"
        ],
        [
          "Gen2-Warehouse X-Small",
          "1.25 (Azure) / 1.35 (AWS, GCP) Credits/Stunde",
          "—"
        ],
        [
          "Storage On-Demand",
          "20.00 – 40.50 USD/TB/Monat",
          "region- und cloudabhängig"
        ],
        [
          "Hybrid-Tables-Storage",
          "0.34 – 0.60 USD/GB/Monat",
          "—"
        ],
        [
          "AI Credit, Global Routing",
          "2.00 USD",
          "—"
        ],
        [
          "AI Credit, Regional Routing",
          "2.20 USD",
          "—"
        ],
        [
          "Cloud-Services-Schicht",
          "kostenlos bis 10 % des täglichen Compute-Verbrauchs",
          "«10-Prozent-Regel»"
        ]
      ],
      "notes": [
        "Nicht öffentlich verifizierbar: Credit- und Storage-Preise spezifisch für AWS eu-central-2, Azure Switzerland North und Google europe-west6 — der offizielle Preisrechner rendert diese erst nach Regionsauswahl. Ebenso die Modell-Tabelle für Cortex-AI-Tokenpreise. Für eine belastbare Offerte ist der Rechner live mit Regionsauswahl zu bedienen."
      ]
    },
    {
      "title": "AWS — Analytics-Bausteine",
      "rows": [
        [
          "Athena",
          "5.00 USD/TB gescannt",
          "generisch ausgewiesen"
        ],
        [
          "Athena Capacity Reservation",
          "0.30 USD/DPU-Stunde",
          "—"
        ],
        [
          "Redshift Serverless",
          "0.375 USD/RPU-Stunde, Minimum 128 RPU-Sekunden pro Query",
          "Basiskapazität ab 4 RPU, also ab 1.50 USD/Stunde"
        ],
        [
          "Redshift RA3 (ra3.xlplus)",
          "ab 1.086 USD/Stunde",
          "us-east-1, Sekundärquelle"
        ],
        [
          "Redshift Managed Storage",
          "0.024 USD/GB/Monat",
          "us-east-1"
        ],
        [
          "Glue ETL und Crawler",
          "0.44 USD/DPU-Stunde, sekundengenau",
          "generisch"
        ],
        [
          "Glue Data Catalog",
          "frei bis 1 Mio. Objekte und 1 Mio. Requests, danach 1.00 USD/100'000 Objekte/Monat",
          "generisch"
        ],
        [
          "S3 Standard",
          "0.023 USD/GB/Monat (erste 50 TB)",
          "us-east-1; AWS nennt 10–30 % Aufschlag ausserhalb"
        ],
        [
          "S3 Tables (Iceberg)",
          "ab 0.0265 USD/GB/Monat plus Compaction/Monitoring",
          "US West (Oregon) als Beispiel"
        ],
        [
          "QuickSight Author / Reader",
          "24 / 3 USD/Nutzer/Monat",
          "—"
        ],
        [
          "QuickSight Author Pro / Reader Pro",
          "40 / 20 USD/Nutzer/Monat",
          "inkl. generative BI"
        ],
        [
          "QuickSight Infrastruktur-Gebühr",
          "250 USD/Monat/Account bei aktiven Pro-Nutzern oder Q&A",
          "—"
        ],
        [
          "Clean Rooms",
          "2.00 USD/CRPU-Stunde",
          "in eu-central-2 nicht verfügbar"
        ],
        [
          "KMS",
          "1 USD/Schlüssel/Monat, 0.03 USD/10'000 Requests",
          "global"
        ],
        [
          "CloudHSM",
          "1.60 USD/HSM-Stunde",
          "global"
        ],
        [
          "Bedrock Guardrails",
          "0.15 USD/1'000 Text-Units",
          "—"
        ],
        [
          "Bedrock Knowledge Bases",
          "5.00 USD/GB/Monat Index plus 1.00 USD/1'000 Retrieval-Calls",
          "—"
        ]
      ],
      "notes": [
        "Schweizer Regionsaufschlag: Sekundäranalysen nennen für eu-central-2 rund 9–13 % über eu-central-1 (Frankfurt) im Servicedurchschnitt. Das ist keine offizielle AWS-Zahl.",
        "Support-Umstellung 2026: AWS stellt Developer, Business und Enterprise On-Ramp per 1. Januar 2027 ein. Nachfolger sind Business Support+ (ab 29 USD/Monat, gestaffelt 9/7/5/3 % der Rechnung) und Enterprise Support (Minimum von 15'000 auf 5'000 USD/Monat gesenkt, gestaffelt 10/7/5/3 %).",
        "Nicht öffentlich verifizierbar: S3- und Data-Transfer-Tarife spezifisch für eu-central-2, Redshift-RA3-Stundenpreise für Zürich, vollständige EMR-Serverless-Tabelle, Tokenpreise für Claude Opus 5 / Sonnet 5 und Amazon Nova, Bedrock-Provisioned-Throughput-Preise, Redshift-Reserved-Instance-Rabattsätze."
      ]
    }
  ],
  "K6": [
    {
      "title": "AWS — Analytics-Bausteine",
      "rows": [
        [
          "Athena",
          "5.00 USD/TB gescannt",
          "generisch ausgewiesen"
        ],
        [
          "Athena Capacity Reservation",
          "0.30 USD/DPU-Stunde",
          "—"
        ],
        [
          "Redshift Serverless",
          "0.375 USD/RPU-Stunde, Minimum 128 RPU-Sekunden pro Query",
          "Basiskapazität ab 4 RPU, also ab 1.50 USD/Stunde"
        ],
        [
          "Redshift RA3 (ra3.xlplus)",
          "ab 1.086 USD/Stunde",
          "us-east-1, Sekundärquelle"
        ],
        [
          "Redshift Managed Storage",
          "0.024 USD/GB/Monat",
          "us-east-1"
        ],
        [
          "Glue ETL und Crawler",
          "0.44 USD/DPU-Stunde, sekundengenau",
          "generisch"
        ],
        [
          "Glue Data Catalog",
          "frei bis 1 Mio. Objekte und 1 Mio. Requests, danach 1.00 USD/100'000 Objekte/Monat",
          "generisch"
        ],
        [
          "S3 Standard",
          "0.023 USD/GB/Monat (erste 50 TB)",
          "us-east-1; AWS nennt 10–30 % Aufschlag ausserhalb"
        ],
        [
          "S3 Tables (Iceberg)",
          "ab 0.0265 USD/GB/Monat plus Compaction/Monitoring",
          "US West (Oregon) als Beispiel"
        ],
        [
          "QuickSight Author / Reader",
          "24 / 3 USD/Nutzer/Monat",
          "—"
        ],
        [
          "QuickSight Author Pro / Reader Pro",
          "40 / 20 USD/Nutzer/Monat",
          "inkl. generative BI"
        ],
        [
          "QuickSight Infrastruktur-Gebühr",
          "250 USD/Monat/Account bei aktiven Pro-Nutzern oder Q&A",
          "—"
        ],
        [
          "Clean Rooms",
          "2.00 USD/CRPU-Stunde",
          "in eu-central-2 nicht verfügbar"
        ],
        [
          "KMS",
          "1 USD/Schlüssel/Monat, 0.03 USD/10'000 Requests",
          "global"
        ],
        [
          "CloudHSM",
          "1.60 USD/HSM-Stunde",
          "global"
        ],
        [
          "Bedrock Guardrails",
          "0.15 USD/1'000 Text-Units",
          "—"
        ],
        [
          "Bedrock Knowledge Bases",
          "5.00 USD/GB/Monat Index plus 1.00 USD/1'000 Retrieval-Calls",
          "—"
        ]
      ],
      "notes": [
        "Schweizer Regionsaufschlag: Sekundäranalysen nennen für eu-central-2 rund 9–13 % über eu-central-1 (Frankfurt) im Servicedurchschnitt. Das ist keine offizielle AWS-Zahl.",
        "Support-Umstellung 2026: AWS stellt Developer, Business und Enterprise On-Ramp per 1. Januar 2027 ein. Nachfolger sind Business Support+ (ab 29 USD/Monat, gestaffelt 9/7/5/3 % der Rechnung) und Enterprise Support (Minimum von 15'000 auf 5'000 USD/Monat gesenkt, gestaffelt 10/7/5/3 %).",
        "Nicht öffentlich verifizierbar: S3- und Data-Transfer-Tarife spezifisch für eu-central-2, Redshift-RA3-Stundenpreise für Zürich, vollständige EMR-Serverless-Tabelle, Tokenpreise für Claude Opus 5 / Sonnet 5 und Amazon Nova, Bedrock-Provisioned-Throughput-Preise, Redshift-Reserved-Instance-Rabattsätze."
      ]
    }
  ],
  "K7": [
    {
      "title": "Google Cloud — BigQuery und Umfeld",
      "rows": [
        [
          "BigQuery On-Demand",
          "6.25 USD/TiB gescannt, erstes TiB/Monat frei",
          "weltweit einheitlich, auch europe-west6"
        ],
        [
          "Editions Slot-Stunde Standard / Enterprise / Enterprise Plus",
          "0.04 / 0.06 / 0.10 USD",
          "identisch für europe-west3/4/6 — kein Zürich-Aufschlag"
        ],
        [
          "dieselben mit 1-Jahres-Commitment",
          "0.036 / 0.054 / 0.09 USD",
          "—"
        ],
        [
          "dieselben mit 3-Jahres-Commitment",
          "0.032 / 0.048 / 0.08 USD",
          "—"
        ],
        [
          "Storage aktiv logisch",
          "ca. 23.55 USD/TiB/Monat",
          "—"
        ],
        [
          "Storage long-term logisch (ab 90 Tagen unverändert)",
          "ca. 16.40 USD/TiB/Monat",
          "—"
        ],
        [
          "Storage aktiv physisch",
          "ca. 41.03 USD/TiB/Monat",
          "komprimiert, inkl. Time Travel"
        ],
        [
          "Cloud Storage Standard",
          "0.020 USD/GiB/Monat",
          "Single-Region europe-west6"
        ],
        [
          "Storage Write API",
          "0.025 USD/GiB, erste 2 TiB/Monat frei",
          "—"
        ],
        [
          "Egress Europa → Internet",
          "0.12 USD/GiB (1–1'024 GiB), 0.085 ab 10 TiB",
          "Premium Tier"
        ],
        [
          "Intra-EU-Transfer Region zu Region",
          "0.02 USD/GiB",
          "—"
        ],
        [
          "BigQuery SLA",
          "99.9 % (Standard) / 99.99 % (Enterprise, Enterprise Plus)",
          "—"
        ],
        [
          "Support Standard / Enhanced / Premium",
          "ab 29 / 100 / 15'000 USD/Monat oder Prozentsatz vom Verbrauch",
          "jeweils der höhere Wert"
        ]
      ],
      "notes": [
        "Mindest-Commitment 50 Slots in 50er-Schritten, organisationsweit geteilt aber regional gebunden. BigQuery kennt keine automatischen Sustained-Use-Discounts.",
        "Nicht öffentlich verifizierbar: Looker-Plattformpreise (ausschliesslich «Contact Sales»), Looker-Studio-Pro-Preis pro Nutzer, Agent-Engine-SKU-Preise."
      ]
    }
  ],
  "K8": [
    {
      "title": "Databricks — DBU-Preise",
      "rows": [
        [
          "Jobs Compute (mit und ohne Photon)",
          "0.30 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Jobs Light Compute",
          "0.22 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "All-Purpose Compute (mit und ohne Photon)",
          "0.55 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "SQL Classic",
          "0.22 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "SQL Compute Pro",
          "0.85 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Serverless SQL",
          "1.09 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Interactive Serverless Compute (Notebooks)",
          "1.05 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Automated Serverless Compute (Jobs)",
          "0.56 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Lakeflow Declarative Pipelines Core / Pro / Advanced",
          "0.30 / 0.38 / 0.54 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Model Training",
          "0.78 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Model Serving (Serverless Realtime Inferencing)",
          "0.092 USD/DBU",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Enhanced Security and Compliance Add-on",
          "0.10 USD/DBU (Mission Critical: 0.15)",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Clean Rooms Collaborator",
          "50.00 USD/Tag",
          "Azure Switzerland North, Premium-Tier"
        ],
        [
          "Disaster-Recovery-Replikation",
          "0.0312 USD/GB",
          "Azure Switzerland North, Premium-Tier"
        ]
      ],
      "notes": [
        "Quelle: Azure Retail Prices API, serviceName eq 'Azure Databricks', armRegionName eq 'switzerlandnorth', abgerufen 20.08.2026.",
        "Die DBU-Rechnung ist nicht die Gesamtrechnung. Bei klassischem Compute kommen die Azure-VM- und Storage-Kosten separat dazu. Als Praxis-Faustregel (keine offizielle Zahl) liegt der Databricks-Anteil bei grob 30–50 % der Gesamtkosten. Bei Serverless-SKU ist die Infrastruktur im DBU-Preis enthalten — dafür liegt der DBU-Satz 1.5- bis 3-fach höher (Serverless SQL 1.09 gegen SQL Classic 0.22).",
        "Der Standard-Tier von Azure Databricks wird per 1. Oktober 2026 abgekündigt. Neuprojekte kalkulieren faktisch mit Premium-Preisen.",
        "Nicht öffentlich verifizierbar: DBU-Listenpreise für AWS und Google Cloud — Databricks publiziert diese nur über einen clientseitigen Rechner. Ebenso Vector-Search-Preise auf Azure.",
        "Für K8 liegt der Workspace in Frankfurt. Regionsvergleich aus dem Vergleichsdokument: West Europe ist bei den Serverless-Metern günstiger (Serverless SQL 0.91), bei klassischem Compute identisch. Switzerland West liegt bei SQL Compute Pro höher als Zürich (0.96 gegen 0.85) und führt bei Serverless SQL keinen aktiven Preis."
      ]
    }
  ]
};

/** Vierstufige Bewertungsskala des Vergleichs. */
export const SCALE = [
  {
    "n": "Ausgeprägt",
    "m": "Kernstärke der Plattform; funktional führend oder alleinstellend"
  },
  {
    "n": "Solide",
    "m": "Marktüblich abgedeckt, keine relevante Lücke"
  },
  {
    "n": "Bedingt",
    "m": "Nutzbar, aber mit Einschränkung, Zusatzprodukt oder Zusatzaufwand"
  },
  {
    "n": "Lücke",
    "m": "Nicht vorhanden oder nur über Drittanbieter abbildbar"
  }
];

/** Methodik- und Transparenzhinweise für das Word-Dokument. */
export const METHOD_NOTES = [
  "Der Vergleich vergibt generisch keinen Sieger und keine Gesamtnote. Die Empfehlung in diesem Dokument gilt ausschliesslich für das protokollierte Anforderungsprofil.",
  "Alle Preisangaben sind Listenpreise in USD, ohne MWST, ohne Rabatt, Stand 20.08.2026. Wo eine Region angegeben ist, gilt der Preis für diese Region.",
  "Reale Kundenpreise entstehen aus Verbrauch mal Einheitenpreis, minus verhandelter Rabatte. Listenpreise sind der Startpunkt einer Verhandlung, nicht das Ergebnis.",
  "Keine Rechtsberatung. Die regulatorischen Abschnitte fassen öffentlich zugängliche Quellen zusammen und ersetzen keine anwaltliche Prüfung.",
  "Nicht alle Angaben des zugrundeliegenden Vergleichs waren aus offiziellen Quellen verifizierbar; die betreffenden Punkte sind im Vergleichsdokument in Kapitel 13 einzeln aufgeführt."
];
