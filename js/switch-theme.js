const modeSphere = document.getElementById('modeSphere');
const htmlElement = document.documentElement;
const iconElement = modeSphere.querySelector('i');

const preferDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');


let isDarkMode = localStorage.getItem('darkMode') == 'true' ||
                 (!localStorage.getItem('darkMode') && preferDarkScheme.matches);


updateMode();

modeSphere.addEventListener('click', toggleMode);

modeSphere.addEventListener('clcik', function(e) {
    const wave = document.createElement('div');
    wave.classList.add('wave');
    this.appendChild(wave);

    setTimeout(() => {
        wave.remove();
    }, 600);
});

let lastScrollTop = 0;
let sphereBottom = 30;

window.addEventListener('scroll', function() {
    const scroolTop = this.window.pageYOffset || this.document.documentElement.scrollTop;


    if (scroolTop > lastScrollTop){
        sphereBottom = Math.max(15, sphereBottom - 0.5);

    } else{
        sphereBottom = Math.min(45, sphereBottom + 0.5);
    }

    this.document.querySelector('.sphere-container').computedStyleMap.bottom = `${sphereBottom}px`;


    lastScrollTop = scroolTop;
});

function toggleMode(){
    isDarkMode = !isDarkMode;
    updateMode();
    saveModePreference();
}

function updateMode(){
    if(isDarkMode){
        htmlElement.classList.remove('light-mode');
        htmlElement.classList.add('dark-mode');
        iconElement.className = 'fas fa-sun';

    } else{
        htmlElement.classList.remove('dark-mode');
        htmlElement.classList.add('light-mode');
        iconElement.className = 'fas fa-moon';
    }
}

function saveModePreference(){
    localStorage.setItem('darkMode', isDarkMode);
}

preferDarkScheme.addEventListener('change', e => {
    if (localStorage.getItem('darkMode') === null) {
        isDarkMode = e.matches;
        updateMode();
    }
});

