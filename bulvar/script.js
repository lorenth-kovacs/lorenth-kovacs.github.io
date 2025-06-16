const body = document.getElementById('body');
const kurzor = document.querySelector("#kurzor");

document.addEventListener('mousemove', (e) => {
  const rect = body.getBoundingClientRect();
  const scrollTop = body.scrollTop;
  const scrollLeft = body.scrollLeft;

  const x = e.clientX - rect.left + scrollLeft;
  const y = e.clientY - rect.top + scrollTop;

  const percentX = (x / body.scrollWidth) * 100;
  const percentY = (y / body.scrollHeight) * 100;

  body.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, black 0%, red 3%, blue 6%, black 15%)`;
/*
  kurzor.style.top = e.clientY - (kurzor.clientHeight / 2);
  kurzor.style.left = e.clientX - (kurzor.clientWidth / 2);*/
});

function Create_tank(){
  // következő tank:
  setTimeout(Create_tank, Math.random() * 5000);
  // elem létrehozása:
  let kep = document.createElement("img");
  let ido = Math.random() * 20;
  let id_hoz = 0;
  // id
  while(document.querySelector("#tank" + id_hoz)){
    id_hoz++;
  }
  kep.id = "tank" + id_hoz;
  kep.src = "sources/tankok/tank.svg";
  let merre_nez = Math.random() < 0.5 ? 1 : -1;
  kep.style.width = (Math.random() * 200 * merre_nez) + "px";
  kep.style.bottom = (Math.random() * 75) + "%";
  if(merre_nez == 1){
    kep.style.right = "100%";
  }else{
    kep.style.left = "100%";
  }
  // appendchild
  document.querySelector("#tankok").appendChild(kep);
  // transition
  kep.style.transition = `${ido}s`;
  let uj_tank = document.querySelector("#tank" + id_hoz);
  setTimeout(() => {
    if(merre_nez == 1){
      uj_tank.style.right = "calc(0% - " + uj_tank.clientWidth + "px)";
    }else{
      uj_tank.style.left = "calc(0% - " + uj_tank.clientWidth + "px)";
    }
  }, 100);
  uj_tank.addEventListener('click', () => {
    uj_tank.src = 'url(boom.jpg)';
    uj_tank.remove();
  });
  setTimeout(() => {
    uj_tank.remove();
  }, ido * 1000 + 100);
}

setTimeout(Create_tank, Math.random() * 2000);