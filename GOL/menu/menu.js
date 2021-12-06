// PARAMS
const conBtn = document.getElementById('con');
const newBtn = document.getElementById('new');
const links = [...document.querySelectorAll('a')];

window.addEventListener('DOMContentLoaded', () => {
    if (Storage.getGameData()) conBtn.classList.remove('hide');
    newBtn.onclick = () => Storage.delGameData();
    links.forEach((a) => {
        a.onclick = () => clickEff(a);
    })
})