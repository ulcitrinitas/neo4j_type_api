import type { Person } from './person.ts'
import type { Crendenciais } from './crend.ts';

const neo4j = require("neo4j-driver");

async function test_conn_neo4j(creds: Crendenciais) {

  try {
    
    let driver = neo4j.driver(creds.db_uri, neo4j.auth.basic(creds.user, creds.pass));
    
    const serverInfo = await driver.getServerInfo();

    console.log("Conectado com o banco de dados");
    console.log(serverInfo);

    await driver.close();

    console.log(`Credencias executadas (conn): ${JSON.stringify(creds)}`);

  } catch (error) {

    console.log("Erro! Não foi possível conectar ao banco...");
    console.log(error);

    console.log(`Credencias executadas (conn catch): ${JSON.stringify(creds)}`);
    
  }
}

async function createPerson(data: Person, crend_db: Crendenciais){

    const driver = neo4j.driver(crend_db.db_uri, neo4j.auth.basic(crend_db.user, crend_db.pass));

    // Criando nós no banco de dados
    let { records , summary } = await driver.executeQuery(
        `
        CREATE (a:Person {name: $name})
        CREATE (b:Person {name: $friendName})
        CREATE (a)-[:KNOWS]->(b)
        `,
        {name: data.name, friendName: data.friendName},
        {database: crend_db.dbname}
    );

    console.log(
        `Created ${summary.counters.updates().nodesCreated} nodes` +
        `in ${summary.resultAvailableAfter} ms.`
    );

    await driver.close();
    
}

async function getPerson(crend_db: Crendenciais){

    const driver = neo4j.driver(crend_db.db_uri, neo4j.auth.basic(crend_db.user, crend_db.pass));

    // Pegando os dados no banco
    let { records , summary } = await driver.executeQuery(
        `
        MATCH (p:Person)-[:KNOWS]->(:Person)
        RETURN p.name AS name
        `,
        {},
        {database: crend_db.dbname}
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


const creds: Crendenciais =   {
    db_uri: "neo4j+s://234f3135.databases.neo4j.io",
    user: "234f3135",
    pass: "5T6b96J_IVh4ajQLHJc5hW4CCfsbmTiTgAkNKMNiDOU",
    dbname: "234f3135"
};

test_conn_neo4j(creds);

console.log(`Credencias executadas: ${JSON.stringify(creds)}`);

getPerson(creds);

// let person = {
//     name: "Willian",
//     age: 28,
//     friendName: "Alice"
// };

// createPerson(person, creds);
// 
