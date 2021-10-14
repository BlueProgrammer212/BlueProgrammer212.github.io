from google.oauth2 import id_token
from google.auth.transport import requests

import requests

url = 'https://blueprogrammer212.github.io/home/comments' 
response = requests.get(url)        # To execute get request 
print(response.status_code)     # To print http response code  
print(response.text)     

try:
   print("Getting tortured by a Python snake")
except ValueError:
    # Invalid token
    pass
