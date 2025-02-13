const quesAnsDiv = `
        
        <div class="question">Q {{INDEX}}: {{QUESTION}}<span class="arrow-down"></span></div>
        <div class="answer">
            <div id="postcontent">
                <div class="answer-div">
                    <b>ANSWER:</b> {{ANSWER}}
                </div>
            </div>
        </div>
        <br>

        `;


function addQuestions() {
    //setTitle()


    //Add question section
    let number = 1;
    let len = (quesAnsArray.length + "").length;
    quesAnsArray.forEach(qa => {
        let index = number.toString().padStart(len, '0');
        var quesAns = quesAnsDiv.replace('{{QUESTION}}', qa.ques).replace('{{ANSWER}}', qa.ans).replace('{{INDEX}}', index);
        var qaSection = document.querySelector('#qa-section');
        qaSection.innerHTML += quesAns;
        number++;
    });


    //Handle collapsibles
    const questions = document.querySelectorAll(".question");

    questions.forEach(question => {
        question.addEventListener("click", () => {
            question.scrollIntoView();
            question.classList.toggle("active");
            const arrow = question.querySelector(".arrow-down");
            arrow.classList.toggle("rotate");
            const answer = question.nextElementSibling;
            if (answer.style.display === "block") {
                answer.style.display = "none";
            } else {
                answer.style.display = "block";
            }
        });
    });

    //Add color to comments
    var preElements = document.querySelectorAll('pre span');
    preElements.forEach(span => {
        var str = span.innerHTML;
        if (str.trim().startsWith('//')) {
            span.classList.add("comment");
        }
    });


}


function collapseExpandedQuesAns() {
    const activeQuestions = document.querySelectorAll(".question.active");

    activeQuestions.forEach(activeQues => {
        activeQues.classList.toggle("active");
        const activeQuesArrows = activeQues.querySelectorAll(".arrow-down");
        activeQuesArrows.forEach(activeQuesArrow => {
            activeQuesArrow.classList.toggle("rotate");
        });
        const activeQuesAnswer = activeQues.nextElementSibling;
        if (activeQuesAnswer.style.display === "block") {
            activeQuesAnswer.style.display = "none";
        } else {
            activeQuesAnswer.style.display = "block";
        }
    });
}

function setTitle() {
    if (topic) {
        document.querySelector("#postcontenttitle").innerHTML = topic;
        document.querySelector("title").innerHTML = topic + " - TutorTech"
    }
}

// JavaScript to show/hide scroll-to-top button
$(document).ready(function () {

    document.querySelectorAll('.expandable .title').forEach(title => {
        title.addEventListener('click', event => {
            event.currentTarget.parentNode.classList.toggle('expanded');
        });
    });


    // Show/hide the scroll-to-top button based on scroll position
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#scrollToTop').fadeIn();
        } else {
            $('#scrollToTop').fadeOut();
        }
    });

    // Scroll to top when the scroll-to-top button is clicked
    $('#scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        return false;
    });
});