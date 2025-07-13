from django.test import TestCase

from property.models import Property


class PropertyModelTest(TestCase):
    def setUp(self):
        self.property = Property.objects.create(
            name="Test Property",
            address_line_1="123 Main St",
            city="Testville",
            state_province="Test State",
            zip_code="12345",
            country="Testland",
            latitude=12.345678,
            longitude=87.654321,
        )

    def test_property_creation(self):
        self.assertIsInstance(self.property, Property)
        self.assertEqual(self.property.name, "Test Property")

    def test_property_str(self):
        self.assertEqual(str(self.property), "Test Property")

    def test_get_main_image_url_no_image(self):
        self.assertIsNone(self.property.get_main_image_url())
