import { StatusCounts } from '../../../../tasks';
import { DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT } from '../default';

describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT', () => {
  it('should match snapshot', () => {
    expect(DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT).toMatchSnapshot();
  });

  describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CreateFolderView', () => {
    it('should match snapshot', () => {
      expect(
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CreateFolderView
      ).toMatchSnapshot();
    });

    it('returns string values from callbacks', () => {
      const { getActionCompleteMessage, getValidationMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CreateFolderView;

      expect(typeof getActionCompleteMessage({} as StatusCounts)).toBe(
        'string'
      );
      expect(typeof getValidationMessage('foldername')).toBe('string');
    });
  });

  describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CopyView', () => {
    it('should match snapshot', () => {
      expect(DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CopyView).toMatchSnapshot();
    });

    it('returns string values from callbacks', () => {
      const { getActionCompleteMessage, getFolderSelectedMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CopyView;

      expect(typeof getActionCompleteMessage({} as StatusCounts)).toBe(
        'string'
      );
      expect(typeof getFolderSelectedMessage('')).toBe('string');
    });

    it('returns correct string for getFolderSelectedMessage', () => {
      const { getFolderSelectedMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.CopyView;

      expect(getFolderSelectedMessage('path/to/somewhere')).toBe(
        `Current folder selected: path/to/somewhere. There are no additional folders under this path.`
      );
    });
  });

  describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.DeleteView', () => {
    it('should match snapshot', () => {
      expect(DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.DeleteView).toMatchSnapshot();
    });

    it('returns string values from callbacks', () => {
      const { getActionCompleteMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.DeleteView;

      expect(typeof getActionCompleteMessage({} as StatusCounts)).toBe(
        'string'
      );
    });
  });

  describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.UploadView', () => {
    it('should match snapshot', () => {
      expect(DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.UploadView).toMatchSnapshot();
    });

    it('returns string values from callbacks', () => {
      const { getActionCompleteMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.UploadView;

      expect(typeof getActionCompleteMessage({} as StatusCounts)).toBe(
        'string'
      );
    });
  });

  describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationDetailView', () => {
    it('should have expected keys', () => {
      expect(
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationDetailView
      ).toMatchObject({
        getListResultsMessage: expect.any(Function),
        searchExhaustedMessage: expect.any(String),
        searchIncludeSubfoldersLabel: expect.any(String),
        searchPlaceholder: expect.any(String),
        tableColumnLastModifiedHeader: expect.any(String),
        tableColumnNameHeader: expect.any(String),
        tableColumnSizeHeader: expect.any(String),
        tableColumnTypeHeader: expect.any(String),
        title: expect.any(Function),
      });

      expect(
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationDetailView
      ).toMatchSnapshot();
    });

    it('returns string values from callbacks', () => {
      const { getListResultsMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationDetailView;

      expect(
        typeof getListResultsMessage({
          key: '',
          id: '',
          lastModified: new Date(),
          size: 1000,
          type: 'FILE',
        })
      ).toBe('string');
    });
  });

  describe('DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationsView', () => {
    it('should match snapshot', () => {
      expect(
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationsView
      ).toMatchSnapshot();
    });

    it('returns string values from callbacks', () => {
      const { getListResultsMessage } =
        DEFAULT_STORAGE_BROWSER_DISPLAY_TEXT.LocationsView;

      expect(
        typeof getListResultsMessage({
          bucket: '',
          permission: 'READ',
          prefix: '',
          id: '',
          type: 'PREFIX',
        })
      ).toBe('string');
    });
  });
});
