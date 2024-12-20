from django.db.models.signals import post_delete, pre_delete


# def delete_labour_table(sender, instance, **kwargs):
#     instance.item_costings.delete()