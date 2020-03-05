# CLI Employee Tracker

A node based CLI app to help you keep track of your employees.

### Features

- Easy CLI prompts help you add, update, and remove employees
- Lightweight reports help you view your employee data
- Quickly calculate the budget (in salaries) for a specific department
- See who reports to a specific manager
- See who is in a specific role or department

### Usage

This lightweight app requires node and a local mySQL database. Follow these steps to get started:

1. Clone this repository to your local machine with `git clone https://github.com/cynthiarich/employee-tracker.git`
1. Install the necessary dependencies with `npm install`
1. Set up a local database to store your employee's data using the [/db/schema.sql](/db/schema.sql). [Seed files](/db/seeds.sql) are also provided if you'd like to try out the app with test data
1. Use `node app.js` to launch the app
1. Follow the prompts to add, update, remove, and view your employee data

### See it in action

![employee-tracker-demo](https://user-images.githubusercontent.com/15653252/75947094-2bf2cc80-5e6d-11ea-9ffd-ed6a879b87de.gif)
