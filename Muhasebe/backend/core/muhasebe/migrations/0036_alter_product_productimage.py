# Generated by Django 4.2.9 on 2024-05-10 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('muhasebe', '0035_alter_profile_photo_alter_supplier_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='productImage',
            field=models.ImageField(blank=True, default='profile_photos/2024/default.jpg', null=True, upload_to='productImage/%Y/%m/'),
        ),
    ]
