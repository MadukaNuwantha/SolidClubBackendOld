## Solid Club API Server

NodeJS v20 + Express on Docker

## Installation steps for server
### create and initialize an empty repository
    $ git init 
### add a remote named origin for the repository at <repository>
    $ git remote add origin <repository> 
### do a git-fetch
    $ git fetch
### check out the master branch
    $ git checkout master
### update the node in project
    $ npm i
### start the server using FOREVER
    $ forever start <app.js>

## Updating the Server
### fetch the latest master branch
    $ git fetch origin master 
### set the header for traces
    $ git reset --hard FETCH_HEAD 
### check the FOREVER service id
    $ forever list 
### restart the service 
    $ forever restart #id 

### Docker setup
[Howto Article](https://blog.kevthatdevs.com/simple-express-docker)

1. Clone the repo
2. Build Docker image: `sudo docker build -t solid-club-admin-v2-image . `
p
3. Build container: `sudo docker run -p 8080:8080 -d --name solid-club-admin-v2-container solid-club-admin-v2-image`
4. npm install
5. Open [http://localhost:8080](http://localhost:8080)

## Servers:

Test: https://sc.rsys.a2hosted.com

Live: `not ready yet`

## Test credentials:


## Todo

- 

## Resources

[Sri Lanka city list](https://github.com/aslamanver/srilanka-cities)


## Development team
- Andrew P
- Sachinthana P
- Maduka N
- Azmeer M

## License

2023 (c) Aventage Labs (Pvt) Ltd.