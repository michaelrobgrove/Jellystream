// Fixed server/referral.ts
import { storage } from './storage';
import { nanoid } from 'nanoid';

export interface ReferralResult {
  success: boolean;
  message: string;
  discount?: {
    type: 'amount' | 'percentage';
    value: number;
  };
}

export class ReferralService {
  // Generate a unique referral code for a user
  static generateReferralCode(): string {
    return nanoid(8).toUpperCase();
  }

  // Apply referral when a new user signs up
  static async applyReferral(newUserUsername: string, referralCode: string): Promise<ReferralResult> {
    try {
      console.log(`Processing referral for ${newUserUsername} with code ${referralCode}`);
      
      // Find the referring user by username (case insensitive)
      const referringUser = await storage.getUserByUsername(referralCode.toLowerCase());
      
      if (!referringUser) {
        console.log('Referring user not found');
        return {
          success: false,
          message: 'Invalid referral code'
        };
      }

      console.log(`Found referring user: ${referringUser.username}`);

      // Check if referring user has reached max referrals (3)
      const currentCredits = parseFloat(referringUser.referralCredits || '0');
      const maxCredits = 15.00; // 3 referrals × $5 each
      
      if (currentCredits >= maxCredits) {
        console.log(`Referring user has reached max credits: ${currentCredits}`);
        return {
          success: false,
          message: 'Referral limit reached for this user'
        };
      }

      // Add $5 credit to referring user
      const newCredits = Math.min(currentCredits + 5.00, maxCredits);
      await storage.updateReferralCredits(referringUser.id, newCredits.toString());

      console.log(`Updated referring user credits from ${currentCredits} to ${newCredits}`);

      // New user gets $1 first month discount
      return {
        success: true,
        message: 'Referral applied successfully - $1 first month!',
        discount: {
          type: 'amount',
          value: 100 // $1 in cents for Stripe
        }
      };
    } catch (error) {
      console.error('Error applying referral:', error);
      return {
        success: false,
        message: 'Failed to apply referral'
      };
    }
  }

  // Get referral stats for a user
  static async getReferralStats(userId: string) {
    try {
      const user = await storage.getUser(userId);
      if (!user) return null;

      const credits = parseFloat(user.referralCredits || '0');
      const maxCredits = 15.00;
      const remainingReferrals = Math.max(0, 3 - Math.floor(credits / 5));

      return {
        referralCode: user.referralCode || user.username,
        credits: credits,
        remainingReferrals: remainingReferrals,
        totalReferrals: Math.floor(credits / 5)
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return null;
    }
  }

  // Process referral after successful payment (called from routes.ts)
  async processReferral(referringUserId: string, newUserId: string): Promise<void> {
    try {
      const referringUser = await storage.getUser(referringUserId);
      const newUser = await storage.getUser(newUserId);
      
      if (!referringUser || !newUser) {
        throw new Error('User not found');
      }

      // Add $5 credit to referring user
      const currentCredits = parseFloat(referringUser.referralCredits || '0');
      const maxCredits = 15.00;
      
      if (currentCredits < maxCredits) {
        const newCredits = Math.min(currentCredits + 5.00, maxCredits);
        await storage.updateReferralCredits(referringUserId, newCredits.toString());
        
        console.log(`Processed referral: ${referringUser.username} earned $5 credit`);
      }
    } catch (error) {
      console.error('Error processing referral:', error);
      throw error;
    }
  }
}