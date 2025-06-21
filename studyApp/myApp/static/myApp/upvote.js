document.addEventListener("DOMContentLoaded", () => {
    // vote buttons
    voteElements = document.getElementsByClassName("vote")
    for (let element of voteElements) {
        // on click, disable and send data
        element.addEventListener("click", () => {

            //disable/hide upvote and downvote
            votes = document.getElementsByClassName("vote")
            for (vote of votes) {
                vote.disabled = true;
                vote.style.display = "none"
            }

            // send data
            question = document.getElementById("questionDiv")
            data = JSON.stringify({'ID' : question.dataset.id, 'upvoteValue' : element.dataset.value})
            fetch("/", {
                method: "PUT",
                headers : {
                    'X-CSRFToken': document.getElementsByName("csrfmiddlewaretoken")[0].value
                },
                body: data
            })
        })
    }
    // flip buttons
    flipButton = document.getElementById("flipButton")
    function flip() {
        questionDiv = document.getElementById("questionDiv")
        answerDiv = document.getElementById("answerDiv")
        if (flipButton.dataset.value == "question") {
            questionDiv.style.display = "none"
            answerDiv.style.display = "block"
            flipButton.dataset.value = "answer"
        }
        else {
            questionDiv.style.display = "block"
            answerDiv.style.display = "none"
            flipButton.dataset.value = "question"
        }
    }

    flipButton.addEventListener("click", flip)
    document.addEventListener("keyup", e => {
        console.log("'" + e.key + "'")
        if (e.key === " ") {
            flip()
        }
    })

})