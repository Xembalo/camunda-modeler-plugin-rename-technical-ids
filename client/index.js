import {
  registerClientExtension,
  registerBpmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

import RenameClientPlugin from './RenameClientPlugin';
import RenameBPMNPlugin from './RenameBPMNPlugin';

registerClientExtension(RenameClientPlugin);
registerBpmnJSPlugin(RenameBPMNPlugin);