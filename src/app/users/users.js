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

/**
 * Import Mutations.
 */
import UpdatePersonMutation from '../../mutations/updatePersonMutation';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import { Grid, Row, Col, PageHeader, Input, Button } from 'react-bootstrap';

/**
 * Import Internationalization.
 */
import {defineMessages, FormattedMessage} from 'react-intl';

const messages = defineMessages({
  firstName: {
    id: 'users.label.firstName',
    description: 'The first name field\'s label text',
    defaultMessage: 'First Name'
  },
  lastName: {
    id: 'users.label.lastName',
    description: 'The last name field\'s label text',
    defaultMessage: 'Last Name'
  },
  email: {
    id: 'users.label.email',
    description: 'The email field\'s label text',
    defaultMessage: 'Email'
  }
});

/**
 * The component.
 */
class Users extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  // Expected context properties.
  static contextTypes = {
    intl: React.PropTypes.object
  };

  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Handle the button click event.
  _handleUpdatePerson = () => {
    // We commit the update directly to the database.
    Relay.Store.commitUpdate(new UpdatePersonMutation({
      person: this.props.viewer,
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      email: this.refs.email.getValue()
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
    // Return the component UI.
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageHeader>
              <FormattedMessage
                id="users.title"
                description="User's settings page header text."
                defaultMessage="Change your account details {firstName} {lastName}"
                values={{firstName: this.props.viewer.firstName, lastName: this.props.viewer.lastName}}/>
            </PageHeader>
            <Input ref="firstName" type="text" label={this.context.intl.formatMessage(messages.firstName)}
                   defaultValue={this.props.viewer.firstName}/>
            <Input ref="lastName" type="text" label={this.context.intl.formatMessage(messages.lastName)}
                   defaultValue={this.props.viewer.lastName}/>
            <Input ref="email" type="text" label={this.context.intl.formatMessage(messages.email)}
                   defaultValue={this.props.viewer.email}/>
            <Button onClick={this._handleUpdatePerson}>
              <FormattedMessage
                id="users.button.save"
                description="The user save button's text."
                defaultMessage="Save"/>
            </Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

/**
 * The users data container.
 */
export default Relay.createContainer(Users, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Person {
        id
        firstName
        lastName
        email,
        ${UpdatePersonMutation.getFragment('person')}
      }
    `
  }
});
