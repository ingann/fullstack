Exercise 0.4 Sequence Diagram for when a user submits a new note on the page
```mermaid
sequenceDiagram
participant browser
participant server

browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
activate server
server-->browser: redirect request
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
activate server
server-->browser: HTML document
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate server
server-->browser: the css file
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
activate server
server-->browser: the javascript file
deactivate server

Note right of browser: The browser starts executing the Javascript code that fetches the JSON from the server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate server
server-->browser: [{"content": "", "date": "2023-12-29T18:17:56.142Z"}, ...]
deactivate server

Note right of browser: The browser executes the callback function that renders the notes
```

Exercise 0.5 Sequence diagram for when a user goes to the example app page in a browser (spa-version)
```mermaid
sequenceDiagram
participant browser
participant server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
activate server
server-->browser: HTML document
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate server
server-->browser: the css file
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
activate server
server-->browser: the javascript file
deactivate server

Note right of browser: The browser starts executing the Javascript code that fetches the JSON from the server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate server
server-->browser: [{"content": "", "date": "2023-12-29T18:17:56.354Z"}, ...]
deactivate server

Note right of browser: The browser executes the callback function that renders the notes
```
Exercise 0.6 Sequence diagram for when a user submits a new note on the page (spa-version)
```mermaid
sequenceDiagram
participant browser
participant server

browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
activate server
server-->browser: {"content": "", "date": "2023-12-29T23:06:15.005Z"} (statuscode 201 (created))
deactivate server
```
Clarifying the last exercise: the javascript file in the browser registers an event handler to handle a situation where the form is submitted. This code prevents refreshing the page and instead creates a new note as a JSON string which is sent to the server. That is why the browser only sends one request to the server (POST-request to submitting a new note without refreshing the page).  
