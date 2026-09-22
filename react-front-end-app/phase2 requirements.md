Front End: React Components (JSX)	
Modern React with functional components and hooks
Proper HTML document structure when transpiled for browser
Use of semantic elements (header, main, footer, nav, section, etc.)
React Router to manage URL paths from user perspective
Alt text on image elements for accessibility
Event handlers
At least 6 distinct components (3+ single-use and 3+ reusable)
Parent & child components with props and/or context for passing data
State changes based on user interaction
Conditional rendering with state
Forms with various input types
Validation on form input fields with user feedback in the UI
Async fetching for HTTP requests to endpoints defined in Java app
C - At least one POST request to save new data
R - At least one GET request to retrieve data
U - At least one PUT request to update existing data
D - At least one DELETE request to remove data
OPTIONAL: Additional data fetched from a public API
OPTIONAL: Auth (register, login, logout) with alternate views
	
Front End: CSS	
External stylesheet(s) or use of TailwindCSS, styled-components, etc.
Consistent color scheme and typography
Flexbox and/or Grid used for layout
Media queries for responsiveness (at least 2 breakpoints)
Custom nav menu styling
Hover effects
Simple animations
	
Back End: Java/Spring Boot App & Database	
At least two entity models with object-relational mapping (ORM)
At least one JPA data repository
At least one REST controller
Clearly defined endpoints for each controller method
C - At least one method to handle a POST request 
R - At least one method to handle a GET request
U - At least one method to handle a PUT request
D - At least one method to handle a DELETE request
OPTIONAL: Auth (register, login, logout) with at least one role
OPTIONAL: SQL script for initial creation and population of database
	
Clean code	
Indentation
Proper naming conventions
Concise logic with modern syntax
Well-organized file structure
No extraneous code or boilerplate content
Brief comments in code to document key parts
No console.log() or System.out.println() statements
No JS alerts in browser
DRY (Don’t Repeat Yourself)
	
Testing & Debugging	
Manual testing efforts (describe to the right)
Debugging efforts (describe to the right)
Everything in the browser must be functional
No runtime errors or 404 pages
OPTIONAL: Jest testing in React app
OPTIONAL: JUnit testing in Java/Spring app
	
Version Control with Git	
Frequent commits (at least 50) with meaningfully concise descriptions 
Branching with PRs/merges to main (no development in main)
	
README.md File	
A paragraph-long description (elevator pitch) of your project
A list of the technologies used
Installation steps for someone else to run your project locally
Wireframes (link or embedded images if readable at that scale)
ER Diagram (link or embedded images if readable at that scale)
Descriptions of any unsolved problems or future features

Database:

Create DB tables for events and RSVPs with the following structure:
### Events Table
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for each event |
| title       | TEXT      | Title of the event |
| description | TEXT      | Description of the event |
| date        | DATE      | Date of the event |
| location    | TEXT      | Location of the event |

### RSVPs Table
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for each RSVP |
| user_id     | INTEGER   | ID of the user who RSVP'd |
| event_id    | INTEGER   | ID of the event they RSVP'd for |
| status      | TEXT      | Status of the RSVP (e.g., attending, not attending) |

user profile table with the following structure:
### User Profile Table
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for each user |
| name        | TEXT      | Name of the user |
| email       | TEXT      | Email address of the user |
| phone       | TEXT      | Phone number of the user |

user authentication table with the following structure:
### User Authentication Table
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for each user |
| email       | TEXT      | Email address of the user |
| password    | TEXT      | Password for the user's account |   

User roles table with the following structure:
### User Roles Table
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for each role |
| name        | TEXT      | Name of the role |
| description | TEXT      | Description of the role |

user authorization table with the following structure:
### User Authorization Table
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| id          | INTEGER   | Unique identifier for each authorization |
| user_id     | INTEGER   | ID of the user being authorized |
| role_id     | INTEGER   | ID of the role being granted |

APIs:
Add the following APIs to manage events, RSVPs, user profiles, authentication, roles, and authorization:
### Events API      
| Endpoint | Method | Description |
|----------|--------|-------------| 
| /events  | GET    | Retrieve a list of all events |
| /events  | POST   | Create a new event |  
| /events/{id} | GET | Retrieve details of a specific event |
| /events/{id} | PUT | Update details of a specific event |
| /events/{id} | DELETE | Delete a specific event |
### RSVPs API
| Endpoint | Method | Description |
|----------|--------|-------------| 
| /rsvps  | GET    | Retrieve a list of all RSVPs |
| /rsvps  | POST   | Create a new RSVP |
| /rsvps/{id} | GET | Retrieve details of a specific RSVP |
| /rsvps/{id} | PUT | Update details of a specific RSVP |
| /rsvps/{id} | DELETE | Delete a specific RSVP |
### User Profiles API
| Endpoint | Method | Description |
|----------|--------|-------------|

| /users  | GET    | Retrieve a list of all user profiles |
| /users  | POST   | Create a new user profile |    
| /users/{id} | GET | Retrieve details of a specific user profile |
| /users/{id} | PUT | Update details of a specific user profile |
| /users/{id} | DELETE | Delete a specific user profile |
### User Authentication API
| Endpoint | Method | Description |
|----------|--------|-------------|

| /auth/login  | POST   | Authenticate a user and return a token |
| /auth/register  | POST   | Register a new user and return a token |
### User Roles API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /roles  | GET    | Retrieve a list of all user roles |
| /roles  | POST   | Create a new user role |
| /roles/{id} | GET | Retrieve details of a specific user role |
| /roles/{id} | PUT | Update details of a specific user role |
| /roles/{id} | DELETE | Delete a specific user role |
### User Authorization API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /authorization  | GET    | Retrieve a list of all user authorizations |
| /authorization  | POST   | Create a new user authorization |
| /authorization/{id} | GET | Retrieve details of a specific user authorization |
| /authorization/{id} | PUT | Update details of a specific user authorization |
| /authorization/{id} | DELETE | Delete a specific user authorization | 


