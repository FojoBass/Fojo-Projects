class Storage {
    static setGameData(data) {
        localStorage.setItem('gameData', JSON.stringify(data));
    }

    static getGameData() {
        return localStorage.getItem('gameData') ? JSON.parse(localStorage.getItem('gameData')) : false;
    }

    static delGameData() {
        localStorage.removeItem('gameData');
    }

    static setScoreData(data) {
        localStorage.setItem('scoreData', JSON.stringify(data));
    }

    static getScoreData() {
        return localStorage.getItem('scoreData') ? JSON.parse(localStorage.getItem('scoreData')) : [];
    }

    static delScoreData() {
        localStorage.removeItem('scoreData');
    }
};

// Get timer values from setTimer()
function getTimerValues(h, m, s) {
    let time = 0;
    if (h > 0) {
        time = time + (h * 60 * 60);
    }
    if (m > 0) {
        time = time + (m * 60);
    }
    time = time + s;
    return time;
}

// Format time values
function timeFormat(num) {
    if (num < 10) return `0${num}`
    else return num;
}