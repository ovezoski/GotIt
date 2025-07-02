from django.db import models


class Property(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    main_image = models.ImageField(
        upload_to='property_images/',
        blank=True,
        null=True
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
    property = models.ForeignKey(Property, on_delete=models.DO_NOTHING)
    price = models.DecimalField(decimal_places=2, max_digits=1000)
    created_at = models.DateTimeField()
