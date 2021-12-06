// PARAMS
const scoreContainer = document.querySelector('.scores');
const confirmClear = document.querySelector('.confirm');
const optsContainer = document.querySelector('.sec-container');
const optsSuperContainer = document.querySelector('.filter-opts');
const clearBtn = document.querySelector('.clear');
const noScore = document.querySelector('.empty');
const filterBtn = document.querySelector('.filter');

// ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    const scoreData = Storage.getScoreData();

    if (scoreData.length) {
        noScore.classList.add('hide');
        clearBtn.classList.remove('hide');
        filterBtn.style.pointerEvents = 'initial';

        let arrangedData = arrData(scoreData);

        displayScore(arrangedData, [...arrangedData]);
    }
})

// FUNCTIONS
// Arranges data chronologically
arrData = (arr) => {
    let nData = [];
    let rData = [];

    arr.forEach((item) => {
        const idTime = { time: getTimerValues(item.time.hours, item.time.mins, item.time.secs), id: item.id };
        nData.push(idTime);
    })

    for (i = 0; i < nData.length;) {
        if (i !== nData.length - 1) {
            if (nData[i].time > nData[i + 1].time) {
                const small = nData[i + 1];
                const big = nData[i];

                nData[i] = small;
                nData[i + 1] = big;

                i = 0;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }

    nData.forEach((data) => {
        rData.push(arr.find((item) => item.id === data.id));
    });

    return rData;
}

// Displays score
function displayScore(arr, arrData) {
    displayScore2(arr);

    clickFilter([...document.querySelectorAll('.score .difficulty')], arrData);
    clearScores();
}

function displayScore2(arr) {
    arr = arr.map((data, i) => {
        return `<div class="score">
                <p class="serial-number">${i+1}.</p>

                <p class="date">
                    <span class='day'>${data.date.day}</span>/<span class='month'>${data.date.month}</span>/<span class='year'>${data.date.year}</span>
                </p>

                <p class="difficulty">${data.diff}</p>

                <p class="time">
                    <span class="hours">${timeFormat(data.time.hours)}</span> : <span class='minutes'>${timeFormat(data.time.mins)}</span> : <span class='secs'>${timeFormat(data.time.secs)}</span>
                </p>
            </div>`
    });

    arr = arr.join('');

    scoreContainer.innerHTML = arr;
}

clickFilter = (diffs, arrData) => {
    diffs = diffs.map((diff) => diff.textContent);

    diffs = diffs.reduce((values, diff) => {
        if (!values.includes(diff)) values.push(diff);
        return values;
    }, ['all']);

    diffs = diffs.map((diff) => {
        if (diff === 'all') {
            return `<div class="${diff} opts">
                    <input type="radio" name='difficulty' id=${diff} checked = 'checked'>
                    <label for=${diff}>${diff}</label>
                </div>`;
        } else {
            return `<div class="${diff} opts">
                    <input type="radio" name='difficulty' id=${diff}>
                    <label for=${diff}>${diff}</label>
                </div>`;
        }
    })

    diffs = diffs.join('')

    optsContainer.innerHTML = diffs;

    filterBtn.onclick = () => {
        optsSuperContainer.classList.remove('hide');
    }

    const filterOpts = [...optsContainer.querySelectorAll('input[name=difficulty]')];

    document.querySelector('.select').onclick = () => {
        let checkId = '';
        filterOpts.forEach((opt) => {
            if (opt.checked) checkId = opt.id;
        })

        let filData = [];

        checkId === 'all' ? filData = [...arrData] : filData = arrData.filter((data) => {
            if (data.diff === checkId) return data;
        });

        displayScore2(filData);

        optsSuperContainer.classList.add('hide');
    }
}

clearScores = () => {
    clearBtn.addEventListener('click', function() {
        confirmClear.classList.remove('hide');

        confirmClear.onclick = (e) => {
            if (e.target.id === 'yes') {
                // delete data on screen
                for (;;) {
                    scoreContainer.removeChild(scoreContainer.children[0]);
                    if (!scoreContainer.children.length) break;
                }

                // delete data in local storage
                Storage.delScoreData();

                // revert to empty display
                noScore.classList.remove('hide');
                clearBtn.classList.add('hide');
                filterBtn.style.pointerEvents = 'none';
                confirmClear.classList.add('hide');
            } else if (e.target.id === 'no') confirmClear.classList.add('hide');
        }
    })
}