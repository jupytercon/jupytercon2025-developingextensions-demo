import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './request';
import { ImageCaptionMainAreaWidget } from './widget';

/**
 * Initialization data for the jupytercon2025-extension-workshop extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercon2025-extension-workshop:plugin',
  description: 'A JupyterLab extension that displays a random image and caption.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupytercon2025-extension-workshop is activated!');

    requestAPI<any>('hello')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupytercon2025_extension_workshop server extension appears to be missing.\n${reason}`
        );
      });

    //Register a new command:
    const command_id = 'image-caption:open';
    app.commands.addCommand(command_id, {
      execute: () => {
        // When the command is executed, create a new instance of our widget
        const widget = new ImageCaptionMainAreaWidget();

        // Then add it to the main area:
        app.shell.add(widget, 'main');
      },
      label: 'View a random image & caption'
    });
  }
};

export default plugin;
