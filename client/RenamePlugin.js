/* eslint-disable no-unused-vars*/
import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import classNames from 'classnames';

import Icon from '../resources/rename.svg';

import RenameOverlay from './RenameOverlay';

const defaultState = {
  activeTab: {},
  configOpen: false,
  entities: [
    {
      old: 'Process_150n8h7',
      new: 'ExampleProcess',
    },
    {
      old: 'Event_04pelek',
      new: 'StartedStartEvent',
    },
    {
      old: 'Activity_1nc3c1z',
      new: 'DoSomethingUsefulTask',
    },
    {
      old: 'Activity_07rfemz',
      new: 'DoSomeMagicTask',
    },
    {
      old: 'Event_1ojgagw',
      new: 'EndEndEvent',
    }
  ]
};

export default class RenamePlugin extends PureComponent {
  activeTab = {
    id: '__empty',
    type: 'empty'
  };

  constructor(props) {
    super(props);

    this.state = defaultState;

    this._buttonRef = React.createRef();
  }

  componentDidMount() {

    /**
    * The component props include everything the Application offers plugins,
    * which includes:
    * - config: save and retrieve information to the local configuration
    * - subscribe: hook into application events, like <tab.saved>, <app.activeTabChanged> ...
    * - triggerAction: execute editor actions, like <save>, <open-diagram> ...
    * - log: log information into the Log panel
    * - displayNotification: show notifications inside the application
    */
    const {
      subscribe
    } = this.props;

    // subscribe to the event when the active tab changed in the application
    subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.setState({ activeTab });
    });
  }

  /**
   * render any React component you like to extend the existing
   * Camunda Modeler application UI
   */
  render() {
    const {
      activeTab,
      configOpen,
      entities
    } = this.state;

    const initValues = {
      entities
    };

    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      { isBPMN(activeTab) && (
        <Fill slot="status-bar__file" group="xx_rename">
          <button
            ref={ this._buttonRef }
            className={ classNames('btn', { 'btn--active': configOpen }) }
            onClick={ () => this.setState({ configOpen: true }) }
            title="Rename technical IDs">
            <Icon />
          </button>
        </Fill>
      )}
      { this.state.configOpen && (
        <RenameOverlay
          anchor={ this._buttonRef.current }
          initValues={ initValues }
        />
      )}
    </Fragment>;
  }
}

const isBPMN = (tab) => {
  return tab.type === 'bpmn' || tab.type === 'cloud-bpmn';
};




