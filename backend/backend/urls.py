from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from django.conf import settings
from django.conf.urls.static import static
from profiles.serializers import ProfileSerializer
from profiles.views import ProfileViewSet
from property.urls import router as property_router
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff", "profile"]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


project_router = routers.DefaultRouter()
project_router.register(r"users", UserViewSet)
project_router.register(r"profiles", ProfileViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(project_router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("profiles.urls")),
    path("", include(property_router.urls)),
    path("api-auth/", include("rest_framework.urls")),
    path("prometheus/", include("django_prometheus.urls")),
    path("silk/", include("silk.urls", namespace="silk")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
] + debug_toolbar_urls()

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
