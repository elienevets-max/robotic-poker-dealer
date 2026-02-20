#!/usr/bin/env node
/**
 * Roboflow YouTube Channel Transcript Downloader (Node.js)
 * =========================================================
 * Downloads and organizes transcripts from all Roboflow YouTube channel videos.
 *
 * Usage:
 *   npm install youtube-transcript
 *   node scripts/download_roboflow_transcripts.js
 *
 *   # Options:
 *   node scripts/download_roboflow_transcripts.js --discover      # Also discover videos from channel
 *   node scripts/download_roboflow_transcripts.js --skip-discover  # Only known IDs (default)
 *   node scripts/download_roboflow_transcripts.js --resume         # Skip already downloaded
 *
 * Output:
 *   transcripts/roboflow/
 *   ├── raw/                          # Individual transcript .txt files
 *   ├── by_category/                  # Organized by topic
 *   ├── all_transcripts.json          # Complete JSON with metadata
 *   └── roboflow_transcripts_organized.txt  # Single organized file
 */

const { YoutubeTranscript } = require('youtube-transcript');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Known Roboflow YouTube video IDs (discovered from GitHub repos + blogs)
// ---------------------------------------------------------------------------
const KNOWN_VIDEOS = {
  // Fine-Tuning Tutorials - Object Detection
  "i3KjYgxNH6w": "Fine-Tune YOLO11 on Object Detection Dataset",
  "jE_s4tVgPHA": "Fine-Tune PaliGemma2 on Object Detection Dataset",
  "5nsmXLyDaU4": "Fine-Tune YOLOv8 on Object Detection Dataset",
  "8yRE2Pa-8_I": "Fine-Tune YOLOv5 on Object Detection Dataset",
  "vKzfvtEtiYo": "Fine-Tune YOLOv7 on Object Detection Dataset",
  "cMa77r3YrDk": "Fine-Tune YOLOv9 on Object Detection Dataset",
  "V-H3eoPUnA8": "Fine-Tune YOLOv10 on Object Detection Dataset",
  "4HNkBMfw-2o": "Fine-Tune MT-YOLOv6 on Object Detection Dataset",
  "X7gKBGVz4vs": "Fine-Tune RT-DETR on Object Detection Dataset",
  "AM8D4j9KoaU": "Fine-Tune RTMDet on Object Detection Dataset",
  "8o701AEoZ8I": "Fine-Tune Scaled-YOLOv4 on Object Detection Dataset",
  "NTnZgLsk_DA": "Fine-Tune YOLOS on Object Detection Dataset",
  "pFiGSrRtaU4": "Fine-Tune DETR Transformer on Object Detection Dataset",

  // Fine-Tuning - Segmentation
  "hj_ybcRdk5Y": "Fine-Tune YOLO11 on Instance Segmentation Dataset",
  "N0V0xxSi6Xc": "Fine-Tune YOLOv5 on Instance Segmentation Dataset",
  "e8LPflX0nwQ": "Fine-Tune YOLOv7 on Instance Segmentation Dataset",
  "q3RbFbaQQGw": "Fine-Tune SegFormer on Instance Segmentation Dataset",
  "sZ5DiXDOHEM": "Fine-Tune Faster RCNN on Instance Segmentation Dataset",
  "xEfh0IR8Fvo": "Fine-Tune RF-DETR Segmentation on Custom Dataset",

  // Fine-Tuning - Other Tasks
  "DPjp9Kq4qn8": "Fine-Tune YOLOv8 on Classification Dataset",
  "rEbpKxZbvIo": "Fine-Tune YOLOv5 on Classification Dataset",
  "93kXzUOiYY4": "Fine-Tune ViT on Classification Dataset",
  "vFGxM2KLs10": "Fine-Tune YOLOv8 on Pose Estimation Dataset",
  "fFCWrMFH2UY": "Fine-Tune YOLOv8 on Oriented Bounding Boxes (OBB) Dataset",
  "yHNPyqazYYU": "Fine-Tune PaliGemma on Object Detection Dataset",
  "XHT2c8jT3Bc": "Fine-Tune Florence-2 on Object Detection Dataset",
  "QnCGcFHZy9s": "Zero-Shot Object Detection with Qwen2.5-VL",
  "6Q6TieCBA4E": "Fine-Tune GPT-4o on Object Detection Dataset",

  // SAM (Segment Anything Model)
  "G1AEuFwQrWU": "Segment Images with SAM3",
  "OMBmVInx68M": "Segment Images with SAM2",
  "Dv003fTyO-Y": "Fine-Tune SAM-2.1 / PaliGemma2 for LaTeX OCR",
  "QCG8QMhga9k": "Auto-Annotate Dataset with GroundedSAM 2",
  "yHW0ip-2i54": "SAM3 Live Session",

  // Zero-Shot & Foundation Models
  "eHAnIehnCt4": "Zero-Shot Object Detection and Segmentation with YOLOE",
  "D-D6ZmadzPE": "Zero-Shot Object Detection with YOLO-World",
  "5kgWyo6Sg4E": "Run Different Vision Tasks with Florence-2",

  // Sports AI / Applied Projects
  "l_kf9CfZ_8M": "Basketball AI: How to Detect Track and Identify Basketball Players",
  "uWP6UjDeZvY": "Basketball AI: Detect NBA 3 Second Violation",
  "OS5qI9YBkfk": "Football AI",
  "YxJkE6FvGF4": "Estimate Vehicle Speed with YOLOv8",

  // Tracking & Counting
  "C4NqaRBz_Kw": "Track and Count Vehicles with YOLOv8 + ByteTRACK + Supervision",
  "oEQYStnF2l8": "Detect and Count Objects in Polygon Zone",
  "yGQb9KkvQ1Q": "How to Track Objects with RF-DETR and SORT Tracker",

  // Inference & Deployment
  "jIgZMr-PBMo": "Roboflow Video Inference with Custom Annotators",
  "gKTYMfwPo4M": "Run YOLOv7 Object Detection with OpenVINO + TorchORT",

  // Other
  "wuZtUMEiKWY": "Fine-Tune YOLO-NAS on Object Detection Dataset",
  "aBVGKoNZQUw": "Roboflow Notebook Tutorial",
  "-OvpdLAElFA": "RF-DETR Architecture and How it Works",
  "hAWpsIuem10": "Supervision Library Tutorial",
};

// Category classification
const CATEGORIES = {
  object_detection: ["object detection", "yolo", "detr", "rtmdet", "detect", "bounding box"],
  segmentation: ["segment", "sam", "segformer", "mask", "instance segmentation"],
  classification: ["classification", "classify", "vit"],
  tracking: ["track", "bytetrack", "sort", "count", "speed"],
  zero_shot: ["zero-shot", "zero shot", "yolo-world", "yoloe", "open vocabulary"],
  vlm_and_multimodal: ["florence", "paligemma", "qwen", "gpt-4o", "vlm", "ocr", "latex"],
  sports_ai: ["basketball", "football", "soccer", "sports", "nba"],
  annotation_and_data: ["annotate", "annotation", "auto-annotate", "grounded", "dataset"],
  inference_and_deployment: ["inference", "deploy", "openvino", "torchort", "supervision"],
  pose_estimation: ["pose", "keypoint"],
  architecture_and_theory: ["architecture", "how it works", "explained"],
};

function classifyVideo(title) {
  const lower = title.toLowerCase();
  const matched = [];
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw))) {
      matched.push(cat);
    }
  }
  return matched.length ? matched : ["uncategorized"];
}

function sanitize(name) {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 80);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function discoverChannelVideos() {
  console.log("\n[DISCOVER] Fetching all video IDs from Roboflow YouTube channel...");
  try {
    const result = execSync(
      'yt-dlp --flat-playlist --print "%(id)s|%(title)s" "https://www.youtube.com/@Roboflow/videos"',
      { timeout: 300000, encoding: 'utf-8' }
    );
    const discovered = {};
    for (const line of result.trim().split('\n')) {
      const [id, ...titleParts] = line.split('|');
      if (id && titleParts.length) {
        discovered[id.trim()] = titleParts.join('|').trim();
      }
    }
    console.log(`[DISCOVER] Found ${Object.keys(discovered).length} videos`);
    return discovered;
  } catch (err) {
    console.log(`[DISCOVER] yt-dlp failed: ${err.message?.slice(0, 200)}`);
    console.log("[DISCOVER] Falling back to known video IDs only");
    return {};
  }
}

async function downloadTranscript(videoId, title) {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    const text = segments.map(s => s.text).join(' ').replace(/\s+/g, ' ').trim();
    return {
      video_id: videoId,
      title,
      text,
      segments: segments.map(s => ({
        start: s.offset / 1000,
        duration: s.duration / 1000,
        text: s.text,
      })),
      chars: text.length,
      segment_count: segments.length,
    };
  } catch (err) {
    return {
      video_id: videoId,
      title,
      text: "",
      error: `${err.name || 'Error'}: ${(err.message || '').slice(0, 200)}`,
      chars: 0,
      segment_count: 0,
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const doDiscover = args.includes('--discover');
  const resume = args.includes('--resume');

  const projectRoot = path.resolve(__dirname, '..');
  const outputDir = path.join(projectRoot, 'transcripts', 'roboflow');
  const rawDir = path.join(outputDir, 'raw');
  const catDir = path.join(outputDir, 'by_category');

  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(catDir, { recursive: true });

  // Collect video IDs
  let allVideos = { ...KNOWN_VIDEOS };
  if (doDiscover) {
    const discovered = discoverChannelVideos();
    allVideos = { ...allVideos, ...discovered };
  }

  const videoEntries = Object.entries(allVideos).sort((a, b) => a[1].localeCompare(b[1]));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Roboflow YouTube Transcript Downloader (Node.js)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total videos to process: ${videoEntries.length}`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`${'='.repeat(60)}\n`);

  // Load existing data for resume
  let existingData = {};
  const jsonPath = path.join(outputDir, 'all_transcripts.json');
  if (resume && fs.existsSync(jsonPath)) {
    existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`[RESUME] Found ${Object.keys(existingData.videos || {}).length} previously downloaded\n`);
  }

  const results = {};
  let successCount = 0, errorCount = 0, skipCount = 0;

  for (let i = 0; i < videoEntries.length; i++) {
    const [videoId, title] = videoEntries[i];
    const num = `[${i + 1}/${videoEntries.length}]`;

    // Resume check
    if (resume && existingData.videos?.[videoId]?.text) {
      results[videoId] = existingData.videos[videoId];
      skipCount++;
      console.log(`${num} SKIP: ${title}`);
      continue;
    }

    process.stdout.write(`${num} Downloading: ${title} (${videoId})... `);

    const data = await downloadTranscript(videoId, title);

    if (data.error) {
      console.log(`ERROR: ${data.error.slice(0, 80)}`);
      errorCount++;
    } else {
      console.log(`OK (${data.chars} chars, ${data.segment_count} segments)`);
      successCount++;

      // Save individual raw transcript
      const safeName = sanitize(title);
      const rawFile = path.join(rawDir, `${videoId}_${safeName}.txt`);
      fs.writeFileSync(rawFile, [
        `Title: ${title}`,
        `Video ID: ${videoId}`,
        `URL: https://www.youtube.com/watch?v=${videoId}`,
        `Characters: ${data.chars}`,
        `Segments: ${data.segment_count}`,
        `Downloaded: ${new Date().toISOString()}`,
        `${'='.repeat(60)}\n`,
        data.text,
      ].join('\n'));
    }

    results[videoId] = data;

    // Rate limiting
    if (i < videoEntries.length - 1) {
      await sleep(1000);
    }
  }

  // Save complete JSON
  const jsonOutput = {
    metadata: {
      channel: "Roboflow",
      channel_id: "UCkPjOoFMapbqhJ07bT56bAA",
      channel_url: "https://www.youtube.com/@Roboflow/videos",
      downloaded_at: new Date().toISOString(),
      total_videos: Object.keys(results).length,
      successful: successCount,
      errors: errorCount,
      skipped: skipCount,
    },
    videos: results,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));

  // Organize by category
  const categorized = {};
  for (const [videoId, data] of Object.entries(results)) {
    if (!data.text) continue;
    const cats = classifyVideo(data.title || '');
    for (const cat of cats) {
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(data);
    }
  }

  for (const [cat, videos] of Object.entries(categorized).sort()) {
    const catFile = path.join(catDir, `${cat}.txt`);
    let content = `${'='.repeat(60)}\nCATEGORY: ${cat.toUpperCase().replace(/_/g, ' ')}\nVideos: ${videos.length}\n${'='.repeat(60)}\n\n`;
    for (const v of videos.sort((a, b) => (a.title || '').localeCompare(b.title || ''))) {
      content += `---\nTitle: ${v.title}\nVideo ID: ${v.video_id}\nURL: https://www.youtube.com/watch?v=${v.video_id}\nCharacters: ${v.chars}\n---\n\n${v.text}\n\n`;
    }
    fs.writeFileSync(catFile, content);
  }

  // Create single organized file
  const orgFile = path.join(outputDir, 'roboflow_transcripts_organized.txt');
  let orgContent = `${'='.repeat(70)}\nROBOFLOW YOUTUBE CHANNEL — COMPLETE TRANSCRIPT COLLECTION\n${'='.repeat(70)}\n`;
  orgContent += `Channel: https://www.youtube.com/@Roboflow\n`;
  orgContent += `Downloaded: ${new Date().toISOString()}\n`;
  orgContent += `Total videos: ${Object.keys(results).length}\n`;
  orgContent += `Successful: ${successCount}\n`;
  orgContent += `Errors: ${errorCount}\n`;
  orgContent += `${'='.repeat(70)}\n\n`;

  // Table of contents
  orgContent += "TABLE OF CONTENTS\n" + "-".repeat(40) + "\n";
  for (const [cat, vids] of Object.entries(categorized).sort()) {
    orgContent += `\n${cat.toUpperCase().replace(/_/g, ' ')} (${vids.length} videos):\n`;
    for (const v of vids.sort((a, b) => (a.title || '').localeCompare(b.title || ''))) {
      orgContent += `  - ${v.title}\n`;
    }
  }
  orgContent += "\n" + "=".repeat(70) + "\n\n";

  // Full transcripts
  for (const [cat, videos] of Object.entries(categorized).sort()) {
    orgContent += `\n${'#'.repeat(70)}\n# ${cat.toUpperCase().replace(/_/g, ' ')}\n# ${videos.length} videos\n${'#'.repeat(70)}\n\n`;
    for (const v of videos.sort((a, b) => (a.title || '').localeCompare(b.title || ''))) {
      orgContent += `${'─'.repeat(60)}\nTITLE: ${v.title}\nVIDEO: https://www.youtube.com/watch?v=${v.video_id}\nLENGTH: ${v.chars} characters | ${v.segment_count} segments\n${'─'.repeat(60)}\n\n${v.text}\n\n`;
    }
  }
  fs.writeFileSync(orgFile, orgContent);

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log("DOWNLOAD COMPLETE");
  console.log(`${'='.repeat(60)}`);
  console.log(`Total: ${Object.keys(results).length} | Success: ${successCount} | Skip: ${skipCount} | Errors: ${errorCount}`);
  console.log(`\nOutput files:`);
  console.log(`  Raw:        ${rawDir}/`);
  console.log(`  Categories: ${catDir}/`);
  console.log(`  JSON:       ${jsonPath}`);
  console.log(`  Organized:  ${orgFile}`);

  if (Object.keys(categorized).length) {
    console.log(`\nCategories:`);
    for (const [cat, vids] of Object.entries(categorized).sort()) {
      console.log(`  ${cat}: ${vids.length} videos`);
    }
  }

  // Show errors
  const errors = Object.entries(results).filter(([, d]) => d.error);
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    for (const [, d] of errors.slice(0, 10)) {
      console.log(`  - ${d.title}: ${(d.error || '').slice(0, 80)}`);
    }
    if (errors.length > 10) console.log(`  ... and ${errors.length - 10} more`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
