from django.shortcuts import render
from .models import Question
from django.http import HttpResponseBadRequest, JsonResponse
import json
from django.forms.models import model_to_dict
# Create your views here.

def home(request):
    if request.method == "POST":
        question = Question.objects.create(question=request.POST["question"], answer=request.POST["answer"], upvotes=0)
        question.save()
    elif request.method == "PUT":
        data = json.loads(request.body)
        id = data["ID"]
        question = Question.objects.get(id=id)
        question.upvotes = question.upvotes + int(data["upvoteValue"])
        question.save()

    return render(request, "myApp/test.html", 
                  {
                      "posts": Question.objects.all()
                  })


def getQuestion(request):
    if request.method != "GET":
        return HttpResponseBadRequest("Bad Request")
    if (request.GET.get('question')):
        questionID = int(request.GET.get('question'))
        questionID = questionID % len(Question.objects.all()) 
        return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[questionID]))
    
    return JsonResponse(model_to_dict(Question.objects.all().order_by('-upvotes')[0]))