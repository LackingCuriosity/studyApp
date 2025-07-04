# Generated by Django 5.2.3 on 2025-06-27 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0003_person_questions'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='country',
            field=models.TextField(default='test', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='subject',
            field=models.TextField(default='English', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='year',
            field=models.IntegerField(default=9),
            preserve_default=False,
        ),
    ]
