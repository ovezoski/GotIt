from django.db import models

class Property(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField()

    def __str__(self) -> str:
        return self.name

class Order(models.Model):
    property = models.ForeignKey(Property, on_delete=models.DO_NOTHING)
    price = models.DecimalField(decimal_places=2, max_digits=1000)
    created_at = models.DateTimeField()