const neo4j = require("neo4j-driver");

async function conn_neo4j(db_uri: string, user: string, pass: string) {

    let driver = neo4j.driver(db_uri, neo4j.auth.basic(user, pass));
    
    const serverInfo = await driver.getServerInfo();

    let dbname = "234f3135"

    console.log("Conectado com o banco de dados");
    console.log(serverInfo);

    // Criando nós no banco de dados
    let { _ , summary } = await driver.executeQuery(
        `
        CREATE (a:Person {name: $name})
        CREATE (b:Person {name: $friendName})
        CREATE (a)-[:KNOWS]->(b)
        `,
        {name: "Ana", friendName: "João"},
        {database: dbname}
    );

    console.log(
        `Created ${summary.counters.updates().nodesCreated} nodes` +
        `in ${summary.resultAvailableAfter} ms.`
    );

    // Pegando os dados no banco
    let { records , sumary } = await driver.executeQuery(
        `
        MATCH (p:Person)-[:KNOWS]->(:Person)
        RETURN p.name AS name
        `,
        {},
        {database: dbname}
    );

    // loop para mostrar os dados
    for(let record of records){
        console.log(`Person with name: ${record.get('name')}`)
        console.log(`Available properties for this node are: ${record.keys}\n`)
    }

    console.log(
        `The query \`${summary.query.text}\` ` +
        `returned ${records.length} nodes.\n`
      )

    await driver.close();
}

conn_neo4j("neo4j+s://234f3135.databases.neo4j.io", "234f3135", "5T6b96J_IVh4ajQLHJc5hW4CCfsbmTiTgAkNKMNiDOU");
