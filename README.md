# SchulPlattform

This is an open source web-based software solution to manage school information, this are the main features.

- Storage of grades
- Elections
- Generation of reports

It uses MySQL as database and MEAN stack where the M stands for MySQL.

### Preview
![Login page](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%201.png)

![Profile view](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%202.png)

![The entire platform is responsive](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%202b.png)

![Reports table](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%203.png)

![Reports graphs](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%203b.png)
You can download a blank PDF with that data

![Elections](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%204.png)
Depending on your profile level, you can set up a survey with a start and due date

![Management](https://github.com/carepollo/Schulplattform/blob/master/assets/Screenshot%205.png)
Admins only create or modify data from other users.

### Deployment

There is a few steps you must do to deploy this app.

1. First of all you must have installed [Angular CLI](https://angular.io/), [NodeJS](https://nodejs.org/en/) and MySQL in your machine.
2. In your local MySQL run the database.sql, departamentos.sql, municipios.sql (in that order) scripts stored in *server/sql*
3. Open one terminal in *server* and run `npm run launch`
4. Open another terminal in *client* and run `ng serve`
5. From the browser go to localhost:4200 and that's it.
