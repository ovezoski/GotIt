from rest_framework import serializers

from .models import Profile
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        validate_password(attrs["password"])

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"], email=validated_data["email"]
        )

        user.set_password(validated_data["password"])
        user.save()

        return user


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
