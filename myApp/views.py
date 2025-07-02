from django.shortcuts import render
from django.db import IntegrityError
from django.urls import reverse
from .models import Question, Person
from django.http import HttpResponseBadRequest, JsonResponse, HttpResponseRedirect
from django.contrib.auth.hashers import make_password
import json
from django.forms.models import model_to_dict
from django.contrib.auth import login, logout, authenticate
import time
# Create your views here.

def home(request):
    #if PUT, upvote if authenticated
    if request.method == "PUT" and request.user.is_authenticated:
        person = Person.objects.get(username=request.user.username)

        # user must have upvotes still
        if person.upvotes > 0:
            #get upvote/downvote and apply
            data = json.loads(request.body)
            id = data["ID"]
            question = Question.objects.get(id=id)
            person = Person.objects.get(username=request.user.username)
            if not person.questions.filter(id=id):
                person.upvotes = person.upvotes - 1
                person.save()

                #divide by abs of value to validate the value to ensure it's always +- 1
                question.upvotes = question.upvotes + int(data["upvoteValue"])/abs(int(data["upvoteValue"]))
                question.save()
            
    # show user amount of upvotes if authenticated
    if request.user.is_authenticated:
        upvotes = Person.objects.get(username=request.user.username).upvotes
    else:
        upvotes = 0

    #render
    return render(request, "myApp/test.html", 
                  {
                      "posts": Question.objects.all(),
                      "upvotes": upvotes
                  })


def getQuestion(request):
    #ensure only get request
    if request.method != "GET":
        return HttpResponseBadRequest("Bad Request")
    
    #model to send 
    model = {}
    
    # get question if the question exists
    if (request.GET.get('question')):
        
        #get requested Question ID
        questionID = int(request.GET.get('question'))
        if Question.objects.all() == 0:
            return JsonResponse({"question" : "No Questdwadions Yet!", "answer":"No Questions Yet!", "upvotes": ""})

        # get filters if applciable
        year = int(request.GET.get("year", -1))
        country = request.GET.get("country", "")
        subject = request.GET.get("subject", "")
        onlyMyQuestion = request.GET.get("onlyMyQuestion", "false")
        questions = (Question.objects.all().order_by('-upvotes'))

        #apply filters if applicable
        if year != -1:
            questions = questions.filter(year=year)
        if country != "Country":
            questions = questions.filter(country=country)
        if subject != "":
            questions = questions.filter(subject=subject)
        if onlyMyQuestion == "true":
            if (request.user.is_authenticated):
                questions = questions.filter(person=request.user)
            else:
                return JsonResponse({"question" : "You Are Not Logged In!<br>You Have no Questions!", "answer":"You Are Not Logged In! You Have no Questions!", "upvotes": ""})
        if len(questions) == 0:
            return JsonResponse({"question" : "No Questions Yet!", "answer":"No Questions Yet!", "upvotes": ""})
        
        #get the question requested, loop back if needed
        questionID = questionID % len(questions)
        model = model_to_dict(questions[questionID])
        if request.user.is_authenticated:
            model["isOwn"] = Person.objects.get(username=request.user.username).questions.filter(id=questions[questionID].id).exists()
            
        return JsonResponse(model)
    
    model = model_to_dict(Question.objects.all().order_by('-upvotes')[0])
    #return question in JSON
    return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[0]))

def test(request):
    return render(request, "myApp/layout.html")

def register(request):
    #show page if not POST
    if request.method != "POST":
        return render(request, "myApp/register.html")
    
    #get user input
    username = request.POST.get("username", "")
    password = request.POST.get("password", "")
    confirmPassword = request.POST.get("confirmPassword", "")

    # error message if passwords dont match
    if (password != confirmPassword):
        return render(request, "myApp/register.html", {
            "message" : "Error: Passwords do not match"
        })
    
    # create user, unless error, then tell user username is taken
    try:
        person = Person.objects.create(username=username, password=make_password(password), upvotes=10, upvotesTime=time.time())
    except IntegrityError:
        return render(request, "myApp/register.html", {
            "message" : "Error: Username is already taken"
        })
    
    #save to db and send home
    person.save()
    login(request, person)
    return HttpResponseRedirect(reverse("home"))

def loginPage(request):
    #if not POST show site
    if request.method != "POST":
        return render(request, "myApp/login.html")
    
    #get user input
    username = request.POST.get("username", "")
    password = request.POST.get("password", "")
    person = authenticate(request, username=username, password=password)

    #if authenticated, login else show error
    if person:
        login(request, person)
        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "myApp/login.html", {
            "message" : "Invalid Credentials"
        })
    
def logoutPage(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

def updateUpvotes(request):
    if request.user.is_authenticated:
        person = Person.objects.get(username=request.user.username)
        #if more that 10 miniutes has passed, set upvotes to 10, and reset time
        if (time.time() - person.upvotesTime > 600):
            person.upvotes = 10
            person.upvotesTime = time.time()
            person.save()
            return JsonResponse({"response": 200})
    return JsonResponse({"response": -1})
        
def manageQuestions(request):
    #if not logged in, send to login page
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    
    person = Person.objects.get(username=request.user.username)
    #if post create/add question
    if request.method == "POST":
        #ensure its valid
        validSubjects = ["Accounting", "Biology", "Chemistry", "Computer Science", "Design And Technology", "Economics", "English", "Food Science", "French", "Math", "Geography", "Music", "Physics", "Philosophy", "Psycology", "Statistics"]
        validCountries = ["Canada", "United States of America", "United Kingdom"]
        validYears = [9,10,11,12,13]
        userQuestion = request.POST.get("question", "")
        userAnswer = request.POST.get("answer", "")
        userCountry = request.POST.get("country", "")
        userSubject = request.POST.get("subject", "")
        userYear = request.POST.get("year", "-1")

        #If valid, make and save
        if userQuestion != "" and userAnswer != "" and userSubject in validSubjects and userCountry in validCountries and int(userYear) in validYears:
            question = Question.objects.create(question=request.POST["question"], answer=request.POST["answer"], upvotes=0, country=userCountry, subject=userSubject, year=userYear)
            question.save()
            person.questions.add(question)
            person.save()
            return (HttpResponseRedirect(reverse("manageQuestions")))
    
    #delete post if PUT method
    elif request.method == "PUT":
        # get question ID
        data = json.loads(request.body)

        #ensure user owns question and delete
        if person.questions.filter(id=data["ID"]):
            person.questions.get(id=data["ID"]).delete()

        
    
    return render(request, "myApp/manageQuestions.html",{
        "questions": person.questions.all().order_by("-upvotes")
    })
