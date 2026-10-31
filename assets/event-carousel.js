/* Native touch scrolling keeps swipes responsive without intercepting page gestures. */
(() => {
  let cleanup = () => {};
  window.initEventCarousel = list => {
    cleanup();
    const cards = [...list.querySelectorAll('.event-card')];
    const navigation = document.getElementById('eventNavigation');
    const pagination = document.getElementById('eventPagination');
    const dots = document.getElementById('eventDots');
    const status = document.getElementById('eventPosition');
    const previous = document.getElementById('eventPrevious');
    const next = document.getElementById('eventNext');
    const controller = new AbortController();
    const signal = controller.signal;
    let frame = 0, resizeObserver, pages = [], page = 0, perPage = 1, requestedPage = null, settleTimer;
    list.classList.add('event-track');
    list.classList.toggle('single-event', cards.length === 1);
    list.setAttribute('aria-label', 'Your invited events');
    cards.forEach((card, i) => {
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${i + 1} of ${cards.length}: ${card.getAttribute('aria-label')}`);
    });
    function paint(index) {
      page = index;
      const first = Math.min(index * perPage + 1, cards.length);
      const last = Math.min(first + perPage - 1, cards.length);
      status.textContent = perPage === 1 ? `Event ${first} of ${cards.length}` : `Events ${first}–${last} of ${cards.length}`;
      [...dots.children].forEach((dot, i) => {
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
      // Keep focus on the controls at either end of the itinerary.
      previous.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === pages.length - 1));
    }
    function update() {
      frame = 0;
      if (!pages.length) return;
      const nearest = pages.reduce((best, value, i) => Math.abs(value - list.scrollLeft) < Math.abs(pages[best] - list.scrollLeft) ? i : best, 0);
      if (nearest !== page) paint(nearest);
    }
    function go(index) {
      if (!pages.length) return;
      index = Math.max(0, Math.min(pages.length - 1, index));
      requestedPage = index;
      list.scrollTo({left: pages[index], behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { requestedPage = null; update(); }, 650);
    }
    function layout() {
      if (!cards.length || !list.clientWidth) return;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      perPage = Math.max(1, Math.floor((list.clientWidth + gap) / (cardWidth + gap)));
      const maxScroll = Math.max(0, list.scrollWidth - list.clientWidth);
      pages = [];
      for (let i = 0; i < cards.length; i += perPage) {
        pages.push(Math.min(maxScroll, cards[i].offsetLeft - cards[0].offsetLeft));
      }
      const multiple = pages.length > 1;
      navigation.hidden = pagination.hidden = !multiple;
      dots.replaceChildren(...pages.map((_, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Show ${cards[i * perPage].querySelector('h3').textContent}${perPage > 1 ? ' and following events' : ''}`);
        button.setAttribute('aria-controls', 'eventList');
        button.addEventListener('click', () => go(i), {signal});
        return button;
      }));
      paint(Math.min(page, pages.length - 1));
      update();
    }
    previous.addEventListener('click', () => go((requestedPage ?? page) - 1), {signal});
    next.addEventListener('click', () => go((requestedPage ?? page) + 1), {signal});
    list.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, {passive: true, signal});
    list.addEventListener('pointerdown', () => { requestedPage = null; }, {passive: true, signal});
    list.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? pages.length - 1 : (requestedPage ?? page) + direction;
      const index = Math.max(0, Math.min(pages.length - 1, target));
      cards[index * perPage].focus({preventScroll: true});
      go(index);
    }, {signal});
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(list);
    } else window.addEventListener('resize', layout, {signal});
    navigation.hidden = pagination.hidden = true;
    dots.replaceChildren();
    status.textContent = '';
    list.scrollLeft = 0;
    layout();
    cleanup = () => {
      controller.abort();
      resizeObserver?.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
    };
  };
})();
