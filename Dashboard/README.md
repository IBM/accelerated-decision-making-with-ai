# accelerated-decision-making-with-ai InteractiveDecisioningDashboard
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.


## Install and configure nvm
1. Change the directory to Dashboard
    ```
    cd Dashboard
    ```
2. Install nvm
    ```
    brew install nvm
    ```
3. Create a NVM working directory `~/.nvm` if it does not exist by using
    ```
    mkdir ~/.nvm
    ```
4. Edit the ` ~/.zshrc` configuration file using `nano ~/.zshrc` and paste the following commands
    ```
    export NVM_DIR="$HOME/.nvm"
    [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
    [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
    ```
- Click `Ctrl + O` then `ENTER` then `ctrl + X` to save the file
5. To read and execute the edited configuration file, run 
    ```
    source ~/.zshrc 
    ```
6. Open a new terminal and type `nvm` to see all the commands possible
7. In the new terminal, check the nvm version installed using the command
    ```
    nvm --version
    ```
7. Download and install node v12.22.10 using
    ```
    nvm install v12.22.10
    ```
8. Check the node version installed using
    ```
    node --version
    ```
9. Change the directory to Dasboard
    ```
    cd Dashboard
    ```

10. ```
    npm install
    ```

## Development server

On a new terminal,

Run `npm run start-local` (in the Dashboard folder)for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Dashboard login
Navigate to `http://localhost:4200/` and click the `Login` button and create a new IBMID

- A successful account creation will send an email to the administator for authorization purposes
- On successful authorization, you can now access the Dashboard and create Models and Environments

****
NEXT UP -> Move to the [JobDeploymentService](../JobDeploymentService/README.md)

****

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--production` flag for a production build, `--staging` flag for a staging build, `--demo` flag for a demo build.
## Running lint

Run `npm run lint` to execute the lint scan

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## NOTE
We customised the plotly js to support additional icons. This holds well with version 1.53.0
In the event that ```"plotly.js-basic-dist": "^1.53.0"``` is updated from version 1.53.0, the file /scripts/custom-plotly.js will have to be updated for forward compatibility.
