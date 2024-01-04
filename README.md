# split
## What is Split?
Split.Direct is an online platform that allows for people living in shared accommodation to track expenses collaboratively in the cloud for free.

## Introduction
Split is an application intended to allow for the management of shared living spaces. For example,
if you are living with others in shared accommodation, Split allows you to manage expenses, tenants, etc.

## Availability
Split.Direct is available at: **[https://split.direct](https://split.direct)**

Previews of new features are available on the staging environment: **[https://staging.split.direct](https://staging.split.direct)** 

## Licensing
Split.Direct is open source and is licensed under **[GPL-3](https://github.com/jonathan-lee-devel/split/blob/main/LICENSE)**

## What to Do
- [x] Create a Expense to Manage
- [x] Invite Tenants via E-mail
- [x] Create Expenses
- [x] Create Expense Distribution Assignments
- [x] View Monthly Expense Reports
## Create a Expense
Go to the 'New' dropdown menu in the navbar. There you will find the page you use to create a property.
## Invite Tenants
Provide the e-mail address of tenants to invite, if they choose to accept, they will receive notifications.
## Create Expenses
Provide a title, amount, frequency and date for the expense, this will now be included in calculations and reports.
## Create Expense Distribution Assignments
Some expenses are not distributed evenly among tenants, expense distribution assignments allow for expenses
to be split semi-manually. For example, one tenant may owe 600 in rent for having the bigger room, while the
total for rent is 2000 split among 4 tenants.
# Upcoming Features (Feel free to contribute)
* Monthly archives
* Repeating expenses

## Deployment
Split.Direct is fully dockerized and deployed to a Kubernetes cluster hosted in the cloud.

![Architecture Diagram](https://github.com/jonathan-lee-devel/split/blob/main/split-arch.png?raw=true)

## Technologies Used
### MEAN Stack (MongoDB, Express, Angular, Node.js)
<img src="https://www.svgrepo.com/show/331488/mongodb.svg" alt="MongoDB" width="50" />
<img src="https://cdn.worldvectorlogo.com/logos/express-109.svg" alt="Express" width="100" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png" alt="Angular" width="50" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" alt="Node.js" width="50" />

### Kubernetes, Docker, and RabbitMQ
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/1055px-Kubernetes_logo_without_workmark.svg.png" alt="Kubernetes" width="50" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Docker_%28container_engine%29_logo.svg/1280px-Docker_%28container_engine%29_logo.svg.png" alt="Docker" width="150" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/RabbitMQ_logo.svg/2560px-RabbitMQ_logo.svg.png" alt="RabbitMQ" width="150" />

### NgRx & SCSS
<img src="https://ngrx.io/assets/images/badge.svg" alt="NgRx" width="50" />
<img src="https://cdn.worldvectorlogo.com/logos/sass-1.svg" alt="SCSS" width="50" />
