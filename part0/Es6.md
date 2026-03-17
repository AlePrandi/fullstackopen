# Exercise 6

:::mermaid
sequenceDiagram
    participant Browser
    participant Server


    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate Server
    Server-->>Browser: 201 OK, message "note created"
    deactivate Server

    note right of Browser: this time is only one request and one response instead of five

:::