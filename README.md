# tripleT
Internal website for house management for Phi Sig @ MIT

### How to set-up your local machine. ###
1. Install npm and node locally.
2. Install MongoDB for your machine.
3. Run `export PATH=$PATH:/usr/local/mongodb/bin` to get all the mongo commands in your PATH. 
4. Run `mkdir -p /data/db` to create a directory that will store your local data.
5. Run `sudo chmod 0755 /data/db` and `sudo chown $USER /data/db` to ensure that user account running mongod has correct permissions for the directory.
6. Verify that you can run `mongod` and `mongo` from your terminal.
7. Start your database using `mongod`

### How to run your triple-T on your machine. ###
1. Download repository.
2. `cd tripleT`
3. `npm install` will install all the necessary node modules locally.
4. Create an admin account by running `./bin/create_admin`.
5. Start your server using `node app.js`.
6. Sign in using kerberos: 'admin' and password: 'password'.
