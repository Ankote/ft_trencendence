    let tables = document.getElementsByClassName('tables');
    tables[0].classList.add('selected');
    for (let i = 0; i < tables.length; i++) {
        tables[i].addEventListener('click', function() {
            for (let j = 0; j < tables.length; j++) {
                tables[j].classList.remove('selected');
            }
            this.classList.add('selected');
            console.log(this.getAttribute('data-value'));
        });    
    }

    let lPlayerPaddel = document.querySelectorAll(".player1 > .paddles > div");
    
    function paddleClickHandler() {
        for (let j = 0; j < lPlayerPaddel.length; j++) {
            lPlayerPaddel[j].classList.remove('selectedPaddle');
        }
        this.classList.add('selectedPaddle');
        console.log(this.getAttribute('data-value'));
    }
    
    // Adding click event listeners to paddles
    lPlayerPaddel[0].classList.add('selectedPaddle');
    for (let i = 0; i < lPlayerPaddel.length; i++) {
        lPlayerPaddel[i].addEventListener('click', paddleClickHandler);
    }

    let rPlayerPaddel = document.querySelectorAll(".player2 > .paddles > div")
    rPlayerPaddel[0].classList.add('selectedPaddle');
    for (let i = 0; i < rPlayerPaddel.length; i++){
        rPlayerPaddel[i].addEventListener('click', function() {
            for (let j = 0; j < rPlayerPaddel.length; j++) {
                rPlayerPaddel[j].classList.remove('selectedPaddle');
            }
            this.classList.add('selectedPaddle');
            console.log(this.getAttribute('data-value'));
        });    
    }

    let readyButton = document.querySelectorAll(".player > button")
    let nameField = document.querySelectorAll("input")
    let startGameBtn = document.getElementById("startGame")
    if (startGameBtn)
    {
        startGameBtn.addEventListener("click", event=>{
            if (nameField[0].textContent == '')
            {

            }
            })
    }

    for (let i = 0; i < readyButton.length; i++){
        readyButton[i].addEventListener('click', function() {
            if (this.textContent == "Ready")
            {
                nameField[i].disabled = true
                nameField[i].style.border = "none"
                nameField[i].style.color = '#5A5A62'
                this.textContent = "Cancel"
                for (let i = 0; i < lPlayerPaddel.length; i++) {
                    lPlayerPaddel[i].removeEventListener('click', paddleClickHandler);
                }
            }
            else
            {
                nameField[i].disabled = false
                nameField[i].style.border = " solid 1px #666673"
                nameField[i].style.color = '#D7D7DB'
                this.textContent = "Ready"
                for (let i = 0; i < lPlayerPaddel.length; i++) {
                    lPlayerPaddel[i].addEventListener('click', paddleClickHandler);
                }
            }
        });    
    }
