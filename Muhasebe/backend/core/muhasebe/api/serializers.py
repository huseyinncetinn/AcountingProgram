from muhasebe.models import *
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    photo = serializers.ImageField(read_only=True)
    balance = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    total_income = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    total_expense = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    unused_balance = serializers.DecimalField(read_only=True,max_digits=10, decimal_places=2, default=0)


    class Meta:
        model = Profile
        fields = '__all__'

class ProfilFotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['photo']

class SupplierSerializer(serializers.ModelSerializer):
    debt = serializers.DecimalField(read_only = True,max_digits=10, decimal_places=2, default=0)
    photo = serializers.ImageField(read_only=True)

    class Meta:
        model = Supplier
        fields = ['id','name','address','phone','email','photo','debt']

    def create(self, validated_data):
        request_user_profile = self.context['request'].user.profil  # 'profil' related_name'ini kullanarak profile erişiyoruz
        validated_data['toWho'] = request_user_profile
        return super().create(validated_data)
    
class SupplierPhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = ['photo']

class CustomerSerializer(serializers.ModelSerializer):
    debt = serializers.DecimalField(read_only = True,max_digits=10, decimal_places=2, default=0)
    photo = serializers.ImageField(read_only=True)
    class Meta:
        model = Customer
        fields = ['id','name','address','phone','email','photo','debt']
    
    def create(self, validated_data):
        request_user_profile = self.context['request'].user.profil  # 'profil' related_name'ini kullanarak profile erişiyoruz
        validated_data['fromWho'] = request_user_profile
        return super().create(validated_data)
    
class CustomerPhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ['photo']

class ProductSerializer(serializers.ModelSerializer):
    productImage = serializers.ImageField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'productImage', 'productName', 'stock', 'price']  
        
    def create(self, validated_data):
        request_user_profile = self.context['request'].user.profil
        validated_data['user'] = request_user_profile
        return super().create(validated_data)

class ProductPhotoSerializers(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['productImage']


class IncomeTransactionSerializer(serializers.ModelSerializer):

    amount = serializers.DecimalField(read_only = True,max_digits=10, decimal_places=2)
    date = serializers.DateTimeField (read_only = True)
    transaction_type = serializers.CharField(read_only =True)
    product_id = serializers.ReadOnlyField(source='product.id')
    customer_id = serializers.ReadOnlyField(source='customer.id')

    class Meta:
        model = Transaction
        fields = ['id' ,'quantity' , 'description' , 'customer' , 'customer_id' , 'product' , 'product_id' , 'amount' , 'date' , 'transaction_type']
    

    def __init__(self, *args, **kwargs):
        super(IncomeTransactionSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user:
            # Kullanıcının sahip olduğu ürünleri filtrele
            self.fields['product'].queryset = Product.objects.filter(user=request.user.profil)
            self.fields['customer'].queryset = Customer.objects.filter(fromWho=request.user.profil)
    def to_representation(self, instance):
        rep = super(IncomeTransactionSerializer, self).to_representation(instance)
        if instance.customer:
            rep['customer'] = instance.customer.name
        else:
            rep['customer'] = None  # veya boş bir değer

        if instance.product:
            rep['product'] = instance.product.productName
        else:
            rep['product'] = None  # veya boş bir değer
            
        return rep

class ExpenseTransactionSerializer(serializers.ModelSerializer):

    amount = serializers.DecimalField(read_only = True,max_digits=10, decimal_places=2)
    date = serializers.DateTimeField (read_only = True)
    transaction_type = serializers.CharField(read_only =True)
    product_id = serializers.ReadOnlyField(source='product.id')
    supplier_id = serializers.ReadOnlyField(source='supplier.id')



    class Meta:
        model = Transaction
        fields = ['id' ,'quantity' , 'description' , 'supplier', 'supplier_id' , 'product' , 'product_id' , 'amount' , 'date' , 'transaction_type']
    

    def __init__(self, *args, **kwargs):
        super(ExpenseTransactionSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user:
            # Kullanıcının sahip olduğu ürünleri filtrele
            self.fields['product'].queryset = Product.objects.filter(user=request.user.profil)
            self.fields['supplier'].queryset = Supplier.objects.filter(toWho=request.user.profil)
    def to_representation(self, instance):
        rep = super(ExpenseTransactionSerializer, self).to_representation(instance)
        rep['supplier'] = instance.supplier.name
        rep['product'] = instance.product.productName
        return rep
            
class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(TransactionSerializer, self).to_representation(instance)
        rep['supplier'] = instance.supplier.name if instance.supplier else None
        rep['customer'] = instance.customer.name if instance.customer else None
        rep['product'] = instance.product.productName

        return rep

class IncomePaymentSerializer(serializers.ModelSerializer):
    
    date = serializers.DateTimeField (read_only = True)
    customer_id = serializers.ReadOnlyField(source='customer_payment.id')


    class Meta:
        model = Payment
        fields = ['id' , 'amount' , 'date' , 'description' , 'customer_payment','customer_id']

    def __init__(self, *args, **kwargs):
        super(IncomePaymentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user:
            self.fields['customer_payment'].queryset = Customer.objects.filter(fromWho=request.user.profil)

    def to_representation(self, instance):
        rep = super(IncomePaymentSerializer, self).to_representation(instance)
        if instance.customer_payment:
            rep['customer_payment'] = instance.customer_payment.name
        return rep
    
class ExpensePaymentSerializer(serializers.ModelSerializer):

    date =serializers.DateTimeField(read_only = True)
    supplier_id = serializers.ReadOnlyField(source = 'supplier_payment.id')

    class Meta:
        model = Payment
        fields = ['id' , 'amount' , 'date' , 'description' , 'supplier_payment' , 'supplier_id']

    def __init__(self, *args, **kwargs):
        super(ExpensePaymentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.user:
            self.fields['supplier_payment'].queryset = Supplier.objects.filter(toWho=request.user.profil)
    def to_representation(self, instance):
        rep = super(ExpensePaymentSerializer, self).to_representation(instance)
        if instance.supplier_payment:
            rep['supplier_payment'] = instance.supplier_payment.name
        return rep






