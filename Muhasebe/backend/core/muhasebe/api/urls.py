from django.urls import path , include
from muhasebe.api.views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user-profile',ProfileViewSet , basename='user-profile')
router.register(r'suppliers',SupplierListCreateView , basename='suppliers')
router.register(r'customers',CustomerListCreateView , basename='customers')
router.register(r'incometransactions',IncomeTransactionView , basename='incometransactions')
router.register(r'expensetransactions',ExpenseTransactionView , basename='expensetransactions')
router.register(r'transactions',TransactionView , basename='transactions')
router.register(r'incomepayment',IncomePaymentView , basename='incomepayment')
router.register(r'expensepayment',ExpensePaymentView , basename='expensepayment')
router.register(r'products',ProductListCreateView , basename='products')

urlpatterns = [
    path('' , include(router.urls)),
    path('profile-photo/' , PorfilePhotoUpdateView.as_view() ,name='profile-photo'),
    path('supplier-photo/<int:pk>/' , SupplierPhotoUpdateView.as_view() , name='supplier-ptoho'),
    path('customer-photo/<int:pk>/' , CustomerPhotoUpdateView.as_view() , name='customer-ptoho'),
    path('product-photo/<int:pk>/' , ProductPhotoUpdateView.as_view() , name='product-ptoho'),
]   