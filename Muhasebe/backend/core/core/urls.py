from django.contrib import admin
from django.urls import path , include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth' , include('rest_framework.urls')), # api sayfasındaki login logout butonu için
    path('dj-rest-auth/', include('dj_rest_auth.urls')), # rest-auth ile ilgili endpointlerimiz için
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/' , include('muhasebe.api.urls'))
]


from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG == True :
    urlpatterns += static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)
