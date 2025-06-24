function getQuestion() {
    newQuestionButton = document.getElementById('newQuestionButton')
    value = newQuestionButton.value
    console.log(value)
    newQuestionButton.value++
    questionDiv = document.getElementById('questionDiv')
    fetch(('/getQuestion' + "/?question=" + value), {
        method : "GET"
    })
    .then(data => data.json())
    .then(data => {
        console.log(data)
        questionDiv.innerHTML = data["question"] + " " + data["upvotes"]
        questionDiv.dataset.id = data["id"]
        questionDiv.dataset.upvotes = data["upvotes"]
        document.getElementById("answerDiv").innerHTML = data["answer"]

    })
}

document.addEventListener("DOMContentLoaded", () => {
    newQuestionButton = document.getElementById('newQuestionButton')
    newQuestionButton.addEventListener("click", getQuestion)
    getQuestion()

    function back() {
        if (document.getElementById('newQuestionButton').value <= 1) {
            return
        }
        document.getElementById('newQuestionButton').value -= 2
        getQuestion();
    }

    document.getElementById("lastQuestionButton").addEventListener("click", back)

        document.addEventListener("keyup", e => {
        if (e.key == "d") {
            newQuestionButton.click()
            newQuestionButton.focus()
        }
        else if (e.key == "a") {
            document.getElementById("lastQuestionButton").click()
            document.getElementById("lastQuestionButton").focus()

        }
    })

        // flip buttons
    flipButton = document.getElementById("flipButton")
    function flip() {
        flipButton = document.getElementById("flipButton")
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
            flipButton.click()
            flipButton.focus()
        }
    })

})

