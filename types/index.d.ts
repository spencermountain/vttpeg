// Type definitions for vttpeg
// Project: https://github.com/spencermountain/vttpeg
// A utility for managing subtitles in vtt format

/**
 * A single subtitle cue. Times are expressed in seconds (with millisecond
 * precision as a fractional part).
 */
export interface Cue {
  /** start time of the cue, in seconds */
  startTime: number
  /** end time of the cue, in seconds */
  endTime: number
  /** the lines of text for this cue */
  text: string[]
  /** trailing cue settings/attributes following the timestamp line, if any */
  attributes?: string
  /** an identifier/label appearing on the line before the timestamp, if any */
  label?: string
}

/** Summary statistics for a set of cues. */
export interface Stats {
  /** number of cues */
  cue_count: number
  /** total spoken duration, in seconds */
  duration_seconds: number
  /** total spoken duration, formatted as `HH:MM:SS` */
  duration: string
  /** length of the shortest cue, in seconds */
  shortest_cue_seconds: number
  /** length of the shortest cue, formatted as `HH:MM:SS` */
  shortestCue: string
  /** length of the longest cue, in seconds */
  longest_cue_seconds: number
  /** length of the longest cue, formatted as `HH:MM:SS` */
  longestCue: string
  /** mean cue length, in seconds */
  average_cue_seconds: number
  /** mean cue length, formatted as `HH:MM:SS` */
  averageCue: string
}

/** Options for {@link Vtt.lint} / {@link Cues.lint}. */
export interface LintOptions {
  /** suppress all console output (default `false`) */
  silent?: boolean
  /** log details about each offending cue (default `false`) */
  verbose?: boolean
  /** maximum allowed characters in a single text line (default `100`) */
  maxLength?: number
  /** don't flag a cue whose start time is at/after its end time (default `false`) */
  allowOverlap?: boolean
}

/** Options for {@link Vtt.normalize} / {@link Cues.normalize}. All default to `true`. */
export interface NormalizeOptions {
  /** remove XML/HTML tags such as `<i>` */
  stripXml?: boolean
  /** remove voice spans such as `<v Bob>` */
  stripVoice?: boolean
  /** remove language tags such as `<lang en>` */
  stripLang?: boolean
  /** remove styling blocks */
  stripStyle?: boolean
  /** remove music/sound cues such as `♪ ... ♪` */
  stripMusic?: boolean
  /** collapse and trim whitespace */
  stripWhitespace?: boolean
  /** remove NOTE blocks */
  stripNotes?: boolean
  /** remove cue metadata/attributes */
  stripMetadata?: boolean
  /** remove inline timestamp tags that aren't displayed */
  stripUndisplayed?: boolean
  /** clamp overlapping cue times so they no longer collide */
  fixOverlaps?: boolean
}

/** Options for {@link Vtt.out} / {@link Cues.out}. */
export interface OutOptions {
  /** include a leading `00:` hours field even when hours is zero (default `true`) */
  showZeroHours?: boolean
}

/** Options for {@link Vtt.scenes}. */
export interface ScenesOptions {
  /** minimum silent gap, in seconds, that marks a scene change (default `2`) */
  minGap?: number
}

/**
 * A collection of parsed cues, with methods to inspect and transform them.
 * Mutating methods (`normalize`, `shift`) return the same instance for chaining.
 */
export declare class Cues {
  constructor(cues: Cue[])
  /** the underlying cue array */
  cues: Cue[]
  /** return a list of warnings about possible problems in the cues */
  lint(opts?: LintOptions): string[]
  /** return a new `Cues` containing only cues that look like spoken dialogue */
  dialogue(): Cues
  /** `true` when the cues produce no lint errors */
  isValid(): boolean
  /** strip tags/cruft from the cues in place; returns this instance */
  normalize(opts?: NormalizeOptions): this
  /** summary statistics for the cues */
  stats(): Stats
  /** total spoken duration, in seconds */
  duration(): number
  /** shift every cue forward (or backward, if negative) by `time` seconds, in place */
  shift(time: number): this
  /** render the cues as readable plaintext */
  text(): string
  /** render the cues as a valid VTT file */
  out(opts?: OutOptions): string
  /** log debugging stats to the console; returns this instance */
  debug(): this
  /** return the raw cue array */
  json(): Cue[]
}

/** A parsed VTT document. */
export declare class Vtt {
  constructor(txt?: string)
  /** the original input text passed to the parser */
  input: string
  /** the parsed cues */
  cues: Cues
  /** return a list of warnings about possible problems in the file */
  lint(opts?: LintOptions): string[]
  /** return the cues that look like spoken dialogue */
  dialogue(): Cues
  /** strip tags/cruft from the cues in place; returns this instance */
  normalize(opts?: NormalizeOptions): this
  /** summary statistics for the document */
  stats(): Stats
  /** total spoken duration, in seconds */
  duration(): number
  /** render the document as readable plaintext */
  text(): string
  /** render the document as a valid VTT file */
  out(opts?: OutOptions): string
  /** return the raw cue array */
  json(): Cue[]
  /** `true` when the document produces no lint errors */
  isValid(): boolean
  /** split the cues into scenes, grouped by silent gaps */
  scenes(opts?: ScenesOptions): Cues[]
  /** shift every cue forward (or backward, if negative) by `time` seconds, in place */
  shift(time: number): this
  /** an HTML diff between the original input and the current output */
  diffHtml(opts?: Record<string, unknown>): string
  /** a CLI/ANSI diff between the original input and the current output */
  diffCli(opts?: Record<string, unknown>): string
}

/**
 * Parse a VTT subtitle string into a manipulable {@link Vtt} document.
 * @param txt - the raw contents of a `.vtt` file (defaults to an empty string)
 */
declare function vttpeg(txt?: string): Vtt

export default vttpeg
