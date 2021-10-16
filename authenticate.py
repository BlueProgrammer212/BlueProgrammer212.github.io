from google.oauth2 import id_token
from google.auth.transport import requests

import requests, json

from requests.api import head;

header = {}
url = 'https://blueprogrammer212.github.io/home/comments' 
response = requests.get(url = url, headers=header, data=json.dumps({}));      

print("Application ran succesfully.");
print(response.json())

process : bool = True;

while(process):
    pass;