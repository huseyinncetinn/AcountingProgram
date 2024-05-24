from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from PIL import Image
from django.contrib import messages
from decimal import Decimal

# Yardımcı fonksiyon: Resim boyutunu küçültme
def resize_image(image_path, output_size=(600, 600)):
    img = Image.open(image_path)
    if img.height > output_size[0] or img.width > output_size[1]:
        img.thumbnail(output_size)
        img.save(image_path)

# Profil Modeli
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profil', null=False, blank=False)
    address = models.CharField(max_length=500, blank=True, null=True)
    phone = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex='^\d{10}$', message='Başında 0 olmadan giriniz...')]
    )
    email = models.EmailField(max_length=50 , blank=True, null=True)
    photo = models.ImageField(blank=True, null=True, default='profile_photos/2024/default.jpg' ,upload_to='profile_photos/%Y/%m/')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_income = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_expense = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unused_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.user.username
    
    def update_balance_for_supplier_payment(self, amount):  # Yapılan ödeme kadar balanceden tedarikçiye ödeme yapar ..
        self.balance -= amount
        self.save()

    def update_balance(self, amount, is_expense=False, is_unused_balance=False, update_total_expense=True):
        if is_expense and not is_unused_balance:
            # Sadece unused_balance'dan gelen expense işlemlerini işle
            return

        if is_expense:
            if update_total_expense:
                self.total_expense += amount
            self.balance -= amount
        else:
            self.balance += amount
            if is_unused_balance:
                self.unused_balance += amount
        self.save()
    def is_unused_balance_enough(self, amount):
        return self.unused_balance >= amount      # müşteriden alınacak ödeme büyük olmamalı , açık provizyondan

    def update_unused_balance(self, amount, is_expense=False):  # İşlem ve ödeme fonksiyonlarına bağlı olarak unused_balance ' günceller
        if is_expense:
            self.unused_balance -= amount
            self.save()
        else:
            self.unused_balance += amount
            self.save()

    def update_income_expense(self, amount, is_income=True):  # Gelir ve gider durumunu günce tutar
        if is_income:
            self.total_income += amount
        else:
            self.total_expense += amount
        self.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.photo:
            resize_image(self.photo.path)

# İlk olarak tahsilat durumu yoksa unused_balance ' a gelecek müşteriden ödeme alındığı zaman unused_balance dan balance a aktarım yapılacak.
# bu durumda balance da olan paradan tedarikçiye ödeme yapılabilecek. ve ödeme yapıldığı zaman balance dan düşecek

# Tedarikçi Modeli
class Supplier(models.Model):
    toWho = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True, related_name='towho')
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500, blank=True, null=True)
    phone = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex='^\d{10}$', message='Başında 0 olmadan giriniz...')]
    )
    photo = models.ImageField(blank=True, null=True, default='profile_photos/2024/default.jpg' ,upload_to='supplier_photos/%Y/%m/')
    email = models.EmailField(unique=True)
    debt = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.photo:
            resize_image(self.photo.path)

    def add_debt(self, amount):  # Kullanıcının tedarikçiye olan borcunu güncel tutar
        self.debt += amount
        self.save()

    def pay_debt(self, amount):  # tedarikçiye olan borcun toplam bordan büyük olmamasını sağlar ve ödeme işlemini yapar
        if amount <= self.debt:
            self.debt -= amount
            self.save()
        else:
            raise ValueError("Ödenen miktar, tedarikçi borcundan büyük olamaz.")

# Müşteri Modeli
class Customer(models.Model):
    fromWho = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True, related_name='fromwho')
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500, blank=True, null=True)
    phone = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex='^\d{10}$', message='Başında 0 olmadan giriniz...')]
    )
    photo = models.ImageField(blank=True, null=True, default='profile_photos/2024/default.jpg' ,upload_to='customer_photos/%Y/%m/')
    email = models.EmailField(unique=True)
    debt = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    no_balance_effect = models.BooleanField(default=False)

    def __str__(self):
        return self.name



    def update_balance(self, amount, is_expense=False):
        # Müşteri bakiyesini güncelleme metodu
        if not is_expense:
            self.debt -= amount  # Gelir (ödeme) yapılırsa borç azalır
            self.save()

    def update_debt(self, amount):
        # Müşteriye olan borcun güncellenmesi
        # if amount <= self.debt:
            self.debt += amount
            self.save()
        # else:
        #     raise ValueError("Ödenen miktar, müşteri borcundan büyük olamaz.")
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.photo:
            resize_image(self.photo.path)

# Ürün Modeli
class Product(models.Model):
    user = models.ForeignKey(Profile, on_delete = models.CASCADE , related_name='urunsahibi')
    productName = models.CharField(max_length = 100)
    stock = models.PositiveIntegerField()
    productImage = models.ImageField(blank = True , null=True , default='profile_photos/2024/default.jpg' ,  upload_to='productImage/%Y/%m/')
    price = models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    
    def __str__(self):
        return self.productName
    
    
    def increase_stock(self, quantity):
        self.stock += quantity
        self.save()

    def decrease_stock(self, quantity):
        if self.stock >= quantity:
            self.stock -= quantity
            self.save()
        else:
            raise ValueError("Stok yetersiz.")
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.productImage:
            resize_image(self.productImage.path)

# İşlem Modeli
class Transaction(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.PositiveIntegerField()
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=10, choices=[("income", "Income"), ("expense", "Expense")], blank=True, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    is_balance = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.user.username} - {self.amount} - {self.transaction_type}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if is_new:
            # transaction_type'a göre amount'u ayarla
            if self.customer is not None:
                self.transaction_type = 'income'  # customer seçildiğinde 'income'
            elif self.supplier is not None:
                self.transaction_type = 'expense'  # supplier seçildiğinde 'expense'

            if self.transaction_type == "income":  # işlem eğer gelir ise
                self.amount = (self.product.price * Decimal(self.quantity)) * Decimal(1.9)
                if self.is_balance:
                    self.user.update_balance(self.amount)
                else:
                    self.user.update_unused_balance(self.amount)
                self.user.update_income_expense(self.amount, is_income=True)
                if self.customer:
                    self.customer.update_debt(self.amount)
                # Alınan ürünü stoklardan düş
                self.product.decrease_stock(self.quantity)
            elif self.transaction_type == "expense":  # eğer işlem gider ise
                self.amount = self.product.price * self.quantity
                self.user.update_balance(self.amount, is_expense=True)
                self.user.update_income_expense(self.amount, is_income=False)
                if self.supplier:
                    self.supplier.add_debt(self.amount)
                    if self.customer:
                        self.customer.update_debt(-self.amount)
                # Satılan ürünü stoklara ekle
                self.product.increase_stock(self.quantity)

            super(Transaction, self).save(*args, **kwargs)


#Ödeme Modeli
class Payment(models.Model):
        payer = models.ForeignKey(Profile, on_delete=models.CASCADE)
        amount = models.DecimalField(max_digits=10, decimal_places=2)
        date = models.DateTimeField(auto_now_add=True)
        description = models.TextField()
        supplier_payment = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True, blank=True)
        customer_payment = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)

        def __str__(self):
            return f"{self.payer.user.username} - {self.amount} - {self.date}"

        def balance_trans(self, amount):
            profile = self.payer

            profile.unused_balance -= amount
            profile.balance += amount
            profile.save()
        
        def update_profile_totals(self):
            profile = self.payer

            if self.customer_payment:
                customer = self.customer_payment
                remaining_debt = customer.debt - self.amount

                customer.update_debt(-self.amount)

                if not customer.no_balance_effect:
                    if remaining_debt >= 0:
                        profile.update_balance(self.amount)
                        customer.no_balance_effect = True
                    else:
                        raise ValueError("Tahsil edilen miktar, müşteri borcundan büyük olamaz.")

                profile.update_unused_balance(self.amount, is_expense=True)

            elif self.supplier_payment:
                supplier = self.supplier_payment
                supplier.pay_debt(self.amount)

                profile.update_balance_for_supplier_payment(self.amount)

            profile.save()


        def save(self, *args, **kwargs):
            super().save(*args, **kwargs)
            self.update_profile_totals()



