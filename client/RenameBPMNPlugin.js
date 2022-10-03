'use strict';


import { remove as removeDiacritics } from 'diacritics';

import {
  domify,
  event as domEvent,
  classes as domClasses,
  query as domQuery,
  clear
} from 'min-dom';


class RenameBPMNPlugin {
  constructor(elementRegistry, editorActions, canvas, modeling) {
    this._elementRegistry = elementRegistry;
    this._modeling = modeling;

    var self = this;

    this.state = {
      open: false
    };

    editorActions.register({
      generateIDs: function() {
        self.generateAndShow();
      }
    });

    this.addRenameIDsContainer(canvas.getContainer().parentNode);
  }
  generateAndShow() {
    if (!this.state.open) {
      this.toggle();
    }
    this.generateIDs();
    this.showIDs();
  }
  addRenameIDsContainer(container) {
    var self = this;
    var markup = '<div class="djs-popup djs-rename-technical-ids"> \
    <div class="djs-rename-technical-ids-container"> \
      <button class="generate-ids">Generate IDs</button> \
      <button class="rename-ids">Rename IDs</button> \
      <ul class="id-list"></ul> \
    </div> \
    <div class="djs-rename-technical-ids-toggle">ID Renaming</div> \
    </div>';
    this.element = domify(markup);

    container.appendChild(this.element);

    domEvent.bind(domQuery('.djs-rename-technical-ids-toggle', this.element), 'click', function(event) {
      self.toggle();
    });
    domEvent.bind(domQuery('.generate-ids', this.element), 'click', function(event) {
      self.generateIDs();
      self.showIDs();
    });
    domEvent.bind(domQuery('.rename-ids', this.element), 'click', function(event) {
      self.retry = 0;
      self.renameIDs();
    });
  }
  toggle() {
    if (this.state.open) {
      domClasses(this.element).remove('open');

      this.state.open = false;
    } else {
      domClasses(this.element).add('open');

      this.state.open = true;
    }
  }
  generateIDs() {
    var self = this;
    var elements = this._elementRegistry._elements;
    this.technicalIds = {};
    Object.keys(elements).forEach(function(key) {
      if (elements[key].type != 'label') {
        var businessObject = elements[key].element.businessObject;
        if (businessObject != null && businessObject.name) {
          var technicalId = self._getTechnicalID(businessObject.name, businessObject.$type);
          self.technicalIds[businessObject.id] = technicalId;
        }
      }
    });
    this._verifyDuplicateIds();
  }
  _verifyDuplicateIds() {
    var self = this;
    var values = {};
    Object.keys(this.technicalIds).forEach(function(technicalId) {
      var newTechnicalId = self.technicalIds[technicalId];
      if (values[newTechnicalId] != null) {
        values[newTechnicalId] = values[newTechnicalId] + 1;
        self.technicalIds[technicalId] = self.technicalIds[technicalId] + values[newTechnicalId];
      } else {
        values[newTechnicalId] = 0;
      }
    });
  }
  showIDs() {
    var self = this;
    var idList = domQuery('.id-list', this.element);
    clear(idList);

    if (this.technicalIds != null) {
      Object.keys(this.technicalIds).forEach(function(technicalId) {
        if (technicalId == self.technicalIds[technicalId]) {
          idList.append(domify('<li>' + technicalId + ' --> ' + self.technicalIds[technicalId] + '</li>'));
        } else {
          idList.append(domify('<li>' + technicalId + ' --> <span  style="background-color:#ffbc00">' + self.technicalIds[technicalId] + '</span></li>'));
        }
      });
    }
  }
  renameIDs() {
    var self = this;

    Object.keys(this.technicalIds).forEach(function(technicalId) {
      if (technicalId != self.technicalIds[technicalId] && self._elementRegistry.get(self.technicalIds[technicalId]) != null) {
        self.retry = self.retry + 1;
      } else {
        var element = self._elementRegistry.get(technicalId);
        var properties = {
          id: self.technicalIds[technicalId]
        };
        self._modeling.updateProperties(element, properties);
      }
    });

    if (self.retry > 0 && self.retry < 100) {
      this.renameIDs();
    }
  }
  _getTechnicalID(name, type) {
    name = removeDiacritics(name); // remove diacritics
    name = name.replace(/[^\w\s]/gi, ''); // now replace special characters
    name = this._getCamelCase(name); // get camelcase

    if (!isNaN(name.charAt(0))) { // mask leading numbers
      name = 'N' + name;
    }

    if (type === 'bpmn:Process') {
      return name + 'Process';
    } else if (type === 'bpmn:IntermediateCatchEvent' || type === 'bpmn:IntermediateThrowEvent') {
      return name + 'Event';
    } else if (type === 'bpmn:UserTask' || type === 'bpmn:ServiceTask' || type === 'bpmn:ReceiveTask' || type === 'bpmn:SendTask' || type === 'bpmn:ManualTask' || type === 'bpmn:BusinessRuleTask' || type === 'bpmn:ScriptTask') {
      return name + 'Task';
    } else if (type === 'bpmn:ExclusiveGateway' || type === 'bpmn:ParallelGateway' || type === 'bpmn:ComplexGateway' || type === 'bpmn:EventBasedGateway') {
      return name + 'Gateway';
    } else {
      return name + type.replace('bpmn:', '');
    }
  }
  _getCamelCase(str) {
    var camelCase = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0)
        return ''; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
}

RenameBPMNPlugin.$inject = [ 'elementRegistry', 'editorActions', 'canvas', 'modeling' ];

export default {
  __init__: [ 'renameBPMNPlugin' ],
  renameBPMNPlugin: [ 'type', RenameBPMNPlugin ]
};
