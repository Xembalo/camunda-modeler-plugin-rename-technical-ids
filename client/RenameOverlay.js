/* eslint-disable no-unused-vars */
import React, { Component } from 'camunda-modeler-plugin-helpers/react';
import { Overlay, Section } from 'camunda-modeler-plugin-helpers/components';

const OFFSET = { left: 0 };

const EntityTableBody = (props) => {
  const rows = props.entityData.map((row, index) => {
    return (
      <tr key={ index }>
        <td>{row.old}</td>
        <td>{row.new}</td>
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};

class EntityTable extends Component {
  render() {
    const { entityData } = this.props;

    if (!containsEntities(entityData)) {
      return ;
    } else {
      return (
        <table>
          <thead>
            <tr>
              <th>Actual name</th>
              <th>Rename to</th>
            </tr>
          </thead>

          <EntityTableBody entityData={ entityData } />
        </table>
      );
    }
  }
}

// we can even use hooks to render into the application
export default function RenameOverlay({ anchor, initValues, onClose }) {

  const hasEntities = containsEntities(initValues.entities);

  let content;

  if (hasEntities) {
    content =
      <Section.Body>
        <EntityTable entityData={ initValues.entities } />
        <Section.Actions>
          <button className="btn btn-primary">Rename all</button>
        </Section.Actions>
      </Section.Body>;
  } else {
    content =
      <Section.Body>
        <p>Nothing to rename</p>
      </Section.Body>;
  }

  // we can use the built-in styles, e.g. by adding "btn btn-primary" class names
  return (
    <Overlay anchor={ anchor } onClose={ onClose } offset={ OFFSET }>
      <Section>
        <Section.Header>Rename Technical IDs</Section.Header>
        {content}
      </Section>
    </Overlay>
  );
}

const containsEntities = (Entities) => {
  return Entities.length > 0;
};