// ? adding all query selectors and classes as constants
const grid = document.querySelector('.grid')
const elements = {
  score: document.querySelector('.score1'),
  startButton: document.querySelector('#start'),
  resetButton: document.querySelector('#restart'),
  lifes: document.querySelector('.lifes1'),
  audioPlayer: document.querySelector('audio'),
  musicButton: document.querySelector('#music'),
  text: document.querySelector('.text'),
  scoreAndLifes: document.querySelector('.interactive'),
  gap: document.querySelector('main'),
}

const width = 13

const cells = []

let xwing = 162

let tiefighters = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 
  14 ,15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]

let score = 0
let lifes = 3
const bombs = []

// ? we set game in play as false and then changes it to true so we stop the button from being able to function again.
let gameInPlay = false

// ? add a start button with all content wrapped within.
elements.startButton.addEventListener('click', () => {
  
  // ? this if statement checks if the gameinplay has been reassigned to be true, if true it stops the start button from being pressed twice
  if (gameInPlay === true) {
    return 
  } 
  gameInPlay = true
    
  // ? these change the styling of classes when the button is pressed
  grid.style.display = 'flex'
  elements.resetButton.style.display = 'inline-block'
  elements.text.style.display = 'none'
  elements.scoreAndLifes.style.display = 'inline-block'
  elements.startButton.style.display = 'none'

  // ? this loop creates HTML divs for each grid by appending child
  for (let index = 0; index < width ** 2; index++) {
    const divBox = document.createElement('div')
    grid.appendChild(divBox)
    // divBox.innerHTML = index
    divBox.style.width = `${100 / width}%`
    divBox.style.height = `${100 / width}%`
    cells.push(divBox)
  }

  // ? we add a the class of shooter which is the xwing on to the grid 
  cells[xwing].classList.add('shooter')
  
  // ? we have to get the score to be updated when necessary
  elements.score.innerHTML = score

  // ? we have to add functions where the user is able to move an shoot
  document.addEventListener('keydown', (event) => {

    const key = event.key
    // console.log(key)
    if (key === 'ArrowLeft' && !(xwing % width === 0) && !(xwing < width)) {
      // ? we have to remove the xwing from the cell before we can move it hence we do classList.remove
      cells[xwing].classList.remove('shooter')
      // ? -= 1 gives the player the ablity to move left
      xwing -= 1
      // ? we have to add the xwing back to the cell its been moved to hence we do classList.add
      cells[xwing].classList.add('shooter')
    }
    if (key === 'ArrowRight' && !(xwing % width === width - 1)) {
      // ? we have to remove the xwing from the cell before we can move it hence we do classList.remove
      cells[xwing].classList.remove('shooter')
      // ? += 1 gives the player the ablity to move right
      xwing += 1
      // ? we have to add the xwing back to the cell its been moved to hence we do classList.add
      cells[xwing].classList.add('shooter')
    }
    // ? we have to also do a keydown down for space so the tie fighter is able to shoot
    if (key === ' ') {
      // ? we set laser to xwing so the laser would shoot from the same cell as the xwing so essentially its a tracker
      let laser = xwing 
      cells[laser].classList.add('laser')
      const intervalLaser = setInterval(() => {
        if (laser < width) {
          cells[laser].classList.remove('laser')
          clearInterval(intervalLaser)
          return
        }
        cells[laser].classList.remove('laser')
        laser = laser - width
        cells[laser].classList.add('laser')
        // console.log(laser)

        const hitIndex = tiefighters.find(tiefighter => tiefighter === laser) 
        // console.log('tiefighters', tiefighters)
        // console.log(laser)
        // console.log('hitIndex', hitIndex)
        if (!hitIndex) return

        cells[hitIndex].classList.remove('tie')
        cells[hitIndex].classList.remove('laser')
        cells[hitIndex].classList.add('explosion')
        setTimeout(() => {
          cells[hitIndex].classList.remove('explosion')
        }, 100)
      
        if (hitIndex) {
          tiefighters.splice(tiefighters.indexOf(hitIndex), 1)
        }
        score += 10
        elements.score.innerHTML = score
        if (tiefighters.length === 0) {
          confirm('You WIN!')
          nextLevel()
        }

        clearInterval(intervalLaser)
      }, 300)
    }
  // console.log(cells)
  })

  const intervalTie = setInterval(() => {
    cells.forEach(wipe => {
      wipe.classList.remove('tie')
    })
    tiefighters = tiefighters.map(tie => tie + 1)
    // console.log(tiefighters)
    tiefighters.forEach(tiefighter => {
      cells[tiefighter].classList.add('tie')
    })
    if (tiefighters.includes(155)) {
      cells.forEach(wipe => {
        wipe.classList.remove('tie')
      })
      tiefighters.length = 0
      // reset()
      clearInterval(intervalTie)
      gameOver()
    }
  }, 400)

  const clearBombInterval = false
  function dropBomb() {
    const randomTieIndex = Math.floor(Math.random() * tiefighters.length)
    const newBomb = tiefighters[randomTieIndex] + 13
    if (!newBomb) return
    bombs.push(newBomb)
    cells[newBomb].classList.add('bomb')
    // console.log(newBomb)
    setTimeout(() => {
      const bombInterval = setInterval(() => {
      
        let bombPosition = bombs[0] 
        // console.log(bombs)
        if (bombPosition >= 156) {
          bombs.shift()
          cells[bombPosition].classList.remove('bomb')
          dropBomb()
          clearInterval(bombInterval)
        // reset()
        // console.log(bombPosition)
        // console.log(bombs)
        } else {
          cells.forEach(wipe => {
            wipe.classList.remove('bomb')
          })
          bombs[0] += 13 
          bombPosition += 13
          console.log(bombs)
          cells[bombPosition].classList.add('bomb')
        }

        const bombHitIndex = bombs.find(bomb => bomb === xwing)
        
        if (bombHitIndex) { 
          cells[bombHitIndex].classList.remove('bomb')
          cells[bombHitIndex].classList.add('xwing')
          lifes -= 1
          elements.lifes.innerHTML = lifes
          if (lifes === 0){
            gameOver()
          // console.log(bombHitIndex)
          }
        }

        const tieBombIndex = bombs.find(bomb => cells[bomb].classList.contains('laser'))
        console.log(tieBombIndex)

        if (clearBombInterval === true) {
          cells.forEach(wipe => {
            wipe.classList.remove('bomb')
          })
          clearInterval(bombInterval)
        }
      }, 500)
    }, 300 )
  }
  dropBomb()


  function gameOver() {
    const gameOverFunction = confirm('The rebellion has fallen.')
    if (gameOverFunction === true) {
      window.location.reload()
    }  else {
      clearInterval(intervalTie)
      clearBombInterval === true
      // clear all interval and and classes of cells  
    }
  }

  // let intervalTie2
  elements.resetButton.addEventListener('click',() => {
    window.location.reload()
  })
  

  function nextLevel() {
    cells.forEach(wipe => {
      wipe.classList.remove('tie')
    })
    cells.forEach(wipe => {
      wipe.classList.remove('shooter')
    })
    xwing = 162
    cells[xwing].classList.remove('shooter')
    xwing -= 1
    cells[xwing].classList.add('shooter')

    cells[xwing].classList.remove('shooter')
    xwing += 1
    cells[xwing].classList.add('shooter')

    
    tiefighters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 
      ,14 ,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 
      40, 41, 42, 43, 44, 45, 46, 47, 48, 48, 50] 
        
    tiefighters = tiefighters.map(tie => tie + 1)

    score = 0
    lifes = 3
    elements.lifes.innerHTML = lifes

    cells.forEach(wipe => {
      wipe.classList.remove('laser')
    })
  }
})

elements.musicButton.addEventListener('click', () => {
  if (elements.audioPlayer.paused){
    elements.audioPlayer.src = 'sounds/Forcetune.wav'
    elements.audioPlayer.play()
    elements.musicButton.innerHTML = 'Pause Music'
  } else {
    elements.audioPlayer.pause()
    elements.musicButton.innerHTML = 'Play Music'
  }
})

