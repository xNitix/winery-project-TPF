from django.contrib import admin
from .models import User, Wine, WineColor, WineTaste, Country, Order, OrderDetails, Review
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import ModelAdmin

class MyUserAdmin(UserAdmin):
    model = User

    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('role',)}),
    )

admin.site.register(User, MyUserAdmin)
admin.site.register(Wine)
admin.site.register(WineColor)
admin.site.register(WineTaste)
admin.site.register(Country)
admin.site.register(Order)
admin.site.register(OrderDetails)
admin.site.register(Review)