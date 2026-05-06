import type { Person } from './person.ts'
import type { Crendenciais } from './crend.ts';

const neo4j = require("neo4j-driver");

async function conn_neo4j(db_uri: string, user: string, pass: string, creds: Crendenciais) {

  try {
    
    let driver = neo4j.driver(db_uri, neo4j.auth.basic(user, pass));
    
    const serverInfo = await driver.getServerInfo();

    let dbname = "234f3135"

    console.log("Conectado com o banco de dados");
    console.log(serverInfo);

    await driver.close();

    creds =   {
        db_uri,
        user,
        pass,
        dbname
    };

  } catch (error) {

    console.log("Erro! Não foi possível conectar ao banco...");
    console.log(error);

    // Para manter a consistência dos objetos
    creds =  {
        db_uri: "",
        user: "",
        pass: "",
        dbname: ""
    };
    
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


let creds: Crendenciais = {
    db_uri: "",
    user: "",
    pass: "",
    dbname: ""
};

conn_neo4j("neo4j+s://234f3135.databases.neo4j.io", "234f3135", "5T6b96J_IVh4ajQLHJc5hW4CCfsbmTiTgAkNKMNiDOU", creds);

if(creds.db_uri == "" || creds.user == ""){
    throw "Erro! Problema ao conectar ao banco de dados";
}

let person = {
    name: "Willian",
    age: 28,
    friendName: "Alice"
};

createPerson(person, creds);
getPerson(creds);
