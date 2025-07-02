document.addEventListener("DOMContentLoaded", () => {
    // get filter value
    country = document.getElementById("country")
    year = document.getElementById("year")
    validSubjects = ["Accounting", "Biology", "Chemistry", "Computer Science", "Design And Technology", "Economics", "English", "Food Science", "French", "Math", "Geography", "Music", "Physics", "Philosophy", "Psycology", "Statistics"]
    
    // returns if the value given is valid
    function isValid() {
        question = document.getElementById("addQuestion")
        answer = document.getElementById("addAnswer")
        subject = document.getElementById("subject")
        if (validSubjects.includes(subject.value) && question.value.trim() != "" && answer.value.trim() != "" && country.dataset.value != -1 && year.dataset.value != -1) {
            return true
        }
        else {
            return false;
        }

    }
    button = document.getElementById("submitButton")
    button.disabled = true
    // on key up (for subject and Q and A)
    document.addEventListener("keyup", e => {
        button.disabled = !isValid()
    })
    country.addEventListener("change", e => {
        button.disabled = !isValid()
    })
    year.addEventListener("change", e => {
        button.disabled = !isValid()
    })

    // add subjects to datalist
    datalist = document.getElementById("subjectList")
    for (subject of validSubjects) {
        datalist.innerHTML += "<option data-value=" + subject + ">" + subject + "</option>"
    }

    //for all delete buttons, add onclick funtion to bring up confirmation and apply question ID
    confirmationDiv = document.getElementById("confirmationDiv")
    deleteButtons = document.getElementsByClassName("delete")
    for (deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", function (e) {
            confirmationDiv.style.display = "flex"  
            confirmationDiv.value = this.id
        })
    }

    // close window on noButton click
    noButton = document.getElementById("noButton")
    noButton.addEventListener("click", e => {
        confirmationDiv.style.display = "none"
    })

    // Async request to delete 
    yesButton = document.getElementById("yesButton")
    yesButton.addEventListener("click", e => {
        data = JSON.stringify({
            "ID": confirmationDiv.value
        })
        fetch("/manageQuestions", {
            method: "PUT",
            headers: {
                "X-CSRFToken": document.getElementsByName("csrfmiddlewaretoken")[0].value
            },
            body: data
        })
        confirmationDiv.style.value = "none"

        // button --> buttonDiv --> tooltip --> questionContainer (3rd parent)
        document.getElementById(confirmationDiv.value).parentNode.parentNode.parentNode.style.display = "none"
        confirmationDiv.style.display = "none"

    })

})