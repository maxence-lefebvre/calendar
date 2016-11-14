# Calendar
Add events to outlook calendars from csv file

## Views

- login redirects to outlook oAuth2 canal then redirects to /calendarEvents.
- index submits file given in input through AJAX which is processed. All events are pushed to outlook calendar

## Developing

Installs npm & bower dependencies
Starts server

```
npm run install:dev
npm run dev
```

## Production

Installs npm prod dependencies and bower assets
Starts server through *forever* (app uid : **outlook**)

``` 
npm run install:prod
npm start
```

## Todo

- Add logger
- Add build task
- Comment & document
- Handle AJAX return line by line
- Add toastr
- Delete cookies and use localStorage 
