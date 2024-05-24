import requests
from pprint import pprint

#{'key': '27ea18a2084f1f075e5c2b68d17766fda6438cef'}

def client():
    credentials = {
        'email' : 'cetinhuseyin60@gmail.com', 
        'password' : '6963024..'
    }

    response = requests.post(
        url='http://127.0.0.1:8000/dj-rest-auth/login/',
        data=credentials
    )

    print('Status Code:' , response.status_code)

    response_data = response.json()
    pprint(response_data)

if __name__ == '__main__':
    client()