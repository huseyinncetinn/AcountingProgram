# Generated by Django 4.2.9 on 2024-01-28 13:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('muhasebe', '0016_payment_payee_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='payee_id',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='payee_type',
        ),
    ]
