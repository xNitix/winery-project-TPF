from django.urls import path
from django.conf.urls import include
from .views import MyTokenObtainPairView, WineViewSet, CountryViewSet, WineTasteViewSet, WineColorViewSet, UserRegisterViewSet, UserProfileViewSet, OrderViewSet, ReviewViewSet, AlcoholValuesView, VolumeValuesView, YearValuesView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'wines', WineViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'wine_tastes', WineTasteViewSet)
router.register(r'wine_colors', WineColorViewSet)
router.register(r'register', UserRegisterViewSet, basename="userregister")
router.register(r'profile', UserProfileViewSet, basename="userprofile")
router.register(r'orders', OrderViewSet)

winerouter = DefaultRouter()
winerouter.register(r'reviews', ReviewViewSet, basename="reviews")

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('', include(router.urls)),
    path('wines/<int:wine_id>/', include(winerouter.urls)),
    path('wine_alcohol_values', AlcoholValuesView.as_view()),
    path('wine_volume_values', VolumeValuesView.as_view()),
    path('wine_year_values', YearValuesView.as_view())
]