# Changelog

## 0.0.6 [July 2026]
- **[fix]** - header lines (YouTube's `Kind: captions` / `Language: en`, HLS `X-TIMESTAMP-MAP=..`) no longer leak into the first cue's label - everything before the first blank line is treated as the file header
- **[fix]** - multi-line `NOTE`, `STYLE`, and `REGION` blocks are now skipped entirely - previously their last line became the next cue's label (e.g. a stray `}` from a STYLE block), and was written back out by `.out()`
- **[fix]** - consecutive cues with no blank line between them no longer silently drop the earlier cue
- **[fix]** - html entities decode one level only - `&amp;lt;` now decodes to the literal text `&lt;` instead of double-decoding to `<`
- **[change]** - out-of-order cues are sorted instead of deleted - `fixOverlaps` used to clamp them into negative durations, and `stripUndisplayed` then removed them
- **[change]** - - simultaneous cues (two cues sharing a start time - legal vtt, used for top/bottom positioning) survive `fixOverlaps` instead of being deleted
- **[change]** - `stripMetadata` removes the whole JSON payload - it used to strip only the opening `{` line, leaving the body and `}` behind
- **[change]** - `stripVoice` now targets `<v>` tags specifically - it was an exact duplicate of `stripXml`
- **[change]** - `.shift()` clamps timestamps at zero - a negative shift could produce garbage like `-1:-1:-5.000` in `.out()`
- **[change]** - `.stats()` and `.duration()` return zeroed stats on an empty file instead of throwing
- **[fix]** - `vttpeg ./file.vtt` and `vttpeg ../dir` work
- **[fix]** - output filenames keep their dots - `My.Show.S01E01.vtt` now writes `My.Show.S01E01.new.vtt`, not `My.new.vtt`
- **[fix]** - a missing input argument prints usage, and a nonexistent path prints a friendly error - both exit 1 instead of dumping a stack trace
- **[change]** - `sortCues` normalize flag (default `true`) - sorts cues by start time before fixing overlaps
- **[change]** - numeric html entities (`&#39;`, `&#x27;`) are decoded in cue text
- **[change]** - `vttpeg()` with no/empty input returns an empty document instead of throwing
- **[change]** - feeding in an SRT file directly throws an error that suggests the ffmpeg conversion
- **[change]** - `.lint()` is silent by default - it still returns the array of warnings, it just no longer console.logs them (pass `{ silent: false }` for the old behavior)
- **[change]** - typescript types updated
