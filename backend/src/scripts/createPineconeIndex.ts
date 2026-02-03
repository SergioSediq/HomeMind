/**
 * Create the HomeMind Pinecone index if it does not exist.
 * Uses Google text-embedding-004 (768 dimensions) with cosine similarity.
 *
 * Run: npx ts-node src/scripts/createPineconeIndex.ts
 * Or:  npm run pinecone:create (if added to package.json)
 */
import dotenv from "dotenv";
dotenv.config();

const INDEX_NAME = process.env.PINECONE_INDEX || "homemind-index";
const DIMENSION = 768; // Google text-embedding-004
const METRIC = "cosine";
const CLOUD = "aws";
const REGION = "us-east-1";

async function createPineconeIndex(): Promise<void> {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    console.error("❌ PINECONE_API_KEY is not set in .env");
    process.exit(1);
  }

  console.log(`📦 Checking Pinecone index: ${INDEX_NAME}`);

  try {
    // List existing indexes
    const listRes = await fetch("https://api.pinecone.io/indexes", {
      headers: { "Api-Key": apiKey },
    });

    if (!listRes.ok) {
      throw new Error(`Failed to list indexes: ${listRes.status} ${listRes.statusText}`);
    }

    const listData = (await listRes.json()) as { indexes?: { name: string }[] };
    const indexes = listData.indexes || [];
    const exists = indexes.some((idx) => idx.name === INDEX_NAME);

    if (exists) {
      console.log(`✅ Index "${INDEX_NAME}" already exists. Nothing to do.`);
      return;
    }

    // Create the index
    console.log(`🔨 Creating index "${INDEX_NAME}" (dimension=${DIMENSION}, metric=${METRIC})...`);

    const createRes = await fetch("https://api.pinecone.io/indexes", {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: INDEX_NAME,
        dimension: DIMENSION,
        metric: METRIC,
        spec: {
          serverless: {
            cloud: CLOUD,
            region: REGION,
          },
        },
        deletion_protection: "disabled",
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Failed to create index: ${createRes.status} - ${errText}`);
    }

    console.log(`✅ Index "${INDEX_NAME}" created successfully!`);
    console.log("   It may take a few minutes to become ready. Run `npm run upsert` to add data.");
  } catch (err) {
    console.error("❌ Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

createPineconeIndex();
