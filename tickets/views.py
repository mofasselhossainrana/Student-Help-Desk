from rest_framework import generics
from .models import Ticket, Comment
from .serializers import TicketSerializer, CommentSerializer
from .serializers import TicketSerializer, CommentSerializer, UserRegistrationSerializer
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.permissions import IsAuthenticated

class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]


class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]


class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer