# Generated by Django 5.1 on 2024-08-16 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_alter_usertournament_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='usertournament',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
