from django.test import TestCase
from django.contrib.auth import get_user_model
from .serializers import UserEmailSerializer

User = get_user_model()


class SerializerTestSetup(TestCase):
    def setUp(self):
        if not hasattr(self, "_test_counter"):
            self._test_counter = 0
        self._test_counter += 1

        self.user_password = "testpassword123"
        self.user = User.objects.create_user(
            email=f"test{self._test_counter}@example.com",
            username=f"testuser{self._test_counter}",
            password=self.user_password,
        )

        self.user_data = {"email": self.user.email, "username": self.user.username}


class UserEmailSerializerTest(SerializerTestSetup):

    def test_user_email_serializer_serialization(self):
        """
        Test that the UserEmailSerializer correctly serializes a User instance.
        The expected data should match the user created in setUp.
        """
        serializer = UserEmailSerializer(instance=self.user)
        expected_data = {"email": self.user.email, "username": self.user.username}
        self.assertEqual(serializer.data, expected_data)

    def test_user_email_serializer_deserialization_valid(self):
        """
        Test that the UserEmailSerializer correctly deserializes valid data.
        """
        data = {"email": "new@example.com", "username": "newuser"}
        serializer = UserEmailSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["email"], "new@example.com")
        self.assertEqual(serializer.validated_data["username"], "newuser")

    def test_user_email_serializer_deserialization_invalid_email(self):
        """
        Test deserialization with an invalid email format.
        """
        data = {"email": "invalid-email", "username": "newuser"}
        serializer = UserEmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
        self.assertIn("Enter a valid email address.", serializer.errors["email"])

    def test_user_email_serializer_deserialization_missing_fields(self):
        """
        Test deserialization when a required field is missing.
        """
        data = {"email": "new@example.com"}
        serializer = UserEmailSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)
        self.assertIn("This field is required.", serializer.errors["username"])
