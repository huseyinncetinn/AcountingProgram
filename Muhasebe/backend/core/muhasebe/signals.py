from django.contrib.auth.models import User
from muhasebe.models import *
from django.db.models.signals import post_save ,post_delete
from django.dispatch import receiver

@receiver(post_save , sender = User)
def create_profile(sender , instance , created , **kwargs):
    print(instance.username , '_____Created :' , created)
    if created:
        Profile.objects.create(user = instance)


@receiver(post_delete, sender=Payment)
def revert_profile_totals_on_delete(sender, instance, **kwargs):
    profile = instance.payer

    if instance.customer_payment:
        customer = instance.customer_payment
        remaining_debt = customer.debt + instance.amount

        customer.update_debt(instance.amount)

        if not customer.no_balance_effect:
            if remaining_debt >= 0:
                profile.update_balance(-instance.amount)
                customer.no_balance_effect = False
            else:
                raise ValueError("Tahsil edilen miktar, müşteri borcundan büyük olamaz.")

        profile.update_unused_balance(instance.amount, is_expense=False)

    elif instance.supplier_payment:
        supplier = instance.supplier_payment
        supplier.add_debt(instance.amount)

        profile.update_balance_for_supplier_payment(-instance.amount)

    profile.save()

def revert_transaction_effects(sender, instance, **kwargs):
    if instance.transaction_type == 'income':
        if instance.is_balance:
            instance.user.update_balance(-instance.amount)
        else:
            instance.user.update_unused_balance(-instance.amount)
        instance.user.update_income_expense(-instance.amount, is_income=True)
        if instance.customer:
            instance.customer.update_debt(-instance.amount)
        instance.product.increase_stock(instance.quantity)
    elif instance.transaction_type == 'expense':
        instance.user.update_balance(-instance.amount, is_expense=True)
        instance.user.update_income_expense(-instance.amount, is_income=False)
        if instance.supplier:
            instance.supplier.add_debt(-instance.amount)
            if instance.customer:
                instance.customer.update_debt(instance.amount)
        instance.product.decrease_stock(instance.quantity)

@receiver(post_delete, sender=Transaction)
def revert_transaction_effects(sender, instance, **kwargs):
    if instance.transaction_type == 'income':
        if instance.is_balance:
            instance.user.update_balance(-instance.amount)
        else:
            instance.user.update_unused_balance(-instance.amount)
        instance.user.update_income_expense(-instance.amount, is_income=True)
        if instance.customer:
            instance.customer.update_debt(-instance.amount)
        instance.product.increase_stock(instance.quantity)
    elif instance.transaction_type == 'expense':
        instance.user.update_balance(-instance.amount, is_expense=True)
        instance.user.update_income_expense(-instance.amount, is_income=False)
        if instance.supplier:
            instance.supplier.add_debt(-instance.amount)
            if instance.customer:
                instance.customer.update_debt(instance.amount)
        instance.product.decrease_stock(instance.quantity)