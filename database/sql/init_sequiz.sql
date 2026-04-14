CREATE DATABASE IF NOT EXISTS sequiz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'sequiz_user'@'localhost'
IDENTIFIED BY 'Shes_electric';

GRANT ALL PRIVILEGES ON sequiz.* TO 'sequiz_user'@'localhost';

FLUSH PRIVILEGES;
