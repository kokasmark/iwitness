import random as r
import requests
import json

def test(num):
    startId = 51
    url = 'https://iwitness--markkokas.repl.co/'
    for i in range(0,num):
        j = "{"+'"title": "{0}", "text": "test", "coordinates": {1}, "createdAt": 0, "author": "0", "id": {2}, "votes": {3}'.format(
            str(startId+i),[r.randint(-90,90),r.randint(-180,180)],i,[r.randint(0,50),r.randint(0,50)])+"}"
        
        j = json.loads(j)
        print(j, end='\n')
        x = requests.post(url, json = j)
test(50)
