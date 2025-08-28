from django.contrib import admin
from .models import Transaction, Budget, Category


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "amount", "date", "category", "created_at")
    list_filter = ("type", "date", "category")
    search_fields = ("note",)


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "period", "amount_limit", "start_date", "end_date")
    list_filter = ("period",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name")

# Register your models here.
