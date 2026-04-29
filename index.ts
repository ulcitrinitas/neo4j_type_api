const neo4j = require("neo4j-driver");

async function conn_neo4j(db_uri: string, user: string, pass: string) {

    let driver = neo4j.driver(db_uri, neo4j.auth.basic(user, pass));
    
    const serverInfo = await driver.getServerInfo();

    console.log("Conectado com o banco de dados");
    console.log(serverInfo);

    await driver.close();
}

conn_neo4j("neo4j+s://234f3135.databases.neo4j.io", "234f3135", "5T6b96J_IVh4ajQLHJc5hW4CCfsbmTiTgAkNKMNiDOU");
