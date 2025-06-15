const { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");

const REVALIDATION_SECRET = "blockchain-briefing-secret-key-2024";
const FRONTEND_URL = "https://blockchain-briefing.vercel.app/"; 

// @ts-ignore
async function triggerRevalidation(reason) {
  try {
    logger.info(`Triggering revalidation: ${reason}`);
    
    const response = await fetch(`${FRONTEND_URL}/api/revalidate?secret=${REVALIDATION_SECRET}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.status}`);
    }

    logger.info('Homepage revalidated successfully');
  } catch (error) {
    logger.error('Revalidation failed:', error);
  }
}

// Articles triggers
exports.onArticleCreated = onDocumentCreated(
    "blog/blockchainBriefing/articles/{articleId}",
    // @ts-ignore
  async (event) => {
    const data = event.data?.data();
    if (data?.status === "published") {
      await triggerRevalidation(`New article: ${data.title}`);
    }
  }
);

exports.onArticleDeleted = onDocumentDeleted(
  "blog/blockchainBriefing/articles/{articleId}",
  async () => {
    await triggerRevalidation("Article deleted");
  }
);

exports.onArticleUpdated = onDocumentUpdated(
  "blog/blockchainBriefing/articles/{articleId}",
  // @ts-ignore
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    
    if (before?.status !== after?.status) {
      await triggerRevalidation(`Article status changed`);
    }
  }
);

// Newsletter triggers
exports.onNewsletterCreated = onDocumentCreated(
  "blog/blockchainBriefing/newsletter/{newsletterId}",
  // @ts-ignore
  async (event) => {
    const data = event.data?.data();
    if (data?.status === "published") {
      await triggerRevalidation(`New newsletter: ${data.title}`);
    }
  }
);

exports.onNewsletterDeleted = onDocumentDeleted(
  "blog/blockchainBriefing/newsletter/{newsletterId}",
  async () => {
    await triggerRevalidation("Newsletter deleted");
  }
);

exports.onNewsletterUpdated = onDocumentUpdated(
  "blog/blockchainBriefing/newsletter/{newsletterId}",
  // @ts-ignore
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    
    if (before?.status !== after?.status) {
      await triggerRevalidation(`Newsletter status changed`);
    }
  }
);