const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// If the logo fails, show a text fallback and check the image path.
const headerLogo = document.querySelector('.brand-logo');
const headerLogoFallback = document.querySelector('.brand-fallback');
headerLogo?.addEventListener('error', () => {
  headerLogo.hidden = true;
  if (headerLogoFallback) headerLogoFallback.hidden = false;
});

// Use one clean inline WhatsApp mark everywhere while keeping the existing links intact.
const officialWhatsAppImage = '<img src="images/whatsapp-icon.svg" alt="" width="24" height="24">';
document.querySelectorAll('.whatsapp-icon').forEach((link) => {
  link.setAttribute('aria-label', 'WhatsApp Ozone Kerala');
  link.querySelector('svg')?.remove();
  link.querySelector('img')?.remove();
  link.insertAdjacentHTML('afterbegin', officialWhatsAppImage);
});

// Keep the existing mobile navigation working and close it after a selection.
navToggle.setAttribute('aria-label', 'Open navigation menu');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

// Add a compact theme button without changing the existing page markup.
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.type = 'button';
themeToggle.setAttribute('aria-pressed', 'false');
themeToggle.setAttribute('aria-label', 'Switch to dark mode');
themeToggle.textContent = 'Dark';
document.querySelector('.nav').appendChild(themeToggle);

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('ozone-theme');
} catch (error) {
  // Private browsing settings can block storage; the device preference still works.
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;

function setTheme(isDark, saveChoice = true) {
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.textContent = isDark ? 'Light' : 'Dark';
  if (saveChoice) {
    try {
      localStorage.setItem('ozone-theme', isDark ? 'dark' : 'light');
    } catch (error) {
      // The page remains usable when localStorage is unavailable.
    }
  }
}

setTheme(shouldUseDark, false);
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode')));

// Add labels to every existing button for screen-reader users.
document.querySelectorAll('button').forEach((button) => {
  if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', button.textContent.trim());
});

// These are the five customer reviews to show on the page.
const reviews = [
  {
    name: 'Abhijith Ks',
    stars: 5,
    text: 'I am extremely satisfied with the service provided. From the first conversation to the final installation, everything was handled professionally. The team was friendly, punctual, and very skilled in their work. They completed the project within the promised time without compromising on quality. The finishing is neat, the materials used are of good quality, and the overall result exceeded my expectations.'
  },
  {
    name: 'Shamna I',
    stars: 5,
    text: 'Excellent service from Ozone UPVC Doors and Windows. Quality of the product is top-notch, finishing is very neat and installation was done on time by professional team. Very satisfied with the look and sound insulation.'
  },
  {
    name: 'Suresh Anandan',
    stars: 5,
    text: 'Ozone is a reliable fabricator of UPVC doors and windows. The workmanship and overall quality of their products are excellent, and their installation services are also carried out to a very high standard. Overall, I am very satisfied with the quality of their products and services.'
  },
  {
    name: 'Harikuttan Mv',
    stars: 5,
    text: 'The service from Ozone UPVC Doors & Windows was excellent. The quality of the products and the excellent customer service are worth mentioning. They take care to provide good designs and accurate finishing that suit the house. Definitely recommend!'
  },
  {
    name: 'Rasiya',
    stars: 5,
    text: 'Very good quality and good service. Ozone UPVC doors and windows are excellent. Thank you!'
  }
];

// Render the review cards with initials instead of profile photos.
const reviewsGrid = document.getElementById('reviews-grid');
if (reviewsGrid) reviewsGrid.innerHTML = reviews.map((review) => {
  const stars = '★'.repeat(review.stars);
  const initial = review.name.charAt(0).toUpperCase();
  return `<article class="review-card">
    <div class="review-header">
      <span class="review-avatar" aria-hidden="true">${initial}</span>
      <div><div class="review-name">${review.name}</div><div class="review-stars" aria-label="${review.stars} out of 5 stars">${stars}</div></div>
    </div>
    <p class="review-text">${review.text}</p>
  </article>`;
}).join('');

// Give every feature card a simple line icon that matches its topic.
const featureIcons = {
  Soundproof: '<path d="M4 10h3l4-3v10l-4-3H4z"/><path d="m17 10 3 4m0-4-3 4"/>',
  Weatherproof: '<path d="M6 17h11a3 3 0 0 0 .4-6A5 5 0 0 0 8 9a4 4 0 0 0-2 8Z"/><path d="m9 20 3 1 3-1"/>',
  'Durable Construction': '<path d="m12 3 7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
  'Termite-proof': '<path d="M9 8 7 5m8 3 2-3M7 12H4m13 0h3M9 16l-2 3m8-3 2 3M12 6v12"/><ellipse cx="12" cy="12" rx="4" ry="6"/><path d="m15.5 17 2 2 3-3"/>',
  'Maintenance-free': '<path d="m14 6 4 4M5 19l6.5-6.5M4 20l3-.7 9.8-9.8a2.8 2.8 0 0 0-4-4L3 15.3 4 20Z"/>',
  Waterproof: '<path d="M12 3s6 6.1 6 10a6 6 0 0 1-12 0c0-3.9 6-10 6-10Z"/><path d="M3 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>',
  'Non-visible joints': '<path d="M4 12h6m4 0h6M10 8v8m4-8v8"/><path d="M6 8h4m4 0h4M6 16h4m4 0h4"/>',
  'Affordable pricing': '<circle cx="12" cy="12" r="8"/><path d="M14.5 8.5h-3a2 2 0 1 0 0 4h1a2 2 0 1 1 0 4h-3M12 7v10"/>',
  'Fire-resistant': '<path d="M12 21c4 0 6-2.7 6-6 0-2.6-1.5-4.7-3.8-7.5.1 2-1 3.2-2 3.8.1-3-1.2-5.3-3.2-7.3.2 4.2-3 5.7-3 9.1 0 4.1 2.7 7.9 6 7.9Z"/>',
  'Expansion and shrinkage resistant': '<path d="M5 19 19 5M7 17l-2-2m5-3-2-2m5-3-2-2m5-1-2-2"/><path d="M5 19h5M5 19v-5"/>'
};
document.querySelectorAll('.feature-card').forEach((card) => {
  const title = card.querySelector('h3')?.textContent.trim();
  if (title && featureIcons[title]) {
    const icon = card.querySelector('.card-icon');
    icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${featureIcons[title]}</svg>`;
  }
});
const featureGrid = document.querySelector('#features-more .card-grid');
if (featureGrid) {
  const expansionCard = document.createElement('article');
  expansionCard.className = 'feature-card';
  expansionCard.innerHTML = '<span class="card-icon"></span><h3>Expansion and shrinkage resistant</h3><p>Designed to resist expansion and shrinkage in Kerala’s climate.</p>';
  const icon = expansionCard.querySelector('.card-icon');
  icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${featureIcons['Expansion and shrinkage resistant']}</svg>`;
  featureGrid.appendChild(expansionCard);
  document.querySelector('.feature-note')?.remove();
}

// Use simple colour swatches and keep the shades easy to change later.
const colourList = document.querySelector('.colour-list');
if (colourList) {
  // Exact shades should be confirmed with the client.
  const colours = [
    ['White', '#FFFFFF'], ['Walnut', '#5D4037'], ['Dark Oak', '#4A3428'], ['Oak', '#C8A97E'],
    ['Mahogany', '#4E1F12'], ['Silver Oak', '#A9A9A0'], ['Black', '#111111']
  ];
  colourList.innerHTML = '<strong>Available colours</strong><div class="colour-swatches">' + colours.map(([name, value]) => `<span class="colour-swatch"><span class="swatch-circle" style="background:${value}"></span><small>${name}</small></span>`).join('') + '<span class="colour-more">and more</span></div>';
}

// Add the five approved product variants with the closest available photos.
const productRange = document.createElement('section');
productRange.className = 'product-range';
productRange.setAttribute('aria-labelledby', 'product-range-title');
productRange.innerHTML = `<h3 id="product-range-title">Our product range</h3><div class="product-range-grid">
  <article class="product-variant"><img src="images/window-1.png" alt="Fixed Windows product example"><h4>Fixed Windows</h4><p>Fixed window option.</p></article>
  <article class="product-variant"><img src="images/window-2.png" alt="Sliding Windows product example"><h4>Sliding Windows</h4><p>Sliding window option.</p></article>
  <article class="product-variant"><img src="images/door-1.png" alt="Casement Doors and Windows product example"><h4>Casement Doors and Windows</h4><p>Casement door and window option.</p></article>
  <article class="product-variant"><img src="images/door-2.png" alt="Sliding Doors and Windows product example"><h4>Sliding Doors and Windows</h4><p>Sliding door and window option.</p></article>
</div>`;
document.querySelector('#products .container')?.appendChild(productRange);

// Use the available similar stamp and logo filenames when exact names are not present.
const trustBadges = document.querySelector('.trust-badges');
if (trustBadges) {
  trustBadges.innerHTML = `<span class="trust-badge"><img src="images/bsi-stamp.png" alt="BSI ISO 9001:2015 certification mark"><span>ISO 9001:2015 certified (BSI).</span></span><span class="trust-badge"><img src="images/skz-stamp.png" alt="Quality approved"><span>Quality approved.</span></span><span class="trust-badge"><span>20-year warranty on products and service<sup>*</sup></span></span><span class="trust-badge">100% lead-free and termite-free</span>`;
  const note = document.createElement('p');
  note.className = 'warranty-note';
  note.innerHTML = '*<a href="terms.html">Terms &amp; Conditions</a> apply.';
  trustBadges.after(note);
}
const prominanceNote = document.querySelector('.prominance-note');
if (prominanceNote) prominanceNote.innerHTML = '<img src="images/prominance-logo.png" alt="Prominance uPVC logo"><span>Built with Prominance uPVC systems.</span>';

document.getElementById('current-year').textContent = new Date().getFullYear();

// Add the draft legal page links under the footer content.
if (!document.querySelector('.legal-links')) {
  const legalLinks = document.createElement('div');
  legalLinks.className = 'legal-links';
  legalLinks.innerHTML = '<a href="privacy-policy.html">Privacy Policy</a><a href="terms.html">Terms</a>';
  document.querySelector('.footer-content')?.appendChild(legalLinks);
}

document.getElementById('enquiry-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('form-status').textContent = 'Thank you. We will connect this enquiry form soon.';
});

// Show the intro once per browser visit. If this script fails, no splash is created.
let hasSeenSplash = false;
try {
  hasSeenSplash = sessionStorage.getItem('ozone-splash-seen') === 'true';
} catch (error) {
  // Continue without session storage; the intro can still be shown safely.
}

if (!hasSeenSplash) {
  const splash = document.createElement('div');
  splash.className = 'splash-screen';
  splash.setAttribute('role', 'status');
  splash.setAttribute('aria-label', 'Loading Ozone Kerala');
  splash.innerHTML = '<img class="splash-logo" src="images/ozone-logo.png" alt="Ozone Kerala logo"><span class="splash-fallback" hidden>Ozone Kerala</span>';
  const splashLogo = splash.querySelector('.splash-logo');
  const splashLogoFallback = splash.querySelector('.splash-fallback');
  splashLogo.addEventListener('error', () => {
    splashLogo.hidden = true;
    splashLogoFallback.hidden = false;
  });
  document.body.appendChild(splash);

  try {
    sessionStorage.setItem('ozone-splash-seen', 'true');
  } catch (error) {
    // A blocked session storage should never prevent the page from loading.
  }

  const splashDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1500;
  window.setTimeout(() => splash.classList.add('is-hidden'), splashDelay);
}
