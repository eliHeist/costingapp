# Generated by Django 4.2.7 on 2024-10-30 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_alter_user_phone_1"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="role",
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(
                max_length=255, unique=True, verbose_name="Email address"
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="is_account_staff",
            field=models.BooleanField(
                default=False,
                help_text="Indicates if the user can access finance actions.",
                verbose_name="Finances Status",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="is_technician",
            field=models.BooleanField(
                default=False,
                help_text="Indicates if the user is a technician",
                verbose_name="Technician Status",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="profile_picture",
            field=models.ImageField(blank=True, null=True, upload_to="pps/"),
        ),
    ]