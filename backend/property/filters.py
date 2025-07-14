from django_filters import rest_framework as filters
from .models import Property


class PropertyFilter(filters.FilterSet):
    class Meta:
        model = Property
        fields = ["city", "country"]
