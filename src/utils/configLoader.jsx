// Default configuration
export const defaultConfig = {
  physics: {
    wheelSpeed: -0.1,        // Initial angular velocity
    ballSpeed: 1,           // Initial ball speed
    friction: 0.99,         // Deceleration factor
    bounceFactor: 0.6,      // How much the ball bounces when hitting pocket
    spinTime: 5000          // How long the wheel spins at full speed in ms
  },
  timing: {
    waitBetweenSpins: 1000 * 60 * 3 // Wait time between auto-spins in ms
  },
  ui: {
    showRunButton: true,    // Whether to show manual spin button
    autoSpin: false,        // Whether to spin automatically
    showResult: true,       // Whether to show last result
    historySize: 10         // Number of previous results to display in history
  },
  appearance: {
    wheelDiameter: 500,     // Wheel diameter in pixels
    ballSize: 8,            // Ball radius in pixels
    pocketSize: 25,         // Size of each number pocket
    showNumbers: true,      // Whether to show numbers on wheel
    numberFontSize: 20,     // Font size for wheel numbers in pixels
    numberFont: 'Arial'     // Font family for wheel numbers
  }
};

/**
 * Parse JSON configuration file
 * @param {string} fileContent - JSON file content
 * @returns {Object} Parsed configuration
 */
export const parseJsonConfig = (fileContent) => {
  try {
    const config = JSON.parse(fileContent);
    return { ...defaultConfig, ...config };
  } catch (error) {
    console.error('Error parsing JSON config:', error);
    return defaultConfig;
  }
};

/**
 * Parse YAML configuration file
 * @param {string} fileContent - YAML file content
 * @returns {Object} Parsed configuration
 */
export const parseYamlConfig = (fileContent) => {
  try {
    // Simple YAML parser (for basic YAML without complex features)
    const lines = fileContent.split('\n');
    const config = {};
    
    let currentSection = null;
    let currentObject = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (trimmedLine.startsWith('#') || trimmedLine === '') {
        continue;
      }
      
      // Check if line is a section header
      if (trimmedLine.endsWith(':') && !trimmedLine.includes(' ')) {
        const sectionName = trimmedLine.slice(0, -1);
        config[sectionName] = {};
        currentSection = sectionName;
        currentObject = config[sectionName];
        continue;
      }
      
      // Parse key-value pair
      if (trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':');
        const key = trimmedLine.slice(0, colonIndex).trim();
        let value = trimmedLine.slice(colonIndex + 1).trim();
        
        // Convert value to appropriate type
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (!isNaN(value)) {
          value = Number(value);
        }
        
        if (currentObject) {
          currentObject[key] = value;
        } else {
          config[key] = value;
        }
      }
    }
    
    return { ...defaultConfig, ...config };
  } catch (error) {
    console.error('Error parsing YAML config:', error);
    return defaultConfig;
  }
};

/**
 * Convert configuration to YAML format
 * @param {Object} config - Configuration object
 * @returns {string} YAML string
 */
export const configToYaml = (config) => {
  // Convert config to YAML
  const yamlLines = [];
  
  for (const [sectionKey, sectionValue] of Object.entries(config)) {
    yamlLines.push(`${sectionKey}:`);
    
    if (typeof sectionValue === 'object') {
      for (const [key, value] of Object.entries(sectionValue)) {
        yamlLines.push(`  ${key}: ${value}`);
      }
    } else {
      yamlLines.push(`  ${sectionValue}`);
    }
    
    yamlLines.push('');
  }
  
  return yamlLines.join('\n');
};