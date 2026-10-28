import 'bootstrap/js/dist/tab.js';
import 'bootstrap/js/dist/menu.js';
import 'bootstrap/js/dist/dialog.js';
import { installGeoEnhancements } from './geo-enhancements.js';

installGeoEnhancements();

const storageKey = 'geo-bootstrap-6-guestbook';
const initialEntries = [
  { name: 'cosmic_surfer_96', message: 'Finally, a website with enough spinning globes. Bookmarked!', date: 'A fellow web surfer' },
  { name: 'pixel_pal', message: 'Love the colours!! Adding this to my cool links page.', date: 'Somewhere in cyberspace' },
  { name: 'the_webmaster', message: 'First! Welcome to the guestbook. Leave a little hello.', date: 'Keeper of the homepage' },
];
let savedEntries = [];
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) savedEntries = stored.filter(entry => entry && typeof entry.name === 'string' && typeof entry.message === 'string' && typeof entry.date === 'string').slice(0, 20);
} catch { /* The guestbook still works when browser storage is unavailable. */ }
let entries = [...savedEntries, ...initialEntries];

function renderEntries() {
  const container = document.querySelector('#guestbook-entries');
  container.replaceChildren();
  for (const entry of entries.slice(0, 4)) {
    const article = document.createElement('article');
    article.className = 'guestbook-entry';
    const name = document.createElement('strong');
    name.textContent = entry.name;
    const date = document.createElement('small');
    date.textContent = entry.date;
    const top = document.createElement('div');
    top.className = 'entry-topline';
    top.append(name, date);
    const message = document.createElement('p');
    message.textContent = entry.message;
    article.append(top, message);
    container.append(article);
  }
}
renderEntries();

document.querySelector('#guestbook-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#guest-name');
  const message = document.querySelector('#guest-message');
  const fields = [[name, name.value.trim().length >= 2], [message, message.value.trim().length >= 5]];
  for (const [field, valid] of fields) {
    field.classList.toggle('is-invalid', !valid);
    field.setAttribute('aria-invalid', String(!valid));
  }
  const invalid = fields.find(([, valid]) => !valid);
  if (invalid) {
    document.querySelector('#guestbook-status').textContent = 'A couple of details need your attention.';
    invalid[0].focus();
    return;
  }
  const entry = { name: name.value.trim(), message: message.value.trim(), date: 'Just surfed in' };
  entries.unshift(entry);
  let status = 'You’re in the guestbook! Thanks for stopping by.';
  if (document.querySelector('#guest-remember').checked) {
    try {
      savedEntries = [entry, ...savedEntries].slice(0, 20);
      localStorage.setItem(storageKey, JSON.stringify(savedEntries));
    } catch { status += ' Browser storage is unavailable; this message lasts until you reload.'; }
  }
  renderEntries();
  event.target.reset();
  for (const [field] of fields) field.removeAttribute('aria-invalid');
  document.querySelector('#guestbook-status').textContent = status;
});

for (const button of document.querySelectorAll('[data-demo]')) {
  button.addEventListener('click', () => {
    document.querySelector('#button-status').textContent = `${button.dataset.demo} button clicked. That’s one small click for you, one giant leap for your homepage.`;
  });
}

const motionButton = document.querySelector('#motion-toggle');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function setMotion(paused) {
  document.documentElement.dataset.geoMotion = paused ? 'off' : 'on';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume animations' : 'Pause animations';
}
setMotion(motionPreference.matches);
motionPreference.addEventListener('change', event => setMotion(event.matches));
motionButton.addEventListener('click', () => setMotion(document.documentElement.dataset.geoMotion !== 'off'));

document.querySelector('#copy-snippet').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  const code = document.querySelector('#install-snippet');
  try {
    await navigator.clipboard.writeText(code.textContent.trim());
    status.textContent = 'Copied! Your homepage makeover awaits.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Snippet selected. Press Ctrl+C or Command+C to copy.';
  }
});

const sectionLinks = [...document.querySelectorAll('.section-nav a')];
const observer = new IntersectionObserver(records => {
  const visible = records.filter(record => record.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  for (const link of sectionLinks) {
    if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}, { rootMargin: '-10% 0px -60% 0px', threshold: [0, .1, .5] });
for (const link of sectionLinks) observer.observe(document.querySelector(link.hash));
