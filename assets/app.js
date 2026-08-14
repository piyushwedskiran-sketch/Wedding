/* Set this to your deployed Google Apps Script Web App URL. */
const API_URL = 'https://script.google.com/macros/s/AKfycbwPOX_vH5rOz5bcPMK5qhsO1y56b9jyPS2R_bTbD4QEZNhTXwPx_jkiLao5kEF9PRM/exec';

const ELEGANZA = {
  name: 'Hotel The Eleganza',
  address: '8WVF+R3R, Hotel The Eleganza, Jhajra, Uttarakhand 248015'
};
const ANNFIELD = {
  name: 'Annfield Lawn by Monga Tent House',
  address: 'FQ67+72R, Kotwali Bypass Rd, Fatehpur, Vikasnagar, Uttarakhand 248198'
};
const EVENTS = [
  { key: 'shagun', date: '10 December 2026', day: '10', month: 'Dec', name: 'Shagun', time: '5:00 PM', setting: 'Rooftop', venue: ELEGANZA },
  { key: 'ringCeremony', date: '10 December 2026', day: '10', month: 'Dec', name: 'Ring Ceremony', time: '6:00 PM', setting: 'Rooftop', venue: ELEGANZA },
  { key: 'sangeet', date: '10 December 2026', day: '10', month: 'Dec', name: 'Sangeet', time: '7:00 PM', setting: 'Rooftop', venue: ELEGANZA },
  { key: 'mehendi', date: '11 December 2026', day: '11', month: 'Dec', name: 'Mehendi', time: '6:00 PM', setting: 'Main Hall', venue: ELEGANZA },
  { key: 'cocktail', date: '11 December 2026', day: '11', month: 'Dec', name: 'Cocktail', time: '7:00 PM', setting: 'Rooftop', venue: ELEGANZA },
  { key: 'haldi', date: '12 December 2026', day: '12', month: 'Dec', name: 'Haldi', time: '10:00 AM', setting: 'Rooftop', venue: ELEGANZA },
  { key: 'wedding', date: '12 December 2026', day: '12', month: 'Dec', name: 'Baraat Departure', time: '6:00 PM', setting: 'Hotel The Eleganza', venue: ELEGANZA },
  { key: 'wedding', date: '12 December 2026', day: '12', month: 'Dec', name: 'Marriage', time: '6:00 PM', setting: 'Annfield Lawn', venue: ANNFIELD }
];

let guest = null;
const $ = selector => document.querySelector(selector);
const mapsUrl = address => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
let openingMessageTimer;

function clearLegacyDeviceData() {
  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith('piyush-kiran-rsvp:')) localStorage.removeItem(key);
    }
  } catch {
    // Storage may be disabled; this website does not depend on it.
  }
}

function scheduleOpeningMessage(delay = 4200) {
  clearTimeout(openingMessageTimer);
  openingMessageTimer = setTimeout(() => $('#openingMessage').classList.add('is-visible'), delay);
}

function revealWelcome() {
  $('#openingScreen').classList.add('hidden');
  $('#authScreen').classList.remove('hidden');
  $('#authScreen').classList.add('login-enter');
  $('#pin').focus();
  startLandingCountdown();
}

clearLegacyDeviceData();
scheduleOpeningMessage();

$('#continueJourney').addEventListener('click', async () => {
  const audio = $('#weddingMusic');
  const button = $('#soundButton');
  try {
    await audio.play();
    button.setAttribute('aria-label', 'Mute music');
    button.querySelector('i').textContent = 'Mute';
  } catch {
    button.querySelector('i').textContent = 'Music';
  }
  $('#openingScreen').classList.add('opening-exit');
  setTimeout(revealWelcome, 950);
});

$('#soundButton').addEventListener('click', async () => {
  const audio = $('#weddingMusic');
  const button = $('#soundButton');
  try {
    if (audio.paused) {
      await audio.play();
      button.setAttribute('aria-label', 'Mute music');
      button.querySelector('i').textContent = 'Mute';
    } else {
      audio.pause();
      button.setAttribute('aria-label', 'Play music');
      button.querySelector('i').textContent = 'Music';
    }
  } catch {
    button.querySelector('i').textContent = 'Add music file';
  }
});

function jsonp(params) {
  return new Promise((resolve, reject) => {
    const callback = `weddingReply_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const query = new URLSearchParams({ ...params, callback, _t: Date.now() });
    const clean = () => {
      delete window[callback];
      script.remove();
    };
    window[callback] = data => {
      clean();
      resolve(data);
    };
    script.onerror = () => {
      clean();
      reject(Error('Unable to reach the invitation service. Please try again.'));
    };
    script.src = `${API_URL}?${query}`;
    document.head.appendChild(script);
  });
}

$('#pinForm').addEventListener('submit', async event => {
  event.preventDefault();
  const pin = $('#pin').value.trim();
  const error = $('#authError');
  error.textContent = '';
  if (!/^\d{6}$/.test(pin)) {
    error.textContent = 'Please enter a valid six-digit PIN.';
    return;
  }
  if (API_URL.startsWith('PASTE_')) {
    error.textContent = 'The invitation service is being prepared. Please check back shortly.';
    return;
  }

  const button = event.submitter;
  button.disabled = true;
  button.textContent = 'Verifying…';
  try {
    const response = await jsonp({ action: 'lookup', pin });
    if (!response.ok) throw Error(response.error || 'This PIN was not found.');
    guest = response.guest;
    showInvitation(response.rsvp);
  } catch (issue) {
    error.textContent = issue.message || 'Unable to verify your PIN. Please try again.';
  } finally {
    button.disabled = false;
    button.textContent = 'Open my invitation';
  }
});

function showInvitation(savedRsvp) {
  $('#authScreen').classList.add('hidden');
  const invitation = $('#invitation');
  invitation.classList.remove('hidden');
  invitation.classList.remove('is-ready');
  const greeting = $('#personalGreeting');
  greeting.replaceChildren('Dear ', Object.assign(document.createElement('strong'), { textContent: guest.name }));
  renderEvents();
  populateRsvp(savedRsvp);
  startCountdown();
  window.scrollTo(0, 0);
  requestAnimationFrame(() => invitation.classList.add('is-ready'));
}

function renderEvents() {
  const list = $('#eventList');
  const invitedEvents = EVENTS.filter(item => guest[item.key]);
  list.innerHTML = invitedEvents.map((item, index) => `
    <article class="event event-card" style="--event-index:${index}" tabindex="0" aria-label="${item.name}, ${item.date}, ${item.time}">
      <div class="event-calendar" aria-label="${item.date}"><strong>${item.day}</strong><span>${item.month}</span><small>2026</small></div>
      <div class="event-details">
        <p class="event-date">${item.date}</p>
        <h3>${item.name}</h3>
        <div class="event-facts">
          <span><b>Time</b>${item.time}</span>
          <span><b>At</b>${item.setting}</span>
        </div>
        <p class="event-place"><b>${item.venue.name}</b>${item.venue.address}</p>
        <a class="event-directions" href="${mapsUrl(item.venue.address)}" target="_blank" rel="noopener">View directions <span>↗</span></a>
      </div>
    </article>`).join('');
  if (!invitedEvents.length) {
    list.innerHTML = '<p class="section-copy">Your celebration details will be shared soon.</p>';
  }
}

function populateRsvp(rsvp, justSaved = false) {
  const form = $('#rsvpForm');
  form.reset();
  $('#rsvpName').value = rsvp?.name || '';
  $('#attending').value = rsvp?.attending || '';
  form.elements.arrivalDate.value = rsvp?.arrivalDate || '';
  form.elements.guests.value = rsvp?.guests || '';
  form.elements.mealPreference.value = rsvp?.mealPreference || '';
  form.elements.message.value = rsvp?.message || '';
  updateRsvpFields();

  const hasSavedResponse = Boolean(rsvp?.attending);
  $('#editRsvp').classList.toggle('hidden', !hasSavedResponse);
  $('#clearRsvp').classList.toggle('hidden', !hasSavedResponse);
  form.querySelector('[type="submit"]').textContent = hasSavedResponse ? 'Update RSVP' : 'Send RSVP';
  setRsvpEditing(!hasSavedResponse);
  $('#rsvpStatus').textContent = hasSavedResponse
    ? (justSaved ? 'Your RSVP has been saved. You may edit it at any time.' : 'Your saved RSVP is shown below. You may edit it at any time.')
    : '';
}

function updateRsvpFields() {
  const declining = $('#attending').value === 'no';
  const details = $('#attendanceDetails');
  details.classList.toggle('hidden', declining);
  details.querySelectorAll('input,select').forEach(control => {
    control.disabled = declining;
    control.required = !declining;
  });
  details.querySelectorAll('input[name="mealPreference"]').forEach((control, index) => {
    control.required = !declining && index === 0;
  });
}

$('#attending').addEventListener('change', updateRsvpFields);

function setRsvpEditing(editing) {
  const form = $('#rsvpForm');
  form.querySelectorAll('input,select,textarea,[type="submit"]').forEach(control => {
    control.disabled = !editing;
  });
  if (editing) updateRsvpFields();
}

$('#editRsvp').addEventListener('click', () => {
  setRsvpEditing(true);
  $('#rsvpStatus').textContent = 'You can now update your response.';
  $('#editRsvp').classList.add('hidden');
  $('#rsvpForm').querySelector('[type="submit"]').textContent = 'Update RSVP';
});

$('#clearRsvp').addEventListener('click', async () => {
  if (!guest || !confirm('Clear your saved RSVP? This removes only your response and cannot be undone.')) return;
  const button = $('#clearRsvp');
  const status = $('#rsvpStatus');
  button.disabled = true;
  button.textContent = 'Clearing…';
  try {
    const response = await jsonp({ action: 'deleteRsvp', pin: guest.pin });
    if (!response.ok) throw Error(response.error);
    populateRsvp(null);
    status.textContent = 'Your RSVP has been cleared. You may send a new response whenever you are ready.';
  } catch (issue) {
    status.textContent = issue.message || 'We could not clear your RSVP. Please try again.';
  } finally {
    button.disabled = false;
    button.textContent = 'Clear my RSVP';
  }
});

$('#rsvpForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!guest) return;
  const status = $('#rsvpStatus');
  const button = event.submitter;
  if (API_URL.startsWith('PASTE_')) {
    status.textContent = 'RSVP service is being prepared.';
    return;
  }

  button.disabled = true;
  button.textContent = 'Sending…';
  const data = Object.fromEntries(new FormData(event.target));
  data.action = 'rsvp';
  data.pin = guest.pin;
  try {
    const response = await jsonp(data);
    if (!response.ok) throw Error(response.error);
    const savedRsvp = response.rsvp || {
      attending: data.attending,
      name: data.name,
      arrivalDate: data.arrivalDate || '',
      guests: data.guests || '',
      mealPreference: data.mealPreference || '',
      message: data.message || ''
    };
    populateRsvp(savedRsvp, true);
  } catch (issue) {
    status.textContent = issue.message || 'We could not send your RSVP. Please try again.';
    button.disabled = false;
    if (button.textContent === 'Sending…') button.textContent = 'Send RSVP';
  }
});

function resetForFreshVisit() {
  guest = null;
  $('#pinForm').reset();
  $('#rsvpForm').reset();
  $('#authError').textContent = '';
  $('#rsvpStatus').textContent = '';
  $('#editRsvp').classList.add('hidden');
  $('#clearRsvp').classList.add('hidden');
  setRsvpEditing(true);
  $('#invitation').classList.add('hidden');
  $('#invitation').classList.remove('is-ready');
  $('#authScreen').classList.add('hidden');
  $('#authScreen').classList.remove('login-enter');
  $('#openingScreen').classList.remove('hidden', 'opening-exit');
  $('#openingMessage').classList.remove('is-visible');
  const audio = $('#weddingMusic');
  audio.pause();
  audio.currentTime = 0;
  $('#soundButton').setAttribute('aria-label', 'Play music');
  $('#soundButton').querySelector('i').textContent = 'Music';
  window.scrollTo(0, 0);
  scheduleOpeningMessage();
}

window.addEventListener('pageshow', event => {
  if (event.persisted) resetForFreshVisit();
});

function startCountdown() {
  const target = new Date('2026-12-12T18:00:00+05:30');
  const tick = () => {
    const remaining = Math.max(0, target - Date.now());
    const parts = [Math.floor(remaining / 864e5), Math.floor(remaining / 36e5) % 24, Math.floor(remaining / 6e4) % 60, Math.floor(remaining / 1e3) % 60];
    document.querySelectorAll('#countdown b').forEach((node, index) => node.textContent = String(parts[index]).padStart(2, '0'));
  };
  tick();
  setInterval(tick, 1000);
}

function startLandingCountdown() {
  if (startLandingCountdown.done) return;
  startLandingCountdown.done = true;
  const target = new Date('2026-12-12T18:00:00+05:30');
  const tick = () => {
    const remaining = Math.max(0, target - Date.now());
    const parts = [Math.floor(remaining / 864e5), Math.floor(remaining / 36e5) % 24, Math.floor(remaining / 6e4) % 60, Math.floor(remaining / 1e3) % 60];
    document.querySelectorAll('#landingCountdown b').forEach((node, index) => node.textContent = String(parts[index]).padStart(2, '0'));
  };
  tick();
  setInterval(tick, 1000);
}

const canvas = $('#snow');
const context = canvas.getContext('2d');
let flakes = [];
function snow() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  flakes = Array.from({ length: Math.min(80, innerWidth / 7) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 2 + 0.4, v: Math.random() * 0.65 + 0.25 }));
}
function drawSnow() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(250,244,232,.65)';
  flakes.forEach(flake => {
    flake.y += flake.v;
    flake.x += Math.sin(flake.y * 0.01) * 0.25;
    if (flake.y > canvas.height) {
      flake.y = -4;
      flake.x = Math.random() * canvas.width;
    }
    context.beginPath();
    context.arc(flake.x, flake.y, flake.r, 0, 7);
    context.fill();
  });
  requestAnimationFrame(drawSnow);
}
addEventListener('resize', snow);
snow();
drawSnow();

const fireworks = $('#fireworks');
const fireContext = fireworks.getContext('2d');
let sparks = [];
let nextBurst = 0;
function sizeFireworks() {
  fireworks.width = innerWidth * devicePixelRatio;
  fireworks.height = innerHeight * devicePixelRatio;
  fireworks.style.width = `${innerWidth}px`;
  fireworks.style.height = `${innerHeight}px`;
  fireContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
function burst() {
  const x = innerWidth * (0.12 + Math.random() * 0.76);
  const y = innerHeight * (0.1 + Math.random() * 0.36);
  const color = ['#d6a95e', '#f7e8bd', '#9db8c5', '#e8c77f'][Math.floor(Math.random() * 4)];
  for (let index = 0; index < 54; index += 1) {
    const angle = Math.PI * 2 * index / 54 + Math.random() * 0.12;
    const speed = 1.2 + Math.random() * 3.1;
    sparks.push({ x, y, px: x, py: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color });
  }
}
function animateFireworks(now) {
  fireContext.clearRect(0, 0, innerWidth, innerHeight);
  if (!$('#authScreen').classList.contains('hidden') && now > nextBurst) {
    burst();
    nextBurst = now + 1700 + Math.random() * 1600;
  }
  sparks = sparks.filter(spark => spark.life > 0.03);
  sparks.forEach(spark => {
    spark.px = spark.x;
    spark.py = spark.y;
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy += 0.035;
    spark.vx *= 0.992;
    spark.life -= 0.016;
    fireContext.beginPath();
    fireContext.strokeStyle = spark.color;
    fireContext.globalAlpha = spark.life * 0.75;
    fireContext.lineWidth = 1.2;
    fireContext.moveTo(spark.px, spark.py);
    fireContext.lineTo(spark.x, spark.y);
    fireContext.stroke();
  });
  fireContext.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}
addEventListener('resize', sizeFireworks);
sizeFireworks();
requestAnimationFrame(animateFireworks);
