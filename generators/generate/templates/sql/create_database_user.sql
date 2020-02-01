CREATE USER <%= dbUser %> WITH PASSWORD '<%= dbPassword %>';
CREATE DATABASE <%= dbName %>;
GRANT ALL PRIVILEGES ON DATABASE <%= dbName %> to <%= dbUser %>;
