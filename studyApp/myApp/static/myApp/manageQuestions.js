document.addEventListener("DOMContentLoaded", () => {
    question = document.getElementById("addQuestion")
    answer = document.getElementById("addAnswer")
    button = document.getElementById("submitButton")
    button.disabled = true
    document.addEventListener("keyup", e => {
        if (question.value.trim() != "" && answer.value.trim() != "") {
            button.disabled = false
        }
        else {
            button.disabled = true
        }
    })

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
        console.log("DS")
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