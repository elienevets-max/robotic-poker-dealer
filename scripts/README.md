# Roboflow YouTube Transcript Downloader

Downloads and organizes transcripts from all Roboflow YouTube channel videos.

## Quick Start

### Python (recommended)

```bash
pip install yt-dlp youtube-transcript-api
python scripts/download_roboflow_transcripts.py
```

### Node.js

```bash
npm install youtube-transcript
node scripts/download_roboflow_transcripts.js
```

## Options

### Python

```bash
# Full run: discover all channel videos + download transcripts
python scripts/download_roboflow_transcripts.py

# Skip channel discovery, only use the 49 known video IDs
python scripts/download_roboflow_transcripts.py --skip-discover

# Resume a previous interrupted run
python scripts/download_roboflow_transcripts.py --resume

# Faster (shorter delay between requests)
python scripts/download_roboflow_transcripts.py --delay 0.5

# Custom output directory
python scripts/download_roboflow_transcripts.py --output-dir transcripts/my_output
```

### Node.js

```bash
# Default: use known video IDs only
node scripts/download_roboflow_transcripts.js

# Also discover all videos from the channel (requires yt-dlp)
node scripts/download_roboflow_transcripts.js --discover

# Resume previous run
node scripts/download_roboflow_transcripts.js --resume
```

## Output Structure

```
transcripts/roboflow/
├── raw/                                    # Individual transcript files
│   ├── i3KjYgxNH6w_Fine-Tune_YOLO11.txt
│   ├── 5nsmXLyDaU4_Fine-Tune_YOLOv8.txt
│   └── ...
├── by_category/                            # Organized by topic
│   ├── object_detection.txt
│   ├── segmentation.txt
│   ├── tracking.txt
│   ├── zero_shot.txt
│   ├── vlm_and_multimodal.txt
│   ├── sports_ai.txt
│   ├── classification.txt
│   ├── pose_estimation.txt
│   ├── annotation_and_data.txt
│   ├── inference_and_deployment.txt
│   └── architecture_and_theory.txt
├── all_transcripts.json                    # Complete JSON with metadata
└── roboflow_transcripts_organized.txt      # Single file, all transcripts
```

## Known Video IDs (49)

The scripts include 49 known Roboflow YouTube video IDs discovered from:
- [roboflow/notebooks](https://github.com/roboflow/notebooks) GitHub repo
- [roboflow/rf-detr](https://github.com/roboflow/rf-detr) GitHub repo
- [roboflow/supervision](https://github.com/roboflow/supervision) GitHub repo

When run with `--discover` (Python default), the scripts use `yt-dlp` to fetch the
complete list of all videos from the channel, which will include videos beyond
these 49 known IDs.

## Categories

Videos are auto-classified into these categories based on title keywords:

| Category | Keywords |
|---|---|
| Object Detection | yolo, detr, detect, bounding box |
| Segmentation | sam, segment, segformer, mask |
| Classification | classification, vit |
| Tracking | track, bytetrack, count, speed |
| Zero-Shot | zero-shot, yolo-world, yoloe |
| VLM & Multimodal | florence, paligemma, qwen, gpt-4o, ocr |
| Sports AI | basketball, football, nba |
| Annotation & Data | annotate, auto-annotate, grounded |
| Inference & Deployment | inference, openvino, supervision |
| Pose Estimation | pose, keypoint |
| Architecture & Theory | architecture, how it works |

## Dependencies

- **Python**: `yt-dlp` (channel discovery), `youtube-transcript-api` (transcript download)
- **Node.js**: `youtube-transcript` (transcript download), `yt-dlp` CLI (optional, for discovery)

## Notes

- Some videos may not have transcripts (auto-generated or manual) available
- Live streams may have limited or no transcript data
- The scripts include 1-second delays between requests to avoid rate limiting
- Use `--resume` to continue interrupted downloads without re-fetching completed videos
