from google.oauth2 import id_token
from google.auth.transport import requests

import requests

url = 'https://blueprogrammer212.github.io/home/comments' 
response = requests.get(url);      

try:
   print("Application ran succesfully.");
   print(response.json())
except ValueError:
   print("An error has occured during execution process.");
   pass;
