from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import serializers
from base.models import Wine, WineTaste, WineColor, Country, User, Order, OrderDetails, Review

from random import randint

from django.db.models import Avg

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        return token

class WineTasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = WineTaste
        fields = '__all__'

class WineColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = WineColor
        fields = '__all__'

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class WineSerializer(serializers.ModelSerializer):
    taste = WineTasteSerializer(many=False, read_only=True)
    color = WineColorSerializer(many=False, read_only=True)
    country = CountrySerializer(many=False, read_only=True)

    rating = serializers.SerializerMethodField()
    number_of_reviews = serializers.SerializerMethodField()

    taste_id = serializers.SlugRelatedField(source='taste', queryset=WineTaste.objects.all(), slug_field='id', many=False, write_only=True)
    color_id = serializers.SlugRelatedField(source='color', queryset=WineColor.objects.all(), slug_field='id', many=False, write_only=True)
    country_id = serializers.SlugRelatedField(source='country', queryset=Country.objects.all(), slug_field='code', many=False, write_only=True)

    def get_rating(self, obj):
        reviews = Review.objects.filter(wine=obj)
        return reviews.aggregate(average=Avg("rating", default=0))["average"]

    def get_number_of_reviews(self, obj):
        reviews = Review.objects.filter(wine=obj)
        return reviews.count()

    class Meta:
        model = Wine
        fields = ["id", "name", "description", "image_url",  "taste_id", "taste", "color_id", "color", "country_id", "country", "year", "price", "units_in_stock", "rating", "alcohol", "volume", "number_of_reviews"]

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email"]

        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class OrderDetailsSerializer(serializers.ModelSerializer):
    wine_id = serializers.SlugRelatedField(source='wine', queryset=Wine.objects.all(), slug_field='id', many=False)
    
    def validate(self, attrs):
        if attrs.get('wine').price != attrs.get('unit_price'):
            raise serializers.ValidationError({"price": "Current price of this wine is different!"})
        return super().validate(attrs)
    
    class Meta:
        model = OrderDetails
        fields = ["wine_id", "quantity", "unit_price"]

class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class OrderSerializer(serializers.ModelSerializer):
    order_details = OrderDetailsSerializer(source='orderdetails_set', many=True)
    user = ReviewUserSerializer(read_only=True)

    def update_stock(self, order_details, previous_order_details=None):
        # "Return" previous wines
        if previous_order_details is not None:
            for order_detail in previous_order_details:
                wine = order_detail.wine
                quantity = order_detail.quantity

                wine.units_in_stock += quantity
                wine.save()

        # Check if there is enough for a new order
        is_order_valid = True
        for order_detail in order_details:
            wine = Wine.objects.get(pk=order_detail.get("wine").pk)
            quantity = order_detail.get("quantity")

            if wine.units_in_stock < quantity:
                is_order_valid = False
                break

        # If order is valid, remove units from stock
        if is_order_valid:
            for order_detail in order_details:
                wine = Wine.objects.get(pk=order_detail.get("wine").pk)
                quantity = order_detail.get("quantity")

                wine.units_in_stock -= quantity
                wine.save()
        
        # Otherwise, if there have been previous order details, update their stock back (remove them from stock)
        else:
            if previous_order_details is not None:
                for order_detail in previous_order_details:
                    wine = order_detail.wine
                    quantity = order_detail.quantity

                    wine.units_in_stock -= quantity
                    wine.save()

        return is_order_valid

    def create(self, validated_data):
        order_data = validated_data.copy()
        order_data.pop('orderdetails_set')
        order_data['user'] = self.context['request'].user

        if self.update_stock(validated_data.get('orderdetails_set')):
            order = Order.objects.create(**order_data)
            for order_detail_data in validated_data.get('orderdetails_set'):
                order_detail_data['order'] = order
                order_detail = OrderDetails.objects.create(**order_detail_data)
                order_detail.save()
            return order
        else:
            raise serializers.ValidationError({"order_details": "There are not enough units in stock."})
    
    def update(self, instance, validated_data):
        order_data = validated_data.copy()
        order_data.pop('orderdetails_set')
        order_data['user'] = self.context['request'].user

        if self.update_stock(validated_data.get('orderdetails_set'), OrderDetails.objects.filter(order=instance)):
            Order.objects.filter(pk=instance.pk).update(**order_data)
            OrderDetails.objects.filter(order=instance).delete()

            for order_detail_data in validated_data.get('orderdetails_set'):
                order_detail_data['order'] = instance
                order_detail = OrderDetails.objects.create(**order_detail_data)
                order_detail.save()
            return instance
        else:
            raise serializers.ValidationError({"order_details": "There are not enough units in stock."})

    class Meta:
        model = Order
        fields = ["id", "user", "date", "first_name", "last_name", "address", "city", "zip_code", "country", "phone_number", "email", "order_details"]

class UserProfileSerializer(serializers.ModelSerializer):
    orders = serializers.SerializerMethodField(read_only=True)
    role = serializers.CharField(source='get_role_display', read_only=True)

    def get_orders(self, obj):
        orders = Order.objects.filter(user=obj)
        return OrderSerializer(orders, many=True).data

    class Meta:
        model = User
        fields = ["id", "username", "email", "orders", "role"]

class ChangePasswordSerializer(serializers.Serializer):
    model = User

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ChangeUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]

class UserRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

class FavoriteWineSerializer(serializers.Serializer):
    pass

class FavoriteWinesSerializer(serializers.ModelSerializer):
    favorite_wines = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['favorite_wines']

class ReviewSerializer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ["id", "user", "created", "content", "rating"]