# Generated by Django 5.1.3 on 2024-12-16 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('LabourCostings', '0004_itemcosting_name_alter_itemcosting_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemcosting',
            name='name',
            field=models.CharField(max_length=50),
        ),
    ]
