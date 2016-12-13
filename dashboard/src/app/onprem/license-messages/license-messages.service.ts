/*
 *  [2015] - [2016] Codenvy, S.A.
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
import {CodenvyLicense} from '../../../components/api/codenvy-license.factory';
import {CodenvyPermissions} from '../../../components/api/codenvy-permissions.factory';


const NAG_MESSAGE_ID: string = 'license-legality-message';
const USER_LICENSE_HAS_REACHED_ITS_LIMIT: string = 'USER_LICENSE_HAS_REACHED_ITS_LIMIT';
/**
 * This class is handling the service for the nag message
 * @author Oleksii Orel
 */
export class LicenseMessagesService {
  codenvyLicense: CodenvyLicense;
  codenvyPermissions: CodenvyPermissions;
  $q: ng.IQService;
  $compile: ng.ICompileService;
  $document: ng.IDocumentService;
  $cookies: ng.cookies.ICookiesService;
  $mdDialog: ng.material.IDialogService;

  legality: {isLegal: boolean, issues?: Array<{message: string, status: string}>};
  userServices: {hasAdminUserService: boolean};

  /**
   * Default constructor that is using resource injection
   * @ngInject for Dependency injection
   */
  constructor(codenvyLicense: CodenvyLicense, codenvyPermissions: CodenvyPermissions, $document: ng.IDocumentService, $cookies: ng.cookies.ICookiesService, $compile: ng.ICompileService, $mdDialog: ng.material.IDialogService, $q: ng.IQService) {
    this.codenvyPermissions = codenvyPermissions;
    this.codenvyLicense = codenvyLicense;
    this.$mdDialog = $mdDialog;
    this.$document = $document;
    this.$cookies = $cookies;
    this.$compile = $compile;
    this.$q = $q;

    this.userServices = codenvyPermissions.getUserServices();
    this.legality = this.codenvyLicense.getLicenseLegality();
  }

  /**
   * Fetch license messages
   */
  fetchMessages(): void {
    this.codenvyLicense.fetchLicenseLegality().then(() => {
      if (!this.codenvyPermissions.getSystemPermissions()) {
        this.codenvyPermissions.fetchSystemPermissions().then(() => {
          this.checkLicenseMessage();
          this.checkIssues();
        });
      } else {
        this.checkLicenseMessage();
        this.checkIssues();
      }
    });
  }

  /**
   * Check the license issues
   */
  checkIssues(): void {
    if (!this.legality || !this.userServices.hasAdminUserService) {
      return;
    }
    let issues: Array<{message: string, status: string}> = this.legality.issues;

    let messages: Map<string, string> = new Map();
    issues.forEach((issue: {message: string, status: string}) => {
      messages.set(issue.status, issue.message);
    });

    // check USER_LICENSE_HAS_REACHED_ITS_LIMIT
    if (messages.get(USER_LICENSE_HAS_REACHED_ITS_LIMIT)) {
      if (this.$cookies.getObject(USER_LICENSE_HAS_REACHED_ITS_LIMIT)) {
        return;
      }
      this.showLicenseLimitPopup(USER_LICENSE_HAS_REACHED_ITS_LIMIT, messages.get(USER_LICENSE_HAS_REACHED_ITS_LIMIT));
    } else {
      this.$cookies.remove(USER_LICENSE_HAS_REACHED_ITS_LIMIT);
    }
  }

  /**
   * Check the license Message
   */
  checkLicenseMessage(): void {
    if (!this.legality.isLegal) {
      this.showLicenseMessage();
    } else {
      this.hideLicenseMessage();
    }
  }

  /**
   * Show popup about license agreement
   * @returns {ng.IPromise<any>}
   */
  showLicenseAgreementPopup(): ng.IPromise<any> {
    let defer = this.$q.defer();

    this.$mdDialog.show({
      controller: 'LicenseAgreementController',
      controllerAs: 'licenseAgreementController',
      bindToController: true,
      clickOutsideToClose: true,
      templateUrl: 'app/onprem/license-messages/license-agreement-dialog/license-agreement-dialog.html'
    }).then(() => {
      defer.resolve();
    }, () => {
      this.$mdDialog.show({
        controller: 'CancelAgreementController',
        controllerAs: 'cancelAgreementController',
        bindToController: true,
        clickOutsideToClose: true,
        templateUrl: 'app/onprem/license-messages/license-agreement-dialog/cancel-agreement-dialog.html'
      }).finally(() => {
        defer.reject();
      });
    });

    return defer.promise;
  }

  /**
   * Show popup about license limit
   * @param key {string}
   * @param message {string}
   */
  showLicenseLimitPopup(key: string, message: string): void {
    this.$mdDialog.show({
      controller: 'LicenseLimitController',
      controllerAs: 'licenseLimitController',
      bindToController: true,
      clickOutsideToClose: true,
      locals: {
        key: key,
        message: message
      },
      templateUrl: 'app/onprem/license-messages/license-limit-dialog/license-limit-dialog.html'
    });
  }

  /**
   * Show license message
   * @returns {boolean} - true if successful
   */
  showLicenseMessage(): boolean {
    if (this.$document.find('#' + NAG_MESSAGE_ID).length) {
      return false;
    }
    let jqItem = angular.element('<cdvy-nag-message></cdvy-nag-message>');
    jqItem.attr('id', NAG_MESSAGE_ID);
    let jqParentElement = angular.element(this.$document.find('body'));
    let nagMessageElement = this.$compile(jqItem)(jqParentElement.scope());
    jqParentElement.addClass('license-message-indent');
    nagMessageElement.prependTo(jqParentElement);
    return true;
  }

  /**
   * Hide license message
   * @returns {boolean} - true if successful
   */
  hideLicenseMessage(): boolean {
    let jqLicenseMessageElement = this.$document.find('#' + NAG_MESSAGE_ID);
    jqLicenseMessageElement.parent().removeClass('license-message-indent');
    return jqLicenseMessageElement.remove().length > 0;
  }
}
