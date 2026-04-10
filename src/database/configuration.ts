export default () => ({
    portBackend: + process.env.PORT_BACKEND,
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      esquema: process.env.DATABASE_ESQUEMA,
      databaseType: process.env.DATABASE_TYPE
    },
    codigoSociedad: process.env.CODIGO_SOCIEDAD,
    jwtSecret: process.env.JWT_SECRET,
    securityKey: process.env.SECURITY_KEY,
    host_backend: process.env.HOST_BACKEND,
    production: process.env.PRODUCTION,
    proxy_database: {
      host: process.env.HOST_DATABASE,
      token: process.env.TOKEN_DATABASE,
      enable: process.env.PROXY_ENABLE
    },
    sms: process.env.SMS
});


