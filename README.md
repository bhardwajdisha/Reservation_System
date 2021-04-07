# Flight Reservation System
### Overview
The flight reservation system is a web platform that provides the facility to search and book tickets online. It helps to manage the ticket booking records as well as the booking records and the details of the customers going to travel.

This project is following microservice-architecture and build with the help of NodeJs
### Booking process

A customer can view all the available flights. Customers can search the flight according to the source and destination. Customers can book a ticket after login into the application, for the first-time customer have to register in the system. 
### Tools and Technology
- *Front-End*  Html, CSS, JS.
- *Back-end:* NodeJs ExpressJs.
- *Database* MongoDB.

### Steps to run the backend server

#### Gateway
- Navigate to Gateway folder inside the project using cd command
- Run `npm install`
- Run `npm start`

#### Load Balancer
- Navigate to India folder inside the project using cd command
- Run `npm install`
- Run `npm start`

#### Microservices
- Navigate to Delhi and Kolkata folder inside the project using cd command
- Run `npm install`
- Run `npm start`

### Microservice Endpoint Details

#### GET `/flights`

#### GET `/flight/:id`

#### POST `/flight/add`

#### POST `/login`

#### POST `/signup`

#### GET `/logout`

#### POST `/reset-password`

#### POST `/new-password`

#### POST `/reserve/:id`

#### GET `/userDetails`

### Architecture Diagram
