# Generated by Django 4.2.9 on 2024-02-03 11:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('muhasebe', '0022_product_price_alter_profile_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='price',
        ),
        migrations.AddField(
            model_name='transaction',
            name='product',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='muhasebe.product'),
            preserve_default=False,
        ),
    ]
