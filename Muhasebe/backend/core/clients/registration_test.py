import requests
from pprint import pprint



def client():
    credentials = {
        'username' : 'deneme2',
        'email' : 'test@test2.co',
        'password1' : '6963024..',
        'password2' : '6963024..',

    }

    response = requests.post(
        url='http://127.0.0.1:8000/dj-rest-auth/registration/',
        data= credentials
    )

    print('Status Code:' , response.status_code)

    response_data = response.json()
    pprint(response_data)

if __name__ == '__main__':
    client()