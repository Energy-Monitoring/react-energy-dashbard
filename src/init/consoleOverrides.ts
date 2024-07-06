// Save the original console.error method
const originalError = console.error;

// Overwrite console.error
console.error = (message?: any, ...optionalParams: any[]) => {

    if (typeof message === 'string' && message.includes('Support for defaultProps will be removed from function components in a future major release.')) {
        return;
    }
    originalError(message, ...optionalParams);
};

export {};
