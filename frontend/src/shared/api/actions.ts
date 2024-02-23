import { AxiosRequestConfig } from 'axios';


/**
 * Create request function with predefined arguments set.
 * Useful for those types of api requests that require payload.
 */
export const createRequest = <D = unknown, R = unknown>(
    cb: (data: D, config?: AxiosRequestConfig<D>) => R
) => {
    return (data: D, config?: AxiosRequestConfig<D>) => {
        return cb(data, config);
    };
};

/**
 * Create request function with predefined arguments set.
 * Useful for those types of api requests that do not require payload.
 */
export const createRequestWithoutData = <R = unknown>(
    cb: (config?: AxiosRequestConfig<never>) => R
) => {
    return (config?: AxiosRequestConfig<never>) => {
        return cb(config);
    };
};
