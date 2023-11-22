import random as r

def test(num):
    startId = len(open('data.txt','r').readlines())
    with open('data.txt','a') as f:
        for i in range(0,num):
            json = "{"+'"title": "{0}", "text": "test", "coordinates": {1}, "createdAt": 0, "author": "0", "id": {2}, "votes": {3}'.format(
                str(startId+i),[r.randint(-90,90),r.randint(-180,180)],i,[r.randint(0,50),r.randint(0,50)])+"}"
            f.write(json+"\n")
test(50)
