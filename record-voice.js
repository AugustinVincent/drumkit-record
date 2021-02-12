const allAudios = ['','','','','','']
const pads = Array.from(document.querySelectorAll('.pads'))
const startRecordButton = document.querySelector('.start-record')
const deleteSoundButton = document.querySelector('.delete-sound')
const timeInput = document.querySelector('.record-time')
let recordSoundTime = 500
let padSelected = ''
let padRecorded = ['','','','','','']
timeInput.value = recordSoundTime
timeInput.addEventListener('input', () =>
{
    recordSoundTime = timeInput.value
    if(timeInput.value > 2000)
    {
        recordSoundTime = 2000
        timeInput.value = 2000
    }
})

// Credit from Bryan Jennings
const newSound = (key) =>
{
    // Ask the permission to the user to use his micrphone
    navigator.mediaDevices.getUserMedia({ audio: true })
    // If he does, we get a promise and we start the voice recording
        .then(stream =>
        {
            // We create our new instance that gonna get our voice in the stream object
            const mediaRecorder = new MediaRecorder(stream)
            // Start the stream of the user voice
            mediaRecorder.start()
            // Create an array where our audio datas are gonna be stocked
            const audioStock = []

            // When we record we check if there is a change on the data of our record, if yes it mean that the record goes a sound from the mic and then we push datas into our array of audioSStock
            mediaRecorder.addEventListener('dataavailable', (event) =>
            {
                //Push the blob audio data to our audioStock array to convert this array in an audio URl
                audioStock.push(event.data)
            })

            // After the time of the set timeout the stop propertie of mediaRecorder change and we listen on this event to create a blob form the audio array 
            mediaRecorder.addEventListener('stop', () =>
            {
                // Create the blob from array
                audioBlob = new Blob(audioStock)

                // Create the url with the blob 
                const audioUrl = URL.createObjectURL(audioBlob)
                const audioInfo = {
                    soundCreated : audioUrl,
                    ownSoundDuration : recordSoundTime
                }
                // finally create our audio to play it right after
                allAudios.splice(key, 1, audioInfo)
                console.log(allAudios)

            })
            // After 3 seconds we stop the record 
            setTimeout(() => 
            {
                mediaRecorder.stop()
                padRecorded.splice(key, 1, pads[key])

                pads[key].style.background = '#ffff56'
            }, recordSoundTime)
        
                
        })
}

// Listen the click on every pads
for(const key in pads)
{
    // Listen click
    pads[key].addEventListener('click', (event) => 
    {

        pads[key].style.border = '2px solid #0027FF'
        // Disselected the previous
        if(padSelected != '' && padSelected != pads[key])
        {
            padSelected.style.border = 'none'
        }
        padSelected = pads[key]


        if(padRecorded[key] == pads[key])
        {
            const playSound = new Audio(allAudios[key].soundCreated)
            playSound.play()
        }
    })
}


deleteSoundButton.addEventListener('click', () =>
{
    console.log(padRecorded, pads.indexOf(padSelected))
    padRecorded.splice(pads.indexOf(padSelected), 1, '')
    padSelected.style.background = "#ececec"
    console.log(padRecorded)

})

startRecordButton.addEventListener('click', () =>
{
    console.log(pads.indexOf(padSelected))
    if(padSelected != '')
    {

        newSound(pads.indexOf(padSelected))
    }
})