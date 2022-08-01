# accelerated-decision-making-with-ai APP Server

## Developer
1. Encrypt master and server password as described [here](https://maven.apache.org/guides/mini/guide-encryption.html), to allow access to the ungana-models from Jfrog Artifactory.

    1.  Create and encypt master password with 
        ```
        mvn --encrypt-master-password
        ```
        `Hint`: The master-password can be any password or the password of the machine
    2. Store the generated encypted password in `${user.home}/.m2/settings-security.xml`; in this format
         ```
        <settingsSecurity>
        <master>{ENCRYPTED_MASTER_PASSWORD}</master>
        </settingsSecurity>
        ```
         #### Step by step guide
        - On the Mac terminal, create a .m2 directory
            ```
            cd ~
            mkdir .m2
            ```
        - Change the directory to .m2
            ```
            cd .m2
            ```
        - Create a settings-security.xml file using `touch`
            ```
            touch settings-security.xml
            ```
        - Edit the created settings-security.xml file using `nano`
            ```
            nano settings-security.xml
            ```
            Paste the format in step 2 in the settings-security.xml file and edit the `{ENCRYPTED_MASTER_PASSWORD}` with the generated encrypted master password from step 1
        
    3.  Create and encrypt server password with 
        ```
        mvn --encrypt-password
        ```
    4. Store the generated encypted password in `${user.home}/.m2/settings.xml`; in this format
        ```
        <settings>
            <servers>
                <server>
                    <id>central</id>
                    <username>SERVER_USERNAME</username>
                    <password>{ENCRPTED_SERVER_PASSWORD}</password>
                </server>
                <server>
                    <id>snapshots</id>
                    <username>SERVER_USERNAME</username>
                    <password>{ENCRPTED_SERVER_PASSWORD}</password>
                </server>
                <server>
                    <id>na-artifactory</id>
                    <username>SERVER_USERNAME</username>
                    <password>{ENCRPTED_SERVER_PASSWORD}</password>
                </server>
                <server>
                    <id>na-snapshots</id>
                    <username>SERVER_USERNAME</username>
                    <password>{ENCRPTED_SERVER_PASSWORD}</password>
                </server>
            </servers>
        </settings>
        ```
        #### Step by step guide
        - On the Mac terminal, create a settings.xml file using `touch`
            ```
            touch settings.xml
            ```
        - Edit the created settings.xml file using `nano`
            ```
            nano settings.xml
            ```
            Paste the format in step 4 in the settings.xml file and edit the `SERVER_USERNAME` with the your email and the `{ENCRPTED_SERVER_PASSWORD}` with the generated encrypted password from step 3

2. Install mvn dependencies and package using 
    ```
    mvn clean package
    ```
3. Navigate to `accelerated-decision-making-with-ai/AppServer/src/main/resources` and paste the application-local.yaml file 

4. For testing purposes;
    
    Edit the end of `datasource` => `jdbc-url` in the application-local.yaml
    - By adding the name of the developer to the jdbc-url. For example: From [`jdbc-url:.../pmai_dev`] to [`jdbc-url:.../pmai_dev_<name_of_developer>`]

5. Install the `Extension Pack for Java` to be able to run the java files in the project
    
6. Install pgAdmin
    - On your preferred browser download pgAdmin(https://www.pgadmin.org/download/pgadmin-4-macos/)
    - Choose the latest version and download 
    - On a successful download, click the `pgadmin4-6.11.dmg` file in Downloads folder and copy it to the Application folder
    - Open the `pgadmin4-6.11.dmg` file 

7. Setup pgAdmin
    1. Add Server by `Right clicking on Server => Register => Server` or `Clicking on Add Server`
    - In General, include the preferred name (i.e.,accelerated-decision-making-with-ai Server)
    - In Connection:
        - Host name/address: `Use the jdbc-url in the` [application-local.yaml file](../Appserver/src/main/resources/application-local.yaml) `(from b2..... to ...cloud)` 
        - Port: `Use the number after cloud but before the slash /`
        - Username: `Use the username in the `[application-local.yaml file](../Appserver/src/main/resources/application-local.yaml) 
        - Password: `Use the password in the `[application-local.yaml file](../Appserver/src/main/resources/application-local.yaml)
    - Click Save
    
    2. Create a new database 
    -  The name of the database is obtained from the jdbc-url in the [application-local.yaml file](../Appserver/src/main/resources/application-local.yaml) after the last slash `/` 

8. Run the AppServer by pressing the `Run` button on the [TaskClerkMainApplication.java file](../Appserver/src/main/java/com/ibm/pmai/taskclerk/TaskClerkMainApplication.java)

****
NEXT UP -> Move to the [Dashboard](../Dashboard/README.md)

****

