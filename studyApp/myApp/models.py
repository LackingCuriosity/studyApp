from django.db import models

# Create your models here.

class Question(models.Model):
    question = models.TextField(max_length=1000)
    answer = models.TextField(max_length=1000)
    upvotes = models.BigIntegerField()
