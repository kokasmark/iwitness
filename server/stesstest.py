import random as r
import requests
import json

def test():
    coords =  [
    [41.0082, 28.9784],   # Istanbul, Turkey
    [35.6895, 139.6917],  # Tokyo, Japan
    [31.5497, 74.3436],   # Lahore, Pakistan
    [28.6139, 77.2090],   # New Delhi, India
    [6.5244, 3.3792],     # Lagos, Nigeria
    [12.9716, 77.5946],   # Bangalore, India
    [37.7749, -122.4194], # San Francisco, United States
    [31.9686, -99.9018],  # Dallas, United States
    [34.0522, -118.2437], # Los Angeles, United States
    [23.8103, 90.4125],   # Dhaka, Bangladesh
    [19.4326, -99.1332],  # Mexico City, Mexico
    [41.8781, -87.6298],  # Chicago, United States
    [51.5074, -0.1278],   # London, United Kingdom
    [48.8566, 2.3522],    # Paris, France
    [55.7558, 37.6176],   # Moscow, Russia
    [40.7128, -74.0060],  # New York City, United States
    [37.5665, 126.9780],  # Seoul, South Korea
    [23.6345, -102.5528], # Aguascalientes, Mexico
    [35.6894, 51.3498],   # Tehran, Iran
    [32.7157, -117.1611], # San Diego, United States
    [23.8103, 90.4125],   # Dhaka, Bangladesh
    [23.8103, 90.4125],   # Dhaka, Bangladesh
    [6.5244, 3.3792],     # Lagos, Nigeria
    [39.9042, 116.4074],  # Beijing, China
    [37.7749, -122.4194], # San Francisco, United States
    [34.0522, -118.2437], # Los Angeles, United States
    [40.7128, -74.0060],  # New York City, United States
    [55.7558, 37.6176],   # Moscow, Russia
    [12.9716, 77.5946],   # Bangalore, India
    [23.6345, -102.5528], # Aguascalientes, Mexico
    [19.4326, -99.1332],  # Mexico City, Mexico
    [31.9686, -99.9018],  # Dallas, United States
    [41.8781, -87.6298],  # Chicago, United States
    [28.6139, 77.2090],   # New Delhi, India
    [35.6895, 139.6917],  # Tokyo, Japan
    [51.5074, -0.1278],   # London, United Kingdom
    [48.8566, 2.3522],    # Paris, France
    [31.5497, 74.3436],   # Lahore, Pakistan
    [32.7157, -117.1611], # San Diego, United States
    [37.5665, 126.9780],  # Seoul, South Korea
    [34.0522, -118.2437], # Los Angeles, United States
    [55.7558, 37.6176],   # Moscow, Russia
    [40.7128, -74.0060],  # New York City, United States
    [37.7749, -122.4194], # San Francisco, United States
]

    startId = 1
    url = 'https://iwitness--markkokas.repl.co/'
    for i in range(0,len(coords)):
        la = coords[i][1]
        lo = coords[i][0]
        print(la, lo)
        j = "{"+'"title": "{0}", "text": "test", "coordinates": {1}, "createdAt": 0, "author": "0", "id": {2}, "votes": {3}'.format(
            str(startId+i),[float(la),float(lo)],i,[r.randint(0,50),r.randint(0,50)])+"}"
        
        j = json.loads(j)
        print(j, end='\n')
        x = requests.post(url, json = j)
test()
