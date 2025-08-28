from rest_framework import serializers
from .models import Transaction, Budget, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class BudgetSerializer(serializers.ModelSerializer):
    def validate_period(self, value: str) -> str:
        if value != "monthly":
            raise serializers.ValidationError("Only monthly budgets are supported")
        return value
    class Meta:
        model = Budget
        fields = ["id", "period", "amount_limit", "start_date", "end_date"]


class TransactionSerializer(serializers.ModelSerializer):
    amount_in_inr = serializers.SerializerMethodField(read_only=True)

    def get_amount_in_inr(self, obj):
        from babel.numbers import format_currency
        return format_currency(obj.amount, 'INR', locale='en_IN')
    class Meta:
        model = Transaction
        fields = [
            "id",
            "type",
            "amount",
            "date",
            "note",
            "category",
            "created_at",
            "amount_in_inr",
        ]


