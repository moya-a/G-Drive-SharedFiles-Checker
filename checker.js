const CHECK_PRIVATE_FILES = false; // change to true if you want to check 'PRIVATE' files

const FOLDER_TYPE = 'D';
const FILE_TYPE = 'F';

const resultFiles = [];

function main() {

    Logger.log('Looking for shared files in your drive, please wait... (This may take a while)');

    const rootFolder = DriveApp.getRootFolder();
    resultFiles.push(["Status", "Path", "Access", "Permissions", "Editors", "Viewers", "Date", "Size", "URL", "Type"]);
    getAllFilesInFolder('', rootFolder, false);

    Logger.log('Found %s shared files, inserting into new sheet...', resultFiles.length);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    const range = sheet.getRange('A1:J' + resultFiles.length);
    range.setValues(resultFiles);

    Logger.log('%s lines inserted !', resultFiles.length);
}

function getAllFilesInFolder(parentPath, folder, inherited) {
    const subFolders = folder.getFolders();
    const folderFiles = folder.getFiles();
    const path = parentPath + '/' + folder.getName();

    var isShared = false;

    try {
        isShared = folder.getSharingAccess() != DriveApp.Access.PRIVATE;
    } catch (err) {
        Logger.log('%s', err)
    }

    addFileOrFolder(parentPath, folder, FOLDER_TYPE, inherited);

    while (subFolders.hasNext()) {
        const folder = subFolders.next();
        getAllFilesInFolder(path, folder, isShared);
    }
    while (folderFiles.hasNext()) {
        addFileOrFolder(path, folderFiles.next(), FILE_TYPE, isShared);
    }
}

function addFileOrFolder(parentPath, file, type, inheritShare) {
    const filePath = parentPath + '/' + file.getName();

    try {
        const sharingAccess = file.getSharingAccess();
        if (CHECK_PRIVATE_FILES || inheritShare || DriveApp.Access.PRIVATE != sharingAccess) {
            const listEditors = file.getEditors().map(it => it.getEmail()).toString();
            const listViewers = file.getViewers().map(it => it.getEmail()).toString();

            const fileData = [
                'ok',
                filePath,
                sharingAccess + (inheritShare ? ' (inherited)' : ''),
                file.getSharingPermission(),
                listEditors,
                listViewers,
                file.getDateCreated(),
                file.getSize(),
                file.getUrl(),
                FILE_TYPE == type ? file.getMimeType() : 'Folder',
            ];
            resultFiles.push(fileData);
        }
    } catch (err) {
        Logger.log('Error while analyzing file %s : %s', filePath, err)
        const fileData = [
            err,
            filePath,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ];
        resultFiles.push(fileData);
    }
}
