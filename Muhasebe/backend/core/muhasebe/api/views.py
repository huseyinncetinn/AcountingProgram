from rest_framework import generics ,status
from rest_framework.permissions import IsAuthenticated 
from muhasebe.models import *
from muhasebe.api.serializers import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from muhasebe.api.permissions import *
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class ProfileViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet
):

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated ,OwnProfileOrReadOnly]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

class PorfilePhotoUpdateView(generics.UpdateAPIView):
    serializer_class = ProfilFotoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile_object = self.request.user.profil
        return profile_object

    def get(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.serializer_class(profile)
        return Response(serializer.data)

class SupplierListCreateView(ModelViewSet):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Supplier.objects.filter(toWho=self.request.user.profil)
        # queryset = Supplier.objects.all()
        # username = self.request.query_params.get('username' , None)
        # if username is not None:
        #     queryset = queryset.filter(toWho__user__username = username)
        # return queryset

    def perform_create(self, serializer):
        try:
            user_profile = self.request.user.profil
            serializer.save(toWho=user_profile)
        except :
            raise serializers.ValidationError("Kullanıcının bir profil bilgisi yok.")


class SupplierPhotoUpdateView(generics.UpdateAPIView):
    serializer_class = SupplierPhotoSerializer
    permission_classes = [IsAuthenticated ,IsOwnerOrReadOnlySupplier]

    def get_object(self):
        # İstekten gelen tedarikçi ID'sini al
        supplier_id = self.kwargs.get('pk')  # URL'den gelen ID parametresi

        # İlgili tedarikçiyi bul veya 404 hatası döndür
        supplier = get_object_or_404(Supplier, id=supplier_id)

        return supplier

    def get(self, request, *args, **kwargs):
        instance = self.get_object()  # Güncellenecek tedarikçi örneği

        # Serializer kullanarak tedarikçi fotoğrafını döndür
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()  # Güncellenecek tedarikçi örneği

        # Serializer kullanarak tedarikçi fotoğrafını güncelle
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class CustomerListCreateView(ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Customer.objects.filter(fromWho=self.request.user.profil)

    def perform_create(self, serializer):
        try:
            user_profile = self.request.user.profil
            serializer.save(fromWho=user_profile)
        except :
            raise serializers.ValidationError("Kullanıcının bir profil bilgisi yok.")

class ProductPhotoUpdateView(generics.UpdateAPIView):
    serializer_class = ProductPhotoSerializers
    permission_classes = [IsAuthenticated ,IsOwnerOrReadOnlyProduct]

    def get_object(self):

        product_id = self.kwargs.get('pk')  # URL'den gelen ID parametresi

        product = get_object_or_404(Product, id=product_id)

        return product

    def get(self, request, *args, **kwargs):
        instance = self.get_object()  # Güncellenecek tedarikçi örneği

        # Serializer kullanarak tedarikçi fotoğrafını döndür
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()  # Güncellenecek tedarikçi örneği

        # Serializer kullanarak tedarikçi fotoğrafını güncelle
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

class ProductListCreateView(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(user = self.request.user.profil)


    def perform_create(self, serializer):
        try:
            user_profile = self.request.user.profil
            serializer.save(user = user_profile)
        except :
            raise serializers.ValidationError("Kullanıcının bir profil bilgisi yok.")   

class CustomerPhotoUpdateView(generics.UpdateAPIView):
    serializer_class = CustomerPhotoSerializer
    permission_classes = [IsAuthenticated ,IsOwnerOrReadOnlyCustomer]

    def get_object(self):
        # İstekten gelen müşteri ID'sini al
        customer_id = self.kwargs.get('pk')  # URL'den gelen ID parametresi

        print(customer_id)

        # İlgili müşteri bul veya 404 hatası döndür
        customer = get_object_or_404(Customer, id=customer_id)

        return customer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()  # Güncellenecek customer örneği

        # Serializer kullanarak müşteri fotoğrafını döndür
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()  # Güncellenecek müşteri örneği

        # Serializer kullanarak müşteri fotoğrafını güncelle
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

class IncomeTransactionView(ModelViewSet):
    serializer_class = IncomeTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Sadece 'income' transaction_type'ına sahip işlemleri filtrele
        user_profile = self.request.user.profil
        queryset = Transaction.objects.filter(user=user_profile, transaction_type='income')
        return queryset

    def perform_create(self, serializer):
        user_profile = self.request.user.profil
        serializer.save(user=user_profile)


class ExpenseTransactionView(ModelViewSet):
    serializer_class = ExpenseTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Sadece 'income' transaction_type'ına sahip işlemleri filtrele
        user_profile = self.request.user.profil
        queryset = Transaction.objects.filter(user=user_profile, transaction_type='expense')
        return queryset

    def perform_create(self, serializer):
        user_profile = self.request.user.profil
        serializer.save(user=user_profile)

class TransactionView(ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Sadece 'income' transaction_type'ına sahip işlemleri filtrele
        user_profile = self.request.user.profil
        queryset = Transaction.objects.filter(user=user_profile)
        return queryset


class IncomePaymentView(ModelViewSet):

    serializer_class = IncomePaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.profil
        queryset = Payment.objects.filter(payer=user_profile).exclude(supplier_payment__isnull=False)
        return queryset
    
    def perform_create(self, serializer):
        user_profile = self.request.user.profil
        serializer.save(payer=user_profile)

class ExpensePaymentView(ModelViewSet):

    serializer_class = ExpensePaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.profil
        queryset = Payment.objects.filter(payer=user_profile).exclude(customer_payment__isnull=False)
        return queryset
    
    def perform_create(self, serializer):
        user_profile = self.request.user.profil
        serializer.save(payer=user_profile)


