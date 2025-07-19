from django.urls import path, include
from rest_framework import routers
from .views import register_user, ProfileViewSet


profile_router = routers.DefaultRouter()
profile_router.register(r"profiles", ProfileViewSet)

urlpatterns = [
    path("register/", register_user, name="register"),
    path("", include(profile_router.urls)),
]
