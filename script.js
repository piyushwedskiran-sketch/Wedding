// ====================================
// GUEST PARAMETER
// ====================================

const params = new URLSearchParams(window.location.search);
const guest = params.get("guest");

if (guest) {
  localStorage.setItem("guest", guest);
}

const storedGuest =
  localStorage.getItem("guest");

// ====================================
// OPEN INVITATION
// ====================================

const openBtn =
  document.getElementById("openBtn");

const welcome =
  document.getElementById("welcome");

const website =
  document.getElementById("website");

const music =
  document.getElementById("music");

const musicBtn =
  document.getElementById("musicBtn");

if (openBtn && welcome && website) {
  openBtn.addEventListener("click", () => {
    if (music) {
      music.play().catch(() => {});
    }

    if (musicBtn) {
      musicBtn.innerHTML =
        "🔊 Music Playing";
    }

    welcome.style.opacity = "0";

    setTimeout(() => {
      welcome.style.display = "none";
      website.style.display = "block";
    }, 900);
  });
}

// ====================================
// MUSIC BUTTON
// ====================================

if (music && musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();

      musicBtn.innerHTML =
        "🔊 Music Playing";
    } else {
      music.pause();

      musicBtn.innerHTML =
        "▶ Play Music";
    }
  });
}

// ====================================
// COUNTDOWN
// ====================================

const weddingDate =
  new Date(
    "December 12, 2026 19:00:00"
  );

function updateCountdown() {
  const now = new Date();

  const diff =
    weddingDate - now;

  if (diff < 0) return;

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (
      diff %
      (1000 * 60 * 60 * 24)
    ) /
      (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (
      diff %
      (1000 * 60 * 60)
    ) /
      (1000 * 60)
  );

  const seconds = Math.floor(
    (
      diff %
      (1000 * 60)
    ) /
      1000
  );

  const d =
    document.getElementById("days");

  const h =
    document.getElementById("hours");

  const m =
    document.getElementById("minutes");

  const s =
    document.getElementById("seconds");

  if (d) d.innerHTML = days;
  if (h) h.innerHTML = hours;
  if (m) m.innerHTML = minutes;
  if (s) s.innerHTML = seconds;
}

if (
  document.getElementById("days")
) {
  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );
}

// ====================================
// PERSONALISED LINKS
// ====================================

const groomLink =
  document.getElementById(
    "groomLink"
  );

const brideLink =
  document.getElementById(
    "brideLink"
  );

if (storedGuest) {
  if (groomLink) {
    groomLink.href =
      "groom.html?guest=" +
      encodeURIComponent(
        storedGuest
      );
  }

  if (brideLink) {
    brideLink.href =
      "bride.html?guest=" +
      encodeURIComponent(
        storedGuest
      );
  }
}

// ====================================
// STARS
// ====================================

const starsCanvas =
  document.getElementById(
    "stars"
  );

if (starsCanvas) {
  const ctx =
    starsCanvas.getContext("2d");

  function resizeStars() {
    starsCanvas.width =
      window.innerWidth;

    starsCanvas.height =
      window.innerHeight;
  }

  resizeStars();

  window.addEventListener(
    "resize",
    resizeStars
  );

  const stars = [];

  const count =
    window.innerWidth < 900
      ? 120
      : 220;

  for (let i = 0; i < count; i++) {
    stars.push({
      x:
        Math.random() *
        window.innerWidth,

      y:
        Math.random() *
        window.innerHeight,

      r:
        Math.random() * 2,

      a:
        Math.random(),

      s:
        Math.random() * 0.02
    });
  }

  function animateStars() {
    ctx.clearRect(
      0,
      0,
      starsCanvas.width,
      starsCanvas.height
    );

    stars.forEach(star => {
      star.a += star.s;

      if (
        star.a > 1 ||
        star.a < 0
      ) {
        star.s *= -1;
      }

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(255,255,255,${star.a})`;

      ctx.fill();
    });

    requestAnimationFrame(
      animateStars
    );
  }

  animateStars();
}

// ====================================
// EMBERS
// ====================================

const embersCanvas =
  document.getElementById(
    "embers"
  );

if (embersCanvas) {
  const ectx =
    embersCanvas.getContext("2d");

  function resizeEmbers() {
    embersCanvas.width =
      window.innerWidth;

    embersCanvas.height =
      window.innerHeight;
  }

  resizeEmbers();

  window.addEventListener(
    "resize",
    resizeEmbers
  );

  const embers = [];

  const emberCount =
    window.innerWidth < 900
      ? 20
      : 50;

  for (
    let i = 0;
    i < emberCount;
    i++
  ) {
    embers.push({
      x:
        Math.random() *
        window.innerWidth,

      y:
        Math.random() *
        window.innerHeight,

      r:
        Math.random() * 3 + 1,

      s:
        Math.random() * 0.8 + 0.2
    });
  }

  function animateEmbers() {
    ectx.clearRect(
      0,
      0,
      embersCanvas.width,
      embersCanvas.height
    );

    embers.forEach(e => {
      e.y -= e.s;

      if (e.y < -20) {
        e.y =
          window.innerHeight +
          20;

        e.x =
          Math.random() *
          window.innerWidth;
      }

      ectx.beginPath();

      ectx.arc(
        e.x,
        e.y,
        e.r,
        0,
        Math.PI * 2
      );

      ectx.fillStyle =
        "rgba(217,194,163,.7)";

      ectx.fill();
    });

    requestAnimationFrame(
      animateEmbers
    );
  }

  animateEmbers();
}

// ====================================
// SHOOTING STARS
// ====================================

setInterval(() => {
  const star =
    document.createElement("div");

  star.style.position =
    "fixed";

  star.style.left =
    Math.random() *
      window.innerWidth +
    "px";

  star.style.top = "-100px";

  star.style.width = "2px";
  star.style.height = "140px";

  star.style.background =
    "linear-gradient(transparent,#fff)";

  star.style.transform =
    "rotate(45deg)";

  star.style.zIndex = "999";

  star.style.pointerEvents =
    "none";

  document.body.appendChild(
    star
  );

  let y = -100;

  const timer =
    setInterval(() => {
      y += 15;

      star.style.top =
        y + "px";

      if (
        y >
        window.innerHeight + 200
      ) {
        clearInterval(timer);
        star.remove();
      }
    }, 20);
}, 12000);

// ====================================
// FLOATING LANTERNS
// ====================================

for (
  let i = 0;
  i <
  (window.innerWidth < 900
    ? 3
    : 6);
  i++
) {
  const l =
    document.createElement("div");

  l.innerHTML = "🏮";

  l.style.position =
    "fixed";

  l.style.left =
    Math.random() * 100 +
    "%";

  l.style.bottom = "-100px";

  l.style.fontSize = "40px";

  l.style.opacity = ".35";

  l.style.pointerEvents =
    "none";

  l.style.zIndex = "5";

  document.body.appendChild(l);

  let y = -100;

  setInterval(() => {
    y += 1;

    l.style.transform =
      `translateY(-${y}px)`;

    if (
      y >
      window.innerHeight +
        300
    ) {
      y = -100;

      l.style.left =
        Math.random() * 100 +
        "%";
    }
  }, 40);
}

// ====================================
// GOLDEN SPARKLES
// ====================================

for (
  let i = 0;
  i <
  (window.innerWidth < 900
    ? 20
    : 45);
  i++
) {
  const s =
    document.createElement("div");

  s.style.position =
    "fixed";

  s.style.width = "3px";
  s.style.height = "3px";

  s.style.borderRadius = "50%";

  s.style.background =
    "#f2d89f";

  s.style.left =
    Math.random() * 100 +
    "%";

  s.style.top =
    Math.random() * 100 +
    "%";

  s.style.opacity = ".5";

  s.style.pointerEvents =
    "none";

  s.style.zIndex = "4";

  document.body.appendChild(s);

  let a = Math.random();

  setInterval(() => {
    a += 0.05;

    s.style.opacity =
      0.2 +
      Math.sin(a) * 0.4;
  }, 80);
}