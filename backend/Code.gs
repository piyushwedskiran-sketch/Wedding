/**
 * Piyush weds Kiran — Google Apps Script backend
 * Spreadsheet tabs: Guests and RSVPs. Deploy as a Web app: Execute as Me, access Anyone.
 */
const GUEST_SHEET = 'Guests';
const RSVP_SHEET = 'RSVPs';
const REQUIRED_GUEST_COLUMNS = ['PIN', 'Name', 'Ring Ceremony', 'Shagun', 'Sangeet', 'Cocktail', 'Mehendi', 'Haldi', 'Wedding'];
const RSVP_COLUMNS = ['Submitted At', 'PIN', 'Invited Guest', 'Attending?', 'RSVP Name', 'Date of Arrival', 'Number of People', 'Meal Preference', 'Message for the Couple'];

function doGet(e) {
  const callback = e.parameter.callback;
  try {
    const action = e.parameter.action || '';
    if (action === 'lookup') {
      const pin = String(e.parameter.pin || '').trim();
      if (!/^\d{6}$/.test(pin)) return json_({ ok: false, error: 'A six-digit PIN is required.' }, callback);
      const row = findGuest_(pin);
      return json_(row ? { ok: true, guest: guestPayload_(row), rsvp: rsvpForPin_(pin) } : { ok: false, error: 'This PIN was not found.' }, callback);
    }
    if (action === 'rsvp') return json_(saveRsvp_(e.parameter), callback);
    if (action === 'deleteRsvp') return json_(deleteRsvp_(e.parameter), callback);
    return json_({ ok: false, error: 'Unsupported request.' }, callback);
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Unable to process the request.' }, callback);
  }
}

function doPost(e) {
  try {
    const data = e.postData && e.postData.contents ? JSON.parse(e.postData.contents || '{}') : e.parameter;
    if (data.action === 'rsvp') return json_(saveRsvp_(data));
    if (data.action === 'deleteRsvp') return json_(deleteRsvp_(data));
    return json_({ ok: false, error: 'Unsupported request.' });
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Unable to save the RSVP.' });
  }
}

function saveRsvp_(data) {
  const pin = String(data.pin || '').trim();
  const guest = findGuest_(pin);
  if (!guest) throw Error('Your invitation could not be verified.');

  const name = clean_(data.name, 100);
  const message = clean_(data.message, 500);
  const attending = clean_(data.attending, 3).toLowerCase();
  const guests = Number(data.guests);
  const arrival = clean_(data.arrivalDate, 20);
  const mealPreference = clean_(data.mealPreference, 10).toLowerCase();

  if (!['yes', 'no'].includes(attending) || !name) throw Error('Please complete every RSVP field.');
  if (attending === 'yes' && (!Number.isInteger(guests) || guests < 1 || guests > 20 || !/^\d{4}-\d{2}-\d{2}$/.test(arrival) || !['veg', 'non-veg'].includes(mealPreference))) {
    throw Error('Please complete your arrival, guest count, and meal preference.');
  }

  const meta = getRsvpMeta_(true);
  const response = {
    'Submitted At': new Date(),
    'PIN': pin,
    'Invited Guest': guest.Name,
    'Attending?': attending === 'yes' ? 'Yes' : 'No',
    'RSVP Name': name,
    'Date of Arrival': attending === 'yes' ? arrival : '',
    'Number of People': attending === 'yes' ? guests : '',
    'Meal Preference': attending === 'yes' ? (mealPreference === 'veg' ? 'Veg' : 'Non-Veg') : '',
    'Message for the Couple': message
  };
  const responseRow = meta.headers.map(header => Object.prototype.hasOwnProperty.call(response, header) ? response[header] : '');
  const existingIndex = meta.values.slice(meta.headerIndex + 1).findIndex(row => String(row[meta.pinIndex] || '').trim() === pin);

  if (existingIndex >= 0) {
    meta.sheet.getRange(meta.headerIndex + existingIndex + 2, 1, 1, meta.headers.length).setValues([responseRow]);
  } else {
    meta.sheet.getRange(meta.sheet.getLastRow() + 1, 1, 1, meta.headers.length).setValues([responseRow]);
  }
  return { ok: true, rsvp: rsvpForPin_(pin) };
}

function deleteRsvp_(data) {
  const pin = String(data.pin || '').trim();
  if (!findGuest_(pin)) throw Error('Your invitation could not be verified.');
  const meta = getRsvpMeta_(false);
  if (!meta) return { ok: true };
  const rowsToDelete = [];
  meta.values.slice(meta.headerIndex + 1).forEach((row, index) => {
    if (String(row[meta.pinIndex] || '').trim() === pin) rowsToDelete.push(meta.headerIndex + index + 2);
  });
  rowsToDelete.reverse().forEach(rowNumber => meta.sheet.deleteRow(rowNumber));
  return { ok: true };
}

function findGuest_(pin) {
  return guestRows_().find(row => String(row.PIN || '').trim() === pin) || null;
}

function guestRows_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(GUEST_SHEET);
  if (!sheet) throw Error('The Guests sheet is missing.');
  const values = sheet.getDataRange().getDisplayValues();
  const headerIndex = values.findIndex(row => row.map(String).map(header => header.trim()).includes('PIN'));
  if (headerIndex < 0) throw Error('The Guests sheet needs a header row containing PIN.');
  const headers = values[headerIndex].map(header => header.trim());
  REQUIRED_GUEST_COLUMNS.forEach(column => {
    if (!headers.includes(column)) throw Error(`Missing Guests column: ${column}`);
  });
  return values
    .slice(headerIndex + 1)
    .filter(row => row.some(Boolean))
    .map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
}

function guestPayload_(row) {
  const yes = value => ['true', 'yes', '1', 'y'].includes(String(value || '').trim().toLowerCase());
  return {
    pin: String(row.PIN),
    name: row.Name,
    ringCeremony: yes(row['Ring Ceremony']),
    shagun: yes(row.Shagun),
    sangeet: yes(row.Sangeet),
    cocktail: yes(row.Cocktail),
    mehendi: yes(row.Mehendi),
    haldi: yes(row.Haldi),
    wedding: yes(row.Wedding),
    venueName: row['Venue Name'] || '',
    venueAddress: row['Venue Address'] || '',
    directionsUrl: row['Directions URL'] || ''
  };
}

function rsvpForPin_(pin) {
  const meta = getRsvpMeta_(false);
  if (!meta) return null;
  const matchingRows = meta.values.slice(meta.headerIndex + 1).filter(row => String(row[meta.pinIndex] || '').trim() === pin);
  if (!matchingRows.length) return null;
  const row = matchingRows[matchingRows.length - 1];
  const value = header => row[meta.headers.indexOf(header)] || '';
  const attendingValue = String(value('Attending?')).trim().toLowerCase();
  const attending = ['yes', 'y', 'true'].includes(attendingValue) ? 'yes' : attendingValue === 'no' ? 'no' : '';
  if (!attending) return null;
  const meal = String(value('Meal Preference')).trim().toLowerCase();
  return {
    attending: attending,
    name: String(value('RSVP Name')).trim(),
    arrivalDate: inputDate_(value('Date of Arrival')),
    guests: String(value('Number of People')).trim(),
    mealPreference: meal === 'non-veg' ? 'non-veg' : meal === 'veg' ? 'veg' : '',
    message: String(value('Message for the Couple')).trim()
  };
}

function getRsvpMeta_(createIfMissing) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(RSVP_SHEET);
  if (!sheet && !createIfMissing) return null;
  if (!sheet) {
    sheet = ss.insertSheet(RSVP_SHEET);
    sheet.appendRow(RSVP_COLUMNS);
    sheet.setFrozenRows(1);
  }
  const values = sheet.getDataRange().getValues();
  const headerIndex = values.findIndex(row => row.map(value => String(value).trim()).includes('PIN'));
  if (headerIndex < 0) throw Error('The RSVPs sheet needs a header row containing PIN.');
  const headers = values[headerIndex].map(value => String(value).trim());
  RSVP_COLUMNS.forEach(column => {
    if (!headers.includes(column)) throw Error(`Missing RSVPs column: ${column}`);
  });
  return { sheet: sheet, values: values, headerIndex: headerIndex, headers: headers, pinIndex: headers.indexOf('PIN') };
}

function inputDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const text = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const indianDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (indianDate) return `${indianDate[3]}-${indianDate[2].padStart(2, '0')}-${indianDate[1].padStart(2, '0')}`;
  return '';
}

function clean_(value, max) {
  return String(value || '').trim().replace(/[<>]/g, '').slice(0, max);
}

function json_(object, callback) {
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]{0,100}$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(object)});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once only when starting with an empty spreadsheet. */
function setupGuestSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(GUEST_SHEET);
  if (!sheet) sheet = ss.insertSheet(GUEST_SHEET);
  if (!sheet.getLastRow()) sheet.appendRow([...REQUIRED_GUEST_COLUMNS, 'Venue Name', 'Venue Address', 'Directions URL', 'Notes']);
  sheet.setFrozenRows(1);
}
