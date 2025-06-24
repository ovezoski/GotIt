from django.http import HttpResponse,  HttpResponseRedirect, JsonResponse

from django.template import loader
from django.shortcuts import render, get_object_or_404
from django.core import serializers
from django.views import generic
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import serializers as rest_serializers

from.serializers import PropertySerializer
from .models import Property

def index(request):
    properties_list = Property.objects.order_by("-created_at")[:5]
    template = loader.get_template("index.html")
    context = {'properties_list' : properties_list}
    return HttpResponse(template.render(context, request))

def create(request):

    name = request.POST["name"]
    created_at = request.POST["created_at"]

    property = Property()
    property.name = name
    property.created_at = created_at

    property.save()

    return HttpResponseRedirect("/property")

def delete(request, property_id):
    property = get_object_or_404(Property, pk=property_id)
    property.delete()

    return HttpResponseRedirect("/property")

@ensure_csrf_cookie
def list_property_json(request):
    response = Property.objects.all()
    serializer = PropertySerializer(response, many=True)

    return JsonResponse(serializer.data, safe=False)


class DetailView ( generic.DetailView ):
    model = Property
    template_name = "details.html"
    