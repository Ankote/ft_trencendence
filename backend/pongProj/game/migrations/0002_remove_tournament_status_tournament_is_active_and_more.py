# Generated by Django 5.1 on 2024-08-10 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tournament',
            name='status',
        ),
        migrations.AddField(
            model_name='tournament',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='tournament',
            name='name',
            field=models.CharField(default=1, max_length=255, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='tournament',
            name='end_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='maxPlayers',
            field=models.IntegerField(default=4),
        ),
    ]