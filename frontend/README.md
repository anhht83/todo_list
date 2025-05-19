# Todo List - Frontend
ReactJs Boilerplate Using NexJs/TypeScript

## Global Requisites
* node (^14.*)  
* yarn (^1.4)  
* typescript (^4.*)
* react (^16.*)
* react-query (^4.*)
* formik (^2.*)  
* tailwindcss (^3.*)
* next (^13.*)

## Install, Configure & Run
Below mentioned are the steps to install, configure & run in your platform/distribution.

### Install
```bash
# Run command to clone the repo.
git clone https://github.com/anhht83/todo_list.git

# Goto the cloned project folder, run command
cd todo_list/frontend

# Run command to install package dependencies.
yarn
```

### Configure
Edit your `.env.xxx` files to config server connections
```bash
# API server
NEXT_PUBLIC_ROOT_API=http://localhost:3001/v1
# Socket server
NEXT_PUBLIC_SOCKET_API=http://localhost:3001
```
### Run
```bash
# Run development
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Test, Storybook & Code format validation
```bash
# Run Storybook
yarn storybook

# Run test
yarn test

# Validate code
yarn lint

# Format code
yarn pretty
```

### Build code and deployment
```bash
# Build code to "dist" folder
yarn build

# Run production
yarn start
```

## Development

### App Structure
```bash
├── .storybook
│   ├── main.js
│   ├── preview.js
├── __stories__
│   ├── pages # write storybook for pages
├── __test__
│   ├── pages # write test for pages
├── public
├── src
│   ├── apis
│   │   ├── Api.ts 
│   │   ├── Base.ts 
│   │   ├── query_client.ts 
│   │   ├── {entity}Api.ts 
│   ├── accests
│   ├── consts 
│   ├── components
│   │   ├── layouts 
│   │   ├── shared
│   │   ├── ui # connect to socket.io server
│   ├── page 
│   │   ├── _app.tsx
│   │   ├── _globals.css # import global style (include tailwind, ...)
│   │   ├── page.d.ts # define new type NextPageWithLayout, aka an extra of NextPage. To be used to implement Layout 
│   ├── types 
│   ├── utils
│   │   ├── helpers.ts
├── .env.local
├── .env.{NODE_ENV} # follow Next.Js structure
├── .eslint* # eslint configuration
├── .prettier* # prettier configuration
├── .git* # git configuration
├── next.config.js
├── next-env.d.ts
├── postcss.config.js
├── tailwind.config.js
├── package.json
├── README.md
└── tsconfig.json
```

### Learn More

To learn more about Next.js, Storybook.js, ... take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and configuration.
- [Storybook.js Documentation](https://storybook.js.org/docs) - learn about Storybook.js.

# Connect
**Anh Tuan Hoang** <anhht83@gmail.com>  https://github.com/anhht83
