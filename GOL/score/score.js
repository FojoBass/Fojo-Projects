// PARAMS
const header = document.querySelector('header');
const mainHead = document.querySelector('.head');
const clearContainer = document.querySelector('.det-wrapper+div')


// Main
const noScore = document.querySelector('main h1');
const detsSupCon = document.querySelector('.dets');
const detsCon = document.querySelector('.det-wrapper');
const clearBtn = document.querySelector('.clear');
const main = document.querySelector('main');


// Clear
const clearSect = document.querySelector('#confirm');
const clearOpts = document.querySelectorAll('#confirm .opt');

// More
const moreSect = document.getElementById('more');
const closeBtn = document.getElementById('close');
const diff = document.querySelector('.diff');
const rems = document.querySelectorAll('.rem');
const gRem = document.querySelector('.gr');

const scoreData = Storage.getScoreData();

// ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    posDivs();

    if (scoreData.length) {
        showHide(detsSupCon, true);
        let data = scoreData.map((sD, i) => {
            return `
             <div class="det">
                        <div class="sn"><span>${i+1}</span>.</div>
                        <div class="diff">${sD.diff}</div>
                        <div class="rp">${sD.passed}</div>
                        <div class="rem">${sD.rem}</div>
                        <div class="date"><span class="dd">${format(sD.dd)}</span>/<span class='mm'>${format(sD.mm+1)}</span>/<span class='yy'>${formatYear(sD.yy)}</span></div>
                    </div>
            `;
        });
        data = data.join('');
        detsCon.innerHTML = data;
        posDivs();

        const dets = detsCon.querySelectorAll('.det');
        dets.forEach((det, i) => {
            det.onclick = () => clickDet(i);
        });
    } else showHide(noScore, true);

    clearBtn.onclick = clearAll;
})

// FUNCTIONS
// For remove and add .hide
function showHide(e, state) {
    if (state) e.classList.remove('hide')
    else e.classList.add('hide');
}

// Formats Year
formatYear = (n) => {
    n = [...String(n)];
    n = n.splice(n.length - 2, 2);
    n = n.join('');
    return n;
}

// Formats dd and mm
format = (num) => {
    const n = [...String(num)];
    if (n.length === 1) return `0${num}`
    else return num;
}

// Fix in Css position values
function posDivs() {
    main.style.height = `calc(100vh - ${header.getBoundingClientRect().height}px)`;
    mainHead.style.top = `${header.getBoundingClientRect().height}px`;
    detsCon.style.top = `${mainHead.getBoundingClientRect().bottom}px`;
    clearContainer.style.top = `${detsCon.getBoundingClientRect().bottom-clearContainer.getBoundingClientRect().top}px`;
}

// For More Dets
clickDet = (ind) => {
    showHide(moreSect, true);
    scoreData.forEach((dat, i) => {
        if (ind === i) {
            diff.textContent = dat.diff;
            rems.forEach((r, inx) => r.textContent = dat.roundsRem[inx]);
            gRem.textContent = dat.rem;
        }
    })

    closeBtn.onclick = () => showHide(moreSect, false);
}

// EVENT LISTENERS
// For ClearBtn
clearAll = () => {
    showHide(clearSect, true);
    clearOpts.forEach(opt => {
        opt.onclick = () => {
            if (opt.textContent === 'yes') {
                detsCon.innerHTML = '';
                showHide(detsSupCon, false);
                showHide(noScore, true);
                Storage.delScoreData();
                showHide(clearSect, false);
            } else showHide(clearSect, false);
        }
    })
}