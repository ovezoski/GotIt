from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"property", views.PropertyViewSet, basename="property")
router.register(
    r"my-properties", views.OwnerPropertyViewSet, basename="my-properties"
)

app_name = "property"   
urlpatterns = router.urls
