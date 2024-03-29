const startDate = "Dec 13, 2020 20:00:00";
const endDate = "Dec 4, 2022 23:00:00";
const startDateMasked = "Dec XX, 2020";
const endDateMasked = "Dec XX, 2022";
var now;
var countDownStartDate;
var countDownEndDate;
var interval;
var percent;
var rem;
var animationTime = 2000;

$(document).ready( () => {
    now = new Date().getTime();
    countDownStartDate = new Date(startDate).getTime();
    countDownEndDate = new Date(endDate).getTime();

    
    $("#start-date").text(startDateMasked);
    $("#end-date").text(endDateMasked);


    setTime();
    percent = Math.ceil(percent);
    move();
    interval = setInterval(setTime, 1000);

    //timeout for mobile user
    if(window.innerWidth < window.innerHeight) {
        console.log("window.innerWidth: "+window.innerWidth)
        console.log("window.innerHeight: "+window.innerHeight)
        //setTimeout(rotateScreen, 5000);
    }
    

});

function move() {

    $("#1").animate({left: (window.innerWidth * 0.5 - 100) * percent/100 + 'px'}, animationTime, 'linear');
    $("#0").animate({right: (window.innerWidth * 0.5 - 100) * percent/100 + 'px'}, animationTime, 'linear');

    $("#myRange0").animate({width: 100-percent + "%"}, animationTime, 'linear');
    $("#myRange1").animate({width: percent + "%"}, animationTime, 'linear');

}

function setTime() {
    
    percent = 100-((countDownEndDate - now)*100)/(countDownEndDate - countDownStartDate);
    if(percent > 100){
        percent = 100;
    }
    else if(percent < 0){
        percent = 0;
    }
    rem = 100 - percent;
    rem = Math.round(rem*1000000)/1000000;
    now = new Date().getTime();
    
    
    // Find the distance between now and the count down date
    var distance = countDownEndDate - now;
    
    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  
    $("#time").text(days + "d " + hours + "h " + minutes + "m " + seconds + "s (" + rem + "%)");
    
    // If the count down is over, write some text
    if (distance < 0) {
        clearInterval(interval);
        $("#time").text("Happily Married: " + timeElapsed(countDownEndDate));
    }

}



function timeElapsed(from) {
    // Find the distance between now and the count down date
    var distance = from - new Date().getTime();

  
    if(distance < 0) {
        distance = distance * -1;
    }
    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}
