import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  ICommandPalette,
  WidgetTracker
} from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { imageIcon } from '@jupyterlab/ui-components';

import { requestAPI } from './request';
import { ImageCaptionMainAreaWidget } from './widget';

/**
 * Initialization data for the jupytercon2025-extension-workshop extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercon2025-extension-workshop:plugin',
  description: 'A JupyterLab extension that displays a random image and caption.',
  autoStart: true,
  requires: [ICommandPalette, ILauncher],  // dependencies of our extension
  optional: [ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    // The activation method receives dependencies in the order they are specified in
    // the "requires" parameter above:
    palette: ICommandPalette,
    launcher: ILauncher,
    restorer: ILayoutRestorer | null
  ) => {
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

    // Track widget state
    const tracker = new WidgetTracker<ImageCaptionMainAreaWidget>({
      namespace: 'jupytercon2025-extension-workshop'
    });

    //Register a new command:
    const command_id = 'image-caption:open';
    app.commands.addCommand(command_id, {
      execute: (args?: { id?: string }) => {
        // When the command is executed, create a new instance of our widget
        const widget = new ImageCaptionMainAreaWidget();

        // Use provided ID or generate a new one
        // During restoration, the args will contain the saved widget ID
        if (args && args.id) {
          widget.id = args.id;
        } else {
          widget.id = `image-caption-${crypto.randomUUID()}`;
        }

        if (!tracker.has(widget)) {
          tracker.add(widget);
        }

        // Then add it to the main area:
        app.shell.add(widget, 'main');
        return widget;
      },
      icon: imageIcon,
      label: 'View a random image & caption'
    });

    palette.addItem({ command: command_id, category: 'Tutorial' });
    launcher.add({ command: command_id });

    // Restore widget state
    if (restorer) {
      restorer.restore(tracker, {
        command: command_id,
        name: widget => widget.id,
        args: widget => ({ id: widget.id })
      });
    }
  }
};

export default plugin;
