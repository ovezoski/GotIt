from django.test import TestCase

from ..models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()


class ProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

    def test_profile_creation_on_user_creation(self):
        self.assertIsNotNone(self.user.profile)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(self.user.profile.user, self.user)

    def test_profile_str(self):
        self.assertEqual(str(self.user.profile), "testuser Profile")
