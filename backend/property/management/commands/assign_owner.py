from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from property.models import Property


class Command(BaseCommand):
    help = "Assigns an owner to properties that do not have one."

    def handle(self, *args, **options):
        try:
            user = User.objects.get(pk=6)
            self.stdout.write(self.style.SUCCESS(f'User "{user.username}" found.'))
        except User.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    "User with id 6 not found. Creating a new superuser."
                )
            )
            user = User.objects.create_superuser(
                "default_owner", "default_owner@example.com", "password"
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser "{user.username}"')
            )

        unowned_properties = Property.objects.filter(owner__isnull=True)
        if not unowned_properties.exists():
            self.stdout.write(
                self.style.SUCCESS("No properties found without an owner.")
            )
            return

        for property_item in unowned_properties:
            property_item.owner = user
            property_item.save()

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully assigned "{user.username}" as the owner for {unowned_properties.count()} properties.'
            )
        )
