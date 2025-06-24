document.addEventListener("DOMContentLoaded", () => {
    question = document.getElementById("addQuestion")
    answer = document.getElementById("addAnswer")
    button = document.getElementById("submitButton")
    document.addEventListener("keyup", e => {
        if (question.value.trim() != "" && answer.value.trim() != "") {
            button.disabled = false
        }
        else {
            button.disabled = true
        }
    })

})