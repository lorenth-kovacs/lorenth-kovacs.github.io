// konstansok a játékhoz
let betuk_ajandekokra = "MARRYXMAS!";
let szoveg_vegen_kiirni = "Boldog Karácsonyt!";

const sebesseg = {ido: 50, pixels: 10};
const marioSeb = {ido: 50, pixels: 12};

switch(window.location.hash){
    case "#maxim":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Maxim!";
        break;
    case "#vilmos":
        betuk_ajandekokra = "MARRYXMAS45"
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Vilmos45!";
        break;
    case "#zsolti":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Zsolti!";
        break;
    case "#berci":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Berci!";
        break;
    case "#nimrod":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Nimród!";
        break;
    case "#reka":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Réka!";
        break;
    case "#anna":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Anna!";
        break;
    case "#np":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Nagypapa!";
        break;
    case "#nm":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Nagymama!";
        break;
    case "#lili":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Lili!";
        break;
    case "#mamageza":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Mama és Géza!";
        break;
    case "#patrik":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Patrik!";
        break;
    case "#lele":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Lele!";
        break;
    case "#vilmo":
        szoveg_vegen_kiirni = "Boldog Karácsonyt, Vilmo!";
        break;
}

//#region változók

let megy_a_jatek = false;
let game_id = 0;
let touch_screen = false;
const keys = {};
let irany = 0;
let telapo_left = 0;
let mario_left = 0;
let lepes_id = 0;
let marioTimer = null;
let kontroller_megy_e = false;

//#endregion

//#region html elemek

const telapo = document.getElementById("mikulas");

const kiir_ablak = document.getElementById("kiir_ablak");
const kiir_szoveg = document.getElementById("kiir_szoveg");
const kiir_gomb = document.getElementById("kiir_gomb");

const ajandek_tarolo = document.getElementById("ajandek_tarolo");

const mario = document.getElementById("mario");

// kontroller
const touchBal = document.getElementById("touch-bal");
const touchJobb = document.getElementById("touch-jobb");
const kontroller = document.getElementById("controller");

//#endregion

// FÜGGVÉNYEK: 

//#region segédfüggvények
const Random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function Kiir_close(){
    kiir_ablak.style.display = "none";
}

function Kiir_function(resolve){
    kiir_gomb.addEventListener("pointerdown", (e) => {
        touch_screen = e.pointerType === "touch";
        Kiir_close();
        resolve();
    }, { once: true });
}

function Kiir(szoveg, gomb = "ok"){
    // Kinyitja a kiírós ablakot, beleírja a szöveget meg a gomb szövegét
    // A leokézást vájra meg a hívó függvény
    kiir_szoveg.innerText = szoveg;
    kiir_gomb.innerText = gomb;
    kiir_ablak.style.display = "block";

    return new Promise(Kiir_function);
}
//#endregion

//#region télapó

function TelapoMozog(mennyit, merre, id){
    // Ezt fel lehetne újítani. !!!
    if(game_id != id) return;
    // léptet:
    telapo_left += merre * sebesseg.pixels;
    telapo.style.left = telapo_left + "px";

    // továbbmegy:
    if(megy_a_jatek){
        if(0 < mennyit){
            setTimeout(() => {
                TelapoMozog(mennyit - 1, merre, id);
            }, sebesseg.ido);
        }else{
            setTimeout(() => {
                telapo.style.transform = "scaleX(" + -merre + ")";
                TelapoMozog(MennyitMozogjonTelapo(-merre), -merre, id);
            }, sebesseg.ido);
        }
    }
}

function MennyitMozogjonTelapo(merre){
    // random szám 10-től a képernyő széléig
    let max_ertek = MennyitMozoghatTelapo(merre);
    return Random(5, max_ertek);
}

function MennyitMozoghatTelapo(merre){
    const telapo_meret = telapo.getBoundingClientRect();

    let max_ertek_pixels;

    if(merre == 1){
        max_ertek_pixels = window.innerWidth - telapo_meret.width - telapo_meret.left;
    }else{
        max_ertek_pixels = telapo_meret.left;
    }

    return Math.floor(max_ertek_pixels / sebesseg.pixels);
}

// megadja a télapó közepének x koordinátáját
function GetTelapoPositionX(){
    const telapoRect = telapo.getBoundingClientRect();
    return telapoRect.left + telapoRect.width / 2;
}

//#endregion

//#region ajándékok

function Ajandek_fuggveny(i, id){
    setTimeout(() => {
        if(megy_a_jatek && game_id == id){
            New_ajandek(betuk_ajandekokra[i], GetTelapoPositionX(), i == betuk_ajandekokra.length - 1, id);
            if(i < betuk_ajandekokra.length - 1)
                Ajandek_fuggveny(i+1, id);
        }
    }, Random(300, 2000));
}

function New_ajandek(betu, hol, utolso_e, id){
    let uj_ajandek = document.createElement("div");
    uj_ajandek.className = "ajandek";
    uj_ajandek.append(betu);
    uj_ajandek.style.left = hol + "px";

    ajandekok.appendChild(uj_ajandek);

    let zuhanas = HogyanEsikAjandek(uj_ajandek);
    uj_ajandek.style.transition = "top " + (zuhanas.dur / 1000) + "s linear";

    uj_ajandek.style.top = zuhanas.erkezik + "px";

    setTimeout(() => {
        Megerkezett_e_az_ajandek(uj_ajandek, utolso_e, id);
    }, zuhanas.dur);
}

function Megerkezett_e_az_ajandek(ajandek, utolso_e, id){
    if(game_id != id) return;
    let ajandekRect = ajandek.getBoundingClientRect();
    let marioRect = mario.getBoundingClientRect();

    if(Math.abs(ajandekRect.left - marioRect.left) < marioRect.width){
        ajandek_tarolo.appendChild(ajandek);
        ajandek.style.position = "initial";
        ajandek.style.transform = "none";
        if(utolso_e)
            gyozelem();
    }else{
        ajandek.style.top = "100%";
        megy_a_jatek = false;
        Retry();
    }
}

function HogyanEsikAjandek(uj_ajandek){
    let dur, erkezik;

    ajandekRect = uj_ajandek.getBoundingClientRect();
    marioRect = mario.getBoundingClientRect();

    erkezik = marioRect.top - ajandekRect.height / 2;

    let indul = ajandekRect.top + ajandekRect.height / 2;
    dur = (erkezik - indul) / sebesseg.pixels * sebesseg.ido; // ezredmásodpercek

    return { dur: dur, erkezik: erkezik };
}

//#endregion

//#region Márió

function Balra(id, fordul_e = false){
    // let marioRect = mario.getBoundingClientRect();
    // if(marioRect.left + marioRect.width / 2 < 0) return;
    if(lepes_id != id || irany != -1 || !megy_a_jatek || mario_left < 0) return;

    if(fordul_e){
        mario.src = "images/mario_jobbra.png";
        mario.style.transform = "translateX(-50%) scaleX(-1)";
    }

    mario_left -= marioSeb.pixels;
    mario.style.left = mario_left + "px";

    clearTimeout(marioTimer);
    marioTimer = setTimeout(()=>Balra(id), marioSeb.ido);
}

function Jobbra(id, fordul_e = false){
    // let marioRect = mario.getBoundingClientRect();
    // if(window.innerWidth < marioRect.left - marioRect.width / 2) return;
    if(lepes_id != id || irany != 1 || !megy_a_jatek || window.innerWidth < mario_left) return;

    if(fordul_e){
        mario.src = "images/mario_jobbra.png";
        mario.style.transform = "translateX(-50%) scaleX(1)";
    }

    mario_left += marioSeb.pixels;
    mario.style.left = mario_left + "px";

    clearTimeout(marioTimer);
    marioTimer = setTimeout(()=>Jobbra(id), marioSeb.ido);
}

function billenyuLe(e){
    if (keys[e.code]) return;
    keys[e.code] = true;

    clearTimeout(marioTimer);
    lepes_id++;

    if(e.code == "ArrowLeft"){
        irany = -1;
        Balra(lepes_id, true);
    }else if(e.code == "ArrowRight"){
        irany = 1;
        Jobbra(lepes_id, true);
    }
}

function billenyuFel(e){
    keys[e.code] = false;
    irany = 0;
    clearTimeout(marioTimer);
    mario.src = "images/mario_szembe.webp";

}


//#endregion

//#region játék mechanika

function Tuzijatek(){
    let kep_szuloje = document.querySelector('#fireworks');
    kep_szuloje.style.display = "flex";
    let kep = kep_szuloje.querySelector("img");
    kep.style.animation = "none";
    kep.offsetHeight;
    kep.style.animation = "tuzijatek 1s linear 0s 1 normal forwards";
    setTimeout(() => {
        kep_szuloje.style.display = 'none';
    }, 1000);
}

function gyozelem(){
    Tuzijatek();
    const marryxmas_felirat = document.getElementById("marryxmas");
    marryxmas_felirat.append(szoveg_vegen_kiirni);
    marryxmas_felirat.style.display = "block";
}

function Nullazasok(){
    lista = document.getElementsByClassName("ajandek");
    for(let i = lista.length - 1; i >= 0; i--){
        lista[i].remove();
    }
    telapo.style.transform = "none";
    telapo.style.transition = "none";
    telapo.style.left = "0px";
    telapo.offsetHeight;
    telapo.style.transition = "left var(--sebesseg)";
}

async function Retry(){
    kontroller.style.display = "none";
    game_id++;
    await Kiir("A francba, leesett az ajándék. Most mi lesz? Micsoda szerencse, hogy pont itt van ez az időgép, amivel újra tudom kezdeni az estét!", "Újra!");

    Nullazasok();

    Jatek_inditasa();
}

function RemoveEventListeners(){    
    document.removeEventListener("keydown", billenyuLe);
    document.removeEventListener("keyup", billenyuFel);
}

function kontroller_events(){
    // Bal oldal
    touchBal.addEventListener("pointerdown", () => {
        if(!megy_a_jatek || keys["bal"]) return;
        keys["bal"] = true;
        lepes_id++;
        irany = -1;
        Balra(lepes_id, true);
    });

    touchBal.addEventListener("pointerup", () => {
        keys["bal"] = false;
        irany = 0;
        clearTimeout(marioTimer);
        mario.src = "images/mario_szembe.webp";
    });

    // Jobb oldal
    touchJobb.addEventListener("pointerdown", () => {
        if(!megy_a_jatek || keys["jobb"]) return;
        keys["jobb"] = true;
        lepes_id++;
        irany = 1;
        Jobbra(lepes_id, true);
    });

    touchJobb.addEventListener("pointerup", () => {
        keys["jobb"] = false;
        irany = 0;
        clearTimeout(marioTimer);
        mario.src = "images/mario_szembe.webp";
    });
}

function Jatek_inditasa(){
    megy_a_jatek = true;
    // szereplők nullázása, előkészítése, indítása
    telapo_left = 0;
    TelapoMozog(MennyitMozoghatTelapo(1), 1, game_id);
    Ajandek_fuggveny(0, game_id);
    // mario_left legyen középen a képernyőn

    // eventlistenerek hozzáadása
    if(!touch_screen){
        document.addEventListener("keydown", billenyuLe);
        document.addEventListener("keyup", billenyuFel);
    }else{
        kontroller.style.display = "block";
        kontroller_megy_e = true;
        kontroller_events();
    }

}

async function Main(){
    await Kiir("Vigyázz! A Télapó idén nem elég óvatos, és elejti az ajándékait! Mentsd meg a karácsonyt, és kapd el az elejtett ajándékokat! De vigyázz, mert ha egy leesik, összetörik, és elromlik a karácsony! tipp: előbb enged fel az egyik gombot, és csak akkor nyomd le a másikat. (és érdemes álló helyzetben tartani a mobileszközt.)", "Mehet!");

    Jatek_inditasa();
}

//#endregion

document.addEventListener("DOMContentLoaded", () => {
    Main();
});
