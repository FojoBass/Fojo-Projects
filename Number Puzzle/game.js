// GAME ARRAY
const easy = [1, 2, 3, 4, 5, 6, 7, 8, ''];
const normal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ''];
const hard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, ''];

// PARAMS
const pauseBtn = document.querySelector('.pause');
const timerDisp = document.querySelector('.timer');
const gameBoard = document.querySelector('.board');
const pausedDisp = document.querySelector('.paused-disp');
const onEntryDisp = document.querySelector('.on-entry');
const congratsDisp = document.querySelector('.complete');
const onEntryOpts = [...document.querySelectorAll('input[type=radio]')];
const selectOpt = document.querySelector('.select');

let difficulty = '';
let gameData = { items: [], time: 0, diff: '', rowStarts: [], colStarts: [] };
let timerStop = false;

// ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    const fetchedGameData = Storage.getGameData();
    let gameDataLength;
    if (fetchedGameData) {
        gameDataLength = fetchedGameData.items.length;
    } else {
        gameDataLength = 0;
    }


    // check storage for saved game data
    if (gameDataLength !== 0) {
        setupBoard(fetchedGameData.items, fetchedGameData.diff, fetchedGameData.time, fetchedGameData.rowStarts, fetchedGameData.colStarts);
    } else {
        // display difficulty selection 
        onEntryDisp.classList.remove('hide');
        onEntryActions();
    }

    // Pause Action
    pauseBtn.onclick = pauseGame;
});

// FUNCTIONS
// Deals with onEntry Actions
function onEntryActions() {
    let randArr = []
    selectOpt.onclick = () => {
        onEntryOpts.forEach(entry => {
            if (entry.checked) {
                difficulty = entry.value;
            }
        })

        onEntryDisp.classList.add('hide');

        if (difficulty === 'easy') {
            for (;;) {
                const i = Math.floor(Math.random() * easy.length);
                if (randArr.length !== 0) {
                    const itemMatch = randArr.find(item => item === easy[i]);
                    if (!itemMatch && itemMatch !== '') randArr.push(easy[i]);
                } else randArr.push(easy[i]);
                if (randArr.length === easy.length) break;
            }
            // randArr = easy;
        } else if (difficulty === 'normal') {
            for (;;) {
                const i = Math.floor(Math.random() * normal.length);
                if (randArr.length !== 0) {
                    const itemMatch = randArr.find(item => item === normal[i]);
                    if (!itemMatch && itemMatch !== '') randArr.push(normal[i]);
                } else randArr.push(normal[i]);
                if (randArr.length === normal.length) break;
            }
            // randArr = normal;
        } else {
            for (;;) {
                const i = Math.floor(Math.random() * hard.length);
                if (randArr.length !== 0) {
                    const itemMatch = randArr.find(item => item === hard[i]);
                    if (!itemMatch && itemMatch !== '') randArr.push(hard[i]);
                } else randArr.push(hard[i]);
                if (randArr.length === hard.length) break;
            }
            // randArr = hard;
        }
        setupBoard(randArr, difficulty, 0);
    }
}

// Set up board
setupBoard = (arr, diff, time, rowStarts, colStarts) => {
    gameData.diff = diff;

    // fit numbers in board
    dispBoardItems(arr, diff, rowStarts, colStarts);

    setupTimer(time);

    // set interval for saving game data in local storage
    const gameDataSaver = setInterval(() => {
        if (timerStop) clearInterval(gameDataSaver)
        else {
            const gridItems = [...gameBoard.querySelectorAll('.number')];
            gameData.items = [];
            gameData.rowStarts = [];
            gameData.colStarts = [];

            for (i = 0; i < gridItems.length; i++) {
                gameData.items.push(gridItems[i].textContent);
                gameData.rowStarts.push(window.getComputedStyle(gridItems[i]).gridRowStart);
                gameData.colStarts.push(window.getComputedStyle(gridItems[i]).gridColumnStart);
            }

            Storage.setGameData(gameData);
        }
    }, 500)
}

// Set up Timer
function setupTimer(value) {
    let secs = 0;
    let mins = 0;
    let hours = 0;

    if (value) {
        if (value < 60) {
            secs = value;
        } else if (value >= 60 && value < 3600) {
            mins = Math.floor(value / 60);
            secs = value % 60;
        } else if (value >= 3600) {
            hours = Math.floor(value / 3600);
            mins = Math.floor((value % 3600) / 60);
            secs = (value % 3600) % 60;
        }
    }

    const timer = setInterval(() => {
        if (timerStop) clearInterval(timer)
        else {
            secs++

            if (secs === 60) {
                mins++;
                secs = 0;
            }

            if (mins === 60) {
                hours++;
                mins = 0
            }
        }

        gameData.time = getTimerValues(hours, mins, secs);

        timerDisp.innerHTML = `<span class="hours">${timeFormat(hours)}</span> :
            <span class="mins">${timeFormat(mins)}</span> :
            <span class="secs">${timeFormat(secs)}</span>`;
    }, 1000);
}

// INCASE OF TIMER ERR, I MOVED SOME TIMER FUNCTION TO "general.js"

// Display Board Items
dispBoardItems = (arr, diff, rowStarts, colStarts) => {
    gameBoard.classList.add(diff);

    if (rowStarts && colStarts) {
        let newArr = [];

        newArr = rearrangeItems(arr, diff, rowStarts, colStarts);

        dispBoardItems2(newArr);
    } else dispBoardItems2(arr);

    clickItems([...gameBoard.querySelectorAll('.number')], diff, [...gameBoard.querySelectorAll('.number')]);
}

function dispBoardItems2(arr) {
    arr = arr.map(item => {
        let htmlCode = '';
        if (item === '') {
            htmlCode = `<button class="number empty">${item}</button>`
        } else {
            htmlCode = `<button class="number">${item}</button>`
        }
        return htmlCode;
    });

    arr = arr.join('');

    gameBoard.innerHTML = arr;
}

// Set click events on items
clickItems = (items, diff, tempItems) => {
    // class to set item position values
    class SetItem {
        constructor(item) {
            this.itemRowStart = window.getComputedStyle(item).gridRowStart;
            this.itemRowEnd = window.getComputedStyle(item).gridRowEnd;
            this.itemColStart = window.getComputedStyle(item).gridColumnStart;
            this.itemColEnd = window.getComputedStyle(item).gridColumnEnd;
        }
    }

    let prevClickedItem = null;
    let currClickedItem = null;

    if (diff === 'easy') {
        // split items into rows
        const rows = splitBoard(tempItems, diff);

        // set item gridRow and gridColumn
        items.forEach(item => {
            rows.row1.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '1/2';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row2.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '2/3';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row3.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '3/4';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
        })
    } else if (diff === 'normal') {
        // split items into rows
        const rows = splitBoard(tempItems, diff);


        // set item gridRow and gridColumn
        items.forEach(item => {
            rows.row1.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '1/2';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row2.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '2/3';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row3.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '3/4';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row4.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '4/5';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
        })
    } else {
        // split items into rows
        const rows = splitBoard(tempItems, diff);

        // set item gridRow and gridColumn
        items.forEach(item => {
            rows.row1.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '1/2';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row2.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '2/3';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row3.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '3/4';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row4.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '4/5';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
            rows.row5.forEach((rItem, i) => {
                if (item === rItem) {
                    item.style.gridRow = '5/6';
                    item.style.gridColumn = `${i+1}/${i+2}`;
                }
            })
        })
    }

    // set click event on item
    items.forEach(item => {
        item.onclick = () => {
            items.forEach(nItem => nItem.classList.remove('focus'));
            item.classList.add('focus');

            // store first click in prevClickedItem and second click in currClickedItem
            if (!prevClickedItem) prevClickedItem = item
            else if (prevClickedItem && !currClickedItem) currClickedItem = item;

            // swap item positions
            if (prevClickedItem && currClickedItem) {
                if (prevClickedItem.textContent === '' || currClickedItem.textContent === '') {
                    if (posVal(prevClickedItem, currClickedItem, SetItem)) {
                        swapItems(prevClickedItem, currClickedItem, SetItem);

                        // checks if board is chronologically  arranged after swap 
                        checker([...gameBoard.querySelectorAll('.number')], diff, [...gameBoard.querySelectorAll('.number')]);
                    };
                }
                currClickedItem = null;
                prevClickedItem = null;
                items.forEach(nItem => nItem.classList.remove('focus'));
            }
        };
    });
    // checks if board is chronologically  arranged after a reload
    checker([...gameBoard.querySelectorAll('.number')], diff, [...gameBoard.querySelectorAll('.number')]);
}

// Swap Items function
function swapItems(item1, item2, ItemClass) {
    const item1Pos = new ItemClass(item1);
    const item2Pos = new ItemClass(item2);

    item1.style.gridRow = `${item2Pos.itemRowStart}/${item2Pos.itemRowEnd}`;
    item1.style.gridColumn = `${item2Pos.itemColStart}/${item2Pos.itemColEnd}`;
    item2.style.gridColumn = `${item1Pos.itemColStart}/${item1Pos.itemColEnd}`;
    item2.style.gridRow = `${item1Pos.itemRowStart}/${item1Pos.itemRowEnd}`;
}

// Validate clicked items positions to ensure empty item is close to filled item
function posVal(item1, item2, ItemClass) {
    const item1Pos = new ItemClass(item1);
    const item2Pos = new ItemClass(item2);

    if (item1Pos.itemRowStart === item2Pos.itemRowEnd || item1Pos.itemRowEnd === item2Pos.itemRowStart) {
        if (item1Pos.itemColStart === item2Pos.itemColStart) {
            return true;
        }
    } else if (item1Pos.itemColEnd === item2Pos.itemColStart || item1Pos.itemColStart === item2Pos.itemColEnd) {
        if (item1Pos.itemRowStart === item2Pos.itemRowStart) {
            return true;
        }
    }
}

// Split items on board into row array
function splitBoard(items, diff) {
    let rows = {};
    let rowCount = 0;
    let colCount = 0;

    if (diff === 'easy') {
        rowCount = 3;
        colCount = 3;
        rows = {
            row1: [],
            row2: [],
            row3: []
        };

        // place items in respective row array
        for (i = 0; i < rowCount; i++) {
            switch (i) {
                case 0:
                    rows.row1 = items.splice(0, colCount);
                    break;
                case 1:
                    rows.row2 = items.splice(0, colCount);
                    break;
                case 2:
                    rows.row3 = items.splice(0, colCount);
                    break;
            }
        }
    } else if (diff === 'normal') {
        rowCount = 4;
        colCount = 4;
        rows = {
            row1: [],
            row2: [],
            row3: [],
            row4: []
        }

        // place items in respective row array
        for (i = 0; i < rowCount; i++) {
            switch (i) {
                case 0:
                    rows.row1 = items.splice(0, colCount);
                    break;
                case 1:
                    rows.row2 = items.splice(0, colCount);
                    break;
                case 2:
                    rows.row3 = items.splice(0, colCount);
                    break;
                case 3:
                    rows.row4 = items.splice(0, colCount);
                    break;
            }
        }
    } else {
        rowCount = 5;
        colCount = 5;
        rows = {
            row1: [],
            row2: [],
            row3: [],
            row4: [],
            row5: []
        }

        // place items in respective row array
        for (i = 0; i < rowCount; i++) {
            switch (i) {
                case 0:
                    rows.row1 = items.splice(0, colCount);
                    break;
                case 1:
                    rows.row2 = items.splice(0, colCount);
                    break;
                case 2:
                    rows.row3 = items.splice(0, colCount);
                    break;
                case 3:
                    rows.row4 = items.splice(0, colCount);
                    break;
                case 4:
                    rows.row5 = items.splice(0, colCount);
                    break;
            }
        }
    }

    return rows;
}

// Checks if items on board are arranged chronologically
checker = (items, diff, tempItems) => {
    let rows = {};
    let nItems = [];
    let rowStarts = [];
    let colStarts = [];
    const numbers = [];

    items.forEach(item => {
        rowStarts.push(window.getComputedStyle(item).gridRowStart);
        colStarts.push(window.getComputedStyle(item).gridColumnStart);
    })


    nItems = rearrangeItems(tempItems, diff, rowStarts, colStarts);

    nItems.forEach(item => {
        numbers.push(item.textContent);
    })


    rows = splitBoard(numbers, diff);

    if (check(rows, diff)) {
        // stop timer
        timerStop = true;

        // clear game data in storage
        Storage.delGameData();

        // congratulations window
        congratsDisp.classList.remove('hide');

        // save score data
        scoreData(diff);
    }
}

// Rearranges items based on row and column positions
function rearrangeItems(items, diff, rowStarts, colStarts) {
    if (diff === 'easy') {
        newArr = ['', '', '', '', '', '', '', '', ''];

        items.forEach((item, i) => {
            switch (Number(rowStarts[i])) {
                case 1:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(0, 1, item);
                            break;
                        case 2:
                            newArr.splice(1, 1, item);
                            break;
                        case 3:
                            newArr.splice(2, 1, item);
                            break;
                    }

                    break;
                case 2:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(3, 1, item);
                            break;
                        case 2:
                            newArr.splice(4, 1, item);
                            break;
                        case 3:
                            newArr.splice(5, 1, item);
                            break;
                    }

                    break;
                case 3:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(6, 1, item);
                            break;
                        case 2:
                            newArr.splice(7, 1, item);
                            break;
                        case 3:
                            newArr.splice(8, 1, item);
                            break;
                    }

                    break;
            }
        })
    } else if (diff === 'normal') {
        newArr = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

        items.forEach((item, i) => {
            switch (Number(rowStarts[i])) {
                case 1:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(0, 1, item);
                            break;
                        case 2:
                            newArr.splice(1, 1, item);
                            break;
                        case 3:
                            newArr.splice(2, 1, item);
                            break;
                        case 4:
                            newArr.splice(3, 1, item);
                            break;
                    }
                    break;
                case 2:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(4, 1, item);
                            break;
                        case 2:
                            newArr.splice(5, 1, item);
                            break;
                        case 3:
                            newArr.splice(6, 1, item);
                            break;
                        case 4:
                            newArr.splice(7, 1, item);
                            break;
                    }
                    break;
                case 3:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(8, 1, item);
                            break;
                        case 2:
                            newArr.splice(9, 1, item);
                            break;
                        case 3:
                            newArr.splice(10, 1, item);
                            break;
                        case 4:
                            newArr.splice(11, 1, item);
                            break;
                    }
                    break;
                case 4:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(12, 1, item);
                            break;
                        case 2:
                            newArr.splice(13, 1, item);
                            break;
                        case 3:
                            newArr.splice(14, 1, item);
                            break;
                        case 4:
                            newArr.splice(15, 1, item);
                            break;
                    }
                    break;
            }
        })
    } else {
        newArr = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

        items.forEach((item, i) => {
            switch (Number(rowStarts[i])) {
                case 1:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(0, 1, item);
                            break;
                        case 2:
                            newArr.splice(1, 1, item);
                            break;
                        case 3:
                            newArr.splice(2, 1, item);
                            break;
                        case 4:
                            newArr.splice(3, 1, item);
                            break;
                        case 5:
                            newArr.splice(4, 1, item);
                            break;
                    }
                    break;
                case 2:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(5, 1, item);
                            break;
                        case 2:
                            newArr.splice(6, 1, item);
                            break;
                        case 3:
                            newArr.splice(7, 1, item);
                            break;
                        case 4:
                            newArr.splice(8, 1, item);
                            break;
                        case 5:
                            newArr.splice(9, 1, item);
                            break;
                    }
                    break;
                case 3:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(10, 1, item);
                            break;
                        case 2:
                            newArr.splice(11, 1, item);
                            break;
                        case 3:
                            newArr.splice(12, 1, item);
                            break;
                        case 4:
                            newArr.splice(13, 1, item);
                            break;
                        case 5:
                            newArr.splice(14, 1, item);
                            break;
                    }
                    break;
                case 4:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(15, 1, item);
                            break;
                        case 2:
                            newArr.splice(16, 1, item);
                            break;
                        case 3:
                            newArr.splice(17, 1, item);
                            break;
                        case 4:
                            newArr.splice(18, 1, item);
                            break;
                        case 5:
                            newArr.splice(19, 1, item);
                            break;
                    }
                    break;
                case 5:
                    switch (Number(colStarts[i])) {
                        case 1:
                            newArr.splice(20, 1, item);
                            break;
                        case 2:
                            newArr.splice(21, 1, item);
                            break;
                        case 3:
                            newArr.splice(22, 1, item);
                            break;
                        case 4:
                            newArr.splice(23, 1, item);
                            break;
                        case 5:
                            newArr.splice(24, 1, item);
                            break;
                    }
                    break;
            }
        })
    }
    return newArr;
}

// Checks each row's arrangement
function check(rows, diff) {
    const rowChecks = { rowCheck1: false, rowCheck2: false, rowCheck3: false, rowCheck4: false, rowCheck5: false };

    function handler(arr) {
        if (arr) {
            for (i = 0; i < arr.length; i++) {
                let check = 0;
                if (i !== arr.length - 1) {
                    check = Number(arr[i + 1]) - Number(arr[i]);
                    if (check !== 1) break;
                } else {
                    check = Number(arr[i]) - Number(arr[i - 1]);
                    if (check !== 1) break
                    else return true;
                }
            };
        } else return false;
    };

    function handler2(arr) {
        let prevCheck = false;

        for (i = 0; i < arr.length; i++) {
            let check = 0;
            if (i !== arr.length - 1) {
                if (!arr[i + 1] && (i + 1 === arr.length - 1)) {} else {
                    check = Number(arr[i + 1]) - Number(arr[i]);
                    if (check !== 1) {
                        prevCheck = false;
                        break;
                    } else prevCheck = true;
                }
            } else {
                if (!arr[i]) {
                    if (prevCheck) return true;
                }
            }
        }
    }

    if (handler(rows.row1)) rowChecks.rowCheck1 = true;
    if (handler(rows.row2)) rowChecks.rowCheck2 = true;
    if (handler(rows.row3)) rowChecks.rowCheck3 = true;
    if (handler(rows.row4)) rowChecks.rowCheck4 = true;
    if (handler(rows.row5)) rowChecks.rowCheck5 = true; //rowChecks.rowCheck5 will always be false as long as " '' " is among its items

    if (diff === 'easy') {
        if (rowChecks.rowCheck1 && rowChecks.rowCheck2) {
            if (handler2(rows.row3)) return true;
            else return false;
        }
    } else if (diff === 'normal') {
        if (rowChecks.rowCheck1 && rowChecks.rowCheck2 && rowChecks.rowCheck3) {
            if (handler2(rows.row4)) return true;
            else return false;
        }
    } else {
        if (rowChecks.rowCheck1 && rowChecks.rowCheck2 && rowChecks.rowCheck3 && rowChecks.rowCheck4) {
            if (handler2(rows.row5)) return true;
            else return false;
        }
    }
}

// Score data function
function scoreData(diff) {
    let currScoreData = { date: { day: 0, month: 0, year: 0 }, diff: diff, time: { hours: 0, mins: 0, secs: 0 }, id: 0 };

    let scoreData = Storage.getScoreData();

    // for id
    currScoreData.id = new Date().getTime();

    // for date
    currScoreData.date = getScoreDate();

    // for time
    currScoreData.time = getScoreTime();

    // push current score data into score data
    scoreData.push(currScoreData);

    // send to local storage
    Storage.setScoreData(scoreData);
}

function getScoreDate() {
    const date = new Date();

    // day
    const day = date.getDate();

    // month
    const month = Number(date.getMonth()) + 1;

    // year
    const year = date.getFullYear();

    return { day, month, year };
}

getScoreTime = () => {
    const hours = Number(timerDisp.querySelector('.hours').textContent);
    const mins = Number(timerDisp.querySelector('.mins').textContent);
    const secs = Number(timerDisp.querySelector('.secs').textContent);

    return { hours, mins, secs };
}

// Pause function
pauseGame = (e) => {
    timerStop = true;
    pausedDisp.classList.remove('hide');

    pausedDisp.addEventListener('click', (e) => {
        if (e.target.textContent === 'resume') {
            pausedDisp.classList.add('hide');
            timerStop = false;
            setupTimer(Storage.getGameData().time);
        } else if (e.target.textContent === 'restart') {
            Storage.delGameData();
        }
    })
}