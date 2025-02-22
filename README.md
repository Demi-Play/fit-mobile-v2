# fit-mobile-v2


 # для применения миграций token_blacklist
 ```bash
python manage.py migrate 
``` 

# запускаем сервер на всех интерфейсах
```bash 
python manage.py runserver 0.0.0.0:8000  
``` 
<!-- Для сборки мобильного приложения -->

# для сборки мобильного приложения
```bash
cd mobile-new-app
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

