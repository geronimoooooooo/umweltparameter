
// JavaScript to dynamically set the active link
document.addEventListener('DOMContentLoaded', function() {    
    let currentPage = window.location.pathname;
    
    if(currentPage=="/"){
        currentPage="/home";
    }
    
    if (typeof currentPage !== 'undefined') {
        let linkId = currentPage.substring(1); //removes first char    
        let linkElement = document.getElementById(linkId);
        if (linkElement) {
            linkElement.classList.add('active');
        }
    }
});
