from django.urls import path

from . import views

app_name = "property" 
urlpatterns = [
    path("", views.index, name="index"),
    path("<int:pk>/", views.DetailView.as_view() , name="detail"),
    path("create/", views.create, name="create"),
    path("<int:property_id>/delete", views.delete, name="delete"),
    path("json/", views.list_property_json, name="list_property_json"),

]