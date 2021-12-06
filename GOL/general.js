clickEff = (e) => {
    e.classList.add('click');
    setTimeout(() => {
        e.classList.remove('click');
    }, 200);
}

// LOCAL STORAGE FUNCTIONS
class Storage {
    // Game data
    static setGameData(data) {
        localStorage.setItem('golGameData', JSON.stringify(data));
    }

    static getGameData() {
        return localStorage.getItem('golGameData') ? JSON.parse(localStorage.getItem('golGameData')) : false;
    }

    static delGameData() {
        localStorage.removeItem('golGameData');
    }

    // Score data
    static setScoreData(data) {
        localStorage.setItem('golScoreData', JSON.stringify(data));
    }

    static getScoreData() {
        return localStorage.getItem('golScoreData') ? JSON.parse(localStorage.getItem('golScoreData')) : [];
    }

    static delScoreData() {
        localStorage.removeItem('golScoreData');
    }
}