
const uborka = document.getElementById("uborka");
const szeletelo = document.getElementById("uborkaszeletelo");
let uborkaX, uborkaY;
let original = { x: 0, y: 0 };
const poziciok = [
  // N
  [5,85],[5,80],[5,75],      // left stroke
  [7.5,77.5], [10,80], [12.5,82.5], // diagonal
  [15,85],[15,80],[15,75],   // right stroke

  // I
  [25,85],[25,80],[25,75],

  // M
  [35,85],[35,80],[35,75],           // left column top+bottom
  [37.5,77.5],[40,80],[42.5,77.5],                   // center middle
  [45,75],[45,80],[45,85],           // right column top+bottom

  // R
  [55,85],[55,80],[55,75],   // left vertical
  [60,75],[62,77.5],[60,80],[60,82.5],[63,85],   // bowl + kick

  // Ó
  [74,80],[75,78],[77,77.5],[78.5,79],[80,80],[79,83],[77,85],[75,83], // O-shape
  [77,70],                         // accent

  // D
  [92,85],[92,80],[92,75],         // left stroke
  [95,75],[97,80],[95,85]          // curve / bowl
];
let pozicio_index = 0;

function megragad(e) {
  console.log("megragad");
  // e.preventDefault();

  const point = getPoint(e);

  // original.x = uborka.offsetLeft;
  // original.y = uborka.offsetTop;

  uborkaX = point.x - uborka.offsetLeft;
  uborkaY = point.y - uborka.offsetTop;

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stop);

  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('touchend', stop);
  document.addEventListener('touchcancel', stop);
}

let ignoreMouse = false;

uborka.addEventListener("touchstart", e => {
  ignoreMouse = true;          // block next mouse event
  setTimeout(() => ignoreMouse = false, 100);  // reset after synthetic mouse fires
  megragad(e);
}, { passive: false });

uborka.addEventListener("mousedown", e => {
  if (ignoreMouse) return;     // skip synthetic mousedown
  megragad(e);
});


function move(e) {
  // e.preventDefault();
  console.log("move");

  const point = getPoint(e);

  uborka.style.left = point.x - uborkaX + 'px';
  uborka.style.top = point.y - uborkaY + 'px';
}

function stop(e) {
  // e.preventDefault();
  console.log("stop");

  document.removeEventListener('mousemove', move);
  document.removeEventListener('mouseup', stop);

  document.removeEventListener('touchmove', move);
  document.removeEventListener('touchend', stop);
  document.removeEventListener('touchcancel', stop);

  const point = getPoint(e);

  const rect = szeletelo.getBoundingClientRect();

  if (
    point.x > rect.left &&
    point.x < rect.right &&
    point.y > rect.top &&
    point.y < rect.bottom
  ) {
    make_slices();
  }

  uborka.style.left = original.x + 'px';
  uborka.style.top = original.y + 'px';
}

function getPoint(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function getCenter(el) {
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return { x: centerX, y: centerY };
}
function getCenterPercent(target) {
  const rect = target.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const percentX = (centerX / window.innerWidth) * 100;
  const percentY = (centerY / window.innerHeight) * 100;

  return { x: percentX, y: percentY };
}


function make_slices(mennyi_maradt = 4){
    const {x,y} = getCenterPercent(szeletelo);

    const uj_szelet = document.createElement("img");

    uj_szelet.style.left = x + '%';
    uj_szelet.style.top = y + '%';
    uj_szelet.src = "slice.png";
    uj_szelet.classList.add("szelet");

    uborkaslices.appendChild(uj_szelet);

    setTimeout(()=>{athelyez(uj_szelet, mennyi_maradt)}, 100);
}

function athelyez(uj_szelet, mennyi_maradt){
    uj_szelet.style.left = poziciok[pozicio_index][0] + '%';
    uj_szelet.style.top = poziciok[pozicio_index][1] + '%';

    pozicio_index++;
    if(pozicio_index == poziciok.length)
        pozicio_index = 0;

    if(mennyi_maradt > 0)
        make_slices(mennyi_maradt-1);
}

// touchscreen:
function normalizeEvent(e) {
  // active finger during touchmove / touchstart
  if (e.touches && e.touches.length > 0) {
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY
    };
  }

  // last finger position during touchend
  if (e.changedTouches && e.changedTouches.length > 0) {
    return {
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY
    };
  }

  return e; // mouse event
}
/*
uborka.addEventListener('mousedown', e => megragad(e));
uborka.addEventListener('touchstart', e => {
  e.preventDefault();                 // stops page scroll
  megragad(normalizeEvent(e));
}, { passive: false });

document.addEventListener('mousemove', e => move(e));
document.addEventListener('touchmove', e => {
  e.preventDefault();                 // stops page scroll
  move(normalizeEvent(e));
}, { passive: false });

document.addEventListener('mouseup', e => stop(e));
document.addEventListener('touchend', e => {
  stop(normalizeEvent(e));
}, { passive: false });*/