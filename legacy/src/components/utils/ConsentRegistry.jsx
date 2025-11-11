
import { Consent } from '@/api/entities';
import { User } from '@/api/entities';

// A simple in-memory cache to reduce database calls
const consentCache = new Map();

// Helper to load all consents for a user
const loadUserConsents = async (userId) => {
    if (consentCache.has(userId)) {
        return consentCache.get(userId);
    }
    const consents = await Consent.filter({ user_id: userId });
    const userConsents = new Map(consents.map(c => [c.feature_key, c]));
    consentCache.set(userId, userConsents);
    return userConsents;
};

export const ConsentRegistry = {
    /**
     * Retrieves a specific consent setting for the current user.
     * @param {string} featureKey - The key for the feature.
     * @returns {Promise<object|null>} - The consent object or null if not found.
     */
    async getConsent(featureKey) {
        try {
            const user = await User.me();
            if (!user) return null;
            
            const consents = await loadUserConsents(user.id);
            return consents.get(featureKey) || null;
        } catch (error) {
            console.error(`Consent retrieval failed for ${featureKey}:`, error);
            return null;
        }
    },

    /**
     * Sets the consent status for a specific feature.
     * @param {string} featureKey - The key for the feature.
     * @param {boolean} granted - True to grant consent, false to revoke.
     * @returns {Promise<boolean>} - True on success.
     */
    async setConsent(featureKey, granted) {
        if (granted) {
            return this.grantConsent(featureKey);
        } else {
            return this.revokeConsent(featureKey);
        }
    },

    /**
     * Checks if a user has granted consent for a specific AI feature.
     * @param {string} featureKey - The key for the feature (e.g., 'ai_personalization').
     * @returns {Promise<boolean>} - True if consent is granted, false otherwise.
     */
    async hasConsent(featureKey) {
        const consent = await this.getConsent(featureKey);
        return consent?.status === 'granted';
    },

    /**
     * Grants consent for a specific AI feature for the current user.
     * @param {string} featureKey - The key for the feature.
     * @returns {Promise<boolean>} - True on success.
     */
    async grantConsent(featureKey) {
        try {
            const user = await User.me();
            if (!user) return false;

            const consents = await loadUserConsents(user.id);
            const existingConsent = consents.get(featureKey);

            if (existingConsent) {
                if (existingConsent.status === 'granted') return true; // No change needed
                await Consent.update(existingConsent.id, { status: 'granted', last_updated: new Date().toISOString() });
            } else {
                await Consent.create({
                    user_id: user.id,
                    feature_key: featureKey,
                    status: 'granted',
                    last_updated: new Date().toISOString()
                });
            }
            consentCache.delete(user.id); // Invalidate cache
            return true;
        } catch (error) {
            console.error(`Granting consent failed for ${featureKey}:`, error);
            return false;
        }
    },

    /**
     * Revokes consent for a specific AI feature for the current user.
     * @param {string} featureKey - The key for the feature.
     * @returns {Promise<boolean>} - True on success.
     */
    async revokeConsent(featureKey) {
        try {
            const user = await User.me();
            if (!user) return false;

            const consents = await loadUserConsents(user.id);
            const existingConsent = consents.get(featureKey);

            if (existingConsent) {
                if (existingConsent.status === 'revoked') return true; // No change needed
                await Consent.update(existingConsent.id, { status: 'revoked', last_updated: new Date().toISOString() });
            } else {
                 await Consent.create({
                    user_id: user.id,
                    feature_key: featureKey,
                    status: 'revoked',
                    last_updated: new Date().toISOString()
                });
            }
            consentCache.delete(user.id); // Invalidate cache
            return true;
        } catch (error) {
            console.error(`Revoking consent failed for ${featureKey}:`, error);
            return false;
        }
    },

    /**
     * Retrieves all consent settings for the current user.
     * @returns {Promise<Map<string, object>>} - A map of feature keys to consent objects.
     */
    async getAllConsents() {
        try {
            const user = await User.me();
            if (!user) return new Map();
            return await loadUserConsents(user.id);
        } catch {
            return new Map();
        }
    }
};
