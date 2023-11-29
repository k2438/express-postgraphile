## Requirement(Local)
- Docker
- npm

## Dependencies
- Node.js
- Express
- PostgreSQL
- PostGraphile

## Setup
```terminal
git clone 

cd express-postgrapile/

npm install

docker-compose up
```

## PostGraphiQL

http://localhost:4200/graphiql

### Query
```terminal
query {
    allTodos {
        edges {
            node {
                id
                title
                done
                createdAt
            }
        }
    }
}
```

### Mutation
```terminal
mutation {
    createTodo(
        input: {
            todo: {
                title: "eat eggs"
            }
        }
    ) {
        todo {
            id
            title
        }
    }
}
```