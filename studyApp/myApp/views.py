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
    if request.method == "POST":
        question = Question.objects.create(question=request.POST["question"], answer=request.POST["answer"], upvotes=0)
        question.save()
    elif request.method == "PUT":
        if request.user.is_authenticated:
            person = Person.objects.get(username=request.user.username)
            if person.upvotes > 0:
                data = json.loads(request.body)
                id = data["ID"]
                question = Question.objects.get(id=id)
                person = Person.objects.get(username=request.user.username)
                person.upvotes = person.upvotes - 1
                person.save()
                
                #divide by abs of value to validate the value to ensure it's always +- 1
                question.upvotes = question.upvotes + int(data["upvoteValue"])/abs(int(data["upvoteValue"]))
                question.save()
            
    
    if request.user.is_authenticated:
        upvotes = Person.objects.get(username=request.user.username).upvotes
    else:
        upvotes = 0

    return render(request, "myApp/test.html", 
                  {
                      "posts": Question.objects.all(),
                      "upvotes": upvotes
                  })


def getQuestion(request):
    if request.method != "GET":
        return HttpResponseBadRequest("Bad Request")
    if (request.GET.get('question')):
        questionID = int(request.GET.get('question'))
        questionID = questionID % len(Question.objects.all()) 
        return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[questionID]))
    
    return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[0]))

def test(request):
    return render(request, "myApp/layout.html")

def register(request):
    if request.method != "POST":
        return render(request, "myApp/register.html")
    username = request.POST["username"]
    password = request.POST["password"]
    confirmPassword = request.POST["confirmPassword"]
    if (password != confirmPassword):
        return render(request, "myApp/register.html", {
            "message" : "Error: Passwords do not match"
        })
    try:
        person = Person.objects.create(username=username, password=make_password(password), upvotes=10, upvotesTime=time.time())
    except IntegrityError:
        return render(request, "myApp/register.html", {
            "message" : "Error: Username is already taken"
        })
    person.save()
    login(request, person)
    return HttpResponseRedirect(reverse("home"))

def loginPage(request):
    if request.method != "POST":
        return render(request, "myApp/login.html")
    username = request.POST["username"]
    password = request.POST["password"]
    person = authenticate(request, username=username, password=password)
    print(username, password)
    if person:
        login(request, person)
        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "myApp/login.html", {
            "message" : "Invalid Credentials"
        })
    
def logoutPage(request):
    logout(request)
    return render(request, "myApp/test.html")
    