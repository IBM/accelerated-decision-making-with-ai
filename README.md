# accelerated-decision-making-with-ai
Monorepo for Decision support for Intervention Planning

## 1. System Requirements

### Clone repository using SSH

1. Check for existing keys on the terminal using
    ```
    ls -al ~/.ssh
    ```
    - Move to step 3, if you remember the password of the existing key
    - If there are no existing keys, move to step 2
2. Generate new ssh keys on the terminal using
    ```
    ssh-keygen -t rsa
    ```
    Press Enter for the following follow up requests in order to save the identification in the default `/User/computer_name/.ssh/id_rsa` and the public key in `/User/computer_name/.ssh/id_rsa.pub`

    The follow up requests include:
    - Enter file in which to save the key:
    - Enter passphrase:
    - Enter same passphrase again:
   

3. Add the SSH key to your Github Account(https://github.com)
    1. Copy the SSH public key to your clipboard on the terminal using
        ```
        pbcopy < ~/.ssh/id_rsa.pub
        ```
    2. Paste the SSH public key to your Github Account
        - Settings => SSH and GPG KEYS => New SSH Key button
        - In the Key Text Field : Paste the SSH Public Key
        - In the Title Text Field : Add preferred title(i.e., MY SSH KEY)
        - Press Add SSH Key and confirm password to continue
4. Clone the accelerated-decision-making-with-ai repository in the dev folder(or any preferred folder)
    1. On the terminal, change the directory then create a new folder/directory called `dev`
        ```
        cd ~
        mkdir dev
        ```
    2. Clone the repository
        ```
        git clone git@github.com:IBM/accelerated-decision-making-with-ai.git
        ```
    
### Install HomeBrew -(to simplify the installation of software)
1. Launch Visual Studio Code and open the AppServer folder in the accelerated-decision-making-with-ai folder in the dev folder
    ```
    cd dev
    cd accelerated-decision-making-with-ai
    cd AppServer
    ```
2. Create a new terminal 
3. On the Visual Studio terminal, install HomeBrew using
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

### Install Maven
1. Update HomeBrew on the Visual Studio terminal using the command:
    ```
    brew update
    ```
2. Install Maven on the Visual Studio terminal using the command:
    ```
    brew install maven
    ```
3. Check the maven version installed (maven 3.8.6)
    ```
    mvn -version
    ```

### Install Java11
1. On the Visual Studio terminal, install java jdk11 using the command:
    ```
    brew install java11
    ```
2. Check the version of java installed
    ```
    java -version
    ```
3. To allow the system to find the java runtime use:
    ```
    sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
    echo 'export PATH="/usr/local/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
    export CPPFLAGS="-I/usr/local/opt/openjdk@11/include"
    ```
4. Check the version of java installed again to accertain the system can recognize the java version installed
    ```
    java -version
    ```

## 2. Setting up the AppServer
Follow prompts under appserver directory below:
 [link to AppServer ReadMe file](Appserver/README.md)

## 3. Setting up the Dashboard
Follow prompts under dashboard directory below:
 [link to Dashboard ReadMe file](Dashboard/README.md)

## 4. Setting up the Job Deployment Service
Follow prompts under jobDeploymentService directory below:
 [link to JobDeploymentService ReadMe file](JobDeploymentService/README.md)

## 5. Handling the initializations 
Follow prompts under initialization directory below:
 [link to Initialization ReadMe file](Initialization/README.md)