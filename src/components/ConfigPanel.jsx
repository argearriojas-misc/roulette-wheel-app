import React, { useState, useRef } from 'react';
import { parseJsonConfig, parseYamlConfig, configToYaml } from '../utils/configLoader';

const ConfigPanel = ({ config, onConfigChange, show, onToggleShow }) => {
  const [configText, setConfigText] = useState(JSON.stringify(config, null, 2));
  const [fileType, setFileType] = useState('json');
  const fileInputRef = useRef(null);

  // Update config when text changes
  const updateConfig = () => {
    try {
      let newConfig;
      if (fileType === 'json') {
        newConfig = parseJsonConfig(configText);
      } else if (fileType === 'yaml') {
        newConfig = parseYamlConfig(configText);
      }
      onConfigChange(newConfig);
    } catch (e) {
      console.error("Invalid configuration:", e);
      alert("Invalid configuration format. Please check your syntax.");
    }
  };

  // Save config to file
  const saveConfig = () => {
    let content = '';
    let fileName = '';
    
    if (fileType === 'json') {
      content = JSON.stringify(config, null, 2);
      fileName = 'roulette-config.json';
    } else if (fileType === 'yaml') {
      content = configToYaml(config);
      fileName = 'roulette-config.yml';
    }
    
    const blob = new Blob([content], { type: `text/${fileType}` });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      setConfigText(content);
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'json') {
        setFileType('json');
        onConfigChange(parseJsonConfig(content));
      } else if (fileExtension === 'yml' || fileExtension === 'yaml') {
        setFileType('yaml');
        onConfigChange(parseYamlConfig(content));
      } else {
        alert('Unsupported file format. Please use JSON or YAML.');
      }
    };
    
    reader.readAsText(file);
  };

  // Switch file type and convert content
  const switchFileType = (type) => {
    if (type === fileType) return;
    
    try {
      let currentConfig;
      
      // Parse current config
      if (fileType === 'json') {
        currentConfig = parseJsonConfig(configText);
      } else {
        currentConfig = parseYamlConfig(configText);
      }
      
      // Convert to new format
      let newText;
      if (type === 'json') {
        newText = JSON.stringify(currentConfig, null, 2);
      } else {
        newText = configToYaml(currentConfig);
      }
      
      setFileType(type);
      setConfigText(newText);
    } catch (e) {
      console.error("Error converting config format:", e);
      alert("Could not convert between formats. Please check your syntax.");
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex mb-4 space-x-2">
        <button
          onClick={onToggleShow}
          className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
        >
          {show ? 'Hide Configuration' : 'Show Configuration'}
        </button>
        
        {show && (
          <>
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Load Config File
            </button>
            
            <button
              onClick={saveConfig}
              className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
            >
              Save Config File
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.yml,.yaml"
              className="hidden"
            />
          </>
        )}
      </div>
      
      {show && (
        <div className="p-4 mb-4 bg-gray-200 rounded">
          <div className="flex mb-2 space-x-2">
            <button
              onClick={() => switchFileType('json')}
              className={`px-3 py-1 font-bold rounded ${
                fileType === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
              }`}
            >
              JSON
            </button>
            
            <button
              onClick={() => switchFileType('yaml')}
              className={`px-3 py-1 font-bold rounded ${
                fileType === 'yaml' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
              }`}
            >
              YAML
            </button>
          </div>
          
          <textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            className="w-full h-64 p-2 mb-4 font-mono border rounded"
          />
          
          <button
            onClick={updateConfig}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Apply Configuration
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;