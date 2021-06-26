# GoogleDrive - Shared Files Finder Script

This script analyses your Google Drive to find all files you've shared.

It returns you a Spreadsheet with the files and theirs access rights alongside the viewers.

## How to use

- Connect to your google drive account
- Create a new spreadsheet (optional: rename it)
- Go to "Tools -> Script Editor"
- Copy the content of the file checker.js into the editor
- Save and Run
- It may asks for permissions that you need to accept in order to access the drive.

## Result
It creates a new sheet in the spreadsheet that should be populated with the results according to this column format :

| Path | Access | Permissions | Editors | Viewers | Date | Size | URL | Type |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |

## Options
If you want the script to check all your files (I mean, also files tagged as 'PRIVATE'), you can set :
```
const CHECK_PRIVATE_FILES = true;
```

## Author
* Arnaud Moya <dev@amoya.fr>

## Thanks
* @woodwardtw (https://gist.github.com/woodwardtw/22a199ecca73ff15a0eb)

For the inital idea

* @danjargold (https://gist.github.com/danjargold/c6542e68fe3a3b46eeb0172f914641bc)

For the version of the script I based mine

## License
* MIT
