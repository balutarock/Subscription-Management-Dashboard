#### Prerequisites

1. Install node(v22.14.0 must)
2. Install docker

#### Backend Setup:

##### change directory to server

```
cd server
```

##### copy the .env.example file to .env

```
cp .env.example .env
```

##### install dependencies

```
npm install
```

##### start the database

```
npm run db:up
```

##### generate the prisma client

```
npm run db:generate
```

##### create a migration

```
npm run db:migrate
```

##### push the migrations to the database

```
npm run db:push
```

##### run the application

```
npm run dev
```
