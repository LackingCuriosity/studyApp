# Generated by Django 5.2.3 on 2025-06-24 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0002_person'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='questions',
            field=models.ManyToManyField(to='myApp.question'),
        ),
    ]
