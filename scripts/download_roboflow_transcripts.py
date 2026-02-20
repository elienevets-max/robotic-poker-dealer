#!/usr/bin/env python3
"""
Roboflow YouTube Channel Transcript Downloader
===============================================
Downloads and organizes transcripts from all Roboflow YouTube channel videos.

Usage:
    # Install dependencies first:
    pip install yt-dlp youtube-transcript-api

    # Run the script:
    python scripts/download_roboflow_transcripts.py

    # Or with options:
    python scripts/download_roboflow_transcripts.py --discover    # Discover new videos from channel
    python scripts/download_roboflow_transcripts.py --skip-discover  # Only use known video IDs
    python scripts/download_roboflow_transcripts.py --output-dir transcripts/roboflow

Output Structure:
    transcripts/roboflow/
    ├── raw/                          # Individual transcript files
    │   ├── {video_id}_{title}.txt
    │   └── ...
    ├── by_category/                  # Organized by topic
    │   ├── object_detection.txt
    │   ├── segmentation.txt
    │   ├── tracking.txt
    │   └── ...
    ├── all_transcripts.json          # Complete JSON with metadata
    └── roboflow_transcripts_organized.txt  # Single organized file
"""

import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Known Roboflow YouTube video IDs (discovered from GitHub repos + blogs)
# These serve as a seed list; the script can also auto-discover from channel
# ---------------------------------------------------------------------------
KNOWN_VIDEOS = {
    # Fine-Tuning Tutorials - Object Detection
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

    # Fine-Tuning Tutorials - Segmentation
    "hj_ybcRdk5Y": "Fine-Tune YOLO11 on Instance Segmentation Dataset",
    "N0V0xxSi6Xc": "Fine-Tune YOLOv5 on Instance Segmentation Dataset",
    "e8LPflX0nwQ": "Fine-Tune YOLOv7 on Instance Segmentation Dataset",
    "q3RbFbaQQGw": "Fine-Tune SegFormer on Instance Segmentation Dataset",
    "sZ5DiXDOHEM": "Fine-Tune Faster RCNN on Instance Segmentation Dataset",
    "xEfh0IR8Fvo": "Fine-Tune RF-DETR Segmentation on Custom Dataset",

    # Fine-Tuning Tutorials - Other Tasks
    "DPjp9Kq4qn8": "Fine-Tune YOLOv8 on Classification Dataset",
    "rEbpKxZbvIo": "Fine-Tune YOLOv5 on Classification Dataset",
    "93kXzUOiYY4": "Fine-Tune ViT on Classification Dataset",
    "vFGxM2KLs10": "Fine-Tune YOLOv8 on Pose Estimation Dataset",
    "fFCWrMFH2UY": "Fine-Tune YOLOv8 on Oriented Bounding Boxes (OBB) Dataset",
    "yHNPyqazYYU": "Fine-Tune PaliGemma on Object Detection Dataset",
    "XHT2c8jT3Bc": "Fine-Tune Florence-2 on Object Detection Dataset",
    "QnCGcFHZy9s": "Zero-Shot Object Detection with Qwen2.5-VL",
    "6Q6TieCBA4E": "Fine-Tune GPT-4o on Object Detection Dataset",

    # SAM (Segment Anything Model)
    "G1AEuFwQrWU": "Segment Images with SAM3",
    "OMBmVInx68M": "Segment Images with SAM2",
    "Dv003fTyO-Y": "Fine-Tune SAM-2.1 / PaliGemma2 for LaTeX OCR",
    "QCG8QMhga9k": "Auto-Annotate Dataset with GroundedSAM 2",
    "yHW0ip-2i54": "SAM3 Live Session",

    # Zero-Shot & Foundation Models
    "eHAnIehnCt4": "Zero-Shot Object Detection and Segmentation with YOLOE",
    "D-D6ZmadzPE": "Zero-Shot Object Detection with YOLO-World",
    "5kgWyo6Sg4E": "Run Different Vision Tasks with Florence-2",

    # Sports AI / Applied Projects
    "l_kf9CfZ_8M": "Basketball AI: How to Detect Track and Identify Basketball Players",
    "uWP6UjDeZvY": "Basketball AI: Detect NBA 3 Second Violation",
    "OS5qI9YBkfk": "Football AI",
    "YxJkE6FvGF4": "Estimate Vehicle Speed with YOLOv8",

    # Tracking & Counting
    "C4NqaRBz_Kw": "Track and Count Vehicles with YOLOv8 + ByteTRACK + Supervision",
    "oEQYStnF2l8": "Detect and Count Objects in Polygon Zone with YOLOv5/YOLOv8/Detectron2 + Supervision",
    "yGQb9KkvQ1Q": "How to Track Objects with RF-DETR and SORT Tracker",

    # Inference & Deployment
    "jIgZMr-PBMo": "Roboflow Video Inference with Custom Annotators",
    "gKTYMfwPo4M": "Run YOLOv7 Object Detection with OpenVINO + TorchORT",

    # Other / Misc
    "wuZtUMEiKWY": "Fine-Tune YOLO-NAS on Object Detection Dataset",
    "aBVGKoNZQUw": "Roboflow Notebook Tutorial",

    # From rf-detr repo
    "-OvpdLAElFA": "RF-DETR Architecture and How it Works",

    # From supervision repo
    "hAWpsIuem10": "Supervision Library Tutorial",
}

# Roboflow YouTube channel ID
ROBOFLOW_CHANNEL_ID = "UCkPjOoFMapbqhJ07bT56bAA"
ROBOFLOW_CHANNEL_URL = "https://www.youtube.com/@Roboflow/videos"

# Category classification keywords
CATEGORIES = {
    "object_detection": [
        "object detection", "yolo", "yolov5", "yolov7", "yolov8", "yolov9",
        "yolov10", "yolo11", "yolo-nas", "rt-detr", "rf-detr", "detr",
        "rtmdet", "scaled-yolov4", "yolos", "mt-yolov6", "faster rcnn",
        "detect", "detection", "bounding box",
    ],
    "segmentation": [
        "segment", "segmentation", "sam", "sam2", "sam3", "segformer",
        "instance segmentation", "semantic segmentation", "mask",
    ],
    "classification": [
        "classification", "classify", "vit", "image classification",
    ],
    "tracking": [
        "track", "tracking", "bytetrack", "sort tracker", "deepsort",
        "count", "counting", "vehicle speed",
    ],
    "zero_shot": [
        "zero-shot", "zero shot", "yolo-world", "yoloe", "foundation model",
        "open vocabulary",
    ],
    "vlm_and_multimodal": [
        "florence", "paligemma", "qwen", "gpt-4o", "gpt4", "vlm",
        "vision language", "multimodal", "ocr", "latex",
    ],
    "sports_ai": [
        "basketball", "football", "soccer", "sports", "nba", "player",
    ],
    "annotation_and_data": [
        "annotate", "annotation", "auto-annotate", "grounded", "dataset",
        "label", "labeling",
    ],
    "inference_and_deployment": [
        "inference", "deploy", "openvino", "torchort", "onnx", "edge",
        "supervision", "roboflow workflow",
    ],
    "pose_estimation": [
        "pose", "keypoint", "skeleton",
    ],
    "architecture_and_theory": [
        "architecture", "how it works", "explained", "theory", "benchmark",
    ],
}


def classify_video(title):
    """Classify a video into categories based on its title."""
    title_lower = title.lower()
    matched = []
    for category, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in title_lower:
                matched.append(category)
                break
    return matched if matched else ["uncategorized"]


def discover_channel_videos():
    """Use yt-dlp to discover all videos from the Roboflow YouTube channel."""
    print("\n[DISCOVER] Fetching all video IDs from Roboflow YouTube channel...")
    print(f"[DISCOVER] Channel URL: {ROBOFLOW_CHANNEL_URL}")

    try:
        result = subprocess.run(
            [
                "yt-dlp",
                "--flat-playlist",
                "--print", "%(id)s|%(title)s|%(upload_date)s|%(duration)s",
                ROBOFLOW_CHANNEL_URL,
            ],
            capture_output=True,
            text=True,
            timeout=300,
        )

        if result.returncode != 0:
            print(f"[DISCOVER] yt-dlp error: {result.stderr[:500]}")
            return {}

        discovered = {}
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split("|")
            if len(parts) >= 2:
                vid_id = parts[0].strip()
                title = parts[1].strip()
                discovered[vid_id] = title

        print(f"[DISCOVER] Found {len(discovered)} videos from channel")
        return discovered

    except FileNotFoundError:
        print("[DISCOVER] yt-dlp not found. Install with: pip install yt-dlp")
        return {}
    except subprocess.TimeoutExpired:
        print("[DISCOVER] yt-dlp timed out after 300 seconds")
        return {}
    except Exception as e:
        print(f"[DISCOVER] Error: {e}")
        return {}


def download_transcript(video_id, title="Unknown"):
    """Download transcript for a single video using youtube-transcript-api."""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        print("[ERROR] youtube-transcript-api not installed.")
        print("        Install with: pip install youtube-transcript-api")
        sys.exit(1)

    try:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id)

        segments = []
        full_text = ""
        for snippet in transcript.snippets:
            segments.append({
                "start": snippet.start,
                "duration": snippet.duration,
                "text": snippet.text,
            })
            full_text += snippet.text + " "

        full_text = full_text.strip()
        # Clean up common transcript artifacts
        full_text = re.sub(r'\s+', ' ', full_text)

        return {
            "video_id": video_id,
            "title": title,
            "text": full_text,
            "segments": segments,
            "chars": len(full_text),
            "segment_count": len(segments),
        }

    except Exception as e:
        error_type = type(e).__name__
        # Try older API format as fallback
        try:
            from youtube_transcript_api import YouTubeTranscriptApi as YTA
            transcript_list = YTA.get_transcript(video_id)
            full_text = " ".join([t["text"] for t in transcript_list])
            full_text = re.sub(r'\s+', ' ', full_text.strip())
            return {
                "video_id": video_id,
                "title": title,
                "text": full_text,
                "segments": transcript_list,
                "chars": len(full_text),
                "segment_count": len(transcript_list),
            }
        except Exception:
            pass

        return {
            "video_id": video_id,
            "title": title,
            "text": "",
            "error": f"{error_type}: {str(e)[:200]}",
            "chars": 0,
            "segment_count": 0,
        }


def sanitize_filename(name):
    """Create a safe filename from a video title."""
    safe = re.sub(r'[^\w\s-]', '', name)
    safe = re.sub(r'\s+', '_', safe.strip())
    return safe[:80]


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Download transcripts from Roboflow YouTube channel"
    )
    parser.add_argument(
        "--discover",
        action="store_true",
        default=True,
        help="Discover videos from channel using yt-dlp (default: True)",
    )
    parser.add_argument(
        "--skip-discover",
        action="store_true",
        help="Skip channel discovery, only use known video IDs",
    )
    parser.add_argument(
        "--output-dir",
        default="transcripts/roboflow",
        help="Output directory (default: transcripts/roboflow)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Delay between transcript downloads in seconds (default: 1.0)",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume from previous run (skip already downloaded)",
    )
    args = parser.parse_args()

    # Resolve output dir relative to project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    output_dir = project_root / args.output_dir
    raw_dir = output_dir / "raw"
    category_dir = output_dir / "by_category"

    # Create directories
    raw_dir.mkdir(parents=True, exist_ok=True)
    category_dir.mkdir(parents=True, exist_ok=True)

    # Collect all video IDs
    all_videos = dict(KNOWN_VIDEOS)

    if not args.skip_discover:
        discovered = discover_channel_videos()
        # Merge discovered videos (discovered takes precedence for titles)
        for vid_id, title in discovered.items():
            if vid_id not in all_videos or all_videos[vid_id].startswith("Roboflow"):
                all_videos[vid_id] = title

    print(f"\n{'='*60}")
    print(f"Roboflow YouTube Transcript Downloader")
    print(f"{'='*60}")
    print(f"Total videos to process: {len(all_videos)}")
    print(f"Output directory: {output_dir}")
    print(f"{'='*60}\n")

    # Check for previously downloaded transcripts
    existing_json = output_dir / "all_transcripts.json"
    existing_data = {}
    if args.resume and existing_json.exists():
        with open(existing_json, "r") as f:
            existing_data = json.load(f)
        print(f"[RESUME] Found {len(existing_data.get('videos', {}))} previously downloaded transcripts")

    # Download transcripts
    results = {}
    success_count = 0
    error_count = 0
    skipped_count = 0

    for idx, (video_id, title) in enumerate(sorted(all_videos.items(), key=lambda x: x[1]), 1):
        # Skip if already downloaded in resume mode
        if args.resume and video_id in existing_data.get("videos", {}):
            prev = existing_data["videos"][video_id]
            if prev.get("text") and not prev.get("error"):
                results[video_id] = prev
                skipped_count += 1
                print(f"[{idx}/{len(all_videos)}] SKIP (already downloaded): {title}")
                continue

        print(f"[{idx}/{len(all_videos)}] Downloading: {title} ({video_id})...", end=" ")

        data = download_transcript(video_id, title)

        if data.get("error"):
            print(f"ERROR: {data['error'][:80]}")
            error_count += 1
        else:
            print(f"OK ({data['chars']} chars, {data['segment_count']} segments)")
            success_count += 1

            # Save individual raw transcript
            safe_name = sanitize_filename(title)
            raw_file = raw_dir / f"{video_id}_{safe_name}.txt"
            with open(raw_file, "w") as f:
                f.write(f"Title: {title}\n")
                f.write(f"Video ID: {video_id}\n")
                f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n")
                f.write(f"Characters: {data['chars']}\n")
                f.write(f"Segments: {data['segment_count']}\n")
                f.write(f"Downloaded: {datetime.now().isoformat()}\n")
                f.write(f"{'='*60}\n\n")
                f.write(data["text"])

        results[video_id] = data

        # Rate limiting
        if idx < len(all_videos):
            time.sleep(args.delay)

    # ---------------------------------------------------------------------------
    # Save complete JSON
    # ---------------------------------------------------------------------------
    json_output = {
        "metadata": {
            "channel": "Roboflow",
            "channel_id": ROBOFLOW_CHANNEL_ID,
            "channel_url": ROBOFLOW_CHANNEL_URL,
            "downloaded_at": datetime.now().isoformat(),
            "total_videos": len(results),
            "successful": success_count,
            "errors": error_count,
            "skipped": skipped_count,
        },
        "videos": results,
    }

    with open(output_dir / "all_transcripts.json", "w") as f:
        json.dump(json_output, f, indent=2, ensure_ascii=False)

    # ---------------------------------------------------------------------------
    # Organize by category
    # ---------------------------------------------------------------------------
    categorized = {}
    for video_id, data in results.items():
        if not data.get("text"):
            continue
        title = data.get("title", "Unknown")
        cats = classify_video(title)
        for cat in cats:
            if cat not in categorized:
                categorized[cat] = []
            categorized[cat].append(data)

    for cat, videos in sorted(categorized.items()):
        cat_file = category_dir / f"{cat}.txt"
        with open(cat_file, "w") as f:
            f.write(f"{'='*60}\n")
            f.write(f"CATEGORY: {cat.upper().replace('_', ' ')}\n")
            f.write(f"Videos: {len(videos)}\n")
            f.write(f"{'='*60}\n\n")

            for v in sorted(videos, key=lambda x: x.get("title", "")):
                f.write(f"---\n")
                f.write(f"Title: {v['title']}\n")
                f.write(f"Video ID: {v['video_id']}\n")
                f.write(f"URL: https://www.youtube.com/watch?v={v['video_id']}\n")
                f.write(f"Characters: {v['chars']}\n")
                f.write(f"---\n\n")
                f.write(v["text"])
                f.write("\n\n")

    # ---------------------------------------------------------------------------
    # Create single organized file
    # ---------------------------------------------------------------------------
    organized_file = output_dir / "roboflow_transcripts_organized.txt"
    with open(organized_file, "w") as f:
        f.write(f"{'='*70}\n")
        f.write(f"ROBOFLOW YOUTUBE CHANNEL — COMPLETE TRANSCRIPT COLLECTION\n")
        f.write(f"{'='*70}\n")
        f.write(f"Channel: https://www.youtube.com/@Roboflow\n")
        f.write(f"Downloaded: {datetime.now().isoformat()}\n")
        f.write(f"Total videos: {len(results)}\n")
        f.write(f"Successful transcripts: {success_count}\n")
        f.write(f"Errors: {error_count}\n")
        f.write(f"{'='*70}\n\n")

        # Table of contents
        f.write("TABLE OF CONTENTS\n")
        f.write("-" * 40 + "\n")
        for cat in sorted(categorized.keys()):
            vids = categorized[cat]
            f.write(f"\n{cat.upper().replace('_', ' ')} ({len(vids)} videos):\n")
            for v in sorted(vids, key=lambda x: x.get("title", "")):
                f.write(f"  - {v['title']}\n")
        f.write("\n" + "=" * 70 + "\n\n")

        # Full transcripts by category
        for cat in sorted(categorized.keys()):
            videos = categorized[cat]
            f.write(f"\n{'#'*70}\n")
            f.write(f"# {cat.upper().replace('_', ' ')}\n")
            f.write(f"# {len(videos)} videos\n")
            f.write(f"{'#'*70}\n\n")

            for v in sorted(videos, key=lambda x: x.get("title", "")):
                f.write(f"{'─'*60}\n")
                f.write(f"TITLE: {v['title']}\n")
                f.write(f"VIDEO: https://www.youtube.com/watch?v={v['video_id']}\n")
                f.write(f"LENGTH: {v['chars']} characters | {v['segment_count']} segments\n")
                f.write(f"{'─'*60}\n\n")
                f.write(v["text"])
                f.write("\n\n")

    # ---------------------------------------------------------------------------
    # Summary
    # ---------------------------------------------------------------------------
    print(f"\n{'='*60}")
    print(f"DOWNLOAD COMPLETE")
    print(f"{'='*60}")
    print(f"Total videos processed: {len(results)}")
    print(f"Successful transcripts: {success_count}")
    print(f"Skipped (already had):  {skipped_count}")
    print(f"Errors:                 {error_count}")
    print(f"\nOutput files:")
    print(f"  Raw transcripts:    {raw_dir}/")
    print(f"  By category:        {category_dir}/")
    print(f"  All JSON:           {output_dir / 'all_transcripts.json'}")
    print(f"  Organized text:     {organized_file}")
    print(f"\nCategories found:")
    for cat, vids in sorted(categorized.items()):
        print(f"  {cat}: {len(vids)} videos")

    # Print errors for review
    errors = [(vid, d) for vid, d in results.items() if d.get("error")]
    if errors:
        print(f"\nVideos with errors ({len(errors)}):")
        for vid, d in errors:
            print(f"  - {d.get('title', vid)}: {d.get('error', 'unknown')[:80]}")


if __name__ == "__main__":
    main()
