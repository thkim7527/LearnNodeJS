let isDarkMode;

function toggleDarkMode() {
    if(isDarkMode) {
        document.querySelector('body').style.backgroundColor = 'white';
        document.querySelector('body').style.color = 'black';
        isDarkMode = false;
    } else {
        document.querySelector('body').style.backgroundColor = 'black';
        document.querySelector('body').style.color = 'white';
        isDarkMode = true;
    }
}
