# Generated by Django 4.2.9 on 2024-01-20 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('muhasebe', '0008_product_productimage_product_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
    ]
