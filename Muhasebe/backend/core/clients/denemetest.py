import requests
from pprint import pprint

def get_auth_token(email, password):
    # Kullanıcı girişi için istek gönder
    credentials = {
        'email': "	deneme3@dsadas.co",
        'password': "123456.."
    }
    response = requests.post(
        url='http://127.0.0.1:8000/dj-rest-auth/login/',
        data=credentials
    )
    data = response.json()
    if 'key' in data:
        return data['key']
    else:
        return None

def get_user_profile(token):
    # Token ile kullanıcı profili endpoint'ine erişim
    headers = {'Authorization': f'Token {token}'}
    response = requests.get(
        url='http://127.0.0.1:8000/api/user-profile/',
        headers=headers
    )
    return response.json()

if __name__ == '__main__':
    # Kullanıcı giriş bilgileri (e-posta ile giriş yapacak)
    email = 'test@test.com'  # Kullanıcının e-posta adresi
    password = 'şifre'  # Kullanıcının şifresi

    # Kullanıcı girişi yaparak token al
    auth_token = get_auth_token(email, password)
    if auth_token:
        print(f"Token alındı: {auth_token}")

        # Token ile kullanıcı profili bilgilerini al
        profile_data = get_user_profile(auth_token)
        pprint(profile_data)
    else:
        print("Giriş başarısız. Lütfen e-posta adresi ve şifrenizi kontrol edin.")
