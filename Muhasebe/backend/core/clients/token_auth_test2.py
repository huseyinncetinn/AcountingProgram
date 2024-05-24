import requests
from pprint import pprint

#{'key': '27ea18a2084f1f075e5c2b68d17766fda6438cef'}

def client():
    token = 'Token d5d9575b770d5feedf22141cbbfa35946ce4980b'
    headers = {
        'Authorization' : token
    }
    response = requests.get(
        url='http://127.0.0.1:8000/api/users-profiles/',
        headers= headers
    )

    print('Status Code:' , response.status_code)

    response_data = response.json()
    pprint(response_data)

if __name__ == '__main__':
    client()