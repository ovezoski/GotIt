from .models import Property
from .serializers import PropertySerializer

from rest_framework import viewsets, permissions, filters, pagination
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator


class StandardResultSetPagination(pagination.PageNumberPagination):
    page_size = 8
    max_page_size = 100
    page_query_param = "page"
    page_size_query_param = "pageSize"


@method_decorator(ensure_csrf_cookie, name="dispatch")
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    pagination_class = StandardResultSetPagination

    def get_serializer_context(self):
        """
        Passes the request object to the serializer context,
        which is necessary for `request.build_absolute_uri`.
        """
        return {"request": self.request}

    def get_permissions(self):
        """
        Instantiates and returns the list of
        permissions that this view requires.
        """
        if self.action == "create":
            permission_classes = [permissions.AllowAny]
        elif self.action in ["update", "partial_update", "destroy", "delete"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
