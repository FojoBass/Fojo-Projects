// PARAMS
// Header
const btn = document.querySelector('.side-btn');
const optsCont = document.querySelector('.content');
const algBtn = document.getElementById('analog');
const dglBtn = document.getElementById('digital');
const bothBtn = document.getElementById('both');
const fmtBtns = [...document.querySelectorAll('.formats button')];
// Main
const hHand = document.getElementById('hHand');
const mHand = document.getElementById('mHand');
const sHand = document.getElementById('sHand');
const aClock = document.getElementById('aClock');
const dCont = document.querySelector('.dClock-container');
const dH = document.getElementById('h');
const dM = document.getElementById('m');
const dP = document.getElementById('period');
// Footer
const currYear = document.getElementById('current-year');

// ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    setupClock();
    btn.onclick = btnClick;
    algBtn.onclick = algClick;
    dglBtn.onclick = dglClick;
    bothBtn.onclick = bothClick;
    fmtBtns.forEach(btn => {
        btn.onclick = fBtnClick;
    })
    clockFunction();

    currYear.textContent = new Date().getFullYear();
})

// FUNCTIONS
// set clock markers
setupClock = () => {
        for (i = 0; i <= 31; i++) {
            const element = document.createElement('div');

            element.classList.add('dMark');
            element.innerHTML = `<span class='top'></span><span class="bot"></span>`;
            if (i === 0 || i === 5 || i === 10 || i === 15 || i === 20 || i === 25) element.classList.add('main');

            aClock.appendChild(element);
            setupStyles(element, i);
        }
    }
    // set markers' style
setupStyles = (e, i) => e.style.transform = `translate(-50%) rotate(${i * 6}deg)`;

// animation on clicked btns
function focus(b) {
    b.classList.add('focus');
    setTimeout(() => b.classList.remove('focus'), 200);
}

// Moves hands
clockFunction = () => {
    setInterval(() => {
        const tH = new Date().getHours();
        const tM = new Date().getMinutes();
        const tS = new Date().getSeconds();

        setHand(hHand, tH, tM, tS);
        setHand(mHand, tH, tM, tS);
        setHand(sHand, tH, tM, tS);

        if (fmtBtns[1].classList.contains('chosen')) {
            dH.textContent = fmtTime(tH);
            dP.textContent = '';
        } else {
            if (tH <= 12) {
                dH.textContent = fmtTime(tH);
                if (tH < 12) dP.textContent = 'am';
                else dP.textContent = 'pm';
            } else {
                dH.textContent = fmtTime(tH - 12);
                dP.textContent = 'pm';
            }
        }
        dM.textContent = fmtTime(tM);
    }, 100)
}

// Sets hands positions
setHand = (hand, vH, vM, vS) => {
    let j = 0;
    if (hand.id === 'hHand') {
        let n = vH;
        j = vM * 0.5;

        if (n > 12) n -= 12;

        hand.style.transform = `translate(-50%,-50%) rotate(${(n * 6 *5) + j}deg)`;
    } else if (hand.id === 'mHand') {
        j = vS * 0.1;

        hand.style.transform = `translate(-50%,-50%) rotate(${(vM * 6) + j}deg)`;
    } else hand.style.transform = `translate(-50%,-50%) rotate(${vS * 6}deg)`;
}

// Formats time
fmtTime = (num) => {
    let arr = [...String(num)];
    if (arr.length < 2) return `0${num}`
    else return num;
}

// EVENT LISTENERS
btnClick = () => {
    optsCont.classList.toggle('show');
    focus(btn);
}

algClick = () => {
    if (dglBtn.classList.contains('chosen')) dglBtn.classList.remove('chosen');
    if (bothBtn.classList.contains('chosen')) bothBtn.classList.remove('chosen');
    focus(algBtn);
    algBtn.classList.add('chosen');
    dCont.classList.add('hide');
    aClock.parentElement.classList.remove('hide');
    optsCont.classList.remove('show');
    fmtBtns[1].style.pointerEvents = 'none';
    fmtBtns[1].classList.remove('chosen');
    fmtBtns[0].classList.add('chosen');
}

dglClick = () => {
    if (algBtn.classList.contains('chosen')) algBtn.classList.remove('chosen');
    if (bothBtn.classList.contains('chosen')) bothBtn.classList.remove('chosen');
    focus(dglBtn);
    dglBtn.classList.add('chosen');
    dCont.classList.remove('hide');
    aClock.parentElement.classList.add('hide');
    optsCont.classList.remove('show');
    fmtBtns[1].style.pointerEvents = 'initial';
}

bothClick = () => {
    if (algBtn.classList.contains('chosen')) algBtn.classList.remove('chosen');
    if (dglBtn.classList.contains('chosen')) dglBtn.classList.remove('chosen');
    focus(dglBtn);
    bothBtn.classList.add('chosen');
    dCont.classList.remove('hide');
    aClock.parentElement.classList.remove('hide');
    optsCont.classList.remove('show');
    fmtBtns[1].style.pointerEvents = 'initial';
}

fBtnClick = (e) => {
    fmtBtns.forEach(btn => btn.classList.remove('chosen'));
    e.currentTarget.classList.add('chosen');
    focus(e.currentTarget);
    optsCont.classList.remove('show');
}