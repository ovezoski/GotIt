from model_bakery.recipe import Recipe
from faker import Faker
from property.models import Property
from django.core.management.base import BaseCommand

fake = Faker()

property_recipe = Recipe(
    Property,
    name=lambda: f"The {fake.color()} {fake.street_name()}",
    address_line_1=fake.street_address,
    city=fake.city,
    state_province=fake.state,
    zip_code=fake.postcode,
    country=fake.country,
    latitude=fake.latitude,
    longitude=fake.longitude,
)


class Command(BaseCommand):
    help = "Populates the database with fake property data."

    def handle(self, *args, **kwargs):
        property_recipe.make(_quantity=1000)
