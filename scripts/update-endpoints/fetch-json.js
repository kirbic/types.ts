const { writeFileSync } = require("fs");
const path = require("path");
const graphqlGot = require("graphql-got");
const prettier = require("prettier");

if (!process.env.VERSION) {
  throw new Error(`VERSION environment variable must be set`);
}


const version = process.env.VERSION.replace(/^v/, "");

const QUERY = `
query{
  endpoints{
    method
    url
    documentationUrl
    parameters {
      alias
      deprecated
      in
      name
    }
  }
}
`;

main();

async function main() {
  // const { endpoints } = await graphql(QUERY, {
  //   //url: "http://localhost:3000/api/graphql",
  //   version,
  //   ignoreChangesBefore: "2020-06-10",
  // });

  const res = await graphqlGot(
    "https://kirbic-openapo-graphql.app.faable.com/api/graphql",
    {
      query: QUERY,
      variables: {
        //url: "http://localhost:3000/api/graphql",
        // version,
        // ignoreChangesBefore: "2020-06-10",
      },
    }
  );
  console.log(res.body);
  const {
    body: { endpoints },
  } = res;
  console.log(endpoints);
  console.log("THE ENDPOINTS");
  writeFileSync(
    path.resolve(__dirname, "generated", "endpoints.json"),
    prettier.format(JSON.stringify(endpoints), {
      parser: "json",
    })
  );
}
