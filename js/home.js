/* ==========================================================================
   home.js — the event image gallery on the home page
   --------------------------------------------------------------------------
   The assignment requires at least three images of different events and a
   button that cycles through them. The images are listed here rather than in
   the HTML so that adding a fourth image means editing one array.
   ========================================================================== */

(function () {
  const GALLERY = [
    {
      src: 'images/event-academic.svg',
      alt: 'Illustration of a study workshop: a lecture room with a whiteboard, clock and desks',
      title: 'Academic workshops and study sessions',
      caption: 'Skills workshops, revision sessions and subject help run by the School and by student societies.'
    },
    {
      src: 'images/event-sports.svg',
      alt: 'Illustration of a sports field with a ball, goal and players',
      title: 'Sport, social clubs and campus recreation',
      caption: 'Social sport you can join without a team, plus competitive clubs through the Sports Association.'
    },
    {
      src: 'images/event-cultural.svg',
      alt: 'Illustration of a cultural festival with bunting, food stalls and lanterns',
      title: 'Cultural societies and campus festivals',
      caption: 'Festivals, food and performances run by cultural societies across the university.'
    },
    {
      src: 'images/event-careers.svg',
      alt: 'Illustration of a careers networking night with two people shaking hands and a city skyline',
      title: 'Careers nights and industry networking',
      caption: 'Employer talks, graduate panels and networking evenings for students nearing the end of a degree.'
    }
  ];

  // Find the pieces of the gallery in the page.
  const img      = document.getElementById('gallery-image');
  const title    = document.getElementById('gallery-title');
  const caption  = document.getElementById('gallery-caption');
  const dots     = document.getElementById('gallery-dots');
  const nextBtn  = document.getElementById('gallery-next');
  const prevBtn  = document.getElementById('gallery-prev');
  const counter  = document.getElementById('gallery-counter');

  if (!img || !nextBtn) return;   // not on the home page

  let current = 0;   // index of the image on screen

  /* Build one dot per image, once. */
  GALLERY.forEach(function () {
    dots.appendChild(document.createElement('span'));
  });

  /** Put the image at position `index` on the screen. */
  function show(index) {
    const item = GALLERY[index];
    img.src = item.src;
    img.alt = item.alt;
    title.textContent = item.title;
    caption.textContent = item.caption;
    counter.textContent = 'Image ' + (index + 1) + ' of ' + GALLERY.length;

    // Highlight the matching dot and un-highlight the others.
    Array.prototype.forEach.call(dots.children, function (dot, i) {
      dot.className = (i === index) ? 'active' : '';
    });
  }

  /* The modulo operator (%) is what makes the gallery cycle: when `current`
     reaches the end of the array it wraps back around to 0 instead of running
     off the end. Adding GALLERY.length before the % handles going backwards,
     because in JavaScript -1 % 4 is -1, not 3. */
  function step(by) {
    current = (current + by + GALLERY.length) % GALLERY.length;
    show(current);
  }

  nextBtn.addEventListener('click', function () { step(1); });
  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });

  show(current);   // show the first image when the page loads
})();
