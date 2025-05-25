# University Research Collaboration Platform

## Overview
This project aims to provide a web-based solution for managing community sports facilities, allowing users to book slots, report maintenance
issues, and receive relevant notifications.

## List of developers
    1. Thabiso Mahlaola : 2426592
    2. Pasha Thipe : 2464845
    3. Trust Mhone : 2491951
    4. Sayuri Singh : 2538889
    5. Nomphumelelo Radebe : 2457468
    6. Bongani Nobela : 2595626

## Code Coverage
[![codecov](https://codecov.io/gh/Vin1632/Uni-Research-Collab-Platform/graph/badge.svg?token=SL17NHA2SA)](https://codecov.io/gh/Vin1632/Uni-Research-Collab-Platform)

## Link to the deployed web application
Click [here](https://uni-research-collab-wits.azurewebsites.net/)

## Sign-in as admin
To sign-in as an admin, use the following details, 
```
    Email: vin.thabs@gmai.com
    Password: [Vin_Thabs]
```
the reason being that there is not path to sign-in as an admin since an admin has all the rights/permission to 
change alot of the settings, So it was a built-in user.

Doesn't Have MFA, so you can test the page for Admin when Marking

## NB---Setup when using Linux(OS)

### Clone the repo
``` 
git clone  https://github.com/Vin1632/Uni-Research-Collab-Platform.git 

```

### Grant executable Permission for script files
```
chmod +x *.sh 
```

### Execute the script file for installing dependencies
```
 ./set_up.sh 
 
```

### Run the web application locally (Prod)

``` 
./run.sh 

```

## NB---Set-Up when using Windows

### Clone the repo
```
 git clone  https://github.com/Vin1632/Uni-Research-Collab-Platform.git
 
 ```

### Execute the command to install dependencies
Execute the following commands one after the other or copy and paste in the powershell command
``` 
npm i 
cd frontend/
npm i
cd ../server
npm i
cd ../

 ```

### Run the web application locally (Prod)
After installing the dependencies, execute the command in the root directory to run the application locally

```
npm run prod 

```
