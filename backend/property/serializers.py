import os
import random
from django.conf import settings
from rest_framework import serializers
from .models import Property


class PropertySerializer(serializers.ModelSerializer):

    main_image = serializers.ImageField(read_only=True)
    main_image_url = serializers.SerializerMethodField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Property
        fields = [
            "name",
            "created_at",
            "main_image",
            "main_image_url",
            "address_line_1",
            "address_line_2",
            "city",
            "state_province",
            "zip_code",
            "country",
            "latitude",
            "longitude",
            "pk",
            "owner",
        ]
        read_only_fields = ["created_at", "owner"]

    def get_main_image_url(self, obj):

        request = self.context.get("request")

        default_image_paths = [
            os.path.join(settings.STATIC_URL, "property/images/default_property_1.jpg"),
            os.path.join(settings.STATIC_URL, "property/images/default_property_2.jpg"),
            os.path.join(settings.STATIC_URL, "property/images/default_property_3.jpg"),
        ]

        if obj.main_image and request:
            return request.build_absolute_uri(obj.main_image.url)
        elif request and default_image_paths:
            random_default_image = random.choice(default_image_paths)
            return request.build_absolute_uri(random_default_image)
        else:
            return random.choice(default_image_paths)
