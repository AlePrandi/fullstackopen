# Exercise 4

:::mermaid
sequenceDiagram
    participant Browser
    participant Server

    note right of Browser: The first operation is a POST because the page was already loaded

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate Server
    Server-->>Browser: 302 Not found
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate Server
    Server-->>Browser: return HTML page 
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server-->>Browser: return CSS file
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate Server
    Server-->>Browser: return Javascript file
    deactivate Server

    note right of Browser: The browser start running the Javascript file
    note right of Browser: The Javascript file fetches the JSON data

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server-->>Browser: return the JSON file
    deactivate Server 

:::