from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class ProfileViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        self.profile = self.user.profile
        self.url = reverse("profile-detail", kwargs={"user_id": self.user.id})

    def test_retrieve_profile(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_update_profile(self):
        data = {"bio": "This is a test bio."}
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.bio, "This is a test bio.")


class RegisterUserTest(APITestCase):
    def setUp(self):
        self.url = reverse("register")

    def test_register_user_success(self):
        data = {
            "username": "newuser",
            "password": "ValidPassword123!",
            "password2": "ValidPassword123!",
            "email": "newuser@example.com",
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "newuser")

    def test_register_user_invalid_data(self):
        data = {"username": "newuser"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
