const CHECK_PRIVATE_FILES = false; // change to true if you want to check 'PRIVATE' files
const PRIVATE = 'PRIVATE';

const resultFiles = [];

function main() {

    Logger.log('Looking for shared files in your drive, please wait... (This may take a while)');

    const rootFolder = DriveApp.getRootFolder();
    resultFiles.push(["Path", "Access", "Permissions", "Editors", "Viewers", "Date", "Size", "URL", "Type"]);
    getAllFilesInFolder('', rootFolder, false);

    Logger.log('Found %s shared files, inserting into new sheet...', resultFiles.length);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    const range = sheet.getRange('A1:I' + resultFiles.length);
    range.setValues(resultFiles);

    Logger.log('%s lines inserted !', resultFiles.length);
}

function getAllFilesInFolder(parentPath, folder, inherited) {
    const subFolders = folder.getFolders();
    const folderFiles = folder.getFiles();
    const path = parentPath + '/' + folder.getName();

    const isShared = folder.getSharingAccess() != PRIVATE;

    addFileOrFolder(parentPath, folder, 'd', inherited);

    while (subFolders.hasNext()) {
        const folder = subFolders.next();
        getAllFilesInFolder(path, folder, isShared);
    }
    while (folderFiles.hasNext()) {
        addFileOrFolder(path, folderFiles.next(), 'f', isShared);
    }
}

function addFileOrFolder(parentPath, file, type, inheritShare) {
    const sharingAccess = file.getSharingAccess();
    if (CHECK_PRIVATE_FILES || inheritShare || PRIVATE != sharingAccess) {
        const listEditors = file.getEditors().map(it => it.getEmail()).toString();
        const listViewers = file.getViewers().map(it => it.getEmail()).toString();

        const fileData = [
            parentPath + '/' + file.getName(),
            sharingAccess + (inheritShare ? ' (inherited)' : ''),
            file.getSharingPermission(),
            listEditors,
            listViewers,
            file.getDateCreated(),
            file.getSize(),
            file.getUrl(),
            'f' == type ? file.getMimeType() : 'Folder',
        ];
        resultFiles.push(fileData);
    }
}
