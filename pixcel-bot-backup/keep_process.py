from flask import Flask 
from threading import Thread 
 
app = Flask('')  
@app.route('/') 
def home():     
  return "Status: 200"  
def run():   
  app.run(host='0.0.0.0',port=8080)  
def keep_process():     
  print("Initializing web server.")
  t = Thread(target=run)     
  t.start()