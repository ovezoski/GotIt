from rest_framework import serializers

from .models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()


class UserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username"]


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = UserEmailSerializer()

    class Meta:
        model = Profile
        fields = ["url", "user", "bio", "user_id"]

        extra_kwargs = {
            "url": {"view_name": "profile-detail", "lookup_field": "user_id"},
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)

        profile_instance = super().update(instance, validated_data)

        if user_data:
            user_instance = profile_instance.user
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        return profile_instance
