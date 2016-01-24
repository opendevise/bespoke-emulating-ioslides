var isWebKit = 'webkitAppearance' in document.documentElement.style,
  // zoom-based scaling causes font sizes and line heights to be calculated differently
  // zoom-based scaling correctly anti-aliases fonts during transforms (no need for the layer creation hack)
  //scaleMethod = isWebKit ? 'zoom' : 'transform',
  scaleMethod = 'transform',
  //scaleMethod = null,
  bespoke = require('bespoke'),
  bullets = require('bespoke-bullets'),
  classes = require('bespoke-classes'),
  //cursor = require('bespoke-cursor'),
  forms = require('bespoke-forms'),
  fullscreen = require('bespoke-fullscreen'),
  hash = require('bespoke-hash'),
  nav = require('bespoke-nav'),
  overview = require('bespoke-overview'),
  scale = require('bespoke-scale');

bespoke.from('.deck', [
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
  bullets('div.build, ul.build > li'),
  hash(),
  forms(),
  //cursor(),
  function(deck) { setTimeout(function() { document.body.classList.add('loaded') }, 0); }
]);
