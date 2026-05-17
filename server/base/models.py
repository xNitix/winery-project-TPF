from django.db import models

from django.core.validators import RegexValidator

from django.contrib.auth.models import AbstractUser

from django.core.exceptions import ValidationError


class User(AbstractUser):
    SHOP_MANAGER = 1
    CUSTOMER = 2

    ROLE_CHOICES = (
        (SHOP_MANAGER, 'Manager'),
        (CUSTOMER, 'Client')
    )

    email = models.EmailField()
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=CUSTOMER)
    favorite_wines = models.ManyToManyField("Wine")

    def __str__(self):
        return self.username


class Country(models.Model):
    class Meta:
        verbose_name_plural = 'Countries'

    code = models.CharField(primary_key=True, max_length=2, validators=[
        RegexValidator(r'^[A-Z]{2}$', 'Country code consists of 2 capital letters.')])
    
    name = models.CharField(max_length=50, validators=[
        RegexValidator(r'^[A-Za-z\s]*$', 'Country name can only contain letters.')
    ])

    def __str__(self):
        return self.code


class WineColor(models.Model):
    color = models.CharField(max_length=30, validators=[
        RegexValidator(r'^[A-Za-z\s]*$', 'Product type can only contain letters.')
    ])

    def __str__(self):
        return self.color


class WineTaste(models.Model):
    taste = models.CharField(max_length=30, validators=[
        RegexValidator(r'^[A-Za-z\s]*$', 'Product type can only contain letters.')
    ])

    def __str__(self):
        return self.taste


class Wine(models.Model):
    name = models.CharField(max_length=50)

    description = models.TextField()
    image_url = models.CharField(max_length=200)
    country = models.ForeignKey("Country", on_delete=models.PROTECT, related_name="wines")
    color = models.ForeignKey("WineColor", on_delete=models.PROTECT, related_name="wines")
    taste = models.ForeignKey("WineTaste", on_delete=models.PROTECT, related_name="wines")
    year = models.PositiveSmallIntegerField()
    price = models.DecimalField(max_digits=9, decimal_places=2)
    units_in_stock = models.PositiveSmallIntegerField()

    # In percentage; 15.5 -> 15.5%
    alcohol = models.DecimalField(max_digits=4, decimal_places=1)

    # In milliliters
    volume = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.name


class Review(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    wine = models.ForeignKey("Wine", on_delete=models.CASCADE, related_name="reviews")
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1)

    def __str__(self):
        return f"[{self.user.username}] {self.content}"
    

class Order(models.Model):
    user = models.ForeignKey("User", on_delete=models.PROTECT)
    date = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    order_details = models.ManyToManyField("Wine", through="OrderDetails")


class OrderDetails(models.Model):
    class Meta:
        verbose_name_plural = 'Order Details'
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    wine = models.ForeignKey("Wine", on_delete=models.PROTECT)
    quantity = models.PositiveSmallIntegerField()
    unit_price = models.DecimalField(max_digits=9, decimal_places=2)

    # def save(self, request_user, *args, **kwargs):
    #     if request_user != self.order.user and request_user.role != User.SHOP_MANAGER:
    #         raise ValidationError("This user cannot add an order detail, because the user is neither the order's user nor the manager.")
    #     super().save(*args, **kwargs)