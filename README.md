<p align="center">
  <img src="./frontend/static/icons/android-chrome-192x192.png" alt="Pixels Logo">
</p>

# Pixels - Learn Programming through Pixel Art

Pixels is an interactive learning platform that aims to teach kids programming by allowing them to create pixel art on a canvas using API calls. The project is built using SvelteKit, Redis, PostgreSQL, and Upstash as the hosting provider for the Redis database.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Documentation](#api-documentation)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

Pixels introduces kids to the exciting world of programming by enabling them to create and manipulate pixel art using simple API calls. By placing pixels on a canvas, learners can develop their programming skills, as well as their creativity and problem-solving abilities.

## Features

- Interactive canvas for creating pixel art
- Simple API calls for placing and manipulating pixels
- Real-time updates for a collaborative experience
- Built with SvelteKit for a fast and responsive user interface
- Uses Redis and PostgreSQL for efficient data storage and retrieval
- Hosted on Upstash for seamless integration and scalability

## Prerequisites

To run the Pixels project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>=14.x)
- [npm](https://www.npmjs.com/) (>=6.x)
- [Redis](https://redis.io/) (>=6.x)
- [PostgreSQL](https://www.postgresql.org/) (>=12.x)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/pixels.git
cd pixels
```

2. Install dependencies:

```sh
npm install
```

3. Set up environment variables by creating a `.env` file in the root directory of the project, and populate it with your Redis, PostgreSQL, and Upstash credentials:

```
REDIS_URL=your_redis_url
POSTGRES_URL=your_postgres_url
UPSTASH_API_KEY=your_upstash_api_key
```

4. Start the development server:

```sh
npm run dev
```

The application should now be running on `http://localhost:3000`.

## Usage

Visit the application in your web browser and follow the on-screen instructions to create and manipulate pixel art using the provided API calls.

## API Documentation

The API documentation can be found at `http://localhost:3000/docs` when running the application locally, or at `https://yourdomain.com/docs` when hosted.

## Contributing

We welcome contributions to the Pixels project! To get started, please review our [contributing guidelines](CONTRIBUTING.md).

## License

Pixels is released under the [MIT License](LICENSE.md).