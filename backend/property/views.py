from .filters import PropertyFilter
from .models import Property
from .serializers import PropertySerializer
from .permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, permissions, filters, pagination
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.decorators import action
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML


from rest_framework.response import Response


class StandardResultSetPagination(pagination.PageNumberPagination):
    page_size = 12
    max_page_size = 100
    page_query_param = "page"
    page_size_query_param = "pageSize"

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "total_pages": self.page.paginator.num_pages,
                "count": self.page.paginator.count,
                "results": data,
            }
        )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by("-created_at")
    serializer_class = PropertySerializer
    filterset_class = PropertyFilter
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["created_at"]
    pagination_class = StandardResultSetPagination

    def get_serializer_context(self):
        """
        Passes the request object to the serializer context,
        which is necessary for `request.build_absolute_uri`.
        """
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        """
        Instantiates and returns the list of
        permissions that this view requires.
        """
        if self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=["get"])
    def generate_pdf(self, request, pk=None):
        property = self.get_object()
        html_string = render_to_string("details.html", {"property": property})
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf = html.write_pdf()

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename={property.name}.pdf"
        return response


class OwnerPropertyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PropertySerializer
    pagination_class = StandardResultSetPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user).order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}
