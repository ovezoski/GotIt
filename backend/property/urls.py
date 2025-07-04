from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"property", views.PropertyViewSet, basename="property")

app_name = "property"
urlpatterns = []
