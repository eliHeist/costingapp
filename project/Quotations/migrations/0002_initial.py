# Generated by Django 5.1.3 on 2024-11-29 18:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Employees', '0001_initial'),
        ('LabourCostings', '0001_initial'),
        ('Projects', '0001_initial'),
        ('Quotations', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='quotation',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='quotation',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Projects.project'),
        ),
        migrations.AddField(
            model_name='quotationgroup',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Projects.project'),
        ),
        migrations.AddField(
            model_name='quotationgroup',
            name='quotation',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='Quotations.quotation'),
        ),
        migrations.AddField(
            model_name='quotationitem',
            name='costing',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='LabourCostings.itemcosting'),
        ),
        migrations.AddField(
            model_name='quotationitem',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Employees.employee'),
        ),
        migrations.AddField(
            model_name='quotationitem',
            name='quotation_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Quotations.quotationgroup'),
        ),
    ]
