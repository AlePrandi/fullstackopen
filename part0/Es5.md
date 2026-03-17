# Exercise 5

:::mermaid
sequenceDiagram
    participant Browser
    participant Server


    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate Server
    Server-->>Browser: return HTML page
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server-->>Browser: return CSS file
    deactivate Server

    note right of Browser: this time the js file is spa.js 

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
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