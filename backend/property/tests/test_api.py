from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

from property.models import Property


class PropertyViewSetTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.other_user = User.objects.create_user(username="otheruser", password="otherpassword")
        self.client.force_authenticate(user=self.user)
        self.property1 = Property.objects.create(name="Property 1", owner=self.user)
        self.property2 = Property.objects.create(name="Property 2", owner=self.user)
        self.list_url = reverse("property-list")

    def test_list_properties(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2) # type: ignore

    def test_create_property(self):
        data = {"name": "New Property"}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 3)
        self.assertEqual(Property.objects.latest("id").owner, self.user)

    def test_retrieve_property(self):
        detail_url = reverse("property-detail", kwargs={"pk": self.property1.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.property1.name) # type: ignore

    def test_update_property(self):
        detail_url = reverse("property-detail", kwargs={"pk": self.property1.pk})
        data = {"name": "Updated Property"}
        response = self.client.put(detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.property1.refresh_from_db()
        self.assertEqual(self.property1.name, "Updated Property")

    def test_delete_property(self):
        detail_url = reverse("property-detail", kwargs={"pk": self.property1.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Property.objects.count(), 1)

    def test_update_property_unauthorized(self):
        self.client.force_authenticate(user=self.other_user)
        detail_url = reverse("property-detail", kwargs={"pk": self.property1.pk})
        data = {"name": "Updated Property"}
        response = self.client.put(detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_property_unauthorized(self):
        self.client.force_authenticate(user=self.other_user)
        detail_url = reverse("property-detail", kwargs={"pk": self.property1.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
