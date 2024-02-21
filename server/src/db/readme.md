NEW SERVER
////////// 0. Ensure you have the correct programs installed (psql and so on).

1. create the db
2. store the connection credentials in the .env file
3. run a test migration (create a new table, add a column), run the down to remove the result

NEW MIGRATIONS (ON AN ALREADY CONFIGURED SERVER)
////////////// 0. Ensure you have correct perms, that you are in the project root folder, and that there is a .env file with the value set: DATABASE_URL=postgresql://localhost:5432/databasename?user=yourdbusername&password=yourpassword" .

1. "db-migrate create initialize --sql-file"
2. Edit the generated files, placing your up and down sql queries in the correct locations. Make sure the files are in the [projectRoot]/server/migrations/sqls/ folder.
3. "npm run migration-up"

Syntax guidance for running new migrations can be found in the history folder located at [projectRoot]/server/migrations/sqls/history .

INSTALLING A DATABASE
///////////////////// 0. Ensure you have correct perms and updated tools (homebrew, terminal perms).

1. brew services start postgresql (brew services stop postgresql)
2. create a root user

   1. pslq postgres
   2. \du (list users)
   3. create user rootuser with login password 'somepassword'; (don't use caps)
   4. ALTER ROLE rootuser CREATEDB;
   5. \q (exit)

3. create the database
   1. psql postgres -U rootuser
   2. \l (list databases)
   3. createdb scraper
   4. \c scraper (connect to database as long as your active postgres user has perms)
   5. \dt (list tables)
4. Save connection details to correct server env variables.
5. make sure firewall is closed in correct places, open in correct places (cicd pipline, server code)
