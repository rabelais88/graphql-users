```graphql
// example query - simple query
query findUser {
  user(id: "41") {
  	firstName
    age
    company
  }
}

// example query - query fragments
query findCompany {
  companyA: company(id: "2") {
    name
    users {
      firstName
      id
      age
      company {
        ...companyDetails
      }
		}
  }
  companyB: company(id: "1") {
    ...companyDetails
  }
}

fragment companyDetails on Company {
  id
  name
  description
}

// example query - mutation
mutation {
  addUser(firstName: "Stephen", age:26) {
    id
    firstName
    age
  }
}

mutation {
	deleteUser(id: "23") {
    firstName
  }
}
```