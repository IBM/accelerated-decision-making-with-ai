# accelerated-decision-making-with-ai Initialization steps

1. In a new terminal change the directory to Initialization
    ```
    cd Initialization
    ```
2. Run the `initialization.py` python script to initialize the various APIs on the dashboard
    ```
    python initialization.py
    ```
    or
    ```
    python3 initialization.py
    ```

3. However, if your dashboard base URI is not http://localhost:4200 run the above commands while supplying your base URI as shown below

    ```
    python initialization.py --baseuri=<YOUR_BASE_URI>
    ```
    or
    ```
    python3 initialization.py --baseuri=<YOUR_BASE_URI>
    ```

4. When running the above command, You'll be prompted to edit the data repository configuration file with you COS credentials.
 
    - After editing click `ctrl + O` then `ENTER` then `ctrl + X` to save the file. 
    - After saving allow the script to continue running
    - All response codes should be 200 any other value indicates a possible error that needs debugging

5. This process is only done once i.e. when you first clone the repository for use. 
