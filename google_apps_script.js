/**
 * GOOGLE APPS SCRIPT BACKEND PER IL SITO DELLA FONDAZIONE GERONIMO STILTON
 * 
 * ISTRUZIONI DI CONFIGURAZIONE:
 * 1. Crea un nuovo Foglio Google.
 * 2. Clicca su "Estensioni" -> "Apps Script".
 * 3. Cancella tutto il codice presente e incolla questo script.
 * 4. Clicca sull'icona Salva (floppy disk).
 * 5. Clicca su "Distribuisci" (Deploy) in alto a destra -> "Nuova distribuzione" (New deployment).
 * 6. Tipo: Seleziona "Applicazione web" (Web app).
 * 7. Descrizione: "Stilton Backend".
 * 8. Esegui come: "Tu" (il tuo account proprietario).
 * 9. Chi ha accesso: Seleziona "Chiunque" (Anyone) - importante per permettere al sito di leggere/scrivere.
 * 10. Clicca su "Distribuisci". Ti chiederà di autorizzare l'accesso (clicca su "Autorizza accesso", seleziona il tuo account Google, clicca su "Avanzate" e poi "Vai a Progetto senza titolo (non sicura)" ed infine "Consenti").
 * 11. Copia l'URL dell'applicazione web fornito (deve finire con /exec).
 * 12. Incolla questo URL nella costante `GOOGLE_SCRIPT_URL` nel file `app.js` del sito.
 */

function doGet(e) {
  var action = e.parameter.action;
  var result = {};
  
  if (action === "getEvents") {
    result = getEvents();
  } else if (action === "getDonations") {
    result = getDonations();
  } else if (action === "getData") {
    result = {
      events: getEvents(),
      donations: getDonations()
    };
  } else {
    result = { status: "error", message: "Azione sconosciuta o mancante" };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var result = {};
    
    if (action === "addEvent") {
      result = addEvent(data.event);
    } else if (action === "deleteEvent") {
      result = deleteEvent(data.id);
    } else if (action === "saveDonations") {
      result = saveDonations(data.donations);
    } else {
      result = { status: "error", message: "Azione POST sconosciuta o mancante" };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Funzione helper per ottenere o creare un foglio con un determinato nome
function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// Legge gli incontri/eventi dal Foglio Google "Events"
function getEvents() {
  var sheet = getOrCreateSheet("Events");
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    // Foglio vuoto o solo intestazioni: inizializza con i dati di esempio se vuoto
    if (lastRow === 0) {
      sheet.appendRow(["id", "title_it", "title_en", "date", "desc_it", "desc_en", "img"]);
    }
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var events = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var event = {};
    for (var j = 0; j < headers.length; j++) {
      event[headers[j]] = row[j];
    }
    events.push(event);
  }
  return events;
}

// Legge le donazioni dal Foglio Google "Donations"
function getDonations() {
  var sheet = getOrCreateSheet("Donations");
  var lastRow = sheet.getLastRow();
  var donations = {};
  
  if (lastRow > 0) {
    var data = sheet.getDataRange().getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) {
        donations[data[i][0]] = data[i][1];
      }
    }
  }
  
  // Se non ci sono dati, ritorna dei valori di default per evitare schermate vuote al primo caricamento
  if (Object.keys(donations).length === 0) {
    donations = {
      beneficiario: "Fondazione Geronimo Stilton",
      iban: "IT99C1234512345123456789012",
      banca: "Banca dei Formaggi S.p.A.",
      swift: "BAFOIT2MXXX",
      paypalEmail: "donazioni@fondazionegeronimostilton.it",
      paypalLink: "https://www.paypal.me/fondazionestilton",
      stripeLink: "https://donate.stripe.com/demo"
    };
  }
  return donations;
}

// Aggiunge un incontro al Foglio "Events"
function addEvent(event) {
  var sheet = getOrCreateSheet("Events");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "title_it", "title_en", "date", "desc_it", "desc_en", "img"]);
  }
  
  // Aggiunge la riga in fondo
  sheet.appendRow([
    event.id,
    event.title_it,
    event.title_en,
    event.date,
    event.desc_it,
    event.desc_en,
    event.img
  ]);
  
  return { status: "success", events: getEvents() };
}

// Elimina un incontro dal Foglio "Events" cercando per id
function deleteEvent(id) {
  var sheet = getOrCreateSheet("Events");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1); // deleteRow è 1-based e la riga 1 è l'intestazione
      break;
    }
  }
  return { status: "success", events: getEvents() };
}

// Salva la configurazione delle donazioni nel Foglio "Donations"
function saveDonations(donations) {
  var sheet = getOrCreateSheet("Donations");
  sheet.clear(); // Pulisce il foglio precedente
  
  for (var key in donations) {
    sheet.appendRow([key, donations[key]]);
  }
  
  return { status: "success", donations: getDonations() };
}
