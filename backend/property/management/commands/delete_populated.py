from django.core.management.base import BaseCommand
from property.models import Property

from django.db.models.functions import Length


class Command(BaseCommand):
    help = "Deletes properties with names longer than 15."

    def handle(self, *args, **kwargs):

        long_name_property_ids = (
            Property.objects.annotate(name_length=Length("name"))
            .filter(name_length__gt=15)
            .values_list("pk", flat=True)
        )

        deleted_count, _ = Property.objects.filter(
            pk__in=long_name_property_ids
        ).delete()

        self.stdout.write(
            self.style.SUCCESS(f"Successfully deleted {deleted_count} properties.")
        )
