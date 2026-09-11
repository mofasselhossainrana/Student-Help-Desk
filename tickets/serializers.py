from rest_framework import serializers
from .models import Ticket, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'ticket', 'user', 'created_at']


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description',
            'priority', 'status', 'user',
            'created_at', 'updated_at'
        ]