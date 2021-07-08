var numOfButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numOfButtons; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", playSound);
}




document.addEventListener("keypress", function(event) {

    makeSound(event.key);

    buttonAnimation(event.key);

});



function playSound() {
    var key = this.innerHTML;
    makeSound(key);
    buttonAnimation(key);
}



function makeSound(classname) {
    var audioFileName = '';
    if (classname === 'w') {
        audioFileName = 'sounds/tom-1.mp3';
    } else if (classname === 'a') {
        audioFileName = 'sounds/tom-2.mp3';
    } else if (classname === 's') {
        audioFileName = 'sounds/tom-3.mp3';
    } else if (classname === 'd') {
        audioFileName = 'sounds/tom-4.mp3';
    } else if (classname === 'j') {
        audioFileName = 'sounds/snare.mp3';
    } else if (classname === 'k') {
        audioFileName = 'sounds/crash.mp3';
    } else if (classname === 'l') {
        audioFileName = 'sounds/kick-bass.mp3';
    }

    var audio = new Audio(audioFileName);
    audio.play();

}

function buttonAnimation(key) {
	var activeButton = document.querySelector("." + key);
	activeButton.classList.add("pressed");
	
	setTimeout(function() {
		activeButton.classList.remove("pressed");
	}, 100);
}



