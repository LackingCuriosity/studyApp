from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Question(models.Model):
    question = models.TextField(max_length=1000)
    answer = models.TextField(max_length=1000)
    upvotes = models.BigIntegerField()
    country = models.TextField(max_length=100)
    subject = models.TextField(max_length=100)
    year = models.IntegerField()



class Person(User):
    upvotes = models.BigIntegerField()
    upvotesTime = models.BigIntegerField()
    questions = models.ManyToManyField(Question, related_name="person")