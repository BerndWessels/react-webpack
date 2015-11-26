/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Relay from 'react-relay';

import { Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input } from 'react-bootstrap';

/**
 * The Home component.
 */
class Home extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };
  // Initialize the component.
  constructor(props) {
    super(props);
  }
  // Render the component.
  render() {
    const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};
    const innerGlyphicon = <Glyphicon glyph="music" />;
    const innerButton = <Button>Before</Button>;
    const innerDropdown = (
      <DropdownButton title="Action" id="input-dropdown-addon">
        <MenuItem key="1">Item</MenuItem>
      </DropdownButton>
    );
    const innerRadio = <input type="radio" aria-label="..." />;
    const innerCheckbox = <input type="checkbox" aria-label="..." />;
    // Return the component UI.
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
              <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
        <ButtonToolbar>
          {/* Standard button */}
          <Button>Default</Button>
          {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
          <Button bsStyle="primary">Primary</Button>
          {/* Indicates a successful or positive action */}
          <Button bsStyle="success">Success</Button>
          {/* Contextual button for informational alert messages */}
          <Button bsStyle="info">Info</Button>
          {/* Indicates caution should be taken with this action */}
          <Button bsStyle="warning">Warning</Button>
          {/* Indicates a dangerous or potentially negative action */}
          <Button bsStyle="danger">Danger</Button>
          {/* Deemphasize a button by making it look like a link while maintaining button behavior */}
          <Button bsStyle="link">Link</Button>
        </ButtonToolbar>
        <div className="well" style={wellStyles}>
          <Button bsStyle="primary" bsSize="large" block>Block level button</Button>
          <Button bsSize="large" block>Block level button</Button>
        </div>
        <ButtonGroup>
          <Button>1</Button>
          <Button>2</Button>
          <DropdownButton title="Dropdown" id="bg-nested-dropdown">
            <MenuItem eventKey="1">Dropdown link</MenuItem>
            <MenuItem eventKey="2">Dropdown link</MenuItem>
          </DropdownButton>
        </ButtonGroup>
        <form>
          <Input type="text" addonBefore="@" />
          <Input type="text" addonAfter=".00" />
          <Input type="text" addonBefore="$" addonAfter=".00" />
          <Input type="text" addonAfter={innerGlyphicon} />
          <Input type="text" buttonBefore={innerButton} />
          <Input type="text" buttonAfter={innerDropdown} />
          <Input type="text" addonBefore={innerRadio} />
          <Input type="text" addonBefore={innerCheckbox} />
        </form>
      </div>
    );
  }
}

/**
 * The home data container.
 */
export default Relay.createContainer(Home, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 5) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }
    `
  }
});
