import * as Bootstrap from 'bootstrap';
import { installGeoEnhancements } from './geo-enhancements.js';

installGeoEnhancements();

// Importing the full release keeps every data API available in the catalogue.
// Explicit initialisation also works when loaded after DOMContentLoaded.
function initialise() {
  const init = (selector, Plugin, config) => {
    for (const element of document.querySelectorAll(selector)) Plugin.getOrCreateInstance(element, config);
  };
  init('[data-bs-toggle="combobox"]', Bootstrap.Combobox);
  init('[data-bs-chips]', Bootstrap.Chips);
  init('[data-bs-otp]', Bootstrap.OtpInput);
  init('[data-bs-strength]', Bootstrap.Strength);
  init('.form-range', Bootstrap.Range);
  init('[data-bs-toggle="datepicker"]', Bootstrap.Datepicker);
  init('[data-bs-toggle="nav-overflow"]', Bootstrap.NavOverflow);
  init('[data-bs-toggle="tooltip"]', Bootstrap.Tooltip, { animation: false });
  init('[data-bs-toggle="popover"]', Bootstrap.Popover, { animation: false, container: 'body' });
  init('[data-bs-spy="scroll"]', Bootstrap.ScrollSpy);
  init('.carousel', Bootstrap.Carousel);
  document.querySelector('#check-mixed').indeterminate = true;

  const toast = Bootstrap.Toast.getOrCreateInstance('#catalogue-toast', { autohide: false });
  document.querySelector('#show-toast').addEventListener('click', () => toast.show());
  document.querySelector('#code-control').addEventListener('complete.bs.otpInput', () => {
    document.querySelector('#otp-status').textContent = 'Six digits entered. Demo verification complete!';
  });
  const calendar = Bootstrap.Datepicker.getInstance('#inline-calendar');
  const syncCalendar = () => {
    const dates = calendar.getSelectedDates();
    document.querySelector('#trip-dates').value = dates.join(',');
    document.querySelector('#date-range-status').textContent = dates.length ? `Selected dates: ${dates.join(', ')}` : 'Choose a date range.';
  };
  document.querySelector('#inline-calendar').addEventListener('change.bs.datepicker', syncCalendar);
  syncCalendar();
  document.querySelector('#volume').addEventListener('input', event => {
    document.querySelector('#range-status').textContent = `Volume: ${event.target.value}%`;
  });
  document.querySelector('#check-name').addEventListener('click', () => {
    const name = document.querySelector('#input-group-name').value.trim();
    document.querySelector('#name-check-status').textContent = name ? `${name} looks great for this demo.` : 'Enter a screen name first.';
  });
  let step = 0;
  document.querySelector('#advance-step').addEventListener('click', () => {
    step = (step + 1) % 3;
    const labels = ['Connect', 'Create', 'Publish'];
    for (const [index, element] of [...document.querySelectorAll('#setup-stepper .stepper-item')].entries()) {
      element.classList.toggle('active', index <= step);
      if (index === step) element.setAttribute('aria-current', 'step');
      else element.removeAttribute('aria-current');
    }
    document.querySelector('#stepper-status').textContent = `Step ${step + 1}: ${labels[step]}.`;
  });
  for (const button of document.querySelectorAll('.pagination-example button')) {
    button.addEventListener('click', () => {
      for (const sibling of document.querySelectorAll('.pagination-example .page-item')) sibling.classList.remove('active');
      for (const sibling of document.querySelectorAll('.pagination-example button')) sibling.removeAttribute('aria-current');
      button.parentElement.classList.add('active');
      button.setAttribute('aria-current', 'page');
      document.querySelector('#pagination-status').textContent = `Showing page ${button.textContent} of 3.`;
    });
  }

  const button = document.querySelector('#motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const setMotion = paused => {
    document.documentElement.dataset.geoMotion = paused ? 'off' : 'on';
    button.textContent = paused ? 'Resume animations' : 'Pause animations';
    button.setAttribute('aria-pressed', String(paused));
  };
  setMotion(preference.matches);
  preference.addEventListener('change', event => setMotion(event.matches));
  button.addEventListener('click', () => setMotion(document.documentElement.dataset.geoMotion !== 'off'));
  document.documentElement.dataset.catalogueReady = 'true';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
else initialise();
