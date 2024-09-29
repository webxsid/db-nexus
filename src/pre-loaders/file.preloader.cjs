// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { ipcRenderer } = require("electron");

const uploadFile = async (file) => {
  if (file.path && file?.path?.length) {
    const filePath = await ipcRenderer.invoke("upload-file", file?.path);
    return filePath;
  }
};

const removeFile = async (filePath) => {
  if (filePath?.length) {
    await ipcRenderer.invoke("remove-file", filePath);
  }
};

// eslint-disable-next-line no-undef
module.exports = {
  uploadFile,
  removeFile,
};
