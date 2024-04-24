# Collaborative Coding Platform 🚀

Welcome to our collaborative coding platform project! This platform aims to revolutionize the coding experience by enabling real-time collaboration and code compilation in Python, C++, and Java.

## Features 🌐

- Real-time code sharing and collaboration
- Creation of rooms with unique IDs for seamless joining
- Support for front-end code with download feature
- Code compilation in Python, C++, and Java

## Tech Stack 💻

- Frontend: React, JSX, CSS
- Backend: Express, MongoDB
- Real-time Communication: Web Sockets
- Code Compilation: Python, C++, Java Compilers

## Links 🔗

- GitHub: [GitHub](https://github.com/ritikkashyap720)
- LinkedIn: [Ritik Kashyap](https://www.linkedin.com/in/ritik-kashyap-24812a1b9/)

## Naviagte
- [Key features](#key-features)
- [How compilation works](#how-compilation-works)
- [UI/UX of code share](#ui-ux-of-code-share)
- [Demo videos](#demo-videos)
- [Run Locally](#run-locally)

## Key Features

- Real-time collaboration: Users can see each other's code changes in real-time, fostering teamwork and knowledge sharing.
- Room creation: Users can create rooms and share unique IDs to invite others, ensuring privacy and exclusivity.
- Multi-language support: Our platform supports code compilation in Python, C++, and Java, catering to diverse coding needs.
- Front-End Coding: Our platform supports coding HTML, CSS, and JS.

## How compilation works

- First code is sent to server, then server generate a file and register a job id with staus pending and this job id is passed to client.
- Then the generated file is compiled if the code have an error the status of job id is updated with status error and output is updated on database if no error then output is updated with status success in the database .
- And on client side after recieving the job id the client will start making polling request on the /status with job id at an interval of 1000ms.
- And if the status change with success or error the polling request is stopped and the output is display on the editor.

  ![Compilation flow diagram](https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/b5c44cb1-958b-4f8d-9b38-25d222ee1101)

## UI UX of code share
- Login
  ![login](https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/8fe64524-73d3-4381-a228-7561113883ab)
- Regsiter  
  ![Registration](https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/0bff0345-cd36-4700-869c-0a904f164d1d)
  
- Home page
  ![join room](https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/a36d0127-2cf7-4f82-b244-0c12d83fafca)
- Editor
  ![coding](https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/124d0797-7e26-4e3a-9e8c-885f6a481a8c)
- Front end code editor
  ![web demo](https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/d876f282-0fe7-469f-958d-4572f7dba850)


## Demo Videos 

https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/ccdd0047-1da2-4396-8ee0-a4f753f3c695

## Front end demo

https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-/assets/72151729/bb34fb4f-77c4-4ba1-a7c2-faa9c03798f6


## Run Locally

Clone the project

```bash
  git clone https://github.com/ritikkashyap720/Codeshare-Realtime-code-editor-
```

Go to the project directory

```bash
  cd my-project
```

Run front-end
```bash
  cd front
  npm install
  npm run dev
```

Run backend
```bash
  cd backend
  npm install
  npm start
```






