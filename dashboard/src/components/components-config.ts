/*
 *  [2015] - [2017] Codenvy, S.A.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Codenvy S.A. and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Codenvy S.A.
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Codenvy S.A..
 */
'use strict';

import {CodenvyApiConfig} from './api/codenvy-api-config';
import {UniqueTeamNameValidator} from './api/validator/unique-team-name-validator.directive';

export class CodenvyComponentsConfig {

  constructor(register) {
    new CodenvyApiConfig(register);

    register.directive('uniqueTeamName', UniqueTeamNameValidator);
  }
}
