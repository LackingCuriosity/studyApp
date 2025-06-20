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
    #if post create/add question
    if request.method == "POST":
        question = Question.objects.create(question=request.POST["question"], answer=request.POST["answer"], upvotes=0)
        question.save()
    
    #if PUT, upvote if authenticated
    elif request.method == "PUT" and request.user.is_authenticated:
        person = Person.objects.get(username=request.user.username)

        # user must have upvotes still
        if person.upvotes > 0:

            #get upvote/downvote and apply
            data = json.loads(request.body)
            id = data["ID"]
            question = Question.objects.get(id=id)
            person = Person.objects.get(username=request.user.username)
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
    
    # get question if the question exists
    if (request.GET.get('question')):
        questionID = int(request.GET.get('question'))
        questionID = questionID % len(Question.objects.all()) 
        return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[questionID]))
    
    #return question in JSON
    return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[0]))

def test(request):
    return render(request, "myApp/layout.html")

def register(request):
    #show page if not POST
    if request.method != "POST":
        return render(request, "myApp/register.html")
    
    #get user input
    username = request.POST["username"]
    password = request.POST["password"]
    confirmPassword = request.POST["confirmPassword"]

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
    username = request.POST["username"]
    password = request.POST["password"]
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
    return HttpResponseRedirect(reverse("home"))
    