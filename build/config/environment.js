import { env } from 'process';
import { ConfigurationError } from '../errors.js';
function validateConfigValue(value, name) {
    if (!value || value.trim() === '') {
        throw new ConfigurationError(`${name} is required and must be provided either through environment variables or constructor options`);
    }
    return value.trim();
}
export function createConfig(options) {
    const TOKEN = validateConfigValue(options?.token ?? env.CODING_TOKEN, 'Personal Access Token (token)');
    return {
        token: TOKEN,
        apiUrl: `https://e.coding.net/open-api`,
    };
}
