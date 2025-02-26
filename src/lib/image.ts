import { screenshotOneClient } from '@/services/screenshotone';
import * as screenshotone from 'screenshotone-api-sdk';

export const generateScreenshot = async (url: string, slug: string): Promise<void> => {
  const options = screenshotone.TakeOptions.url(url)
    .delay(3)
    .viewportHeight(720)
    .viewportWidth(1280)
    .format('webp')
    .responseType('by_format')
    .blockAds(true)
    .blockCookieBanners(true)
    .blockBannersByHeuristics(false)
    .blockTrackers(true)
    .blockChats(true)
    .cache(true)
    .cacheTtl(2592000)
    .timeout(60)
    .darkMode(true)
    .reducedMotion(true)
    .store(true)
    .storagePath(slug)
    .imageQuality(100);

  try {
    const endpointUrl = await screenshotOneClient.generateSignedTakeURL(options);

    await fetch(endpointUrl);
  } catch (error) {
    console.error('Error fetching screenshot:', error);
    throw error;
  }
};
