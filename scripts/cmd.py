# update database:
# python3 manage.py makemigrations
# python3 manage.py migrate


# manage database:
# python3 manage.py shell

# update installed app
# python3 managy.py collectstatic

from django.core.cache import cache

def clear():
    for key in cache.keys('*'):
        cache.delete(key)

# Query all keys in the current Redis database.
cache.keys('*')

# Query the value of the key "room-1" in the current Redis database.
cache.get('room-1')
