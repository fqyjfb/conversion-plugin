import React from 'react';
import ReactDOM from 'react-dom/client';
import ToolPanel from './ToolPanel';

const PluginApp: React.FC = () => {
  return <ToolPanel />;
};

function renderStandalone() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  ReactDOM.createRoot(root).render(<PluginApp />);
}

function registerPlugin(api: any) {
  const { registerTool, registerSidebarButton, openPluginWindow } = api;

  registerTool({
    id: 'plugin-conversion',
    name: '单位换算',
    iconName: 'ArrowRightLeft',
    color: '#059669',
    textColor: '#ffffff',
    path: '/tools/plugin-conversion',
    component: ToolPanel,
  });

  registerSidebarButton({
    id: 'plugin-conversion-btn',
    icon: 'ArrowRightLeft',
    label: '单位换算',
    onClick: () => {
      openPluginWindow?.('plugin-conversion');
    },
  });
}

const pluginData = (window as any).__PLUGIN_DATA__;

if (pluginData) {
  renderStandalone();
}