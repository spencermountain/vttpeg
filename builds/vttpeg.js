/* vttpeg 0.0.1 MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.vttpeg = factory());
})(this, (function () { 'use strict';

  const round = n => Math.round(n * 10) / 10;

  // Parse a timestamp string (HH:MM:SS.mmm) into seconds
  function parseTimestamp(timestamp) {
    const parts = timestamp.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // Handle seconds and milliseconds
    const secondParts = parts[2].split('.');
    const seconds = parseInt(secondParts[0], 10);
    const milliseconds = parseInt(secondParts[1], 10);

    // Round to 2 decimal places
    let secs = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    return round(secs)
  }

  // Parse VTT content into a structured array of subtitle entries
  const parseVTT = function (vttContent) {
    // Split content into lines
    const lines = vttContent.trim().split('\n');

    // Check if it's a valid WebVTT file
    if (!lines[0].includes('WEBVTT')) {
      throw new Error('Invalid WebVTT format');
    }

    const entries = [];
    let currentEntry = null;
    let collectingText = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        continue;
      }

      // Check for timestamp line (00:00:00.000 --> 00:00:00.000)
      const timestampMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})/);

      if (timestampMatch) {
        // If we were collecting text, finalize the previous entry
        if (collectingText && currentEntry) {
          entries.push(currentEntry);
        }

        // Parse start and end times
        const startTime = parseTimestamp(timestampMatch[1]);
        const endTime = parseTimestamp(timestampMatch[2]);

        // Create new entry
        currentEntry = {
          startTime,
          endTime,
          text: []
        };

        collectingText = true;
      } else if (collectingText && currentEntry) {
        // Add this line to the current subtitle text
        currentEntry.text.push(line);
      }
    }

    // Don't forget the last entry
    if (collectingText && currentEntry) {
      entries.push(currentEntry);
    }

    return entries;
  };

  // find gaps in the entries, which are possibly scene-changes
  const findGaps = (entries, options = {}) => {
    // Default options
    const minGapSeconds = options.minGapSeconds || 5;
    const minSceneDuration = options.minSceneDuration || 30;


    if (entries.length === 0) {
      return [];
    }

    // Initialize scene changes array
    const gaps = [];

    // Find gaps between subtitle entries that exceed our threshold
    for (let i = 0; i < entries.length - 1; i++) {
      const currentEntry = entries[i];
      const nextEntry = entries[i + 1];

      // Calculate gap between end of current subtitle and start of next
      const gapDuration = nextEntry.startTime - currentEntry.endTime;

      // If gap exceeds our threshold, consider it a scene change
      if (gapDuration >= minGapSeconds) {
        // Use the midpoint of the gap as the scene change timestamp
        const midpoint = currentEntry.endTime + (gapDuration / 2);

        // Only add if it's far enough from the last scene change
        if (gaps.length === 0 ||
          (midpoint - gaps[gaps.length - 1]) >= minSceneDuration) {
          gaps.push({
            startTime: currentEntry.endTime,
            midpoint: midpoint,
            endTime: nextEntry.startTime,
            duration: gapDuration,
          });
        }
      }
    }

    return gaps;
  };

  const getStats = (entries) => {
    let words = entries.reduce((acc, entry) => acc + entry.text.split(' ').length, 0);
    let duration = entries.reduce((acc, entry) => acc + entry.endTime - entry.startTime, 0);

    return {
      duration: duration.toFixed(2),
      entries: entries.length,
      wordCount: words,
      wordsPerMinute: (words / duration * 60).toFixed(2),
    }
  };

  const shift = (entries, seconds) => {
    return entries.map(entry => {
      entry.startTime += seconds;
      entry.endTime += seconds;
      return entry
    })
  };

  // find suspicious entries in the vtt file
  const lint = (entries, opts = {}) => {
    opts.silent = opts.silent || false;
    let errors = [];
    for (let i = 0; i < entries.length; i += 1) {
      let entry = entries[i];
      if (entry.startTime >= entry.endTime) {
        errors.push(`StartTime is greater than EndTime for entry ${i}`);
      }
      if (entry.text.length === 0) {
        errors.push(`Text is empty for entry ${i}`);
      }
      if (entry.text.length > 100) {
        errors.push(`Text is too long for entry ${i}`);
      }

    }
    if (errors.length > 0) {
      if (!opts.silent) {
        console.log(`Lint errors: `);
        console.log(errors);
      }
    } else {
      if (!opts.silent) {
        console.log('No lint errors found');
      }
    }
    return errors
  };

  const isValid = (entries, opts = {}) => {
    opts.silent = opts.silent || false;
    let errors = [];
    if (!entries || entries.length === 0) {
      errors.push('No entries found');
    }
    for (let i = 0; i < entries.length; i += 1) {
      let entry = entries[i];
      if (!entry.startTime || !entry.endTime) {
        errors.push(`Invalid start or end time for entry ${i}`);
      }
      if (entry.startTime >= entry.endTime) {
        errors.push(`Start time is greater than end time for entry ${i}`);
      }
    }
    if (errors.length > 0) {
      if (!opts.silent) {
        console.log(`Validation errors: `);
        console.log(errors);
      }
      return false
    }
    return true
  };

  class Vtt {
    constructor(str) {
      this.entries = parseVTT(str);
    }
    json() {
      return this.entries
    }
    text() {
      return this.entries.map(entry => entry.text).join('\n')
    }
    out() {
      return this.entries.map(entry => entry.text).join('\n')
    }
    debug() {
      console.log('--------------------------------');
      console.log(this.entries);
      console.log(this.stats());
      console.log('--------------------------------');
    }

    // run analyses on the vtt file
    stats() {
      return getStats(this.entries)
    }
    lint(opts = {}) {
      return lint(this.entries, opts)
    }
    isValid(opts = {}) {
      return isValid(this.entries, opts)
    }


    // move timestamps forward or backward
    shift(seconds) {
      return shift(this.entries, seconds)
    }
    shiftLeft(seconds) {
      return shift(this.entries, -seconds)
    }
    shiftRight(seconds) {
      return shift(this.entries, seconds)
    }
    sort() {
      return this.entries.sort((a, b) => a.startTime - b.startTime)
    }

    // detect silences
    gaps() {
      return findGaps(this.entries)
    }
    firstEntry() {
      return this.entries[0]
    }
    lastEntry() {
      return this.entries[this.entries.length - 1]
    }
    duration() {
      return this.lastEntry().endTime - this.firstEntry().startTime
    }

  }

  // factory
  const vttpeg = function (txt = '') {
    return new Vtt(txt)
  };

  return vttpeg;

}));
