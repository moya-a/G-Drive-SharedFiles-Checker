const files = [];
const checkAllFiles = false; // change to true if you want to check 'PRIVATE' files

function main() {

    Logger.log('Looking for shared files in your drive, please wait... (This may take a while)');

    const rootFolder = DriveApp.getRootFolder();
    files.push(["Type", "Path", "Access", "Permissions", "Editors", "Viewers", "Date", "Size", "URL", "Type"]);
    getAllFilesInFolder('', rootFolder);

    Logger.log('Found %s shared files, inserting into new sheet...', files.length);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    const range = sheet.getRange('A1:J'+files.length);
    range.setValues(files);
    
    Logger.log('%s lines inserted !', files.length);
}

function getAllFilesInFolder(parentPath, folder) {
    const subFolders = folder.getFolders();
    const folderFiles = folder.getFiles();
    const path = parentPath + '/' + folder.getName();

    addFileOrFolder(parentPath, folder, 'd');

    while (subFolders.hasNext()) {
        const folder = subFolders.next();
        getAllFilesInFolder(path, folder);
    }
    while (folderFiles.hasNext()) {
        addFileOrFolder(path, folderFiles.next(), 'f');
    }
}

function addFileOrFolder(parentPath, file, type) {
    if (checkAllFiles || 'PRIVATE' != file.getSharingAccess()) {
        const listEditors = file.getEditors().map(it => it.getEmail()).toString();
        const listViewers = file.getViewers().map(it => it.getEmail()).toString();

        const fileData = [
            type,
            parentPath + '/' + file.getName(),
            file.getSharingAccess(),
            file.getSharingPermission(),
            listEditors,
            listViewers,
            file.getDateCreated(),
            file.getSize(),
            file.getUrl(),
            'f' == type ? file.getMimeType() : '',
        ];
        files.push(fileData);
    }
}
