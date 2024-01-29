npx sequelize-cli migration:generate --name migration-skeleton

npx sequelize-cli db:migrate

npx sequelize-cli db:migrate:undo

npx sequelize-cli seed:generate --name demo-user

npx sequelize-cli db:seed:all

npx sequelize-cli db:seed:undo