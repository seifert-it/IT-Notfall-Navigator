function addStep(target, text, sourceKey) {
  target.push({ text, src: sourceKey });
}
function common(plan){
  addStep(plan.now,"Bewahren Sie Ruhe. Informieren Sie Vorstand oder Gemeindeleitung über einen vertrauenswürdigen Kanal. Eine erreichbare Person übernimmt die Koordination und hält fest, wer welche Aufgabe erledigt.","bsiOrg");
  addStep(plan.document,"Notieren Sie Entdeckungszeit, beobachtete Symptome, betroffene Konten/Geräte/Daten und jede Maßnahme mit Uhrzeit. Bewahren Sie verdächtige Nachrichten und vorhandene Protokolle auf; löschen Sie nichts übereilt.","bsiOrg");
  addStep(plan.follow,"Prüfen Sie, ob weitere Konten, Geräte oder Dienstleister betroffen sind. Wenn niemand im Team das beurteilen kann, beauftragen Sie den betreuenden IT-Dienstleister oder holen Sie unabhängige fachliche Hilfe.","bsiTech");
}
function privacy(plan,answers,force=false){
  const p=answers.personal;
  if(force||p!=="no"){
    addStep(plan.privacy,"Vorstand oder Gemeindeleitung prüft mit einer vorhandenen Datenschutzbeauftragten oder externer Beratung, ob personenbezogene Daten verletzt wurden und welches Risiko für Betroffene besteht. Fehlt eine solche Person, beginnen Sie die Prüfung trotzdem sofort und dokumentieren die Entscheidung.","gdpr");
    addStep(plan.privacy,"Für DSGVO-Verantwortliche gilt: Eine meldepflichtige Verletzung ist der zuständigen Aufsicht unverzüglich und möglichst binnen 72 Stunden nach Bekanntwerden zu melden; bei voraussichtlich hohem Risiko sind Betroffene grundsätzlich ebenfalls unverzüglich zu informieren. Nicht jeder Vorfall ist automatisch meldepflichtig.","gdpr");
    addStep(plan.privacy,"Kirchengemeinden prüfen das für sie geltende kirchliche Datenschutzrecht und die kirchliche Aufsicht; Vereine in der Regel die zuständige Landesdatenschutzaufsicht. Behörden prüfen ihren zuständigen Meldeweg.","dsk");
    addStep(plan.external,"Datenschutzaufsicht: Bei meldepflichtiger Datenschutzverletzung die zuständige Landes- oder kirchliche Aufsicht fristgerecht informieren. Bei hohem Risiko für Menschen auch die Betroffenen informieren. Vorstand oder Gemeindeleitung veranlasst dies; fehlende IT- oder Datenschutzstellen verschieben die Prüfung nicht.","gdpr");
  }
  else{
    addStep(plan.privacy,"Halten Sie fest, warum nach bisherigem Stand keine personenbezogenen Daten betroffen sind. Prüfen Sie diese Einschätzung bei neuen Erkenntnissen erneut.","gdpr");
  }
}
function accountSteps(plan,answers){
  addStep(plan.now,"Sichern Sie das betroffene Konto über eine selbst eingegebene, bekannte Anmeldeseite oder durch den Anbieter. Ändern Sie das Passwort von einem vertrauenswürdigen Gerät aus; bei fehlendem Zugriff den offiziellen Support kontaktieren.","ms");
  addStep(plan.now,"Bitten Sie den Anbieter oder eine berechtigte Person mit Verwaltungszugang, aktive Sitzungen zu beenden und MFA-Methoden, Wiederherstellungsdaten, Weiterleitungsregeln und verbundene Apps zu prüfen. Geben Sie dabei keine Passwörter weiter.","ms");
  if(answers.service==="microsoft")addStep(plan.follow,"Bei Microsoft 365: Die Betreiberin oder der Betreiber des Mandanten kann die offizielle Admin-Hilfe zur Reaktion auf kompromittierte Postfächer nutzen.","ms");
  if(answers.service==="google")addStep(plan.follow,"Bei Google Workspace: Eine Person mit Verwaltungszugang kann Passwort und Anmelde-Cookies zurücksetzen.","google");
  if(answers.reuse!=="no")addStep(plan.follow,"Falls dasselbe Passwort anderswo verwendet wurde oder dies unklar ist: diese Zugänge von einem vertrauenswürdigen Gerät aus mit jeweils neuen, einzigartigen Passwörtern sichern.","bsiTech");
  addStep(plan.document,"Prüfen Sie Anmeldeverlauf, versendete Nachrichten, Freigaben und mögliche Datenabflüsse mit dem Anbieter. Warnen Sie betroffene Kontakte über einen anderen Kanal, falls gefälschte Nachrichten aus dem Konto gingen.","ms");
}
function externalSteps(plan,id,a){
  const x=plan.external;
  if(["link","credentials","account","mfa"].includes(id)){
    if(id!=="link"||a.linkAction!=="view")addStep(x,"Kontoanbieter oder betreuenden IT-Dienstleister sofort über den offiziellen Kontaktweg einschalten, wenn Sie Sitzungen oder Zugänge nicht selbst sichern können.",a.service==="google"?"google":"ms");
    if(id==="account"&&a.accountAbuse!=="no"||id==="link"&&a.linkAction==="entered")addStep(x,"Angeschriebene Kontakte über einen anderen Kanal warnen, wenn aus dem Konto verdächtige Nachrichten versendet wurden. Bei Betrug, Datendiebstahl oder unbefugter Kontonutzung Strafanzeige erstatten.","policeCyber");
    if(id==="mfa"&&a.mfaApproved!=="no")addStep(x,"Bei bestätigter fremder Anmeldung oder missbräuchlicher Nutzung Strafanzeige erstatten und relevante Anmeldehinweise sichern.","policeCyber");
  }
  if(id==="malware"||id==="link"&&a.linkAction==="file"){
    addStep(x,"IT-Dienstleister oder den betroffenen Anbieter rasch hinzuziehen. Bei Erpressung oder nachgewiesenem Angriff Strafanzeige bei der Polizei erstatten und Beweismittel aufbewahren.","policeCyber");
  }
  if(id==="device"){
    if(a.deviceMissing==="stolen")addStep(x,"Polizei: Den Diebstahl anzeigen. Seriennummer oder IMEI, letzten Aufenthaltsort und vorhandene Kaufbelege bereithalten. Die Anzeige kann auch für Versicherungsfragen wichtig sein.","policeTheft");
    if(a.deviceMissing==="unknown")addStep(x,"Bei Verdacht auf Diebstahl die Polizei kontaktieren und Anzeige erstatten; ist das Gerät nur verlegt, zunächst Such- und Sperrmöglichkeiten nutzen.","policeTheft");
    if(a.deviceType==="phone")addStep(x,"Mobilfunkanbieter: SIM-Karte bei Verlust oder Diebstahl umgehend über die bekannte Hotline sperren lassen, damit Nummer und SMS-Codes nicht weiter genutzt werden.","policeTheft");
    addStep(x,"Geräte- oder Kontoanbieter kontaktieren, wenn Fernsperre, verlorener Modus oder Abmeldung von Sitzungen nötig sind.","bsiOrg");
  }
  if(id==="loss"){
    addStep(x,"Cloud- oder Backup-Anbieter kontaktieren, wenn Versionierung oder Sicherungen dort liegen. Bei vermutetem Angriff zusätzlich IT-Hilfe holen und bei bestätigter Straftat Anzeige erstatten.",a.lossCause==="attack"?"policeCyber":"bsiOrg");
  }
  if(id==="misdirect")addStep(x,"Fehladressierte direkt über einen bekannten Kanal um Löschung und Nichtweitergabe bitten. Die Bitte und jede Antwort dokumentieren.","gdpr");
  if(id==="social"){
    addStep(x,"Plattform-Support über die offizielle Hilfe für übernommene Konten einschalten; Follower und Kontakte bei fremden Posts über einen unabhängigen Kanal warnen.","bsiOrg");
    if(a.socialAbuse!=="no")addStep(x,"Bei Betrug, Erpressung oder unbefugter Nutzung Strafanzeige erstatten; Posts und Nachrichten als Belege sichern.","policeCyber");
  }
  if(id==="website"){
    addStep(x,"Hoster oder Agentur über deren bekannten Notfallkontakt einschalten. Wenn Besucher durch schädliche Inhalte oder Formulare gefährdet waren, diese über einen unabhängigen Kanal warnen.","bsiOrg");
    addStep(x,"Bei nachgewiesenem Angriff Strafanzeige erstatten. Vertragliche Informationspflichten gegenüber Auftraggebern oder Partnern prüfen.","policeCyber");
  }
  if(id==="fraud"){
    addStep(x,a.payment==="no"?"Bei einem Betrugsversuch die Polizei informieren und Anzeige erstatten; Nachricht und Zahlungsanweisung sichern.":"Bank sofort über eine bekannte Nummer kontaktieren und Zahlungsstopp oder Rückruf verlangen. Anschließend bei der Polizei Strafanzeige erstatten.","police");
    addStep(x,"Den echten Rechnungsaussteller oder die angebliche Führungsperson über eine bereits bekannte Nummer kontaktieren, damit auch weitere Betroffene gewarnt werden können.","police");
  }
  if(id==="other")addStep(x,"Bei Verdacht auf eine Straftat Polizei kontaktieren; bei Problemen mit einem konkreten Dienst dessen offiziellen Support. Wenn die Lage unklar bleibt, externe IT-Hilfe hinzuziehen.","policeCyber");
  if(["malware","device","loss","account","fraud","website"].includes(id))addStep(x,"Besteht eine Cyber- oder Sachversicherung, den Vorfall frühzeitig nach den Vertragsbedingungen melden. Auch Informationspflichten gegenüber Auftraggebern oder Vertragspartnern prüfen.","bsiOrg");
  if(["malware","account","credentials","website","fraud"].includes(id))addStep(x,"BSI: Für einzelne Organisationen bestehen besondere gesetzliche IT-Meldepflichten; prüfen Sie die passende Meldestelle. Eine freiwillige Meldung ist ebenfalls möglich.","bsiReport");
  if(!x.length)addStep(x,"Wenn nur ein verdächtiger Link geöffnet wurde und kein weiterer Schaden erkennbar ist, melden Sie Nachricht und Link dem E-Mail-Anbieter oder betreuenden Dienstleister. Bei späteren Anzeichen von Betrug oder Kontomissbrauch Polizei einschalten.","bsiOrg");
}
function buildPlan(incident,answers){
  const a = answers;
  const id = incident.id;
  const p = { now: [], follow: [], external: [], document: [], privacy: [] };
  common(p);
  if(id==="link"){
    if(a.linkAction==="entered"){
      accountSteps(p,a);
      addStep(p.now,"Wenn ein Einmalcode eingegeben oder eine MFA-Anfrage bestätigt wurde, behandeln Sie das Konto als möglicherweise übernommen und kontaktieren Sie den Anbieter oder eine Person mit Verwaltungszugang sofort.","ms");
    }
    else if(a.linkAction==="file"){
      addStep(p.now,"Öffnen Sie die Datei nicht erneut. Falls sie ausgeführt wurde oder Sicherheitswarnungen erscheinen, trennen Sie das betroffene Gerät vom Netzwerk und verwenden Sie es nicht für Anmeldungen.","bsiRansom");
      addStep(p.follow,"Lassen Sie das Gerät durch einen IT-Dienstleister prüfen, bevor es wieder Zugang zu gemeinsamen Laufwerken oder Konten erhält.","bsiTech");
      if(a.malwareActive==="ransom")addStep(p.now,"Bei Verschlüsselung oder Erpressung: Zahlen Sie kein Lösegeld aus eigener Entscheidung; eine Zahlung garantiert keine Wiederherstellung.","ransomware");
    }
    else{
      addStep(p.now,"Schließen Sie die verdächtige Seite. Geben Sie dort keine Daten ein und erlauben Sie keine Downloads oder Benachrichtigungen.","bsiTech");
      addStep(p.follow,"Bewahren Sie Link und Nachricht auf. Bitten Sie den betreuenden IT-Dienstleister oder Anbieter zu prüfen, ob Anmeldungen, Downloads oder Browserfreigaben stattgefunden haben.","bsiOrg");
    }
    if(a.linkAction==="unknown")addStep(p.now,"Da der weitere Ablauf unklar ist, lassen Sie Konto und Gerät vorsorglich fachlich prüfen; geben Sie bis dahin keine Zugangsdaten auf dem betroffenen Gerät ein.","bsiTech");
  }
  if(id==="credentials")accountSteps(p,a);
  if(id==="account"){
    accountSteps(p,a);
    if(a.accountAbuse!=="no")addStep(p.now,"Stoppen Sie missbräuchliche Freigaben und informieren Sie potenziell angeschriebene Personen über einen anderen, bekannten Kanal.","ms");
  }
  if(id==="malware"){
    addStep(p.now,"Betroffene Geräte bei laufender Infektion möglichst rasch vom Netzwerk trennen (WLAN/LAN), ohne sie weiter zu benutzen. Holen Sie umgehend IT-Hilfe; bei mehreren Systemen koordiniert Vorstand oder Gemeindeleitung die Entscheidungen.","bsiRansom");
    addStep(p.now,"Melden Sie sich auf einem möglicherweise infizierten Gerät nicht mit Administrationskonten an. Bereinigen oder setzen Sie es nicht eigenmächtig neu auf, bevor Spuren und Ausmaß bewertet sind.","bsiRansom");
    if(a.malwareActive==="ransom"){
      addStep(p.now,"Zahlen Sie kein Lösegeld aus eigener Entscheidung; eine Zahlung garantiert keine Wiederherstellung.","ransomware");
      addStep(p.follow,"Prüfen Sie unberührte Backups und planen Sie die Wiederherstellung erst nach Klärung des Angriffswegs.","bsiRansom");
    }
    if(a.spread!=="no")addStep(p.document,"Prüfen Sie mit Fachpersonal gemeinsame Laufwerke, Administratorzugänge, weitere Geräte und Dienstleister auf Betroffenheit.","bsiRansom");
  }
  if(id==="device"){
    addStep(p.now,"Prüfen Sie von einem anderen Gerät aus die betroffenen Konten und lassen Sie aktive Sitzungen bei Bedarf durch den Anbieter oder eine berechtigte Person sperren.","bsiOrg");
    if(a.deviceType==="phone")addStep(p.now,"Bei einem verwalteten Smartphone: Geräteverwaltung nutzen. Bei Apple-Geräten kann „Wo ist?“ das Gerät als verloren markieren, sofern die Funktion zuvor aktiv war.","apple");
    addStep(p.follow,"Prüfen Sie, welche Konten und lokal gespeicherten Daten erreichbar waren. Eine Fernlöschung nur nach fachlicher Abwägung, weil sie Beweissicherung und Suche beeinflussen kann.","bsiOrg");
    if(a.deviceLock!=="yes")addStep(p.privacy,"Da Schutz oder Verschlüsselung fehlen oder unklar sind, behandeln Sie einen möglichen Zugriff auf personenbezogene Daten mit erhöhter Dringlichkeit.","gdpr");
    addStep(p.document,"Dokumentieren Sie Gerätetyp, Seriennummer oder IMEI falls bekannt, letzten Aufenthaltsort, Zeitpunkt, Schutzstatus und ergriffene Sperren. Halten Sie für eine Anzeige vorhandene Kaufbelege bereit.","policeTheft");
  }
  if(id==="loss"){
    if(a.lossCause==="attack")addStep(p.now,"Wenn ein Angriff möglich ist, stoppen Sie weitere Nutzung betroffener Systeme und lassen Sie zuerst die Ursache untersuchen. Stellen Sie keine Sicherung in eine möglicherweise noch kompromittierte Umgebung zurück.","bsiRansom");
    else addStep(p.now,"Vermeiden Sie weitere Schreibvorgänge auf dem betroffenen Speicher und bitten Sie bei Bedarf den Anbieter oder IT-Dienstleister um Hilfe; zusätzliche Änderungen können die Wiederherstellung erschweren.","bsiTech");
    if(a.backup==="yes")addStep(p.follow,"Lassen Sie Umfang und Integrität der Sicherung prüfen und eine kontrollierte Wiederherstellung planen.","bsiOrg");
    else addStep(p.follow,"Klären Sie mit Provider oder Fachpersonal, ob Versionierung, Papierakten oder andere unabhängige Kopien verfügbar sind.","bsiOrg");
    addStep(p.document,"Halten Sie fest, welche Daten seit wann fehlen, wer sie benötigt und welche Dienste ausfallen. Priorisieren Sie kritische Aufgaben Ihrer Organisation.","bsiOrg");
  }
  if(id==="misdirect"){
    if(a.recall==="yes")addStep(p.now,"Sperren Sie einen falsch freigegebenen Link oder widerrufen Sie den Zugriff über die vorgesehene Funktion. Bitten Sie Empfänger über einen bekannten Kanal um Löschung und Nichtweitergabe; verlassen Sie sich nicht allein auf eine Rückruf-Funktion.","gdpr");
    else addStep(p.now,"Informieren Sie Vorstand oder Gemeindeleitung sofort. Kontaktieren Sie Fehladressierte sachlich über einen bekannten Kanal und bitten Sie um Löschung und Nichtweitergabe.","gdpr");
    addStep(p.document,"Erfassen Sie Art und Menge der Daten, Zahl und Art der Empfänger, Versandzeit, Abruf-/Zugriffsstatus und bereits erfolgte Eindämmung.","gdpr");
    if(a.sensitive!=="no"||a.misdirectAccess!=="no")addStep(p.privacy,"Bei sensiblen Daten, Kindern oder möglichem Zugriff Dritter muss die Risikoprüfung besonders zügig erfolgen; zuständige Aufsicht und Benachrichtigung Betroffener fachlich prüfen.","gdpr");
  }
  if(id==="mfa"){
    if(a.mfaApproved==="yes"||a.mfaApproved==="unknown"){
      accountSteps(p,a);
      addStep(p.now,"Behandeln Sie die unerwartete Bestätigung als möglichen Kontozugriff. Kontaktieren Sie den Anbieter oder eine Person mit Verwaltungszugang sofort.","ms");
    }
    else{
      addStep(p.now,"Lehnen Sie die unbekannte Anfrage ab. Geben Sie keinen Code weiter und bestätigen Sie keine weitere Aufforderung.","bsiTech");
      addStep(p.follow,"Prüfen Sie mit dem Anbieter den Anmeldeverlauf und melden Sie wiederholte Anfragen; ändern Sie das Passwort bei Verdacht auf Kenntnisnahme.","ms");
    }
  }
  if(id==="social"){
    addStep(p.now,"Nutzen Sie den offiziellen Wiederherstellungsweg der Plattform. Solange Zugriff besteht: Passwort ändern, fremde Sitzungen beenden und MFA sowie Rollen prüfen. Bei fehlendem Zugriff den Plattform-Support einschalten.","bsiTech");
    if(a.socialAbuse!=="no")addStep(p.now,"Warnen Sie Follower und Kontakte über einen anderen Kanal vor fremden Posts, Links oder Zahlungsaufrufen.","bsiOrg");
    addStep(p.follow,"Prüfen Sie verbundene E-Mail-Konten, Werbekonten, Seitenadministratoren und hinterlegte Zahlungsarten gemeinsam mit den Berechtigten.","bsiOrg");
    addStep(p.document,"Sichern Sie Links und Screenshots auffälliger Posts, Zeitpunkte, Reichweite und mögliche Direktnachrichten.","bsiOrg");
  }
  if(id==="website"){
    if(a.websiteActive!=="no")addStep(p.now,"Kontaktieren Sie den Hoster sofort. Lassen Sie schädliche Inhalte oder Weiterleitungen durch Berechtigte sperren; Besucher gegebenenfalls über einen unabhängigen Kanal warnen.","bsiTech");
    if(a.websiteAccess==="no")addStep(p.now,"Nutzen Sie den offiziellen Notfallkontakt des Hosters. Versuchen Sie keine improvisierten Eingriffe über unbekannte Zugänge.","bsiTech");
    addStep(p.follow,"Lassen Sie CMS, Plugins, Konten, Veröffentlichungen und Protokolle prüfen. Wiederherstellung erst nach Schließen der Ursache und aus vertrauenswürdiger Sicherung.","bsiRansom");
    addStep(p.document,"Dokumentieren Sie veränderte Seiten, Zeiträume, mögliche Downloads/Formulare und betroffene Besucher oder Daten.","bsiOrg");
  }
  if(id==="fraud"){
    if(a.payment==="yes"||a.payment==="unknown")addStep(p.now,"Rufen Sie sofort Ihre Bank über eine bekannte Nummer an und fragen Sie nach Stopp oder Rückruf der Zahlung.","police");
    else addStep(p.now,"Stoppen Sie die Zahlung. Prüfen Sie die Anweisung durch Rückruf bei der angeblichen Person über eine bereits bekannte Nummer, nicht über Angaben in der Nachricht.","police");
    if(a.accountAccess!=="no")addStep(p.follow,"Prüfen Sie, ob ein echtes E-Mail-Konto missbraucht wurde; bei Anzeichen dafür Konto und Sitzungen durch den Anbieter oder eine berechtigte Person sichern.","ms");
    addStep(p.document,"Sichern Sie Rechnung, Nachricht, Zahlungsdaten, Kommunikationswege und Zeitpunkte. Legen Sie die Prüfung von Kontodaten für künftige Zahlungen fest.","police");
  }
  if(id==="other"){
    if(a.ongoing!=="no")addStep(p.now,"Holen Sie Hilfe vom betreuenden IT-Dienstleister oder Anbieter. Falls ein Gerät offensichtlich weitere Systeme gefährdet, trennen Sie es vom Netzwerk und benutzen es nicht weiter.","bsiTech");
    addStep(p.follow,"Klären Sie systematisch: Was ist ungewöhnlich, seit wann, wer hat es beobachtet, welche Systeme und Personen könnten betroffen sein? Holen Sie bei unklarer Lage externe Hilfe.","bsiOrg");
  }
  externalSteps(p,id,a);
  privacy(p,a,id==="misdirect");
  return p;
}
