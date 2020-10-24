const drawButtons = document.querySelectorAll("[id^='draw']")
const startButton = document.querySelector("#start_button")

function test(){
    startButton.click()
    drawButtons.forEach(button => { button.click() })
}