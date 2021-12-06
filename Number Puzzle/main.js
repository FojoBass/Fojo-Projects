const contOpt = document.getElementById('continue');
const newOpt = document.getElementById('new');

window.addEventListener('DOMContentLoaded', () => {
    const gameDataLength = Storage.getGameData();

    if (gameDataLength) {
        contOpt.classList.remove('hide');

        newOpt.onclick = () => {
            localStorage.removeItem('gameData');
        };
    } else contOpt.classList.add('hide');
})