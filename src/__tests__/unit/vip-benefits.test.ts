import { describe, it, expect } from 'vitest';

import { VIP_BENEFITS, type UserTier } from '@/types';

describe('VIP Benefits', () => {
  describe('Free Tier', () => {
    const benefits = VIP_BENEFITS.free;

    it('should have no daily free chapters', () => {
      expect(benefits.dailyFreeChapters).toBe(0);
    });

    it('should not skip ads', () => {
      expect(benefits.adSkip).toBe(false);
    });

    it('should have 24 hour wait-free time', () => {
      expect(benefits.waitFreeHours).toBe(24);
    });

    it('should not have download enabled', () => {
      expect(benefits.downloadEnabled).toBe(false);
    });

    it('should not have exclusive content access', () => {
      expect(benefits.exclusiveContent).toBe(false);
    });

    it('should not have monthly bonus coins', () => {
      expect(benefits.monthlyBonusCoins).toBeUndefined();
    });
  });

  describe('VIP Tier', () => {
    const benefits = VIP_BENEFITS.vip;

    it('should have 5 daily free chapters', () => {
      expect(benefits.dailyFreeChapters).toBe(5);
    });

    it('should skip ads', () => {
      expect(benefits.adSkip).toBe(true);
    });

    it('should have 12 hour wait-free time (50% reduction)', () => {
      expect(benefits.waitFreeHours).toBe(12);
    });

    it('should have download enabled', () => {
      expect(benefits.downloadEnabled).toBe(true);
    });

    it('should not have exclusive content access', () => {
      expect(benefits.exclusiveContent).toBe(false);
    });

    it('should have 200 monthly bonus coins', () => {
      expect(benefits.monthlyBonusCoins).toBe(200);
    });
  });

  describe('SVIP Tier', () => {
    const benefits = VIP_BENEFITS.svip;

    it('should have 15 daily free chapters', () => {
      expect(benefits.dailyFreeChapters).toBe(15);
    });

    it('should skip ads', () => {
      expect(benefits.adSkip).toBe(true);
    });

    it('should have 6 hour wait-free time (75% reduction)', () => {
      expect(benefits.waitFreeHours).toBe(6);
    });

    it('should have download enabled', () => {
      expect(benefits.downloadEnabled).toBe(true);
    });

    it('should have exclusive content access', () => {
      expect(benefits.exclusiveContent).toBe(true);
    });

    it('should have 500 monthly bonus coins', () => {
      expect(benefits.monthlyBonusCoins).toBe(500);
    });

    it('should have author direct message feature', () => {
      expect(benefits.authorDirectMessage).toBe(true);
    });
  });

  describe('Wait-Free Time Calculation', () => {
    it('should calculate correct wait times for each tier', () => {
      const tiers: UserTier[] = ['free', 'vip', 'svip'];
      const expectedHours = [24, 12, 6];

      tiers.forEach((tier, index) => {
        expect(VIP_BENEFITS[tier].waitFreeHours).toBe(expectedHours[index]);
      });
    });

    it('should progressively reduce wait time with higher tiers', () => {
      const freeWait = VIP_BENEFITS.free.waitFreeHours;
      const vipWait = VIP_BENEFITS.vip.waitFreeHours;
      const svipWait = VIP_BENEFITS.svip.waitFreeHours;

      expect(vipWait).toBeLessThan(freeWait);
      expect(svipWait).toBeLessThan(vipWait);
    });
  });

  describe('Benefit Comparison', () => {
    it('SVIP should have all VIP benefits and more', () => {
      const vip = VIP_BENEFITS.vip;
      const svip = VIP_BENEFITS.svip;

      expect(svip.dailyFreeChapters).toBeGreaterThanOrEqual(vip.dailyFreeChapters);
      expect(svip.adSkip).toBe(vip.adSkip);
      expect(svip.downloadEnabled).toBe(vip.downloadEnabled);
      expect(svip.waitFreeHours).toBeLessThanOrEqual(vip.waitFreeHours);
      expect(svip.monthlyBonusCoins!).toBeGreaterThan(vip.monthlyBonusCoins!);
    });
  });
});
