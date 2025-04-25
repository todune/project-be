type FileType = 'image' | 'xlsx' | 'docx' | 'mp4' | 'txt' | 'unknown';

export const classifyFile = (file: any): FileType => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const xlsxExtensions = ['xlsx'];
    const docxExtensions = ['docx'];
    const mp4Extensions = ['mp4'];
    const txtExtensions = ['txt'];

    const extension = file.filename.split('.').pop()?.toLowerCase();

    if (!extension) {
        return 'unknown';
    }

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (xlsxExtensions.includes(extension)) {
        return 'xlsx';
    } else if (docxExtensions.includes(extension)) {
        return 'docx';
    } else if (mp4Extensions.includes(extension)) {
        return 'mp4';
    } else if (txtExtensions.includes(extension)) {
        return 'txt';
    } else {
        return 'unknown';
    }
}
