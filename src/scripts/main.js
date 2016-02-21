var isWebKit = 'webkitAppearance' in document.documentElement.style,
  // zoom-based scaling causes font sizes and line heights to be calculated differently
  // on the other hand, zoom-based scaling correctly anti-aliases fonts during transforms (no need for layer creation hack)
  //scaleMethod = isWebKit ? 'zoom' : 'transform',
  scaleMethod = 'transform',
  //scaleMethod = null,
  bespoke = require('bespoke'),
  bullets = require('bespoke-bullets'),
  classes = require('bespoke-classes'),
  //cursor = require('bespoke-cursor'),
  //forms = require('bespoke-forms'),
  fullscreen = require('bespoke-fullscreen'),
  hash = require('bespoke-hash'),
  nav = require('bespoke-nav'),
  overview = require('bespoke-overview'),
  scale = require('bespoke-scale');

(window.bespoke = bespoke).deck = bespoke.from('.deck', [
  classes(),
  function(deck) {
    var slideCount = String(deck.slides.length);
    deck.slides.forEach(function(slide) {
      slide.setAttribute('data-slide-count', slideCount);
    });
  },
  nav(),
  fullscreen(),
  (scaleMethod ? scale(scaleMethod) : function(deck) {}),
  function(deck) {
    var firstSlide = deck.slides[0], canvas = document.createElement('div');
    canvas.classList.add('bespoke-slide-canvas');
    firstSlide.parentNode.insertBefore(canvas, firstSlide);
    if (scaleMethod === 'zoom') {
      canvas.style.zoom = firstSlide.style.zoom;
      new MutationObserver(function(mutations) {
        if (canvas.style.zoom !== firstSlide.style.zoom) canvas.style.zoom = firstSlide.style.zoom;
      }).observe(firstSlide, { attributes: true, attributeFilter: ['style'] });
    }
  },
  overview({ margin: 20 }),
  bullets('.build,.build-items>*:not(.build-items)'),
  // ...or fuse the .build-items:not(.build) list with first item
  //bullets([
  //  '.build',
  //  '.build-items.build>*:not(.build-items)',
  //  '.build-items:not(.build)',
  //  '.build-items:not(.build)>*:not(.build-items):not(:first-child)'].join(', ')
  //),
  hash(),
  // enable forms() if you have form elements in your slides
  //forms(),
  // enable cursor() to automatically hide the cursor when presenting
  //cursor(),
  function(deck) { setTimeout(function() { document.body.classList.add('loaded') }, 0); }
]);
