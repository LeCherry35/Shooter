document.addEventListener('keydown', move);

const container = document.querySelector('.container');
container.addEventListener('click', shoot);

const gun = document.querySelector('.gun')
gun.addEventListener('click', event => event.stopPropagation())

let score = 0
let shipFrequency = 1500
let gameOver = false
let starX = Math.random() * 600
let starY = Math.random() * 600
updateScore()

setInterval(() => {

    shipAppears()
    shipMoves()
    setInterval(() => {

        shipAppears()
        shipMoves()
    }
    , shipFrequency + 1234.56789)
}
, shipFrequency)
setInterval(() => {
    if(!gameOver) {

        checkHit()
        CheckCrash()
    }
}, 10)
// setInterval(() => {
//     shipFrequency = Math.floor(shipFrequency / 2)
// }, 1000)


function move (event) {
    switch (event.code) {
        case 'KeyW':
            moveUp()
            break
        case 'KeyS':
            moveDown()
            break
        case 'KeyD':
            moveRight()
            break
        case 'KeyA':
            moveLeft()
            break
    }
}
function moveUp () {
    var gun = document.querySelector('.gun');
    const gunTop = gun.offsetTop - 500
    gun.style.top = gunTop + 'px'  
}
function moveLeft () {
    var gun = document.querySelector('.gun');
    const gunLeft = gun.offsetLeft - 500
    gun.style.left = gunLeft + 'px'
}
function moveDown () {
    var gun = document.querySelector('.gun');
    const gunTop = gun.offsetTop + 500
    gun.style.top = gunTop + 'px'  
}
function moveRight () {
    var gun = document.querySelector('.gun');
    const gunLeft = gun.offsetLeft + 500
    gun.style.left = gunLeft + 'px'
}

function updateScore() {
    const scoreDiv = document.querySelector('#score')
    scoreDiv.innerHTML = score
}

function shoot(e) {
    const gun = document.querySelector('.gun');
    // const container = this
    container.insertAdjacentHTML('afterbegin', '<div class= "bullet"></div>')
    var bullet = document.querySelector('.bullet');
    bullet.style.left = (gun.offsetLeft + 15) + 'px'
    bullet.style.top = (gun.offsetTop + 15) + 'px'
    const {x: bulletX, y: bulletY} = bullet.getBoundingClientRect()   
    const moveX = (e.clientX - bulletX) * 100
    const moveY = (e.clientY - bulletY) * 100
    // console.log(moveX, moveY);
    // if ((moveX > 500 || moveX < -500) && (moveY < -500 || moveY > 500)) {
    bullet.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`
    setTimeout(() => {
        bullet.remove()
    }, 4000)

} 

function shipAppears() {
    container.insertAdjacentHTML('afterbegin', '<div class= "ship"></div>')
    const ship = document.querySelector('.ship')
    ship.style.left =`-100px`
    const shipStartY = Math.random()*600
    ship.style.top =`${shipStartY}px`
    setTimeout(() => {
        if(ship.className !== 'shot') {
            if(!gameOver) {
                score -=1
                updateScore()
                ship.remove()

            }
        }
    }, 3000)
    // ship.style.left =`100px`
    // ship.style.top =`100px`
}
function shipMoves() {
    const ship = document.querySelector('.ship')
    const {x: shipStartX, y: shipStartY} = ship.getBoundingClientRect()   
    const shipEndY = Math.random() * 600 - shipStartY

    ship.style.transform = `translateX(800px) translateY(${shipEndY}px)`

}

function checkHit() {
    const bullets = document.querySelectorAll('.bullet')
    const ships = document.querySelectorAll('.ship')
    const ss = document.querySelector('#ss')
    for (let bullet of bullets) {
        for (let ship of ships) {
            const {x: bulletCurrentX, y: bulletCurrentY} = bullet.getBoundingClientRect() 
            
            const {x: shipCurrentX, y: shipCurrentY} = ship.getBoundingClientRect() 
            // console.log(shipCurrentX, shipCurrentY)
            if ((bulletCurrentX < 880) && 
            ((bulletCurrentX + 5) > (shipCurrentX) && (bulletCurrentX + 5) < (shipCurrentX + 50) && (bulletCurrentY + 5) > (shipCurrentY) && (bulletCurrentY + 5) < (shipCurrentY + 50))) {
                score += 1
                updateScore()
                ship.className = 'shot'
                ship.remove()
            }
        }
    }
}
function CheckCrash() {
    const ships = document.querySelectorAll('.ship')
    const gun = document.querySelector('.gun')
    const {x: gunCurrentX, y: gunCurrentY} = gun.getBoundingClientRect()
    const {x: containerCurrentX, y: containerCurrentY} = container.getBoundingClientRect()
    
    if((gunCurrentX > containerCurrentX + 600) || (gunCurrentX + 40 < containerCurrentX) || (gunCurrentY > containerCurrentY + 600) || (gunCurrentY + 40 < containerCurrentY)) {
        gun.remove()
        gameOver = true
        // console.log(score);
        score = String(score) + ' and then flew away'
        updateScore()
    }
    for (let ship of ships) {
        const {x: shipCurrentX, y: shipCurrentY} = ship.getBoundingClientRect()
        if(gunCurrentX + 25 > shipCurrentX - 5 && gunCurrentX - 5 < shipCurrentX + 35 && gunCurrentY + 25 > shipCurrentY - 5 && gunCurrentY - 5 < shipCurrentY + 35) {
            gun.remove()
        gameOver = true
        // console.log(score);
        score = String(score) + ' and then suicided'
        updateScore()
        }

    }
    if (gameOver) {
        container.removeEventListener('click', shoot);
        document.removeEventListener('keydown', move);
    }
}



