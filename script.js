const container = document.querySelector('.container')
const addButton = Array.from(container.querySelectorAll('.add-sound'))
const addSounds = document.querySelector('.add-sounds')
const addYourSounds = document.querySelector('.add-own-sounds')
const categorySelected = addSounds.querySelector('.category-selected')
const soundPads = Array.from(addSounds.querySelectorAll('.sound-pads'))
// Buttons
const playButton  = document.querySelector('.play-button')
const closeButton = document.querySelector('.close')
const ownSoundCloseButton = document.querySelector('.close-own-sound')
const deleteButton = document.querySelector('.delete-button')

const timeIndicator = Array.from(container.querySelectorAll('.time-indicator'))
const soundAreas = Array.from(container.querySelectorAll('.sound-area'))
const resetButton = document.querySelector('.reset-button')
let soundIndicator = Array.from(container.querySelectorAll('.indicator'))
let category 
let soundSelected
let previousSelected = ''
let timeCount = 0
let recordTime = 10000
let soundStock = []
let stockPosition = 0
let colorCategory
let indicatorSelected = ''
let indicatorPosX 
let isEditing = false
let isClicking = false
let indicatorMove = 0

// Listen on which add button he click to know what category of sound he want to add
for(const addSundButton of addButton)
{
    addSundButton.addEventListener('click', (event) =>
    {
        isEditing = true
        for(const indicator of soundIndicator)
        {
            indicator.style.pointerEvents =  'none'
        }
        // Stock the category ina  var
        category = addSundButton.getAttribute('category')
        // Make the sounds appear
        if(category != 'your-sound')
        {
            addSounds.style.display = 'flex'
            addYourSounds.style.display = 'none'
        }
        else if(category == 'your-sound')
        {
            addSounds.style.display = 'none'
            addYourSounds.style.display = 'flex'
        }
        categorySelected.textContent = category

        // Change the color of pads depending of the category the user choosed
        if(event.target.getAttribute('category') == 'bass')
        {
            colorCategory = '#0CFFC4'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'chant')
        {
            colorCategory = '#0CC8FF'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'clap')
        {
            colorCategory = '#A70CFF'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'hithat')
        {
            colorCategory = '#FFA30C'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'kick')
        {
            colorCategory = '#3CFF0C'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'snap')
        {
            colorCategory = '#FF0C0C'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'snare')
        {
            colorCategory = '#FF0CC8'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
        if(event.target.getAttribute('category') == 'your-sound')
        {
            colorCategory = '#ffff56'
            for(const pad of soundPads)
            {
                pad.style.background = colorCategory
            }
        }
    })
}

// Listen click on each pad and play the sound corresponding to the pad
for(const pad of soundPads)
{
    pad.addEventListener('click', () =>
    {
        // Stock the 'number' of the pad in a var
        soundSelected = pad.getAttribute('number')
        // create the audio 
        const sound = new Audio(`drum-sounds/${category}/0${pad.getAttribute('number')}-${category}.mp3`)
        // Put a border to teel that he's selected
        pad.style.border = '2px solid #6769ff'
        // Disselected the previous
        if(previousSelected != '')
        {
            previousSelected.style.border = 'none'
        }
        previousSelected = pad
        // play the sound
        sound.play()
    })
}






// PLay button that strat the final sound
playButton.addEventListener('click', () => 
{
    // Call the function that play sound
    playSoundRecorded()
    // Set our time count to 0
    timeCount = 0
    // Set intervall at 10 to coun tevery 0.01 seconds
    const soundTime = setInterval(() => 
    {
        // If the counter didn't reach the end we make our indicator move
        if((timeCount/recordTime*100) < 100)
        {
            // All indicators
            for(const indicator of timeIndicator)
            {
                indicator.style.left = `${timeCount/recordTime*100}%`
            }
        }
        // Increase our time count at all intervals
        timeCount = timeCount+10
        // Clear the sett interval after the time set of recordTime
        setTimeout(() => {
            clearInterval(soundTime)
        }, recordTime);
    }, 10);
    
})

// Clear the indicator and the sounds
resetButton.addEventListener('click', () => 
{
    // Make our array empty
    soundStock = []
    // remove alls indicator
    for(const indicatorCode of soundIndicator)
    {
        indicatorCode.remove()
    }
})


// Function taht will read the array to play the sound
function playSoundRecorded()
{
    for(const sounds of soundStock)
    {
        if(sounds != '' && sounds.type == 'preset-sound')
        {

            setTimeout(() => {
                const audioRecorded = new Audio(`drum-sounds/${sounds.categorySound}/0${sounds.soundNumber}-${sounds.categorySound}.mp3`)
                audioRecorded.play()
            }, sounds.time);
        }
        if(sounds != '' && sounds.type == 'own-sound')
        {

            setTimeout(() => {
                const audioRecorded = new Audio(allAudios[sounds.soundPosition].soundCreated)
                audioRecorded.play()
            }, sounds.time);
        }
    }
}

// When the sound is selected and we click on thge right sound area it had the sound in the array and add an indicator at the right place on the sound area
for(const soundArea of soundAreas)
{ 
    soundArea.addEventListener('click', (event) =>
    {
        // Check if teh user click on the right sound area
        if(soundArea.getAttribute('category') == category && previousSelected != '' && isEditing == true && category != 'your-sound')
        {
            // Get the bounding of the sound area to be able to set properly the indicator
            const soundAreaBounding = soundArea.getBoundingClientRect()
            // Create the object that we gonna push in the sound array to make the sound
            const addAction = {
                type : 'preset-sound',
                time : event.offsetX/soundAreaBounding.width * recordTime,
                categorySound : category,
                soundNumber : soundSelected,
                soundDuration :  parseInt(soundArea.getAttribute('sound-duration'))
            }
            console.log(soundArea.getAttribute('sound-duration'))
            // Create our indicator
            const indicator = document.createElement('div')
            indicator.classList.add('indicator')
            if(event.offsetX/soundAreaBounding.width * 100 + addAction.soundDuration/recordTime*100 > 100)
            {
                const indicatorWidth = 100 - event.offsetX/soundAreaBounding.width * 100
                indicator.style.width = `${indicatorWidth}%`
            }
            else
            {
                const indicatorWidth = addAction.soundDuration/recordTime*100
                indicator.style.width = `${indicatorWidth}%`
            }
            indicator.style.background =  `${colorCategory}`
            indicator.style.left = `${event.offsetX/soundAreaBounding.width * 100}%`
            // Set a position of the indicator in the array to know which sound it was in array
            indicator.setAttribute('position', `${stockPosition}`)
            stockPosition = stockPosition + 1
            soundArea.appendChild(indicator)
            // Push the object in our record actions array
                soundStock.push(addAction)
            soundIndicator = Array.from(container.querySelectorAll('.indicator'))
        }
        if(soundArea.getAttribute('category') == category && category == 'your-sound' && padRecorded[pads.indexOf(padSelected)] != '')
        {
            // Get the bounding of the sound area to be able to set properly the indicator
            const soundAreaBounding = soundArea.getBoundingClientRect()
            // Create the object that we gonna push in the sound array to make the sound
            const addAction = {
                type : 'own-sound',
                soundPosition : pads.indexOf(padSelected),
                time : event.offsetX/soundAreaBounding.width * recordTime,
                ownSound :  allAudios[pads.indexOf(padSelected)].soundCreated,
                soundDuration : allAudios[pads.indexOf(padSelected)].ownSoundDuration
            }
            console.log(addAction.soundDuration)
            // Create our indicator
            const indicator = document.createElement('div')
            indicator.classList.add('indicator')
            if(event.offsetX/soundAreaBounding.width * 100 + addAction.soundDuration/recordTime*100 > 100)
            {
                const indicatorWidth = 100 - event.offsetX/soundAreaBounding.width * 100
                indicator.style.width = `${indicatorWidth}%`
            }
            else
            {
                const indicatorWidth = addAction.soundDuration/recordTime*100
                indicator.style.width = `${indicatorWidth}%`
            }
            indicator.style.background =  `${colorCategory}`
            indicator.style.left = `${event.offsetX/soundAreaBounding.width * 100}%`
            // Set a position of the indicator in the array to know which sound it was in array
            indicator.setAttribute('position', `${stockPosition}`)
            stockPosition = stockPosition + 1
            soundArea.appendChild(indicator)
            // Push the object in our record actions array
            soundStock.push(addAction)
            soundIndicator = Array.from(container.querySelectorAll('.indicator'))
        }
    })
    
}

const close = () =>
{
    console.log('closqez')
    addSounds.style.display = 'none'
    addYourSounds.style.display = 'none'
    for(const indicator of soundIndicator)
    {
        indicator.style.pointerEvents =  'all'
    }
    isEditing = false
}
// Close the menu of the sound that has been opened
closeButton.addEventListener('click', close)

ownSoundCloseButton.addEventListener('click', close)


// Delete the sound and indicator that's selected
deleteButton.addEventListener('click', () =>
{
    deleteElement()
})
// Delete the sound and indicator that's selected
window.addEventListener('keydown', (event) =>
{
    if(event.code == 'Backspace')
    {
        deleteElement()
    }
})

// Function that delete element
const deleteElement = () =>
{
    if(indicatorSelected != '')
    {
        soundStock[indicatorSelected.getAttribute('position')] = ''
        indicatorSelected.remove()
    }
}


// Selected the indicator by clicking on it
window.addEventListener('mousedown', (event) => 
{
    // Set teh target
    const target = event.target
    // If the traget has position attribute it mean that its an inidcator so we can select it
    if(target.hasAttribute('position'))
    {
        // Change border to see that he's selected
        target.style.border = '2px solid #0027FF'
        // If we click anywhere else, delete the blue border
        if(indicatorSelected != target && indicatorSelected != '')
        {
            indicatorSelected.style.border = 'none'
        }
        // Stock the indicator selected in a variable
        indicatorSelected = target
    }
    // If the element has the attribute positin it mean that the user clicked somewhere else so we diselect the indicator
    else if(target.hasAttribute('position') == false && indicatorSelected != '')
    {
        indicatorSelected.style.border = 'none'
        indicatorSelected = ''
    }
})

// Listen arrow keys to know of the user want to move the indicator whe one's is seleted
window.addEventListener('keydown', (event) =>
{
    // If the indicator is welel selected we can listen keyboard
    if(indicatorSelected != '')
    {
        if(event.code == 'ArrowRight')
        {
            // Increase the time by 1% consequently the indicator ps-osition too
            soundStock[indicatorSelected.getAttribute('position')].time = (parseInt(indicatorSelected.style.left) + 1)/ 100 * recordTime
            indicatorSelected.style.left = `${parseInt(indicatorSelected.style.left) + 1}%`
        }
        if(event.code == 'ArrowLeft')
        {
             // Dicrease the time by 1% consequently the indicator ps-osition too
            soundStock[indicatorSelected.getAttribute('position')].time = (parseInt(indicatorSelected.style.left) - 1)/ 100 * recordTime
            indicatorSelected.style.left = `${parseInt(indicatorSelected.style.left) - 1}%`
        }
    }
})

// Listen the click on the indicator
window.addEventListener('mousedown', (e) =>
{
    // Make sure the user clicked on the indicator
    if(e.target == indicatorSelected)
    {
        // Tell that he's clicking right
        isClicking = true
    }
    // Listen move mouse to move the indicator like the mouse
    window.addEventListener('mousemove', (event) =>
    {
        // Only do this if he clicked on the indicator
        if(isClicking == true)
        {
            for(const soundArea of soundAreas)
            {
                // get sound area boudning to get width and be able to know where the mouse is in the sound area
                const soundAreaBounding = soundArea.getBoundingClientRect()
                // Calclate the mos position considering all
                indicatorMove = (event.x - (0.21 * window.innerWidth)) / soundAreaBounding.width * 100
                // Make the indicator move only if it doesn't get away from sound area
                if((event.x - (0.21 * window.innerWidth)) / soundAreaBounding.width * 100 > 0 && (event.x - (0.21 * window.innerWidth)) / soundAreaBounding.width * 100 < 100 - parseInt(indicatorSelected.style.width))
                {
                    
                    soundStock[indicatorSelected.getAttribute('position')].time = indicatorMove * recordTime / 100
                    indicatorSelected.style.left = `${indicatorMove}%`
                }
            }
        }
    })
})
window.addEventListener('mouseup', () =>
{
    isClicking = false
})