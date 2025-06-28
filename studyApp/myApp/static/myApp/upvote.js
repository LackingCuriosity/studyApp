document.addEventListener("DOMContentLoaded", () => {
    // vote buttons
    voteElements = document.getElementsByClassName("vote")

    function sendVote(amount) {
        
            if (document.getElementById("upvoteDiv").style.display == "none") {
                return
            }
            //update info for user
            try {
                upvotesAmount = document.getElementById("upvotesAmount")
                upvotesAmount.innerHTML = Math.max(upvotesAmount.innerHTML - 1, 0)
                questionUpvotesAmount = document.getElementById("questionUpvotesAmount")
                questionUpvotesAmount.innerHTML = Number(questionUpvotesAmount.innerHTML) + amount
            }
            catch(e) {
                console.log(e)
            }   

            // send data
            question = document.getElementById("questionDiv")
            data = JSON.stringify({'ID' : question.dataset.id, 'upvoteValue' : amount})
            fetch("/", {
                method: "PUT",
                headers : {
                    'X-CSRFToken': document.getElementsByName("csrfmiddlewaretoken")[0].value
                },
                body: data
            })
    }

    // apply function to all elements
    for (let element of voteElements) {
        // on click, disable and send data
        element.addEventListener("click", () => {
            sendVote(element.dataset.value)
            element.classList.add("pushOutAnimation")
            setTimeout(() => {
                element.classList.remove("pushOutAnimation")
            }, 1000)
        })
    }

    // Assign function to W and S key
    document.addEventListener("keyup", (e) => {
        activeElementTag = document.activeElement.tagName.toLowerCase()
        if (activeElementTag == "textarea" || activeElementTag == "input") {
            return
        }
        
        if (e.key === "w") {
            sendVote(1)
        }
        else if (e.key === "s") {
            sendVote(-1)
        }
    })

    setInterval(() => {
        fetch("/updateUpvotes", {
            method: "GET"
        })
        .then (data => data.json())
        .then (data => {
            if (data["response"] == 200) {
                document.getElementById("upvotesAmount").innerHTML = 10;
            }
        })
    }, 2000);

})