import { createManagedAuthAdapter } from '../../../adapters/createManagedAuthAdapter/createManagedAuthAdapter';
import { createListLocationsHandler } from '../../../adapters/createManagedAuthAdapter/createListLocationsHandler';
import { createLocationCredentialsHandler } from '../../../adapters/createManagedAuthAdapter/createLocationCredentialsHandler';

jest.mock(
  '../../../adapters/createManagedAuthAdapter/createListLocationsHandler'
);
jest.mock(
  '../../../adapters/createManagedAuthAdapter/createLocationCredentialsHandler'
);

const mockCreateListLocationsHandler = jest.mocked(createListLocationsHandler);
const mockCreateLocationCredentialsHandler = jest.mocked(
  createLocationCredentialsHandler
);

describe('createManagedAuthConfigAdapter', () => {
  const region = 'us-foo-2';
  const accountId = 'XXXXXXXXXXXX';
  const credentialsProvider = jest.fn();
  const customEndpoint = 'mock-endpoint';
  const mockCreatedListLocationsHandler = jest.fn();
  const mockCreatedLocationCredentialsHandler = jest.fn();
  const mockRegisterAuthListener = jest.fn();

  beforeEach(() => {
    mockCreateListLocationsHandler.mockReturnValue(
      mockCreatedListLocationsHandler
    );
    mockCreateLocationCredentialsHandler.mockReturnValue(
      mockCreatedLocationCredentialsHandler
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass region and accountId to the adapter', () => {
    expect(
      createManagedAuthAdapter({
        region,
        credentialsProvider: jest.fn(),
        accountId,
        registerAuthListener: mockRegisterAuthListener,
      })
    ).toMatchObject({
      region,
      accountId,
    });
  });

  it('should create list locations handler', () => {
    expect(
      createManagedAuthAdapter({
        region,
        accountId,
        credentialsProvider,
        customEndpoint,
        registerAuthListener: mockRegisterAuthListener,
      })
    ).toMatchObject({
      listLocations: mockCreatedListLocationsHandler,
    });
    expect(mockCreateListLocationsHandler).toHaveBeenCalledWith({
      region,
      accountId,
      credentialsProvider,
      customEndpoint,
    });
  });

  it('should create get location credentials handler', () => {
    expect(
      createManagedAuthAdapter({
        region,
        accountId,
        credentialsProvider,
        customEndpoint,
        registerAuthListener: mockRegisterAuthListener,
      })
    ).toMatchObject({
      getLocationCredentials: mockCreatedLocationCredentialsHandler,
    });
    expect(mockCreateLocationCredentialsHandler).toHaveBeenCalledWith({
      region,
      accountId,
      credentialsProvider,
      customEndpoint,
    });
  });
});
