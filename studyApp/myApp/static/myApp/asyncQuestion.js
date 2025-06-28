
document.addEventListener("DOMContentLoaded", () => {
    function getQuestion() {
        newQuestionButton = document.getElementById('newQuestionButton')
        value = newQuestionButton.value
        newQuestionButton.value++
        questionDiv = document.getElementById('questionDiv')
        // apply filters if needed
        year = document.getElementById("year").value
        country = document.getElementById("country").value
        subject = document.getElementById("subject").value
        fetch(('/getQuestion' + "/?question=" + value + "&year=" + year + "&country=" + country + "&subject=" + subject), {
            method : "GET"
        })
        .then(data => data.json())
        .then(data => {
            console.log('/getQuestion' + "/?question=" + value + "&year=" + year + "&country=" + country + "&subject=" + subject)
            questionDiv.innerHTML = data["question"] + " " + data["upvotes"]
            questionDiv.dataset.id = data["id"]
            questionDiv.dataset.upvotes = data["upvotes"]
            document.getElementById("answerDiv").innerHTML = data["answer"]
            if(data["isOwn"]) {
                document.getElementById("upvoteDiv").style.display = "none"
            }
            else {
                document.getElementById("upvoteDiv").style.display = "flex"
            }

        })
    }
    function updateQuestion() {
        document.getElementById('newQuestionButton').value--;
        getQuestion()
    }
    newQuestionButton = document.getElementById('newQuestionButton')
    newQuestionButton.addEventListener("click", getQuestion)
    document.getElementById("year").addEventListener("change" , updateQuestion)
    document.getElementById("country").addEventListener("change" , updateQuestion)
    document.getElementById("subject").addEventListener("keyup" , updateQuestion)
    

    function back() {
        if (document.getElementById('newQuestionButton').value <= 1) {
            return
        }
        document.getElementById('newQuestionButton').value -= 2
        getQuestion();
    }

    document.getElementById("lastQuestionButton").addEventListener("click", back)
        document.addEventListener("keyup", e => {

            activeElementTag = document.activeElement.tagName.toLowerCase()
            if (activeElementTag == "textarea" || activeElementTag == "input") {
                return
            }

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
        if (e.key === " ") {
            flipButton.click()
            flipButton.focus()
        }
    })

    // Inorder to list out all of the subjects depending on grade, use a [] of all the subjects, then use a for loop and inject the html 
    subjects = ["Accounting", "Biology", "Chemistry", "Computer Science", "Design And Technology", "Economics", "English", "Food Science", "French", "Math", "Geography", "Music", "Physics", "Philosophy", "Psycology", "Statistics"]
    subjectList = document.getElementById("subjectList")
    for (subject of subjects) {
        subjectList.innerHTML +=("<option data-value=" + subject + ">" + subject + "</option>")
    }

    getQuestion()
})

