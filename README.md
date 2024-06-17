# DealsDepot

Online deals and product sharing service based on Express and Angular.
This project contains a back-end server and a front-end.

## Functionalities

- JWT-based authentication & authorization
- User accounts
- Article posting & browsing, with associated titles, tags, contents, and links
- Article search queries with filtering & sorting options
- Selection of the most popular articles on the home page
- Evaluation system based on public votes
- Article categorization through tags
- Responsive UI

## Installation

1. Install MongoDB and NodeJS
2. Clone the repo: `git clone https://github.com/ali-bennezia/dealsdepot`
3. Add a .env configuration file to src/app
4. To this file, add the properties: PORT, DB_URL and SECRET_KEY
5. If you wish, change the configured front-end URL within the src/ui/src/environmnets/\*.ts configuration files

## Usage

1. To Launch developpement: `npm run dev` in the /src/app directory and `ng serve --o` in the /src/ui directory
2. To launch production: `npm start` in the /src/app and `ng build` in the /src/ui directory. Setup the resulting files in a web server.

## Gallery

![Cap1](/docs/cap1.png)
![Cap2](/docs/cap2.png)
![Cap3](/docs/cap3.png)
![Cap4](/docs/cap4.png)
![Cap5](/docs/cap5.png)
![Cap6](/docs/cap6.png)
