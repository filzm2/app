# PSB-BI. Установка клиентской части в контуре банка

1. ##### Клонируем репозиторий для фронтенда
    https://gitlab.psb.netintel.ru/bi-projects/psb-bi

2. ##### Доработка конфигурационных файлов
    В файле front.conf поменять порт на тот, что используется в банке (сейчас `listen    8080`)

    Также в этом файле для location /ms/ и /api/v1/ поменять поля proxy_pass на IP и порты бэкенда

3. ##### Установка nginx
```bash
 yum install nginx
```

4. ##### Установка зависимостей для фронтенда
```bash
 npm install
```

5. ##### Сборка проекта
```bash
 npm run build
```

6. ##### Перенос собранного проекта и конфигурационного файла. После этого необходимо перезапустить nginx
```bash
 COPY ./dist/psb-bi/ /usr/share/nginx/psb-bi/
 COPY front.conf /etc/nginx/conf.d/front.conf
 systemctl restart nginx

```
