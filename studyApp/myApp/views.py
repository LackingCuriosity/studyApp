from django.shortcuts import render
from .models import Question
# Create your views here.

def home(request):
    if request.method == "POST":
        question = Question.objects.create(question=request.POST["question"], answer=request.POST["answer"], upvotes=0)
        question.save()
    print(Question.objects.all())
    return render(request, "myApp/test.html", 
                  {
                      "posts": Question.objects.all()
                  })