# Generated by Django 5.1 on 2025-02-22 08:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_goal_description_goal_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='age',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1),
        ),
        migrations.AddField(
            model_name='user',
            name='height',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='weight',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
