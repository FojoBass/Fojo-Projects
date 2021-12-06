// MONTHS
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
// DAYS
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


// PARAMS
// Header Sect
const jumpBtn = document.getElementById('jump');
const goTodayBtn = document.getElementById('today');
// Jump to date
const toDateContainer = document.querySelector('.to-date');
const notifiContainer = document.querySelector('.notifications');
const closeBtn = document.querySelector('.close');
const jumpInputs = [...document.querySelectorAll('input[type=number]')];
const goJumpBtn = document.querySelector('input[type=submit]');
const form = document.querySelector('form');
// Main Sect
const mainSect = document.querySelector('main');
const prevBtn = document.getElementById('prev');
const mainMth = document.querySelector('main .mth');
const mainYear = document.querySelector('main .year');
const nextBtn = document.querySelector('#next');
const datesList = [...document.querySelectorAll('.dates li')];
// Clicked Date Sect
const cliDateSect = document.querySelector('.clicked-date');
const cliDay = document.querySelector('.day');
const cliDate = document.querySelector('.date');
const cliMth = document.querySelector('.clicked-date .mth');
const cliYear = document.querySelector('.clicked-date .year');
const eventsContainer = document.querySelector('.items');
const nilContainer = document.querySelector('.items h2');
const addEventBtn = document.querySelector('.add-event');
const cliCloseBtn = document.querySelector('.clicked-date .close');
// enter event sect
const entEventContainer = document.querySelector('.container');
const textArea = document.querySelector('textarea');
const enterBtn = document.querySelector('.enter');
// Footer
const footYear = document.getElementById('current-year');

let date = new Date();
let mth = date.getMonth();
let year = date.getFullYear();

const currMth = date.getMonth();
const currYear = date.getFullYear();
const currDate = date.getDate();

let firstDay;
let id = 0;
let eventDets = [];
let editElement = '';
let editFlag = false;
let editId = '';

// ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    dispDates(mth, year);

    markToday();

    nextBtn.onclick = nextBtnClicked;

    prevBtn.onclick = prevBtnClicked;

    goTodayBtn.onclick = goTodayClicked;

    jumpBtn.onclick = jumpClicked;

    datesList.forEach((list) => list.onclick = listClicked);

    footYear.textContent = currYear;

})

// FUNCTIONS
// First disp dates func ensures exact number of days in the month
function dispDates(m, y, d) {
    datesList.forEach((list) => list.textContent = '');

    for (i = 1;; i++) {
        date.setDate(i);
        if (date.getMonth() === m) dispDates2(date.getDate(), m, y)
        else if (date.getMonth() === m + 1) break
        else if (date.getMonth() === 0 && m === 11) break;
    }

    if (d) {
        const lElement = datesList.find((list) => list.textContent == d);
        lElement.classList.add('flicker');
        lElement.onanimationend = () => lElement.classList.remove('flicker');
    }


    mainMth.textContent = months[m];
    mainYear.textContent = y;

    checkForEvents(m, y);
}

// Second disp dates func, does the actual display of dates
dispDates2 = (dNum) => {
    const nDay = date.getDay();
    let daysGroup = [];

    switch (nDay) {
        case 0:
            daysGroup = datesList.filter(dList => dList.id === 'sunday');
            fixInDates(dNum, daysGroup, nDay);
            break;
        case 1:
            daysGroup = datesList.filter(dList => dList.id === 'monday');
            fixInDates(dNum, daysGroup, nDay);
            break;
        case 2:
            daysGroup = datesList.filter(dList => dList.id === 'tuesday');
            fixInDates(dNum, daysGroup, nDay);
            break;
        case 3:
            daysGroup = datesList.filter(dList => dList.id === 'wednesday');
            fixInDates(dNum, daysGroup, nDay);
            break;
        case 4:
            daysGroup = datesList.filter(dList => dList.id === 'thursday');
            fixInDates(dNum, daysGroup, nDay);
            break;
        case 5:
            daysGroup = datesList.filter(dList => dList.id === 'friday');
            fixInDates(dNum, daysGroup, nDay);
            break;
        case 6:
            daysGroup = datesList.filter(dList => dList.id === 'saturday');
            fixInDates(dNum, daysGroup, nDay);
            break;
    }
}

// Works with dispDates2()
function fixInDates(date, group, day) {
    if (date === 1) {
        firstDay = day;
    }

    if (day < firstDay) {
        for (j = 0; j < group.length; j++) {
            if (j !== 0 && !group[j].textContent) {
                group[j].textContent = date;
                break;
            }
        }
    } else {
        for (j = 0; j < group.length; j++) {
            if (!group[j].textContent) {
                group[j].textContent = date;
                break;
            }
        }
    }
}

// Checks Local Storage for event details and signify on calendar
checkForEvents = () => {
    eventDets = getStorage();

    datesList.forEach(list => list.classList.remove('event'));

    if (eventDets.length) {
        const dispMth = mainMth.textContent;
        const dispYear = mainYear.textContent;

        eventDets.forEach(det => {
            if (det.mth === dispMth && det.year === dispYear) {
                const target = datesList.find(list => list.textContent === det.date);
                target.classList.add('event');
            }
        })
    }
}

// Marks the current day on calendar
markToday = () => {
    datesList.forEach(list => list.classList.remove('today'));

    if (mth === currMth && year === currYear) {
        datesList.find(list => list.textContent == currDate).classList.add('today');
    }
}

// Error Notification
errNote = (msg) => {
    notifiContainer.classList.remove('hide');
    notifiContainer.innerHTML = msg;

    setTimeout(() => notifiContainer.classList.add('hide'), 3000)
}

// Validates date input value
dateValid = (dNum, mNum, yNum) => {
    const yNumArr = [...String(yNum)];
    let det = false;

    if (yNumArr[2] == 0 && yNumArr[3] == 0) det = true;

    if (!(yNum % 4) && mNum === 2 && !det) {
        if (dateValid2(dNum, 29)) return true;
    } else if (det && !(yNum % 400) && mNum === 2) {
        if (dateValid2(dNum, 29)) return true;
    } else if (mNum === 4 || mNum === 6 || mNum === 9 || mNum === 11) {
        if (dateValid2(dNum, 30)) return true;
    } else if (mNum === 1 || mNum === 3 || mNum === 5 || mNum === 7 || mNum === 8 || mNum === 10 || mNum === 12) {
        if (dateValid2(dNum, 31)) return true;
    } else if (!(mNum < 1) && !(mNum > 12)) {
        if (dateValid2(dNum, 28)) return true;
    } else errNote(`<span>i</span>nvalid month!`);
}

// Works with dateValid()
dateValid2 = (num, tDays) => {
    if (num >= 1 && num <= tDays) return true
    else if (num < 1) errNote('<span>i</span>nvalid date!')
    else errNote(`<span>i</span>nvalid date! <span>m</span>onth has only ${tDays} days`);
}

// Validates month input value
mthValid = (num) => {
    if (num >= 1 && num <= 12) return true
    else errNote('<span>i</span>nvalid month!');
}

// Validates year input value
yearValid = (num) => {
    if (num >= 1900) return true
    else if (num < 1) errNote('<span>i</span>nvalid year!')
    else if (num >= 1 && num < 1900) errNote('<span>y</span>ear value should be at least 1900');
}

// Formats date value
dateFormat = (num) => {
    const numArr = [...num];

    if (num != 11 && num != 12 && num != 13) {
        switch (Number(numArr[numArr.length - 1])) {
            case 1:
                return `${num}<sup>st</sup>`;
            case 2:
                return `${num}<sup>nd</sup>`;
            case 3:
                return `${num}<sup>rd</sup>`;
            default:
                return `${num}<sup>th</sup>`;
        }
    } else return `${num}<sup>th</sup>`;
}

// Display events from Local Storage
function dispEvents() {
    eventDets = getStorage();
    const dispMth = mainMth.textContent;
    const dispYear = mainYear.textContent;
    let dispDate = [...cliDate.textContent];


    dispDate.splice(dispDate.length - 2, 2);
    dispDate = dispDate.join('');

    if (!eventDets.length) nilContainer.classList.remove('hide')
    else {
        if (!nilContainer.classList.contains('hide')) nilContainer.classList.add('hide');

        const events = [...eventsContainer.querySelectorAll('li')];

        if (events.length) {
            events.forEach((event) => eventsContainer.removeChild(event));
        }

        eventDets.forEach((det) => {
            if (det.mth === dispMth && det.year === dispYear && det.date === dispDate) {
                if (!nilContainer.classList.contains('hide')) nilContainer.classList.add('hide');

                const event = document.createElement('li');
                event.classList.add('item');
                event.id = det.id;

                event.innerHTML = `<div class="details">${det.details}</div>
                                    <div class="opts">
                                        <button class='edit' id=${det.id}>edit</button>
                                        <button class='del' id=${det.id}>del</button>
                                    </div>`;

                eventsContainer.appendChild(event);

                const editEvent = event.querySelector('.edit');
                const delEvent = event.querySelector('.del');

                editEvent.onmousedown = () => editEvent.classList.add('focus');
                delEvent.onmousedown = () => delEvent.classList.add('focus');

                editEvent.onmouseup = editClicked;
                delEvent.onmouseup = delClicked;
            } else {
                if (eventsContainer.children.length < 2) nilContainer.classList.remove('hide');
            }
        })
    }
}

// For animations
animation = (state) => {
    if (state) {
        goTodayBtn.style.pointerEvents = 'none';
        prevBtn.style.pointerEvents = 'none';
        nextBtn.style.pointerEvents = 'none';
    } else {
        goTodayBtn.style.pointerEvents = 'initial';
        prevBtn.style.pointerEvents = 'initial';
        nextBtn.style.pointerEvents = 'initial';
    }
}

// CALLBACK FUNCTS
// For nextBtn click event
nextBtnClicked = () => {
    mainSect.classList.add('next-anim');
    mainSect.onanimationstart = () => animation(true);
    mainSect.onanimationend = () => {
        mainSect.classList.remove('next-anim');
        animation(false);
    }

    setTimeout(() => {
        if (mth !== 11) {
            date.setMonth(mth + 1);
            mth = date.getMonth();
        } else {
            date.setMonth(0);
            date.setFullYear(year + 1);
            mth = date.getMonth();
            year = date.getFullYear();
        }

        dispDates(mth, year);

        markToday();
    }, 640)
}

// For prevBtn click event
prevBtnClicked = () => {
    mainSect.classList.add('prev-anim');
    mainSect.onanimationstart = () => animation(true);

    mainSect.onanimationend = () => {
        mainSect.classList.remove('prev-anim');
        animation(false);
    }

    setTimeout(() => {
        if (mth !== 0) {
            date.setMonth(mth - 1);
            mth = date.getMonth();
        } else {
            date.setMonth(11);
            date.setFullYear(year - 1);
            mth = date.getMonth();
            year = date.getFullYear();
        }

        dispDates(mth, year);

        markToday();
    }, 640)
}

// For goToTodayBtn click event
goTodayClicked = () => {
    date = new Date();
    mth = date.getMonth();
    year = date.getFullYear();
    mainSect.classList.add('disp-anim');

    mainSect.onanimationstart = () => animation(true);
    mainSect.onanimationend = () => {
        mainSect.classList.remove('disp-anim');
        animation(false);
    }
    setTimeout(() => {
        dispDates(currMth, currYear);
        markToday();
    }, 750);
}

// For jumpBtn click event
jumpClicked = () => {
    toDateContainer.classList.remove('hide');

    goJumpBtn.onmousedown = () => goJumpBtn.classList.add('focus');

    goJumpBtn.onmouseup = () => goJumpBtn.classList.remove('focus');

    closeBtn.onmousedown = () => closeBtn.classList.add('focus');
    closeBtn.onmouseup = () => {
        closeBtn.classList.remove('focus');
        toDateContainer.classList.add('hide');
    };


    form.onsubmit = (e) => {
        e.preventDefault();

        const dateValue = Number(jumpInputs[0].value);
        const mthValue = Number(jumpInputs[1].value);
        const yearValue = Number(jumpInputs[2].value);

        if (dateValid(dateValue, mthValue, yearValue) && mthValid(mthValue) && yearValid(yearValue)) {
            date = new Date(yearValue, mthValue - 1);
            mth = date.getMonth();
            year = date.getFullYear();
            mainSect.classList.add('disp-anim');

            mainSect.onanimationstart = () => animation(true);
            mainSect.onanimationend = () => {
                mainSect.classList.remove('disp-anim');
                animation(false);
            }
            setTimeout(() => {
                dispDates(mth, year, dateValue);
                markToday();
            }, 750);
            toDateContainer.classList.add('hide');
        }
    }
}

// For datesList click event
listClicked = (e) => {
    const liElement = e.currentTarget;

    if (liElement.textContent) {
        cliDateSect.classList.remove('hide');
        cliDay.textContent = liElement.id;
        cliDate.innerHTML = dateFormat(liElement.textContent);
        cliMth.textContent = mainMth.textContent;
        cliYear.textContent = mainYear.textContent;
    }

    dispEvents();

    addEventBtn.onmousedown = () => addEventBtn.classList.add('focus');

    addEventBtn.onmouseup = () => {
        addEventBtn.classList.remove('focus');
        entEventContainer.classList.remove('hide');
    }

    enterBtn.onmousedown = () => enterBtn.classList.add('focus');
    enterBtn.onmouseup = enterClicked;

    cliCloseBtn.onmousedown = () => cliCloseBtn.classList.add('focus');
    cliCloseBtn.onmouseup = () => {
        cliCloseBtn.classList.remove('focus');
        cliDateSect.classList.add('hide');
    };
}

// For event enterBtn 
enterClicked = () => {
    eventDets = getStorage();
    if (!editFlag) {
        let textValue = textArea.value.trim();
        if (!textValue) entEventContainer.classList.add('hide')
        else {
            enterBtn.classList.remove('focus');
            let formatDate = [...cliDate.textContent];


            formatDate.splice(formatDate.length - 2, 2);
            formatDate = formatDate.join('');

            textValue = [...textValue];
            textValue[0] = textValue[0].toUpperCase();
            textValue = textValue.join('');

            const eventDet = {
                details: textValue,
                date: formatDate,
                mth: cliMth.textContent,
                year: cliYear.textContent,
                id: new Date().getTime()
            };

            eventDets.push(eventDet);

            setStorage(eventDets);
            checkForEvents();
            dispEvents();

            entEventContainer.classList.add('hide');
        }
    } else {
        let textValue = textArea.value.trim();
        if (textValue) {
            textValue = [...textValue];
            textValue[0] = textValue[0].toUpperCase();
            textValue = textValue.join('');

            editElement.children[0].textContent = textValue;
            editStorage(textValue, editId);
        }
        setToDefault();
        entEventContainer.classList.add('hide');
    }
}

// For editBtn
editClicked = (e) => {
    const btn = e.currentTarget;
    const eventList = [...document.querySelectorAll('.item')];
    editElement = eventList.find(list => list.id === btn.id);
    const textValue = editElement.children[0].textContent;

    entEventContainer.classList.remove('hide');
    textArea.value = textValue;

    enterBtn.textContent = 'edit';
    editFlag = true;
    editId = editElement.id;

    btn.classList.remove('focus');
}

// For delBtn
delClicked = (e) => {
    const btn = e.currentTarget;
    const eventList = [...document.querySelectorAll('.item')];
    delElement = eventList.find(list => list.id === btn.id);
    const textValue = delElement.children[0].textContent;

    eventsContainer.removeChild(delElement);
    delStorage(btn.id);

    if (eventsContainer.children.length === 1) nilContainer.classList.remove('hide');

    btn.classList.remove('focus');
    checkForEvents();
}

setToDefault = () => {
    editFlag = false;
    enterBtn.textContent = 'enter';
}

// LOCAL STORAGE FUNCS
getStorage = () => {
    return localStorage.getItem('eventDetails') ? JSON.parse(localStorage.getItem('eventDetails')) : [];
}

setStorage = (item) => {
    localStorage.setItem('eventDetails', JSON.stringify(item));
}

editStorage = (value, id) => {
    eventDets = getStorage();
    eventDets.forEach(det => {
        if (det.id == id) {
            det.details = value;
        }
    })
    setStorage(eventDets);
}

delStorage = (id) => {
    eventDets = getStorage();
    eventDets.forEach((det, i) => {
        if (det.id == id) eventDets.splice(i, 1);
    })
    setStorage(eventDets);
}