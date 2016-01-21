/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {Link} from 'react-router';

/**
 * Import Mutations.
 */
import UpdatePersonMutation from '../mutations/updatePersonMutation';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import { Nav, Navbar, NavbarBrand, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

/**
 * Import Internationalization.
 */
import {IntlProvider, FormattedMessage} from 'react-intl';

/**
 * The component.
 */
class App extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  };

  // Expected context properties.
  static contextTypes = {
    setLocale: React.PropTypes.func
  };

  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
    // Update the application language if necessary.
    this.context.setLocale(this.props.viewer.language);
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.viewer.language !== this.props.viewer.language) {
      // Update the application language if necessary.
      this.context.setLocale(nextProps.viewer.language);
    }
  }

  // User wants to change his language setting.
  handleLanguageChange = (eventKey) => {
    // We commit the update directly to the database.
    // This will cause the viewer.language property to change
    // which will then result in a call to setLocale.
    Relay.Store.commitUpdate(new UpdatePersonMutation({
      person: this.props.viewer,
      language: eventKey
    }), {
      onFailure: (err) => {
        // TODO: Deal with it!
        console.log(err);
      },
      onSuccess: (result) => {
        // TODO: Maybe nothing todo here?
      }
    });
  };

  // Render the component.
  render() {
    // Get the properties.
    const {viewer, children} = this.props;
    // Return the component UI.
    return (
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLinkContainer to={`/`}>
                <a>
                  <FormattedMessage id="App.Navbar.Brand"
                                    description="The application's navigation bar brand title."
                                    defaultMessage="React-Webpack"/>
                </a>
              </IndexLinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <IndexLinkContainer to={`/`}>
                <NavItem eventKey={1}>Home</NavItem>
              </IndexLinkContainer>
              <LinkContainer to={`/users`}>
                <NavItem>Users</NavItem>
              </LinkContainer>
              <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                <MenuItem divider/>
                <MenuItem eventKey={3.3}>Separated link</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight onSelect={this.handleLanguageChange} activeKey={this.props.viewer.language}>
              <NavItem eventKey={'de'}>
                <FormattedMessage id="App.Navbar.Language.German"
                                  description="The application's navigation bar german language selection."
                                  defaultMessage="German"/>
              </NavItem>
              <NavItem eventKey={'en'}>
                <FormattedMessage id="App.Navbar.Language.English"
                                  description="The application's navigation bar english language selection."
                                  defaultMessage="English"/>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {children}
      </div>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
              fragment on Person {
                language,
                ${UpdatePersonMutation.getFragment('person')}
              }
            `
  }
});
