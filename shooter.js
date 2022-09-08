let menu = document.querySelector('.menu')
menu.addEventListener('click', startGame)
menu.style.opacity = 1

let container = document.querySelector('.container')
let scoreDiv = document.querySelector('#score')
let gunny = document.querySelector('.gunny')
let gun = document.querySelector('.gun')


let shipFrequency = 4000
let gameOver = false
let score = 0


function startGame() {
    gameOver = false
    console.log('started')
    gun.style.display = ''
    menu.removeEventListener('click', startGame)
    menu.style.opacity = '0%'
    setTimeout(() => {  //without it gun rotation gunRot() works incorrect 
        menu.remove()
    }, 1000)
    
    document.addEventListener('keydown', move)
    container.addEventListener('click', shoot)
    container.addEventListener('mousemove', gunRot)
    gun.addEventListener('click', event => event.stopPropagation())
    console.log('added listeners')
    updateScore()
    scoreDiv.style.transform = 'translateY(0px) scale(100%)'
    
    const shipsAttack = setInterval(() => {
        console.log('attack');
        if(gameOver) {
            
            clearInterval(shipsAttack)
        }
        const delay = Math.rand * 1000
        setTimeout(() => {
            console.log('ship app and m')
            shipAppears()
            shipMoves()
        },delay)
        const moreShipsAttack = setInterval(() => {
            console.log('attackMore');
            if(gameOver) {
                clearInterval(moreShipsAttack)
            } else {
                console.log('ship app and m')
                shipAppears()
                shipMoves()
            }
        }
        , shipFrequency * Math.PI)
    }, shipFrequency)
    console.log('?')
    setInterval(() => {
        if(!gameOver) {
            console.log('ch')
            checkHit()
            CheckCrash()
        }
    }, 10)
}


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
    const gunTop = gun.offsetTop - 500
    gun.style.top = gunTop + 'px'  
}
function moveLeft () {   
    const gunLeft = gun.offsetLeft - 500
    gun.style.left = gunLeft + 'px'
}
function moveDown () {   
    const gunTop = gun.offsetTop + 500
    gun.style.top = gunTop + 'px'  
}
function moveRight () {    
    const gunLeft = gun.offsetLeft + 500
    gun.style.left = gunLeft + 'px'
}

function gunRot(e) {
    const x = e.offsetX - gun.offsetLeft - 20 
    const y = e.offsetY - gun.offsetTop - 20
    if (y <= 0) {
        gunny.style.transform = `rotateZ(${360 - Math.atan(x/y)/(Math.PI/180)}deg)`
    } else {
        gunny.style.transform = `rotateZ(${180 - Math.atan(x/y)/(Math.PI/180)}deg)`
    }
}

function updateScore() {
    scoreDiv.innerHTML = gameOver ? score : 'score: <span>' + score + '</span>'
}

function shoot(e) {
    container.insertAdjacentHTML('afterbegin', '<div class= "bullet"></div>')
    const bullet = document.querySelector('.bullet');
    bullet.style.left = (gun.offsetLeft + 15) + 'px'
    bullet.style.top = (gun.offsetTop + 15) + 'px'
    const {x: bulletX, y: bulletY} = bullet.getBoundingClientRect()   
    const moveX = (e.clientX - bulletX) * 100
    const moveY = (e.clientY - bulletY) * 100
    bullet.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`
    setTimeout(() => {
        bullet.remove()
    }, 4000)

} 

function shipAppears() {
    container.insertAdjacentHTML('afterbegin', '<div class= "ship"><div class= "shipRot"><img src="./img/roundShip-01.svg" /></div><div>')
    const ship = document.querySelector('.ship')
    ship.style.left = (Math.random() * 100 - 150) + 'px' 
    const shipStartY = Math.random()*600
    ship.style.top =`${shipStartY}px`
    setTimeout(() => {
        if(ship.className !== 'shot') {
            if(!gameOver) {
                score -=1
                updateScore()
                ship.remove()

            } else {
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
    for (let bullet of bullets) {
        for (let ship of ships) {
            const {x: bulletCurrentX, y: bulletCurrentY} = bullet.getBoundingClientRect() 
            const {x: shipCurrentX, y: shipCurrentY} = ship.getBoundingClientRect() 
            if ((bulletCurrentX < container.getBoundingClientRect().x + 610) && 
            ((bulletCurrentX + 10) > (shipCurrentX) && (bulletCurrentX) < (shipCurrentX + 50) && (bulletCurrentY + 10) > (shipCurrentY) && (bulletCurrentY) < (shipCurrentY + 50))) {
                score += 3
                updateScore()
                ship.className = 'shot'
                const body = document.querySelector('body')
                body.insertAdjacentHTML('afterbegin', `<div class="explosion" style="top:${shipCurrentY}px; left:${shipCurrentX}px"></div>` )
                setTimeout(() => {
                    document.querySelector('.explosion').remove()
                }, 1500)
                ship.remove()
            }
        }
    }
}
function CheckCrash() {
    const ships = document.querySelectorAll('.ship')
    
    const {x: gunCurrentX, y: gunCurrentY} = gun.getBoundingClientRect()
    const {x: containerCurrentX, y: containerCurrentY} = container.getBoundingClientRect()
    
    if((gunCurrentX > containerCurrentX + 600) || (gunCurrentX + 40 < containerCurrentX) || (gunCurrentY > containerCurrentY + 600) || (gunCurrentY + 40 < containerCurrentY)) {
        gun.style.display = 'none'
        gun.style.top = '280px'
        gun.style.left = '280px'
        gameOver = true
        // console.log(score);
        score = 'scored <span>' + String(score) + '</span> and then flew away'
        updateScore()
    }
    for (let ship of ships) {
        const {x: shipCurrentX, y: shipCurrentY} = ship.getBoundingClientRect()
        if(gunCurrentX + 25 > shipCurrentX - 5 && gunCurrentX - 5 < shipCurrentX + 35 && gunCurrentY + 25 > shipCurrentY - 5 && gunCurrentY - 5 < shipCurrentY + 35) {
            const body = document.querySelector('body')
            body.insertAdjacentHTML('afterbegin', `<div class="bigEexplosion" style="top:${gunCurrentY}px; left:${gunCurrentX}px"></div>` )
            ship.remove()
            gun.style.display = 'none'
            gun.style.top = '280px'
            gun.style.left = '280px'
            gameOver = true
            score = 'scored <span>' + String(score) + '</span> and then crashed'
            updateScore()
        }
    }
    if (gameOver) {
        container.removeEventListener('click', shoot);
        document.removeEventListener('keydown', move);
        scoreDiv.style.transform = 'translateY(200px) scale(190%)'
        container.insertAdjacentHTML('afterbegin', '<div class="menu">play again!</div>')
        menu = document.querySelector('.menu')
        setTimeout(() => {
            menu.addEventListener('click', startGame)
            menu.style.opacity = 1
            score = 0
            
        }, 3000) 
    }
}



