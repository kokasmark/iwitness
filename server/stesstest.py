import random as r
import requests
import json

def test(num):
    startId = 51
    url = 'https://iwitness--markkokas.repl.co/'
    for i in range(0,num):
        la = str(r.randint(-90,90))+"."+'{num:0{width}}'.format(num=r.randint(0,9999999), width=6)
        lo = str(r.randint(-180,180))+"."+'{num:0{width}}'.format(num=r.randint(0,9999999), width=6)
        print(la, lo)
        j = "{"+'"title": "{0}", "text": "test", "coordinates": {1}, "createdAt": 0, "author": "0", "id": {2}, "votes": {3}'.format(
            str(startId+i),[float(la),float(lo)],i,[r.randint(0,50),r.randint(0,50)])+"}"
        
        j = json.loads(j)
        print(j, end='\n')
        x = requests.post(url, json = j)
test(50)
