tables = document.getElementsByClassName('tables');
tables[0].classList.add('selected');
for (let i = 0; i < tables.length; i++) {
    // tables[i].addEventListener('mouseover', function() {
    //     for (let j = 0; j < tables.length; j++) {
    //         tables[j].style.background = '#2c2c36'; 
    //     }
    //     this.style.background = '#3A3A45'
    //     console.log(this.getAttribute('data-value'))
    // });
    tables[i].addEventListener('click', function() {
        for (let j = 0; j < tables.length; j++) {
            tables[j].classList.remove('selected');
        }
        this.classList.add('selected');
        console.log(this.getAttribute('data-value'));
    });    
}
