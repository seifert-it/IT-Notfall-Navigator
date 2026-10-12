"use strict";

const SOURCES = {
  bsiOrg: ["BSI · Checkliste Organisatorisches", "https://www.bsi.bund.de/DE/IT-Sicherheitsvorfall/Unternehmen/Ich-habe-einen-IT-Sicherheitsvorfall-Checkliste-Organisatorisches/ich-habe-einen-it-sicherheitsvorfall-checkliste-organisatorisches.html", "Rollen, Lagebild, Kommunikation und Meldewege"],
  bsiTech: ["BSI · Vorfallunterstützung", "https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Cyber-Sicherheitslage/Reaktion/Vorfallunterstuetzung/vorfallsunterstuetzung.html", "Erste Hilfe und fachliche Unterstützung"],
  bsiRansom: ["BSI · Erste Hilfe bei schwerem IT-Sicherheitsvorfall (PDF)", "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/Themen/Ransomware_Erste-Hilfe-IT-Sicherheitsvorfall.pdf?__blob=publicationFile&v=3", "Eingrenzung, Beweissicherung, Wiederanlauf"],
  bsiReport: ["BSI · Sicherheitsvorfall melden", "https://www.bsi.bund.de/DE/IT-Sicherheitsvorfall/Unternehmen/Ich-moechte-einen-IT-Sicherheitsvorfall-melden/ich-moechte-einen-it-sicherheitsvorfall-melden.html", "Freiwillige und besondere Meldewege"],
  gdpr: ["EUR-Lex · DSGVO Art. 33 und 34", "https://eur-lex.europa.eu/eli/reg/2016/679/ojv", "Meldung an die Aufsicht und Information Betroffener"],
  bfdi: ["BfDI · Datenschutz in der Bundesverwaltung (PDF)", "https://www.bfdi.bund.de/SharedDocs/Publikationen/Infobroschueren/INFO6.pdf?__blob=publicationFile&v=34", "Einordnung von Datenschutzverletzungen"],
  church: ["Datenschutzkonferenz · Spezifische Aufsicht (PDF)", "https://www.datenschutzkonferenz-online.de/media/dskb/20190812_dsk_spezifische.pdf", "Hinweise zur kirchlichen Datenschutzaufsicht"],
  ms: ["Microsoft · Kompromittiertes Microsoft-365-Postfach", "https://learn.microsoft.com/en-us/defender-office-365/responding-to-a-compromised-email-account", "Sitzungen, MFA-Methoden, Weiterleitungen und Apps prüfen"],
  google: ["Google · Workspace-Passwort und Sitzungen zurücksetzen", "https://support.google.com/a/answer/33319", "Administrationshilfe für kompromittierte Konten"],
  apple: ["Apple · Verlorenes iPhone oder iPad", "https://support.apple.com/en-euro/101593", "Gerät suchen und als verloren markieren"],
  police: ["Polizeiliche Kriminalprävention · CEO-Fraud", "https://www.polizei-beratung.de/themen-und-tipps/gefahren-im-internet/ceo-fraud/", "Rückruf über bekannte Nummer und Betrugsanzeige"],
  policeTheft: ["Polizei · Diebstahl und gestohlenes Smartphone", "https://www.polizei-beratung.de/infos-fuer-betroffene/einbruch/", "Anzeige, Gerätedaten und Sperrung"],
  policeCyber: ["Polizei · Cybercrime: Was Betroffene tun können", "https://www.polizei-beratung.de/infos-fuer-betroffene/cybercrime/", "Strafanzeige und Beweismittel"],
  dsk: ["Datenschutzkonferenz · Zuständige Aufsichtsbehörden", "https://www.datenschutzkonferenz-online.de/datenschutzaufsichtsbehoerden.html", "Bundes-, Landes- und kirchliche Datenschutzaufsichten"],
  ransomware: ["BSI · Ransomware", "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Cyber-Sicherheitslage/Methoden-der-Cyber-Kriminalitaet/Schadprogramme/Ransomware/ransomware.html", "Lösegeld und Strafanzeige"]
};

const INCIDENTS = [
  {id:"link", icon:"↗", title:"Phishing-Link angeklickt", hint:"Eine verdächtige Seite wurde geöffnet", qs:["linkAction","personal"]},
  {id:"credentials", icon:"⌑", title:"Zugangsdaten eingegeben", hint:"Passwort oder Code auf fraglicher Seite", qs:["service","reuse","personal"]},
  {id:"account", icon:"✉", title:"E-Mail-/Cloud-Konto übernommen", hint:"Fremde Anmeldung, Nachrichten oder Dateien", qs:["service","accountAbuse","personal"]},
  {id:"malware", icon:"⚠", title:"Malware oder Ransomware", hint:"Verdächtige Datei, Verschlüsselung, Erpressung", qs:["malwareActive","spread","personal"]},
  {id:"device", icon:"▣", title:"Gerät verloren oder gestohlen", hint:"Laptop, Smartphone oder Datenträger", qs:["deviceMissing","deviceType","deviceLock","personal"]},
  {id:"loss", icon:"↶", title:"Daten verloren", hint:"Dateien gelöscht, beschädigt oder unzugänglich", qs:["lossCause","backup","personal"]},
  {id:"misdirect", icon:"➤", title:"Personenbezogene Daten fehlversandt", hint:"E-Mail, Brief, Link oder falsche Freigabe", qs:["misdirectAccess","sensitive","recall"]},
  {id:"mfa", icon:"◉", title:"Verdächtige MFA-Anfrage", hint:"Unbekannte Freigabe oder Anmeldecode", qs:["mfaApproved","service","personal"]},
  {id:"social", icon:"#", title:"Social-Media-Konto übernommen", hint:"Unbekannte Posts, Nachrichten oder Sperre", qs:["accountAccess","socialAbuse","personal"]},
  {id:"website", icon:"⌘", title:"Website kompromittiert", hint:"Fremde Inhalte, Weiterleitung oder Ausfall", qs:["websiteActive","websiteAccess","personal"]},
  {id:"fraud", icon:"€", title:"Zahlungs- / CEO-Fraud", hint:"Falsche Rechnung oder angebliche Leitung", qs:["payment","accountAccess","personal"]},
  {id:"other", icon:"?", title:"Sonstiger Verdachtsfall", hint:"Etwas ist auffällig, aber noch unklar", qs:["ongoing","accountAccess","personal"]}
];

const QUESTIONS = {
  linkAction:{title:"Was ist nach dem Klick passiert?",options:[["view","Nur die Seite geöffnet"],["entered","Passwort oder Code eingegeben"],["file","Datei geladen oder geöffnet"],["unknown","Ich bin unsicher"]]},
  service:{title:"Welcher Dienst ist betroffen?",options:[["microsoft","Microsoft 365 / Outlook"],["google","Google Workspace / Gmail"],["other","Anderer Dienst oder unbekannt"]]},
  reuse:{title:"Wird dieses Passwort noch woanders verwendet?",options:[["yes","Ja oder möglicherweise"],["no","Nein"],["unknown","Unbekannt"]]},
  accountAbuse:{title:"Gibt es Hinweise auf aktive Nutzung durch Fremde?",options:[["yes","Ja, z. B. Nachrichten oder Weiterleitungen"],["no","Noch keine Hinweise"],["unknown","Unklar"]]},
  malwareActive:{title:"Was beobachten Sie?",options:[["ransom","Dateien verschlüsselt oder Erpressungsforderung"],["suspicious","Verdächtige Datei / Warnung, kein klarer Schaden"],["unknown","Unklar"]]},
  spread:{title:"Sind mehrere Geräte oder gemeinsame Laufwerke betroffen?",options:[["yes","Ja oder möglicherweise"],["no","Bisher nur ein Gerät"],["unknown","Unbekannt"]]},
  deviceType:{title:"Welches Gerät fehlt?",options:[["phone","Smartphone oder Tablet"],["computer","Laptop oder Computer"],["drive","USB-Stick oder Datenträger"]]},
  deviceMissing:{title:"Wurde das Gerät gestohlen?",options:[["stolen","Ja, Diebstahl oder Raub"],["lost","Nein, vermutlich verloren"],["unknown","Unklar"]]},
  deviceLock:{title:"War es geschützt?",options:[["yes","Sperrcode und Verschlüsselung bekannt"],["no","Nein oder nur teilweise"],["unknown","Unbekannt"]]},
  lossCause:{title:"Wie sind die Daten verloren gegangen?",options:[["deleted","Gelöscht oder überschrieben"],["outage","System / Cloud nicht erreichbar"],["attack","Angriff oder Schadsoftware möglich"],["unknown","Unbekannt"]]},
  backup:{title:"Gibt es eine geprüfte Sicherung?",options:[["yes","Ja"],["no","Nein"],["unknown","Unbekannt"]]},
  misdirectAccess:{title:"Konnten Unbefugte die Daten sehen?",options:[["yes","Ja oder wahrscheinlich"],["no","Nachweislich nein"],["unknown","Unklar"]]},
  sensitive:{title:"Sind besonders sensible Daten betroffen?",options:[["yes","Ja, z. B. Gesundheit, Seelsorge, Kinder"],["no","Nein"],["unknown","Unbekannt"]]},
  recall:{title:"Ist eine Rücknahme oder Sperrung noch möglich?",options:[["yes","Ja, z. B. Linkfreigabe oder Rückruf"],["no","Nein"],["unknown","Unbekannt"]]},
  mfaApproved:{title:"Haben Sie eine unbekannte Anfrage bestätigt?",options:[["yes","Ja"],["no","Nein"],["unknown","Ich bin unsicher"]]},
  accountAccess:{title:"Haben Sie noch Kontrolle über das Konto?",options:[["yes","Ja"],["no","Nein"],["unknown","Unklar"]]},
  socialAbuse:{title:"Wurden bereits fremde Inhalte oder Nachrichten versendet?",options:[["yes","Ja"],["no","Bisher nicht"],["unknown","Unbekannt"]]},
  websiteActive:{title:"Ist die schädliche Änderung öffentlich sichtbar?",options:[["yes","Ja"],["no","Nein"],["unknown","Unklar"]]},
  websiteAccess:{title:"Haben Sie noch Zugang zum Hosting / CMS?",options:[["yes","Ja"],["no","Nein"],["unknown","Unklar"]]},
  payment:{title:"Wurde schon Geld überwiesen?",options:[["yes","Ja"],["no","Nein"],["unknown","Unbekannt"]]},
  ongoing:{title:"Besteht gerade eine akute Störung oder Gefahr?",options:[["yes","Ja"],["no","Nein"],["unknown","Unklar"]]},
  personal:{title:"Könnten personenbezogene Daten betroffen sein?",options:[["yes","Ja oder möglicherweise"],["no","Nach bisherigem Stand nein"],["unknown","Unbekannt"]]}
};
