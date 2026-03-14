from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from notes.defaults import create_default_notes


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def on_user_created(sender, instance, created, **kwargs):
    if not created:
        return
    create_default_notes(instance)
