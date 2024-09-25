import * as React from 'react';
import { getLogger, ComponentClassName } from '@aws-amplify/ui';
import { VisuallyHidden } from '@aws-amplify/ui-react';
import { useDeprecationWarning, useSetUserAgent } from '@aws-amplify/ui-react-core';
import { useDropZone } from '@aws-amplify/ui-react/internal';
import { useFileUploader } from './hooks/useFileUploader/useFileUploader.mjs';
import { useUploadFiles } from './hooks/useUploadFiles/useUploadFiles.mjs';
import { FileStatus } from './types.mjs';
import { Container } from './ui/Container/Container.mjs';
import { DropZone } from './ui/DropZone/DropZone.mjs';
import { FileList } from './ui/FileList/FileList.mjs';
import { FileListHeader } from './ui/FileListHeader/FileListHeader.mjs';
import { FileListFooter } from './ui/FileListFooter/FileListFooter.mjs';
import { FilePicker } from './ui/FilePicker/FilePicker.mjs';
import { checkMaxFileSize } from './utils/checkMaxFileSize.mjs';
import { defaultFileUploaderDisplayText } from './utils/displayText.mjs';
import { filterAllowedFiles } from './utils/filterAllowedFiles.mjs';
import 'aws-amplify/auth';
import 'aws-amplify/storage';
import { VERSION } from '../../version.mjs';

const logger = getLogger('Storage');
const MISSING_REQUIRED_PROPS_MESSAGE = '`FileUploader` requires a `maxFileCount` prop to be provided.';
const ACCESS_LEVEL_WITH_PATH_CALLBACK_MESSAGE = '`FileUploader` does not allow usage of a `path` callback prop with an `accessLevel` prop.';
const ACCESS_LEVEL_DEPRECATION_MESSAGE = '`accessLevel` has been deprecated and will be removed in a future major version. See migration notes at https://ui.docs.amplify.aws/react/connected-components/storage/FileUploader';
const FileUploaderBase = React.forwardRef(function FileUploader({ acceptedFileTypes = [], accessLevel, autoUpload = true, components, defaultFiles, displayText: overrideDisplayText, isResumable = false, maxFileCount, maxFileSize, onFileRemove, onUploadError, onUploadStart, onUploadSuccess, path, processFile, showThumbnails = true, useAccelerateEndpoint, }, ref) {
    if (!maxFileCount) {
        // eslint-disable-next-line no-console
        console.warn(MISSING_REQUIRED_PROPS_MESSAGE);
    }
    if (accessLevel && typeof path === 'function') {
        throw new Error(ACCESS_LEVEL_WITH_PATH_CALLBACK_MESSAGE);
    }
    useDeprecationWarning({
        message: ACCESS_LEVEL_DEPRECATION_MESSAGE,
        shouldWarn: !!accessLevel,
    });
    const Components = {
        Container,
        DropZone,
        FileList,
        FilePicker,
        FileListHeader,
        FileListFooter,
        ...components,
    };
    const allowMultipleFiles = maxFileCount === undefined ||
        (typeof maxFileCount === 'number' && maxFileCount > 1);
    const displayText = {
        ...defaultFileUploaderDisplayText,
        ...overrideDisplayText,
    };
    const { getFileSizeErrorText } = displayText;
    const getMaxFileSizeErrorMessage = (file) => {
        return checkMaxFileSize({
            file,
            maxFileSize,
            getFileSizeErrorText,
        });
    };
    const { addFiles, clearFiles, files, removeUpload, queueFiles, setUploadingFile, setUploadPaused, setUploadProgress, setUploadSuccess, setUploadResumed, } = useFileUploader(defaultFiles);
    React.useImperativeHandle(ref, () => ({ clearFiles }));
    const { dragState, ...dropZoneProps } = useDropZone({
        acceptedFileTypes,
        onDropComplete: ({ acceptedFiles, rejectedFiles }) => {
            if (rejectedFiles && rejectedFiles.length > 0) {
                logger.warn('Rejected files: ', rejectedFiles);
            }
            // We need to filter out files by extension here,
            // we don't get filenames on the drag event, only on drop
            const _acceptedFiles = filterAllowedFiles(acceptedFiles, acceptedFileTypes);
            addFiles({
                files: _acceptedFiles,
                status: autoUpload ? FileStatus.QUEUED : FileStatus.ADDED,
                getFileErrorMessage: getMaxFileSizeErrorMessage,
            });
        },
    });
    useUploadFiles({
        accessLevel,
        files,
        isResumable,
        maxFileCount,
        onUploadError,
        onUploadSuccess,
        onUploadStart,
        setUploadingFile,
        setUploadProgress,
        setUploadSuccess,
        processFile,
        path,
        useAccelerateEndpoint,
    });
    const onFilePickerChange = (event) => {
        const { files } = event.target;
        if (!files || files.length === 0) {
            return;
        }
        addFiles({
            files: Array.from(files),
            status: autoUpload ? FileStatus.QUEUED : FileStatus.ADDED,
            getFileErrorMessage: getMaxFileSizeErrorMessage,
        });
    };
    const onClearAll = () => {
        clearFiles();
    };
    const onUploadAll = () => {
        queueFiles();
    };
    const onPauseUpload = ({ id, uploadTask }) => {
        uploadTask.pause();
        setUploadPaused({ id });
    };
    const onResumeUpload = ({ id, uploadTask }) => {
        uploadTask.resume();
        setUploadResumed({ id });
    };
    const onCancelUpload = ({ id, uploadTask }) => {
        // At this time we don't know if the delete
        // permissions are enabled (required to cancel upload),
        // so we do a pause instead and remove from files
        uploadTask.pause();
        removeUpload({ id });
    };
    const onDeleteUpload = ({ id }) => {
        // At this time we don't know if the delete
        // permissions are enabled, so we do a soft delete
        // from file list, but don't remove from storage
        removeUpload({ id });
        if (typeof onFileRemove === 'function') {
            const file = files.find((file) => file.id === id);
            if (file) {
                const key = file.resolvedKey ?? file.key;
                onFileRemove({ key });
            }
        }
    };
    // checks if all downloads completed to 100%
    const allUploadsSuccessful = files.length === 0
        ? false
        : files.every((file) => file?.status === FileStatus.UPLOADED);
    // Displays if over max files
    const hasMaxFilesError = files.filter((file) => file.progress < 100).length > maxFileCount;
    const uploadedFilesLength = files.filter((file) => file?.status === FileStatus.UPLOADED).length;
    const remainingFilesCount = files.length - uploadedFilesLength;
    // number of files selected for upload when autoUpload is turned off
    const selectedFilesCount = autoUpload ? 0 : remainingFilesCount;
    const hasFiles = files.length > 0;
    const hasUploadActions = !autoUpload && remainingFilesCount > 0;
    const hiddenInput = React.useRef(null);
    function handleClick() {
        if (hiddenInput.current) {
            hiddenInput.current.click();
            hiddenInput.current.value = '';
        }
    }
    useSetUserAgent({
        componentName: 'FileUploader',
        packageName: 'react-storage',
        version: VERSION,
    });
    return (React.createElement(Components.Container, { className: `${ComponentClassName.FileUploader} ${hasFiles ? ComponentClassName.FileUploaderPreviewer : ''}` },
        React.createElement(Components.DropZone, { inDropZone: dragState !== 'inactive', ...dropZoneProps, displayText: displayText },
            React.createElement(React.Fragment, null,
                React.createElement(Components.FilePicker, { onClick: handleClick }, displayText.browseFilesText),
                React.createElement(VisuallyHidden, null,
                    React.createElement("input", { type: "file", tabIndex: -1, ref: hiddenInput, onChange: onFilePickerChange, multiple: allowMultipleFiles, accept: acceptedFileTypes.join(',') })))),
        hasFiles ? (React.createElement(Components.FileListHeader, { allUploadsSuccessful: allUploadsSuccessful, displayText: displayText, fileCount: files.length, remainingFilesCount: remainingFilesCount, selectedFilesCount: selectedFilesCount })) : null,
        React.createElement(Components.FileList, { displayText: displayText, files: files, isResumable: isResumable, onCancelUpload: onCancelUpload, onDeleteUpload: onDeleteUpload, onResume: onResumeUpload, onPause: onPauseUpload, showThumbnails: showThumbnails, hasMaxFilesError: hasMaxFilesError, maxFileCount: maxFileCount }),
        hasUploadActions ? (React.createElement(Components.FileListFooter, { displayText: displayText, remainingFilesCount: remainingFilesCount, onClearAll: onClearAll, onUploadAll: onUploadAll })) : null));
});
// pass an empty object as first param to avoid destructive action on `FileUploaderBase`
const FileUploader = Object.assign({}, FileUploaderBase, {
    Container,
    DropZone,
    FileList,
    FileListHeader,
    FileListFooter,
    FilePicker,
});

export { ACCESS_LEVEL_DEPRECATION_MESSAGE, ACCESS_LEVEL_WITH_PATH_CALLBACK_MESSAGE, FileUploader, MISSING_REQUIRED_PROPS_MESSAGE };