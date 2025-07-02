
document.addEventListener("DOMContentLoaded", () => {
    // gets a new question and increases next question value by 1
    function getQuestion() {

        // get question and increase by 1
        newQuestionButton = document.getElementById('newQuestionButton')
        value = newQuestionButton.value
        newQuestionButton.value++
        questionDiv = document.getElementById('questionDiv')

        // apply filters if needed and return
        year = document.getElementById("year").value
        country = document.getElementById("country").value
        subject = document.getElementById("subject").value
        onlyMyQuestion = document.getElementById("onlyMyQuestion").checked
        fetch(('/getQuestion' + "/?question=" + value + "&year=" + year + "&country=" + country + "&subject=" + subject + "&onlyMyQuestion=" + onlyMyQuestion), {
            method : "GET"
        })
        .then(data => data.json())
        .then(data => {
            // get question and ID
            questionDiv.innerHTML = data["question"]
            document.getElementById("answerDiv").innerHTML = data["answer"]
            questionDiv.dataset.id = data["id"]

            // show upvotes
            document.getElementById("questionUpvotesAmount").innerHTML = data["upvotes"]
            questionDiv.dataset.upvotes = data["upvotes"]

            // if user owns data, hide upvote bar
            if(data["isOwn"]) {
                document.getElementById("upvoteDiv").style.display = "none"
            }
            else {
                document.getElementById("upvoteDiv").style.display = "flex"
            }

        })
    }

    // refreshes current question
    function updateQuestion() {
        document.getElementById('newQuestionButton').value--;
        getQuestion()
    }

    // get new question on click
    newQuestionButton = document.getElementById('newQuestionButton')
    newQuestionButton.addEventListener("click", e => {
            nextButton = document.getElementById("newQuestionButton")
            nextButton.classList.add("questionRefresh")
            setTimeout(() => {
                nextButton.classList.remove("questionRefresh")
            }, 100)
            getQuestion()
    })

    // on change update quesiton
    document.getElementById("year").addEventListener("change" , updateQuestion)
    document.getElementById("country").addEventListener("change" , updateQuestion)
    document.getElementById("subject").addEventListener("keyup" , updateQuestion)
    document.getElementById("onlyMyQuestion").addEventListener("change", updateQuestion)
    
    // get previous question.
    function back() {
        if (document.getElementById('newQuestionButton').value <= 1) {
            return
        }
        document.getElementById('newQuestionButton').value -= 2

        backButton = document.getElementById("lastQuestionButton")
        backButton.classList.add("questionRefresh")
        setTimeout(() => {
            backButton.classList.remove("questionRefresh")}, 100)
        
        getQuestion();
    }

    // Keyboard controls
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

