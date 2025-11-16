const round = n => Math.round(n * 10) / 10

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
  let secs = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
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
}
export default parseVTT;