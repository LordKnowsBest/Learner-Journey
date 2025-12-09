import { IGamificationDataProvider } from './DataProvider.interface';
import { MockDataProvider } from './MockDataProvider';
import { FirebaseDataProvider } from './FirebaseDataProvider';
import { ENV_CONFIG } from '../../../config/environment';

let providerInstance: IGamificationDataProvider | null = null;

export const getDataProvider = (): IGamificationDataProvider => {
    if (!providerInstance) {
        if (ENV_CONFIG.DATA_MODE === 'firebase') {
            providerInstance = new FirebaseDataProvider();
            console.log('🔥 Using Firebase Data Provider (Production Mode)');
        } else {
            providerInstance = new MockDataProvider();
            console.log('📦 Using Mock Data Provider (Demo Mode)');
        }
    }
    return providerInstance;
};

// For testing: allow provider reset
export const resetDataProvider = (): void => {
    providerInstance = null;
};
