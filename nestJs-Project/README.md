# festivalData

## project overview

festivaldata is a project for Creating HTTP API and the the Details should be Display by Alphabetical

## technology used

-node.js
-Typescipt
-NestJs
-Docker
-jest

## Getting started

### prerequisites

-node.js ( version 20 )
-Docker ( Containerization )

## Installation

clone the repository

```bash
    git clone https://github.com/Madhubalan-R/festivalData.git
```
Install dependencies

```bash
    cd nestJs-Project
    npm install
```

Run the Application

```bash 
    npm run start
```
Test Application

```bash
    npm run test
```

## configuration

`API_URL`: https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals

## file path

`sample.json`:/src/services/sample

## API Endpoints

** GET : api/v1/festivals

  -description: Fetches the Api Data from the url 
  -parameters: None
  -Response: JSON Array of festival objects

## Example Request

``` bash
 GET http://localhost:3000/api/v1/festivals
```

## Docker commands

Docker image build

```bash
    sudo docker build -t festivaldata .
```

List the Images

```bash
    sudo docker images
```
List the Containers

```bash
    sudo docker ps -a
```
Run Container using image name

```bash
    sudo docker run -d -p 3000:3000 festivaldata
```
Access the application

```bash
    sudo docker logs <image-ID>
```

## Run Application

Open the Browser and Navigate to `http://localhost:3000/api/v1/festivals`.

```