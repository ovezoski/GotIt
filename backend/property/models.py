from django.db import models
from django.contrib.auth.models import User


class Property(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        User, related_name="properties", on_delete=models.CASCADE, null=True
    )

    main_image = models.ImageField(upload_to="property_images/", blank=True, null=True)

    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state_province = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        return self.name

    def get_main_image_url(self):
        """
        Returns the URL of the main image.
        """
        if self.main_image:
            return self.main_image.url
        return None


class Order(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    price = models.DecimalField(decimal_places=2, max_digits=1000)
    created_at = models.DateTimeField()
