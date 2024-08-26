from django.contrib import admin
from .models import Product, Client, Order, Supplier

admin.site.register(Product)
admin.site.register(Client)
admin.site.register(Order)
admin.site.register(Supplier)
