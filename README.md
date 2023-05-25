<p align="center">
  <img src="./frontend/static/icons/android-chrome-192x192.png" alt="Pixels Logo">
</p>

# Pixels - Learn Programming through Pixel Art

Pixels is an interactive learning platform that aims to teach kids programming by allowing them to create pixel art on a canvas any programming language.


## Introduction

Pixels introduces kids to the exciting world of programming by enabling them to create and manipulate pixel art simple code in any programming langue. Learners can develop their programming skills, as well as their creativity and problem-solving abilities.

## Features

- Interactive canvas for creating pixel art
- Simple API calls for placing and manipulating pixels
- Real-time updates for a collaborative experience

## Prerequisites

- [Node.js](https://nodejs.org/) >=18.x
- [pnpm](https://pnpm.io/) >=8.x
- [Docker](https://www.docker.com/) >=23.x

## Development

1. Clone the repository:

```sh
git clone https://github.com/pixelcorp-nl/canvas.edu.git
cd pixels
```

2. Set up environment variables
```shell
cp frontend/.env.example frontend/.env
# fill in the variables in .env
```

3. Start dependencies (database, etc.)
```sh
make start-deps
```

4. Start the development server

```sh
cd frontend
pnpm install
pnpm run dev
```

5. Pixels is ready at http://localhost:5173


Pixels is released under the [MIT License](LICENSE)
