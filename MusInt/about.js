// PARAMS
const sections = [...document.querySelectorAll('.details-section .head li')];
const sectionTexts = [...document.querySelectorAll('.category-text')];

sections.forEach(section => {
    section.onclick = () => {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        section.classList.add('active');

        sectionTexts.forEach(text => {
            const textID = text.dataset.id;
            text.classList.remove('active');
            if (section.getAttribute('id') === textID) {
                text.classList.add('active');
            }
        })
    }
})