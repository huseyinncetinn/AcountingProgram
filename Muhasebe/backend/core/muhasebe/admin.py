from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Profile)
admin.site.register(Transaction)
admin.site.register(Supplier)
admin.site.register(Customer)
admin.site.register(Payment)
admin.site.register(Product)

