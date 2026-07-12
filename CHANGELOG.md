# Changelog

## 0.0.6 (unreleased)

### Fixed

**Parser**
- header lines (YouTube's `Kind: captions` / `Language: en`, HLS `X-TIMESTAMP-MAP=..`) no longer leak into the first cue's label - everything before the first blank line is treated as the file header
- multi-line `NOTE`, `STYLE`, and `REGION` blocks are now skipped entirely - previously their last line became the next cue's label (e.g. a stray `}` from a STYLE block), and was written back out by `.out()`
- consecutive cues with no blank line between them no longer silently drop the earlier cue
- html entities decode one level only - `&amp;lt;` now decodes to the literal text `&lt;` instead of double-decoding to `<`

**Normalize**
- out-of-order cues are sorted instead of deleted - `fixOverlaps` used to clamp them into negative durations, and `stripUndisplayed` then removed them
- simultaneous cues (two cues sharing a start time - legal vtt, used for top/bottom positioning) survive `fixOverlaps` instead of being deleted
- `stripMetadata` removes the whole JSON payload - it used to strip only the opening `{` line, leaving the body and `}` behind
- `stripVoice` now targets `<v>` tags specifically - it was an exact duplicate of `stripXml`

**Output**
- `.shift()` clamps timestamps at zero - a negative shift could produce garbage like `-1:-1:-5.000` in `.out()`
- `.stats()` and `.duration()` return zeroed stats on an empty file instead of throwing

**CLI**
- `vttpeg ./file.vtt` and `vttpeg ../dir` work - the dotfile filter was rejecting any *path* starting with `.`, which broke the README's own examples
- output filenames keep their dots - `My.Show.S01E01.vtt` now writes `My.Show.S01E01.new.vtt`, not `My.new.vtt`
- a missing input argument prints usage, and a nonexistent path prints a friendly error - both exit 1 instead of dumping a stack trace

### Added
- `sortCues` normalize flag (default `true`) - sorts cues by start time before fixing overlaps
- numeric html entities (`&#39;`, `&#x27;`) are decoded in cue text
- `vttpeg()` with no/empty input returns an empty document instead of throwing
- feeding in an SRT file directly throws an error that suggests the ffmpeg conversion

### Changed
- `.lint()` is silent by default - it still returns the array of warnings, it just no longer console.logs them (pass `{ silent: false }` for the old behavior)
- the lint message `StartTime is greater than EndTime` is now `StartTime is not before EndTime` (it also fires when they're equal)
- typescript types updated to match: `sortCues` option, `.diffCli()` returns `void` (it prints), lint/shift doc-comments
