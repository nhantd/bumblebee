import subprocess
import re
import requests
import urllib
import httplib

HOST="http://localhost:1232/"


data1={}
data1['episode_id']=1
data1['film_key']='bigbang theory'
data1['language']= 'English'
data1['is_available']= True
data1['url']= 'http:bb/1'
r = requests.post(HOST+"sub/create", data=data1)
print(r.text)

data1={}
data1['episode_id']=1
data1['film_key']='bigbang theory'
data1['language']= 'Russia'
data1['is_available']= True
data1['url']= 'http:bb/1'
r = requests.post(HOST+"sub/create", data=data1)
print(r.text)

data1={}
data1['episode_id']=1
data1['film_key']='bigbang theory'
data1['language']= 'Danish'
data1['is_available']= True
data1['url']= 'http:bb/1'
r = requests.post(HOST+"sub/create", data=data1)
print(r.text)

data1={}
data1['episode_id']=2
data1['film_key']='bigbang theory'
data1['language']= 'English'
data1['is_available']= True
data1['url']= 'http:bb/1'
r = requests.post(HOST+"sub/create", data=data1)
print(r.text)

data1={}
data1['episode_id']=2
data1['film_key']='bigbang theory'
data1['language']= 'English'
data1['is_available']= True
data1['url']= 'http:bb/2'
r = requests.post(HOST+"sub/update", data=data1)
print(r.text)

data1={}
data1['episode_id']=2
data1['film_key']='bigbang theory'
data1['language']= 'English'
data1['is_available']= True
data1['url']= 'http:bb/2'
r = requests.post(HOST+"sub/remove", data=data1)
print(r.text)

data1={}
data1['episode_id']=2
data1['film_key']='bigbang theory'
data1['language']= 'English'
data1['is_available']= True
data1['url']= 'http:bb/2'
r = requests.post(HOST+"sub/create", data=data1)
print(r.text)


data1={}
data1['episode_id']=2
data1['film_key']='bigbang theory'
data1['language']= 'English'
data1['is_available']= True
data1['url']= 'http:bb/555'
r = requests.post(HOST+"sub/update", data=data1)
print(r.text)

data1={}
data1['episode_id']=2
data1['film_key']='bigbang theory'
data1['language']= 'English'

r = requests.post(HOST+"sub/get", data=data1)
print(r.text)