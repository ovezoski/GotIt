from rest_framework import viewsets
from .models import Profile
from .serializers import ProfileSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    lookup_field = "user_id"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
