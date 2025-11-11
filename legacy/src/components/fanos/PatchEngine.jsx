
import { Patch, User, PointTransaction, Event, SponsorDeal, CommunityPost } from '@/api/entities';
import { ProgressiveXPEngine } from '../xp/ProgressiveXPEngine';
import { NotificationService } from '../utils/NotificationService';

export class PatchEngine {
  /**
   * Claims a patch by its QR code ID for a given user.
   * @param {string} qrCodeId - The unique ID from the scanned QR code.
   * @param {string} userIdOrEmail - The user ID or email of the fan scanning.
   * @returns {object} Result of the claim attempt.
   */
  static async claimPatch(qrCodeId, userIdOrEmail) {
    try {
      // 1. Find the patch
      const patches = await Patch.filter({ qr_code_id: qrCodeId });
      if (patches.length === 0) {
        return {
          success: false,
          message: 'Patch not found. Check the QR code and try again.'
        };
      }

      const patch = patches[0];

      // 2. Check if patch is still available
      if (patch.inventory_status === 'claimed') {
        return {
          success: false,
          message: 'This patch has already been claimed.'
        };
      }

      if (patch.inventory_status === 'expired' || !patch.is_active) {
        return {
          success: false,
          message: 'This patch is no longer available.'
        };
      }

      // 3. Find the user (by ID or email)
      let user;
      if (userIdOrEmail.includes('@')) {
        // It's an email
        const users = await User.filter({ email: userIdOrEmail });
        if (users.length === 0) {
          return {
            success: false,
            message: 'User not found with that email address.'
          };
        }
        user = users[0];
      } else {
        // It's a user ID
        try {
          user = await User.get(userIdOrEmail);
        } catch (error) {
          return {
            success: false,
            message: 'User not found with that ID.'
          };
        }
      }

      // 4. Check if user has already claimed THIS specific patch
      if (patch.claimed_by_user_id) {
        return {
          success: false,
          message: 'This specific patch has already been claimed.'
        };
      }

      // Fetch associated event for context
      const event = patch.event_id ? await Event.get(patch.event_id) : null;

      // 5. Award XP using the Progressive XP Engine
      const xpResult = await ProgressiveXPEngine.awardProgressiveXP(
        user.id,
        'patch_scan',
        `Claimed patch: ${patch.name}`, // Assuming patch.name exists for better description
        {
          referenceId: patch.id,
          eventId: patch.event_id,
          sponsorId: patch.sponsor_id,
          context: 'field_scan',
          event: event // Pass the full event object
        }
      );

      let awardedBadges = [];
      // Award "First Patch" badge
      // Check if this user has any other patches claimed by filtering where claimed_by_user_id is set
      const existingPatches = await Patch.filter({ claimed_by_user_id: user.id });
      // If the only patch found is the current one being claimed (or none at all yet), it's their first
      // We need to count patches *excluding* the one currently being claimed if it's already in the filter result
      // A more robust check might be to count claims before this operation, or check for > 1 after the current claim
      // For simplicity, let's assume `filter` might return the *current* patch even before its status is updated,
      // so if the count is 1 (meaning only this one) it's the first. If 0, it's also the first.
      // If we filtered for *already claimed* patches, the current one won't show up yet.
      const alreadyClaimedPatches = existingPatches.filter(p => p.id !== patch.id && p.inventory_status === 'claimed');

      if (alreadyClaimedPatches.length === 0) {
        // This is the user's first patch
        await NotificationService.awardBadge(user.id, 'first_patch', 'First Patch Scanned!', 'You\'ve started your collection journey!');
        awardedBadges.push({ name: 'First Patch Scanned!', description: 'Welcome to the collector\'s club.' });
      }

      // 6. Update patch status
      const updatedPatch = await Patch.update(patch.id, {
        inventory_status: 'claimed',
        claimed_by_user_id: user.id,
        claimed_timestamp: new Date().toISOString()
      });

      // 7. Log the transaction for sponsor ROI tracking
      await PointTransaction.create({
        user_id: user.id,
        points_amount: xpResult.awarded,
        transaction_type: 'patch_scan',
        description: `Patch scan at event - ${patch.qr_code_id}`,
        reference_id: patch.id,
        source: 'field_scan'
      });
      
      const sponsor = patch.sponsor_id ? await SponsorDeal.get(patch.sponsor_id).catch(() => null) : null;

      return {
        success: true,
        message: `Successfully claimed '${patch.name || patch.qr_code_id}' and earned ${xpResult.awarded} XP!`,
        patch: updatedPatch,
        event: event,
        sponsor: sponsor,
        xpResult: xpResult,
        awardedBadges: awardedBadges
      };

    } catch (error) {
      console.error('Error in claimPatch:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Generates a new patch for an event
   * @param {string} eventId - The event ID
   * @param {string} sponsorId - The sponsor ID
   * @param {number} xpValue - XP value for this patch
   * @returns {object} The created patch
   */
  static async generatePatch(eventId, sponsorId, xpValue = 100) {
    try {
      // Generate a unique QR code ID
      const qrCodeId = this.generateQRCodeId();

      const newPatch = await Patch.create({
        qr_code_id: qrCodeId,
        event_id: eventId,
        sponsor_id: sponsorId,
        xp_value: xpValue,
        inventory_status: 'available',
        is_active: true
      });

      return {
        success: true,
        patch: newPatch,
        qrCodeUrl: `https://thebutton.ca/patch/${qrCodeId}`
      };
    } catch (error) {
      console.error('Error generating patch:', error);
      return {
        success: false,
        message: 'Failed to generate patch'
      };
    }
  }

  /**
   * Generates a unique QR code ID
   * @returns {string} A unique identifier
   */
  static generateQRCodeId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `PATCH-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Gets patch statistics for an event
   * @param {string} eventId - The event ID
   * @returns {object} Statistics about patches for the event
   */
  static async getPatchStats(eventId) {
    try {
      const patches = await Patch.filter({ event_id: eventId });
      
      const stats = {
        totalPatches: patches.length,
        availablePatches: patches.filter(p => p.inventory_status === 'available').length,
        claimedPatches: patches.filter(p => p.inventory_status === 'claimed').length,
        expiredPatches: patches.filter(p => p.inventory_status === 'expired').length,
        totalXPAwarded: patches
          .filter(p => p.inventory_status === 'claimed')
          .reduce((sum, p) => sum + p.xp_value, 0)
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting patch stats:', error);
      return {
        success: false,
        message: 'Failed to get patch statistics'
      };
    }
  }
}
